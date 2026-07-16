import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const result = (documents ?? []).map((doc) => ({
      id: doc.id,
      file_name: doc.file_name,
      file_type: doc.file_type,
      file_size: doc.file_size,
      created_at: doc.created_at,
      summary_count: (doc.summaries as unknown as { count: number }[])?.[0]?.count ?? 0,
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 },
    );
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
    const documentId = searchParams.get("id");

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required." },
        { status: 400 },
      );
    }

    // Verify ownership before deleting
    const { data: document, error: fetchError } = await supabase
      .from("documents")
      .select("id, file_url, user_id")
      .eq("id", documentId)
      .single();

    if (fetchError || !document) {
      return NextResponse.json(
        { error: "Document not found." },
        { status: 404 },
      );
    }

    if (document.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete file from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([document.file_url]);

    if (storageError) {
      console.error("Storage deletion failed:", storageError.message);
    }

    // Delete summaries first (foreign key constraint)
    await supabase.from("summaries").delete().eq("document_id", documentId);

    // Delete document row
    const { error: deleteError } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId);

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 },
    );
  }
}