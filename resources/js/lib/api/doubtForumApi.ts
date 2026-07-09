import api from "./api";

const DoubtForumApi = {
    index: (params?: { page?: number; per_page?: number; status?: string; lms_class_id?: number; search?: string }) =>
        api.get("/doubts", { params }),

    show: (id: number) => api.get(`/doubts/${id}`),

    store: (data: { title: string; body: string; lms_class_id?: number; class_subject_allocation_id?: number; tags?: string }) =>
        api.post("/doubts", data),

    update: (id: number, data: Record<string, unknown>) => api.put(`/doubts/${id}`, data),

    destroy: (id: number) => api.delete(`/doubts/${id}`),

    storeReply: (threadId: number, data: { body: string }) =>
        api.post(`/doubts/${threadId}/replies`, data),

    acceptReply: (threadId: number, replyId: number) =>
        api.patch(`/doubts/${threadId}/replies/${replyId}/accept`),

    resolve: (id: number) => api.patch(`/doubts/${id}/resolve`),

    upvoteThread: (id: number) => api.patch(`/doubts/${id}/upvote`),

    upvoteReply: (threadId: number, replyId: number) =>
        api.patch(`/doubts/${threadId}/replies/${replyId}/upvote`),

    togglePin: (id: number) => api.patch(`/doubts/${id}/pin`),
};

export default DoubtForumApi;
