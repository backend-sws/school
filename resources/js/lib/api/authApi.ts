import axios, { AxiosError } from "axios";
import { api } from "@/lib/api/api";

/** Get CSRF token from Laravel's XSRF-TOKEN cookie (url-decoded for header). */
function getCsrfToken(): string | null {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

/** Axios instance for web auth routes (same origin, with CSRF). */
const webAuthClient = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

webAuthClient.interceptors.request.use((config) => {
  const token = getCsrfToken();
  if (token) {
    config.headers["X-XSRF-TOKEN"] = token;
  }
  return config;
});

export interface AdminLoginPayload {
  login_id: string;
  password: string;
  remember?: boolean;
}

export interface ValidationErrors {
  message?: string;
  errors?: Record<string, string[]>;
}

/** POST /login (Laravel Fortify). Returns redirect info on success; throws with ValidationErrors on 422. */
export async function adminLogin(data: AdminLoginPayload): Promise<{ redirect?: string }> {
  const response = await webAuthClient.post("/login", {
    login_id: data.login_id,
    password: data.password,
    remember: data.remember ?? false,
  });
  return response.data;
}

/** Type guard and extract validation errors from axios error (422). */
export function getLoginValidationErrors(
  error: unknown
): ValidationErrors | null {
  const ax = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
  if (ax.response?.status === 422 && ax.response?.data) {
    return {
      message: ax.response.data.message,
      errors: ax.response.data.errors,
    };
  }
  return null;
}

/** Response from set-password-with-token (generic verification flow). */
export interface SetPasswordWithTokenResponse {
  success?: boolean;
  data?: { redirect?: string };
  message?: string;
}

/** POST /api/v1/auth/set-password-with-token – verify token, set password, login, return redirect URL. */
export async function setPasswordWithToken(
  token: string,
  password: string,
  password_confirmation: string
): Promise<SetPasswordWithTokenResponse> {
  return api.post("/auth/set-password-with-token", {
    token,
    password,
    password_confirmation,
  }) as Promise<SetPasswordWithTokenResponse>;
}

export async function requestOtpLogin(login_id: string): Promise<{ message?: string }> {
  return api.post("/auth/request-otp-login", { login_id });
}

export async function verifyOtpAndSetPassword(
  login_id: string, 
  otp: string, 
  password: string, 
  password_confirmation: string
): Promise<{ data?: { redirect?: string }, message?: string }> {
  return api.post("/auth/verify-otp-and-set-password", { login_id, otp, password, password_confirmation });
}

export async function verifyOtp(login_id: string, otp: string): Promise<{ message?: string }> {
  return api.post("/auth/verify-otp", { login_id, otp });
}
