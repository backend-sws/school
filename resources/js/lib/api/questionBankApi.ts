import api from "./api";

const QuestionBankApi = {
    // Categories
    categories: (params?: { tree?: boolean }) =>
        api.get("/question-bank/categories", { params }),
    storeCategory: (data: { name: string; description?: string; parent_id?: number }) =>
        api.post("/question-bank/categories", data),
    updateCategory: (id: number, data: Record<string, unknown>) =>
        api.put(`/question-bank/categories/${id}`, data),
    destroyCategory: (id: number) => api.delete(`/question-bank/categories/${id}`),

    // Questions
    questions: (params?: {
        page?: number;
        per_page?: number;
        category_id?: number;
        type?: string;
        difficulty?: string;
        search?: string;
        source?: string;
    }) => api.get("/question-bank/questions", { params }),
    showQuestion: (id: number) => api.get(`/question-bank/questions/${id}`),
    storeQuestion: (data: Record<string, unknown>) =>
        api.post("/question-bank/questions", data),
    updateQuestion: (id: number, data: Record<string, unknown>) =>
        api.put(`/question-bank/questions/${id}`, data),
    destroyQuestion: (id: number) => api.delete(`/question-bank/questions/${id}`),

    // Practice mode
    practice: (data: {
        category_id?: number;
        difficulty?: string;
        type?: string;
        count?: number;
    }) => api.post("/question-bank/practice", data),

    // Stats
    stats: () => api.get("/question-bank/stats"),


};

export default QuestionBankApi;
