import api from "../api";

const API_URL = "/student";

const AdmissionApi = {
  // Note: getFilterData, verifyAdmissionId, verifyReAdmissionId, getAdmissionForm
  // were removed — they called deleted AdmissionFeeHeadController routes.
  // Student admission now uses the unified admission flow.

  searchAdmissionHead: (payload: {
    major_subject_id: number;
    board: string;
    course_for: "new" | "re-admission";
  }) => api.post(`${API_URL}/search-admission-head`, payload),

  getSettingByKey: (key: string) => api.get(`/settings/${key}`),



  submitAdmissionForm: (payload: any) =>
    api.post(`${API_URL}/admission-form/submit`, payload),

  myApplications: (params: any) =>
    api.get(`${API_URL}/applications`, { params }),

  studentProfile: () => api.get(`${API_URL}/profile`),

  feePreview: (applicationId: any) =>
    api.get(`${API_URL}/admission-applications/${applicationId}/fee-preview`),
};

export default AdmissionApi;
