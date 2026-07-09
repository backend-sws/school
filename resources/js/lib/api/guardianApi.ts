import api from "./api";

const GUARDIAN_URL = "/guardians";

export interface GuardianStudent {
  id: number;
  name: string;
  email?: string;
  avatar_url?: string | null;
  mobile?: string;
  reg_no?: string;
  stream?: string;
  session?: string;
  institution?: string;
  institution_id?: number;
}

export interface SameEmailAccount {
  id: number;
  name: string;
  email?: string;
  avatar_url?: string | null;
  is_linked: boolean;
}

const GuardianApi = {
  sameEmailAccounts: () =>
    api.get<{ data?: { accounts?: SameEmailAccount[] }; success?: boolean }>(
      `${GUARDIAN_URL}/same-email-accounts`
    ),

  myStudents: () =>
    api.get<{ data?: { students?: GuardianStudent[] }; success?: boolean }>(
      `${GUARDIAN_URL}/my-students`
    ),

  linkAccount: (payload: { email: string }) =>
    api.post<{ data?: { email?: string }; message?: string }>(
      `${GUARDIAN_URL}/link-account`,
      payload
    ),

  verifyLinkAccount: (token: string) =>
    api.post<{ data?: { guardian_id: number; name: string }; message?: string }>(
      `${GUARDIAN_URL}/verify-link-account`,
      { token }
    ),

  setActiveStudent: (userId: number) =>
    api.post<{ data?: { active_student_id: number }; message?: string }>(
      `${GUARDIAN_URL}/active-student`,
      { user_id: userId }
    ),

  clearActiveStudent: () =>
    api.post<{ message?: string }>(`${GUARDIAN_URL}/clear-active-student`),

  me: () =>
    api.get<{
      data?: {
        guardians?: { id: number; name: string; email?: string; mobile?: string; institution_id?: number }[];
        active_student_id?: number | null;
        is_guardian: boolean;
      };
    }>(`${GUARDIAN_URL}/me`),
};

export default GuardianApi;
