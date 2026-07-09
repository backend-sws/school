import api from "./api";

const API_URL = "/student/certificate";

const StudentCertificateApi = {
  // Submit Certificate Application with Snapshots
  submitCertificate: (data: any) => api.post(`${API_URL}/submit`, data),

  // Get list of student's certificate applications
  getMyApplications: (params?: Record<string, any>) =>
    api.get(`${API_URL}/my-applications`, { params }),

  getCertificateList: (params?: Record<string, any>) =>
    api.get(`${API_URL}/list`, { params }),

  // Get certificate details by ID
  getCertificateDetails: (id: string) => api.get(`${API_URL}/details/${id}`),
};

export default StudentCertificateApi;
