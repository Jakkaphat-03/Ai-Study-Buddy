import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const getConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey)
    throw new Error("Missing Supabase environment variables.");
  return { url, anonKey };
};

// Routes that require a confirmed email session
const PROTECTED_PATHS = [
  "/dashboard",
  "/upload",
  "/documents",
  "/summary",
  "/profile",
  "/quiz",
  "/history",
  "/chat",
];

// Routes only for unauthenticated users
const AUTH_PATHS = ["/login", "/register"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const { url, anonKey } = getConfig();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (items) => {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        items.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const confirmed = Boolean(user?.email_confirmed_at);

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  const isAuthPage = AUTH_PATHS.includes(pathname);

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !confirmed) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from login/register
  if (isAuthPage && confirmed) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}