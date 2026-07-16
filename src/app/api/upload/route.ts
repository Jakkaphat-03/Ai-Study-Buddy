import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
} from "@/features/upload/types/upload";

import { createClient } from "@/lib/supabase/server";
import { extractDocument } from "@/features/document/services/extract-document";

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

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "File size must not exceed 20 MB.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !ACCEPTED_FILE_TYPES.includes(
        file.type as (typeof ACCEPTED_FILE_TYPES)[number],
      )
    ) {
      return NextResponse.json(
        {
          error: "Unsupported file type.",
        },
        {
          status: 400,
        },
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
        {
          error: "Invalid file extension.",
        },
        {
          status: 400,
        },
      );
    }

    const storagePath = `${user.id}/${randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(storagePath, file);

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: document, error: dbError } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: storagePath,
      })
      .select("id")
      .single();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const extractedText = (
        await extractDocument(
          buffer,
          file.type as (typeof ACCEPTED_FILE_TYPES)[number],
        )
      ).trim();

      if (extractedText.length > 0) {
        const { error: updateError } = await supabase
          .from("documents")
          .update({
            extracted_text: extractedText,
          })
          .eq("id", document.id);

        if (updateError) {
          console.error("Failed to save extracted text:", updateError.message);
        }
      }
    } catch (error) {
      console.error("Document extraction failed:", error);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unexpected server error.",
      },
      {
        status: 500,
      },
    );
  }
}
