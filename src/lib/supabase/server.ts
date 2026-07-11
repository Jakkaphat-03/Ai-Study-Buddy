import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
const getConfig = () => { const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; if (!url || !anonKey) throw new Error("Missing Supabase environment variables."); return { url, anonKey }; };
export async function createClient() { const store = await cookies(); const { url, anonKey } = getConfig(); return createServerClient(url, anonKey, { cookies: { getAll: () => store.getAll(), setAll: (items) => { try { items.forEach(({ name, value, options }) => store.set(name, value, options)); } catch {} } } }); }
