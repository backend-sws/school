import api from "./api";

const API_URL = "/students";

const StudentApi = {
  getSummary: (params: { year: number; page?: number; per_page?: number }) => api.get(`${API_URL}/stats`, {
    params
  }),
  getCandidates: (
    params: Record<string, any>
  ) => {
    return api.get(`${API_URL}/candidates`, {
      params
    });
  },
  getCandidateById: (id: any) => {
    return api.get(`${API_URL}/candidates/${id}/edit`);
  },

  updateCandidate: (id: any, data: Record<string, any>) => {
    return api.put(`${API_URL}/candidates/${id}`, data);

  },

  updateCandidateStatus: (id: any, data: any) => {
    return api.put(`${API_URL}/candidates/${id}/status`, data);

  },

  getStudentList: (params: Record<string, any>) => {
    return api.get(`${API_URL}/list`, {
      params
    });
  },

  /** Resend verification email (set-password link) to student. */
  resendVerificationEmail: (userId: number | string) => {
    return api.post(`${API_URL}/resend-verification`, { user_id: userId });
  },

  /** Get verification URL for a student (for copy/share). */
  getVerificationLink: (userId: number | string) => {
    return api.post<{ url?: string }>(`${API_URL}/verification-link`, { user_id: userId });
  },

  /** Export students list with active filters. */
  exportStudents: async (params: Record<string, any>) => {
    const response = await api.get(`${API_URL}/export`, {
      params,
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `students_export_${new Date().toISOString().slice(0, 10)}.xlsx`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  },
}

export default StudentApi;
