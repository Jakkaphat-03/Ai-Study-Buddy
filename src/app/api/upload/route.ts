import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { serverError } from "@/lib/api-error";
import { rateLimitResponse } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { extractDocument } from "@/features/document/services/extract-document";
import { hasValidSignature } from "@/features/document/services/verify-file-signature";
import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
} from "@/features/upload/types/upload";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limited = rateLimitResponse("upload", user.id, {
      limit: 20,
      windowMs: 60_000,
    });

    if (limited) return limited;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must not exceed 20 MB." },
        { status: 400 },
      );
    }

    const mimeType = file.type as (typeof ACCEPTED_FILE_TYPES)[number];

    if (!ACCEPTED_FILE_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: "Unsupported file type." },
        { status: 400 },
      );
    }

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (
      !extension ||
      !ACCEPTED_EXTENSIONS.includes(
        extension as (typeof ACCEPTED_EXTENSIONS)[number],
      )
    ) {
      return NextResponse.json(
        { error: "Invalid file extension." },
        { status: 400 },
      );
    }

    // Read the file once and reuse the buffer for both the signature check and
    // the text extraction below.
    const buffer = Buffer.from(await file.arrayBuffer());

    // The MIME type and extension above are client-supplied; the leading bytes
    // are the only part that cannot be forged by simply renaming a file.
    if (!hasValidSignature(buffer, mimeType)) {
      return NextResponse.json(
        {
          error:
            "File contents do not match its type. Please upload a valid PDF, DOCX or PPTX file.",
        },
        { status: 400 },
      );
    }

    const storagePath = `${user.id}/${randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(storagePath, buffer, { contentType: mimeType, upsert: false });

    if (uploadError) {
      return serverError("upload:storage", uploadError);
    }

    const { data: document, error: dbError } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_type: mimeType,
        file_size: file.size,
        file_url: storagePath,
      })
      .select("id")
      .single();

    if (dbError) {
      // Do not leave an orphaned object behind if the row could not be written.
      await supabase.storage.from("documents").remove([storagePath]);

      return serverError("upload:insert", dbError);
    }

    try {
      const extractedText = (await extractDocument(buffer, mimeType)).trim();

      if (extractedText.length > 0) {
        const { error: updateError } = await supabase
          .from("documents")
          .update({ extracted_text: extractedText })
          .eq("id", document.id)
          .eq("user_id", user.id);

        if (updateError) {
          console.error("[upload:extract-save]", updateError.message);
        }
      }
    } catch (error) {
      console.error("[upload:extract]", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return serverError("upload", error);
  }
}
