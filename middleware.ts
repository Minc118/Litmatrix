import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDemo =
    pathname === "/projects/ocpm-demo" ||
    pathname.startsWith("/projects/ocpm-demo/") ||
    pathname === "/api/projects/ocpm-demo" ||
    pathname.startsWith("/api/projects/ocpm-demo/");

  const isProtectedPath =
    (pathname.startsWith("/new") ||
      pathname.startsWith("/projects") ||
      pathname.startsWith("/api/projects")) &&
    !isDemo;

  if (isProtectedPath) {
    const { data: session } = await auth.getSession({
      fetchOptions: {
        headers: request.headers,
      },
    });

    if (!session) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: { code: "UNAUTHORIZED", message: "Authentication required." } },
          { status: 401 }
        );
      }
      const loginUrl = new URL("/auth/sign-in", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
