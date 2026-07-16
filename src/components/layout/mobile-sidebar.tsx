"use client";


import { useState } from "react";
import { Menu, X } from "lucide-react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Button } from "@/components/ui/button";


type Profile = {
  id: string;
  email: string;
};



export function MobileSidebar({
  email,
  profile,
}: {
  email: string;
  profile: Profile | null;
}) {


  const [isOpen, setIsOpen] = useState(false);



  return (

    <div className="lg:hidden">


      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
      >

        <Menu className="size-5" />

      </Button>




      {isOpen && (

        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
        >


          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />



          <div className="relative h-full w-[min(19rem,85vw)] shadow-2xl shadow-black/60">


            <AppSidebar
              email={email}
              profile={profile}
              onNavigate={() => setIsOpen(false)}
            />



            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-4"
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation menu"
            >

              <X className="size-5" />

            </Button>


          </div>


        </div>

      )}



    </div>

  );
}