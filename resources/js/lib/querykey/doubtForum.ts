export const DoubtForumQueryKeys = {
    all: ["doubts"] as const,
    list: (filters?: { status?: string; lms_class_id?: number }) =>
        [...DoubtForumQueryKeys.all, "list", filters] as const,
    detail: (id: number) => [...DoubtForumQueryKeys.all, "detail", id] as const,
};

export const QuestionBankQueryKeys = {
    all: ["question-bank"] as const,
    categories: () => [...QuestionBankQueryKeys.all, "categories"] as const,
    questions: (filters?: { category_id?: number; type?: string; difficulty?: string }) =>
        [...QuestionBankQueryKeys.all, "questions", filters] as const,
    questionDetail: (id: number) => [...QuestionBankQueryKeys.all, "question", id] as const,
};
