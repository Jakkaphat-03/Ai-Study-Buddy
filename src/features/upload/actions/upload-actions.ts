"use server";

import { randomUUID } from "crypto";

import { createClient } from "@/lib/supabase/server";

export async function uploadDocument(file: File) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized.");
  }

  const fileExtension = file.name.split(".").pop();

  const fileName = `${user.id}/${randomUUID()}.${fileExtension}`;

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(fileName, file, {
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from("documents").getPublicUrl(fileName);

  const { error: insertError } = await supabase.from("documents").insert({
    user_id: user.id,
    file_name: file.name,
    file_type: file.type,
    file_url: data.publicUrl,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  return {
    success: true,
  };
}
