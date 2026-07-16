import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";


type Profile = {
  id: string;
  email: string;
};


export function AppShell({
  children,
  email,
  profile,
}: Readonly<{
  children: React.ReactNode;
  email: string;
  profile: Profile | null;
}>) {


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">


      <div className="fixed inset-y-0 left-0 hidden w-72 lg:block">

        <AppSidebar
          email={email}
          profile={profile}
        />

      </div>



      <div className="lg:pl-72">


        <AppHeader
          email={email}
          profile={profile}
        />


        <main className="min-h-[calc(100vh-5rem)] px-4 py-6 sm:px-6 lg:px-8">

          {children}

        </main>


      </div>


    </div>
  );
}