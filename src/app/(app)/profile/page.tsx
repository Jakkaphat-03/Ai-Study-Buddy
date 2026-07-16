import { redirect } from "next/navigation";

import { Avatar } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProfile } from "@/features/profile/actions/profile-actions";

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  const initials =
    profile.email
      ?.split("@")[0]
      .split(/[.\-_]/)
      .map((word: string) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2) ?? "U";

  const memberSince = profile.created_at
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(profile.created_at))
    : "-";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <section>
        <p className="text-sm font-medium text-emerald-200">
          Account Settings
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Profile
        </h1>

        <p className="mt-2 text-slate-400">
          View your account information.
        </p>
      </section>

      <Card>
        <CardHeader className="items-center text-center">
          <Avatar
            initials={initials}
            className="mb-4 size-20 text-xl"
          />

          <CardTitle>{profile.email}</CardTitle>

          <CardDescription>
            Your AI Study Buddy account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-slate-400">
              Email
            </p>

            <p className="mt-1 text-slate-100">
              {profile.email}
            </p>
          </div>

          <div className="border-t border-white/10" />

          <div>
            <p className="text-sm text-slate-400">
              User ID
            </p>

            <p className="mt-1 break-all font-mono text-sm text-slate-100">
              {profile.id}
            </p>
          </div>

          <div className="border-t border-white/10" />

          <div>
            <p className="text-sm text-slate-400">
              Member Since
            </p>

            <p className="mt-1 text-slate-100">
              {memberSince}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}