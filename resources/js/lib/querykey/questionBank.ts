export const QuestionBankQueryKeys = {
    all: ["question-bank"] as const,
    categories: () => [...QuestionBankQueryKeys.all, "categories"] as const,
    questions: (filters?: {
        category_id?: number;
        type?: string;
        difficulty?: string;
        source?: string;
    }) => [...QuestionBankQueryKeys.all, "questions", filters] as const,
    questionDetail: (id: number) =>
        [...QuestionBankQueryKeys.all, "question", id] as const,
    stats: () => [...QuestionBankQueryKeys.all, "stats"] as const,
    practice: (filters?: {
        category_id?: number;
        difficulty?: string;
        type?: string;
    }) => [...QuestionBankQueryKeys.all, "practice", filters] as const,
};
