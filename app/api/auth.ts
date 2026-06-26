import * as SecureStore from "expo-secure-store";

import apiClient from "./axios";

export const AUTH_TOKEN_KEY = "beauty_spot_auth_token";

export const AUTH_APIS = [
  { name: "login", method: "POST", path: "/api/v1/login" },
  { name: "logout", method: "DELETE", path: "/api/v1/logout" },
  { name: "currentUser", method: "GET", path: "/api/v1/me" },
  { name: "signup", method: "POST", path: "/api/v1/signup" },
  {
    name: "resendSignupCode",
    method: "POST",
    path: "/api/v1/signup/resend_code",
  },
  { name: "verifySignup", method: "POST", path: "/api/v1/signup/verify" },
] as const;

type ApiMessage = {
  message?: string;
};

export type AuthUser = {
  id: number;
  email: string;
  username: string;
  role?: "admin" | "student" | "customer" | string;
  is_admin?: boolean;
  credit_score?: number;
  verified_at?: string | null;
  status?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
};

export type VerifySignupPayload = {
  email: string;
  code: string;
};

export type LoginResponse = ApiMessage & {
  data?: AuthUser;
};

export type CurrentUserResponse = AuthUser;

export type SignupResponse = ApiMessage;

export const getRawAuthToken = (tokenOrAuthorization?: string) => {
  if (!tokenOrAuthorization) {
    return undefined;
  }

  return tokenOrAuthorization.replace(/^Bearer\s+/i, "");
};

export const getAuthorizationHeader = (tokenOrAuthorization?: string) => {
  const token = getRawAuthToken(tokenOrAuthorization);

  if (!token) {
    return undefined;
  }

  return `Bearer ${token}`;
};

export const setAuthorizationHeader = (tokenOrAuthorization?: string) => {
  const authorization = getAuthorizationHeader(tokenOrAuthorization);

  if (authorization) {
    apiClient.defaults.headers.common.Authorization = authorization;
  }
};

export const clearAuthorizationHeader = () => {
  delete apiClient.defaults.headers.common.Authorization;
};

export const saveAuthToken = async (authorization?: string) => {
  const token = getRawAuthToken(authorization);

  if (!token) {
    return;
  }

  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  setAuthorizationHeader(token);
};

export const loadAuthToken = async () => {
  const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  setAuthorizationHeader(token ?? undefined);
  return token;
};

export const clearAuthToken = async () => {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  clearAuthorizationHeader();
};

export const login = async (payload: LoginPayload) => {
  const response = await apiClient.post<LoginResponse>("/api/v1/login", {
    user: payload,
  });

  await saveAuthToken(response.headers.authorization);

  return response.data;
};

export const logout = async () => {
  try {
    const response = await apiClient.delete<ApiMessage>("/api/v1/logout");
    return response.data;
  } finally {
    await clearAuthToken();
  }
};

export const currentUser = async () => {
  const response = await apiClient.get<CurrentUserResponse>("/api/v1/me");
  return response.data;
};

export const signup = async (payload: SignupPayload) => {
  const response = await apiClient.post<SignupResponse>("/api/v1/signup", {
    user: payload,
  });
  return response.data;
};

export const resendSignupCode = async () => {
  const response = await apiClient.post<SignupResponse>(
    "/api/v1/signup/resend_code",
  );
  return response.data;
};

export const verifySignup = async (payload: VerifySignupPayload) => {
  const response = await apiClient.post<SignupResponse>(
    "/api/v1/signup/verify",
    payload,
  );
  return response.data;
};
