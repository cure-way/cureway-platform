/**
 * Server-side session retrieval
 * Returns the current user session or null if not authenticated
 */

import type { CureWayUser } from "@/types/auth";
import { cookies } from "next/headers";

import { SHOWCASE_MODE } from "@/lib/showcase/config";
import { PATIENT_USER } from "@/lib/showcase/fixtures/users";

export interface Session {
  user: CureWayUser;
  accessToken: string;
  expiresAt: number;
}

/**
 * Get the current session from cookies/headers.
 *
 * Showcase mode returns the demo patient session, because the server-side
 * guard would otherwise reject every request: nothing in this app ever sets
 * the `session-token` cookie, and the token branch below has never been
 * implemented, so `requirePatient()` always redirected to sign-in and
 * /notifications was unreachable.
 *
 * TODO: Implement real session retrieval (validate and decode the token)
 * before relying on this for a live backend. Until then the non-showcase path
 * returns null, which route guards treat as "not signed in".
 */
export async function getSession(): Promise<Session | null> {
  if (SHOWCASE_MODE) {
    return {
      user: showcaseSessionUser(),
      accessToken: "showcase-demo-access-token",
      // Far enough out that nothing treats the demo session as expired.
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    };
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session-token")?.value;

  if (!sessionToken) {
    return null;
  }

  // TODO: Validate and decode the session token.
  return null;
}

/** Map the demo patient fixture onto the server-side `CureWayUser` shape. */
function showcaseSessionUser(): CureWayUser {
  const [firstName, ...rest] = PATIENT_USER.name.split(" ");

  return {
    id: String(PATIENT_USER.id),
    email: PATIENT_USER.email,
    phone: PATIENT_USER.phoneNumber,
    name: PATIENT_USER.name,
    emailVerified: PATIENT_USER.isEmailVerified,
    phoneVerified: PATIENT_USER.isPhoneVerified,
    firstName,
    lastName: rest.join(" "),
    role: "patient",
    isVerified: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
