// Public API for src/features/auth

export { AuthProvider, AuthContext } from "./AuthProvider";
export type { AuthContextValue } from "./AuthProvider";

export { useAuth } from "./useAuth";

export {
  login,
  logout,
  refresh,
  registerPatient,
  registerPharmacy,
  registerDriver,
} from "./auth.api";

export type {
  AuthUser,
  AuthProfile,
  AuthTokens,
  AuthResponse,
  LoginPayload,
  LogoutPayload,
  LogoutResponse,
  RefreshPayload,
  RegisterPatientPayload,
  RegisterPharmacyPayload,
  RegisterDriverPayload,
  UserRole,
  UserStatus,
  VerificationStatus,
} from "./auth.types";
