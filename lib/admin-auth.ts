import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "follicia_admin_token";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

// Get JWT secret as Uint8Array
function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET is not defined in environment variables");
  }
  return new TextEncoder().encode(secret);
}

/**
 * Verify admin credentials against environment variables
 */
export function verifyAdminCredentials(
  adminId: string,
  password: string
): boolean {
  const envAdminId = process.env.ADMIN_ID;
  const envPassword = process.env.ADMIN_PASSWORD;

  if (!envAdminId || !envPassword) {
    console.error("❌ Admin credentials not configured in environment");
    return false;
  }

  return adminId === envAdminId && password === envPassword;
}

/**
 * Create a signed JWT token for admin session
 */
export async function createAdminToken(adminId: string): Promise<string> {
  const secret = getJwtSecret();
  
  const token = await new SignJWT({ adminId, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  return token;
}

/**
 * Verify and decode admin JWT token
 */
export async function verifyAdminToken(
  token: string
): Promise<{ adminId: string; role: string } | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    
    if (payload.adminId && payload.role === "admin") {
      return {
        adminId: payload.adminId as string,
        role: payload.role as string,
      };
    }
    
    return null;
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    return null;
  }
}

/**
 * Set admin session cookie
 */
export async function setAdminCookie(adminId: string): Promise<void> {
  const token = await createAdminToken(adminId);
  const cookieStore = await cookies();
  
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

/**
 * Clear admin session cookie
 */
export async function clearAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

/**
 * Get admin session from cookie
 */
export async function getAdminSession(): Promise<{
  adminId: string;
  role: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME);

  if (!token) {
    return null;
  }

  return verifyAdminToken(token.value);
}

/**
 * Check if current request has valid admin session
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}
