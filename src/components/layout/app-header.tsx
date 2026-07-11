import { Bell } from "lucide-react";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
export function AppHeader() { return <header className="flex h-20 items-center justify-between border-b border-white/10 bg-slate-950/50 px-4 backdrop-blur-xl sm:px-6 lg:px-8"><div className="flex items-center gap-3"><MobileSidebar /><div><p className="text-sm font-semibold text-white">Learning workspace</p><p className="text-xs text-slate-500">Make progress, one concept at a time.</p></div></div><div className="flex items-center gap-3"><Button variant="ghost" size="icon" aria-label="Notifications"><Bell className="size-[18px]" /></Button><Avatar initials="AS" /></div></header>; }
