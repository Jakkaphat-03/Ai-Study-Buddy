import { NextResponse } from "next/server";
import { z } from "zod";

import { serverError } from "@/lib/api-error";
import { createClient } from "@/lib/supabase/server";

const deleteParamsSchema = z.object({
  id: z.string().uuid("Invalid document id."),
});

// GET /api/documents — list all documents for the authenticated user
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: documents, error } = await supabase
      .from("documents")
      .select(
        `
        id,
        file_name,
        file_type,
        file_size,
        created_at,
        summaries(count)
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return serverError("documents:list", error);
    }

    const result = (documents ?? []).map((doc) => ({
      id: doc.id,
      file_name: doc.file_name,
      file_type: doc.file_type,
      file_size: doc.file_size,
      created_at: doc.created_at,
      summary_count:
        (doc.summaries as unknown as { count: number }[])?.[0]?.count ?? 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return serverError("documents:list", error);
  }
}

// DELETE /api/documents?id=<documentId>
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = deleteParamsSchema.safeParse({ id: searchParams.get("id") });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }

    const documentId = parsed.data.id;

    // Scope the lookup to the caller so a document owned by somebody else is
    // indistinguishable from one that does not exist.
    const { data: document, error: fetchError } = await supabase
      .from("documents")
      .select("id, file_url")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !document) {
      return NextResponse.json(
        { error: "Document not found." },
        { status: 404 },
      );
    }

    // Delete file from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([document.file_url]);

    if (storageError) {
      console.error("[documents:delete-storage]", storageError.message);
    }

    // summaries and quizzes are removed by the ON DELETE CASCADE foreign key.
    const { error: deleteError } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId)
      .eq("user_id", user.id);

    if (deleteError) {
      return serverError("documents:delete", deleteError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return serverError("documents:delete", error);
  }
}
