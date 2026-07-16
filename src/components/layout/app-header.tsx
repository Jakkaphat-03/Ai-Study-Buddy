import { Bell } from "lucide-react";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type Profile = {
  id: string;
  email: string;
};

export function AppHeader({
  email,
  profile,
}: {
  email: string;
  profile: Profile | null;
}) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-slate-950/50 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <MobileSidebar 
          email={email}
          profile={profile}
        />

        <div>
          <p className="text-sm font-semibold text-white">
            Learning workspace
          </p>

          <p className="text-xs text-slate-500">
            Make progress, one concept at a time.
          </p>
        </div>
      </div>


      <div className="flex items-center gap-3">

        <p className="hidden max-w-48 truncate text-sm text-slate-400 sm:block">
          {profile?.email ?? email}
        </p>


        <Button 
          variant="ghost" 
          size="icon"
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" />
        </Button>


        <Avatar 
          initials={(profile?.email ?? email)
            .slice(0, 2)
            .toUpperCase()
          }
        />

      </div>
    </header>
  );
}