import { createBrowserClient } from "@supabase/ssr";
const getConfig = () => { const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; if (!url || !anonKey) throw new Error("Missing Supabase environment variables."); return { url, anonKey }; };
export function createClient() { const { url, anonKey } = getConfig(); return createBrowserClient(url, anonKey); }
