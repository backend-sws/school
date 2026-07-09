import api from "./api";

const BASE = "/lms";

const lmsApi = {
  streams: {
    index: (params?: Record<string, unknown>) => api.get(`${BASE}/streams`, { params }),
  },
  courses: {
    index: (params?: Record<string, unknown>) => api.get(`${BASE}/courses`, { params }),
    show: (id: string | number) => api.get(`${BASE}/courses/${id}`),
    store: (data: Record<string, unknown>) => api.post(`${BASE}/courses`, data),
    update: (id: string | number, data: Record<string, unknown>) => api.put(`${BASE}/courses/${id}`, data),
    destroy: (id: string | number) => api.delete(`${BASE}/courses/${id}`),
  },
  classes: {
    index: (params?: Record<string, unknown>) => api.get(`${BASE}/classes`, { params }),
    myClasses: (params?: Record<string, unknown>) => api.get(`${BASE}/my-classes`, { params }),
    findOrCreateForStream: (streamId: number) => api.post(`${BASE}/classes/find-or-create-for-stream`, { stream_id: streamId }),
    show: (id: string | number) => api.get(`${BASE}/classes/${id}`),
    allocations: (classId: string | number) => api.get(`${BASE}/classes/${classId}/allocations`),
    storeAllocation: (classId: string | number, data: Record<string, unknown>) =>
      api.post(`${BASE}/classes/${classId}/allocations`, data),
    store: (data: Record<string, unknown>) => api.post(`${BASE}/classes`, data),
    update: (id: string | number, data: Record<string, unknown>) => api.put(`${BASE}/classes/${id}`, data),
    destroy: (id: string | number) => api.delete(`${BASE}/classes/${id}`),
    enrollments: (classId: string | number) => api.get(`${BASE}/classes/${classId}/enrollments`),
    storeEnrollment: (classId: string | number, data: Record<string, unknown>) =>
      api.post(`${BASE}/classes/${classId}/enrollments`, data),
    availableStudents: (classId: string | number) =>
      api.get(`${BASE}/classes/${classId}/available-students`),
    removeEnrollment: (classId: string | number, userId: string | number) =>
      api.delete(`${BASE}/classes/${classId}/enrollments/${userId}`),
    feeStructures: (classId: string | number) =>
      api.get(`${BASE}/classes/${classId}/fee-structures`),
    syncFeeStructures: (classId: string | number, data: Record<string, unknown>) =>
      api.post(`${BASE}/classes/${classId}/fee-structures`, data),
    removeFeeStructure: (classId: string | number, id: string | number) =>
      api.delete(`${BASE}/classes/${classId}/fee-structures/${id}`),
  },
  allocations: {
    update: (id: string | number, data: Record<string, unknown>) => api.put(`${BASE}/allocations/${id}`, data),
    destroy: (id: string | number) => api.delete(`${BASE}/allocations/${id}`),
  },
  assignments: {
    index: (classId: string | number, params?: Record<string, unknown>) =>
      api.get(`${BASE}/classes/${classId}/assignments`, { params }),
    show: (classId: string | number, assignmentId: string | number) =>
      api.get(`${BASE}/classes/${classId}/assignments/${assignmentId}`),
    store: (classId: string | number, data: Record<string, unknown>) =>
      api.post(`${BASE}/classes/${classId}/assignments`, data),
    update: (classId: string | number, assignmentId: string | number, data: Record<string, unknown>) =>
      api.put(`${BASE}/classes/${classId}/assignments/${assignmentId}`, data),
    destroy: (classId: string | number, assignmentId: string | number) =>
      api.delete(`${BASE}/classes/${classId}/assignments/${assignmentId}`),
  },
  assignmentSubmissions: {
    index: (classId: string | number, assignmentId: string | number) =>
      api.get(`${BASE}/classes/${classId}/assignments/${assignmentId}/submissions`),
    store: (classId: string | number, assignmentId: string | number, data: Record<string, unknown>) =>
      api.post(`${BASE}/classes/${classId}/assignments/${assignmentId}/submissions`, data),
    update: (classId: string | number, assignmentId: string | number, submissionId: string | number, data: Record<string, unknown>) =>
      api.patch(`${BASE}/classes/${classId}/assignments/${assignmentId}/submissions/${submissionId}`, data),
  },
  tests: {
    index: (classId: string | number, params?: Record<string, unknown>) =>
      api.get(`${BASE}/classes/${classId}/tests`, { params }),
    show: (classId: string | number, testId: string | number) =>
      api.get(`${BASE}/classes/${classId}/tests/${testId}`),
    store: (classId: string | number, data: Record<string, unknown>) =>
      api.post(`${BASE}/classes/${classId}/tests`, data),
    update: (classId: string | number, testId: string | number, data: Record<string, unknown>) =>
      api.put(`${BASE}/classes/${classId}/tests/${testId}`, data),
    destroy: (classId: string | number, testId: string | number) =>
      api.delete(`${BASE}/classes/${classId}/tests/${testId}`),
    // Questions
    questions: (classId: string | number, testId: string | number) =>
      api.get(`${BASE}/classes/${classId}/tests/${testId}/questions`),
    storeQuestion: (classId: string | number, testId: string | number, data: Record<string, unknown>) =>
      api.post(`${BASE}/classes/${classId}/tests/${testId}/questions`, data),
    updateQuestion: (classId: string | number, testId: string | number, questionId: string | number, data: Record<string, unknown>) =>
      api.put(`${BASE}/classes/${classId}/tests/${testId}/questions/${questionId}`, data),
    destroyQuestion: (classId: string | number, testId: string | number, questionId: string | number) =>
      api.delete(`${BASE}/classes/${classId}/tests/${testId}/questions/${questionId}`),
    // Attempts
    myAttempts: (classId: string | number, testId: string | number) =>
      api.get(`${BASE}/classes/${classId}/tests/${testId}/attempts`),
    startAttempt: (classId: string | number, testId: string | number) =>
      api.post(`${BASE}/classes/${classId}/tests/${testId}/attempts`),
    submitAttempt: (classId: string | number, testId: string | number, attemptId: string | number, data: Record<string, unknown>) =>
      api.patch(`${BASE}/classes/${classId}/tests/${testId}/attempts/${attemptId}/submit`, data),
  },
  liveSessions: {
    index: (classId: string | number, params?: Record<string, unknown>) =>
      api.get(`${BASE}/classes/${classId}/live-sessions`, { params }),
    show: (classId: string | number, id: string | number) =>
      api.get(`${BASE}/classes/${classId}/live-sessions/${id}`),
    store: (classId: string | number, data: Record<string, unknown>) =>
      api.post(`${BASE}/classes/${classId}/live-sessions`, data),
    update: (classId: string | number, id: string | number, data: Record<string, unknown>) =>
      api.put(`${BASE}/classes/${classId}/live-sessions/${id}`, data),
    destroy: (classId: string | number, id: string | number) =>
      api.delete(`${BASE}/classes/${classId}/live-sessions/${id}`),
  },
  recordings: {
    index: (classId: string | number, params?: Record<string, unknown>) =>
      api.get(`${BASE}/classes/${classId}/recordings`, { params }),
    show: (classId: string | number, id: string | number) =>
      api.get(`${BASE}/classes/${classId}/recordings/${id}`),
    store: (classId: string | number, data: Record<string, unknown>) =>
      api.post(`${BASE}/classes/${classId}/recordings`, data),
    update: (classId: string | number, id: string | number, data: Record<string, unknown>) =>
      api.put(`${BASE}/classes/${classId}/recordings/${id}`, data),
    destroy: (classId: string | number, id: string | number) =>
      api.delete(`${BASE}/classes/${classId}/recordings/${id}`),
  },
  announcements: {
    index: (classId: string | number, params?: Record<string, unknown>) =>
      api.get(`${BASE}/classes/${classId}/announcements`, { params }),
    show: (classId: string | number, id: string | number) =>
      api.get(`${BASE}/classes/${classId}/announcements/${id}`),
    store: (classId: string | number, data: Record<string, unknown>) =>
      api.post(`${BASE}/classes/${classId}/announcements`, data),
    update: (classId: string | number, id: string | number, data: Record<string, unknown>) =>
      api.put(`${BASE}/classes/${classId}/announcements/${id}`, data),
    destroy: (classId: string | number, id: string | number) =>
      api.delete(`${BASE}/classes/${classId}/announcements/${id}`),
  },
  materials: {
    index: (classId: string | number, params?: Record<string, unknown>) =>
      api.get(`${BASE}/classes/${classId}/materials`, { params }),
    show: (classId: string | number, id: string | number) =>
      api.get(`${BASE}/classes/${classId}/materials/${id}`),
    store: (classId: string | number, data: Record<string, unknown>) =>
      api.post(`${BASE}/classes/${classId}/materials`, data),
    update: (classId: string | number, id: string | number, data: Record<string, unknown>) =>
      api.put(`${BASE}/classes/${classId}/materials/${id}`, data),
    destroy: (classId: string | number, id: string | number) =>
      api.delete(`${BASE}/classes/${classId}/materials/${id}`),
  },
};

export default lmsApi;
