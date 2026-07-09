import api from "../api";

const API_URL = "/student-auth";

const AuthApi = {
  // AUTH
  Login: (data: any) => api.post(`${API_URL}/login`, data),
  Register: (data: any) => api.post(`${API_URL}/register`, data),

  // STUDENT REGISTRATION FLOW
  FindApplication: (app_no: string) =>
    api.post(`${API_URL}/find-application`, { app_no }),

  SendOtp: (data: { mobile: string; email: string }) =>
    api.post(`${API_URL}/send-otp`, data),

  ChangePassword: (data: any) => api.post(`${API_URL}/change-password`, data),
};

export default AuthApi;
