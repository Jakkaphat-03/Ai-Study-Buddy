"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authSchema, type AuthCredentials } from "@/features/auth/schemas/auth-schema";
import type { AuthActionState } from "@/features/auth/types/auth";
const validate = (value: AuthCredentials): AuthActionState | null => { const result = authSchema.safeParse(value); return result.success ? null : { error: result.error.issues[0]?.message ?? "Check your email and password." }; };
export async function signIn(value: AuthCredentials): Promise<AuthActionState> { const invalid = validate(value); if (invalid) return invalid; const supabase = await createClient(); const { data, error } = await supabase.auth.signInWithPassword(value); if (error) return { error: error.message }; if (!data.user.email_confirmed_at) { await supabase.auth.signOut(); return { error: "Please confirm your email before signing in." }; } redirect("/dashboard"); }
export async function signUp(value: AuthCredentials): Promise<AuthActionState> { const invalid = validate(value); if (invalid) return invalid; const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"; const supabase = await createClient(); const { error } = await supabase.auth.signUp({ ...value, options: { emailRedirectTo: `${origin}/auth/callback?next=/dashboard` } }); return error ? { error: error.message } : { success: "Check your inbox to confirm your email before signing in." }; }
export async function signOut() { const supabase = await createClient(); await supabase.auth.signOut(); redirect("/login"); }
