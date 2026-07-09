import api from "./api";

const API_URL = "/student/verification";

const StudentVerificationApi = {
  // Get global status + stream list
  getVerificationSettings: (params?: Record<string, any>) =>
    api.get(`${API_URL}`, {
      params,
    }),

  // Toggle global student verification
  toggleGlobalVerification: (status: boolean) =>
    api.post(`${API_URL}/toggle-global`, {
      status,
    }),

  // Toggle verification for a specific stream
  toggleStreamVerification: (streamId: number | string, status: boolean) =>
    api.post(`${API_URL}/toggle-stream/${streamId}`, {
      status,
    }),

  // Upload student verification Excel for a stream
  uploadStudentDatabase: (streamId: number | string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post(`${API_URL}/upload/${streamId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  exportStream: async (streamId: number | string) => {
    const response = await api.get(`${API_URL}/export-stream`, {
      params: { main_stream_id: streamId },
      responseType: "blob",
    });

    // Create download
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `admission_export_stream_${streamId}.xlsx`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Download sample Excel file
  downloadSampleExcel: async () => {
    const response = await api.get(`${API_URL}/download-sample`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");

    link.href = url;
    link.download = "student_verification_sample.xlsx";

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default StudentVerificationApi;
