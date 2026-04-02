import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE_NAME = "follicia_admin_token";

/**
 * Verify admin JWT token in middleware
 */
async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) {
      console.error("❌ ADMIN_JWT_SECRET not configured");
      return false;
    }

    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);

    return payload.role === "admin";
  } catch (error) {
    console.error("❌ Token verification failed in middleware:", error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/auth)
  if (pathname.startsWith("/admin")) {
    // Allow access to the auth page
    if (pathname === "/admin/auth") {
      return NextResponse.next();
    }

    // Check for admin token
    const token = request.cookies.get(ADMIN_COOKIE_NAME);

    if (!token) {
      console.log("🚫 No admin token found, redirecting to /admin/auth");
      const url = request.nextUrl.clone();
      url.pathname = "/admin/auth";
      return NextResponse.redirect(url);
    }

    // Verify token
    const isValid = await verifyToken(token.value);

    if (!isValid) {
      console.log("🚫 Invalid admin token, redirecting to /admin/auth");
      const url = request.nextUrl.clone();
      url.pathname = "/admin/auth";
      
      // Clear invalid cookie
      const response = NextResponse.redirect(url);
      response.cookies.delete(ADMIN_COOKIE_NAME);
      return response;
    }

    console.log("✅ Admin authenticated, allowing access to:", pathname);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all admin routes except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/admin/:path*",
  ],
};
