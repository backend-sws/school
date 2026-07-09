export const IdCardQueryKeys = {
    templates: {
        all: ["id-card-templates"] as const,
        list: (filters?: Record<string, unknown>) =>
            ["id-card-templates", "list", filters] as const,
        detail: (id: number) =>
            ["id-card-templates", "detail", id] as const,
    },
    cards: {
        all: ["id-cards"] as const,
        list: (filters?: Record<string, unknown>) =>
            ["id-cards", "list", filters] as const,
        detail: (id: number) => ["id-cards", "detail", id] as const,
    },
    verify: (token: string) =>
        ["id-card-verify", token] as const,
    studentCard: ["student-id-card"] as const,
};
