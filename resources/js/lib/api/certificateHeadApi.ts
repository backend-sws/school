import api from "./api";

const API_URL = "/certificate-heads";

const CertificationHeadApi = {
  getCertificationHead: (params?: Record<string, any>) =>
    api.get(API_URL, { params }),

  getCertificationHeadById: (id: string) => api.get(`${API_URL}/${id}`),

  createCertificationHead: (data: any) => api.post(API_URL, data),

  updateCertificationHead: (id: string, data: any) =>
    api.put(`${API_URL}/${id}`, data),

  deleteCertificationHead: (id: string) => api.delete(`${API_URL}/${id}`),
};

export default CertificationHeadApi;
