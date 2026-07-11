import { AppShell } from "@/components/layout/app-shell";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user?.email_confirmed_at) redirect("/login"); return <AppShell email={user.email ?? ""}>{children}</AppShell>; }
