import { httpPost, setTokens, clearTokens, getRefreshToken } from "@/lib/api";
import type {
  LoginPayload,
  AuthResponse,
  AuthApiResponse,
  LogoutPayload,
  LogoutResponse,
  LogoutApiResponse,
  RefreshPayload,
  RegisterPatientPayload,
  RegisterPharmacyPayload,
  RegisterDriverPayload,
} from "./auth.types";

/** Unwrap the { success, data } envelope into our app-level AuthResponse */
function unwrapAuth(raw: AuthApiResponse): AuthResponse {
  return {
    user: raw.data.user,
    tokens: raw.data.tokens,
    profile: raw.data.profile ?? null,
  };
}

// ---------------------------------------------------------------------------
// POST /auth/login
// ---------------------------------------------------------------------------

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const raw = await httpPost<AuthApiResponse, LoginPayload>(
    "/auth/login",
    payload,
  );
  const result = unwrapAuth(raw);
  setTokens(result.tokens.accessToken, result.tokens.refreshToken);
  return result;
}

// ---------------------------------------------------------------------------
// POST /auth/refresh
// ---------------------------------------------------------------------------

export async function refresh(): Promise<AuthResponse> {
  const rt = getRefreshToken();
  if (!rt) throw new Error("No refresh token available.");

  const raw = await httpPost<AuthApiResponse, RefreshPayload>("/auth/refresh", {
    refreshToken: rt,
  });
  const result = unwrapAuth(raw);
  setTokens(result.tokens.accessToken, result.tokens.refreshToken);
  return result;
}

// ---------------------------------------------------------------------------
// POST /auth/logout
// ---------------------------------------------------------------------------

export async function logout(): Promise<LogoutResponse> {
  const rt = getRefreshToken();
  if (!rt) {
    clearTokens();
    return { revoked: true };
  }

  try {
    const raw = await httpPost<LogoutApiResponse, LogoutPayload>(
      "/auth/logout",
      { refreshToken: rt },
    );
    return raw.data;
  } finally {
    clearTokens();
  }
}

// ---------------------------------------------------------------------------
// POST /auth/register/patient
// ---------------------------------------------------------------------------

export async function registerPatient(
  payload: RegisterPatientPayload,
): Promise<AuthResponse> {
  const raw = await httpPost<AuthApiResponse, RegisterPatientPayload>(
    "/auth/register/patient",
    payload,
  );
  const result = unwrapAuth(raw);
  setTokens(result.tokens.accessToken, result.tokens.refreshToken);
  return result;
}

// ---------------------------------------------------------------------------
// POST /auth/register/pharmacy
// ---------------------------------------------------------------------------

export async function registerPharmacy(
  payload: RegisterPharmacyPayload,
): Promise<AuthResponse> {
  const raw = await httpPost<AuthApiResponse, RegisterPharmacyPayload>(
    "/auth/register/pharmacy",
    payload,
  );
  const result = unwrapAuth(raw);
  setTokens(result.tokens.accessToken, result.tokens.refreshToken);
  return result;
}

// ---------------------------------------------------------------------------
// POST /auth/register/driver
// ---------------------------------------------------------------------------

export async function registerDriver(
  payload: RegisterDriverPayload,
): Promise<AuthResponse> {
  const raw = await httpPost<AuthApiResponse, RegisterDriverPayload>(
    "/auth/register/driver",
    payload,
  );
  const result = unwrapAuth(raw);
  setTokens(result.tokens.accessToken, result.tokens.refreshToken);
  return result;
}
