import { createClient } from "@/lib/supabase/server";

export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  if (error) {
    console.error("Profile fetch error:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });

    return null;
  }

  return profile;
}
