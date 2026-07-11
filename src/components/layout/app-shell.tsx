import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) { return <div className="min-h-screen bg-slate-950 text-slate-100"><div className="fixed inset-y-0 left-0 hidden w-72 lg:block"><AppSidebar /></div><div className="lg:pl-72"><AppHeader /><main className="min-h-[calc(100vh-5rem)] px-4 py-6 sm:px-6 lg:px-8">{children}</main></div></div>; }
