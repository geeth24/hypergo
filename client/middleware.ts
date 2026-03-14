import { NextRequest, NextResponse } from "next/server";

const KNOWN_PATHS = ["/", "/shortcuts", "/stats"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // skip next internals and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // skip known app routes
  if (
    KNOWN_PATHS.includes(pathname) ||
    pathname.startsWith("/stats/")
  ) {
    return NextResponse.next();
  }

  // everything else is a shortcode — redirect to backend
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api-go.rsft.co";
  return NextResponse.redirect(`${apiUrl}${pathname}`);
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
