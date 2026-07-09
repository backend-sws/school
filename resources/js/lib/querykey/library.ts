export const LibraryQueryKeys = {
    all: ["library"] as const,
    books: (filters?: Record<string, unknown>) =>
        ["library-books", ...(filters ? [filters] : [])] as const,
    booksList: () => ["library-books-list"] as const,
    book: (id: number | string) =>
        ["library-book", id] as const,
    copies: (filters?: Record<string, unknown>) =>
        ["library-copies", ...(filters ? [filters] : [])] as const,
    copiesAvailable: (filters?: Record<string, unknown>) =>
        ["library-copies-available", ...(filters ? [filters] : [])] as const,
    issues: (filters?: Record<string, unknown>) =>
        ["library-issues", ...(filters ? [filters] : [])] as const,
    issuesOverdue: (filters?: Record<string, unknown>) =>
        ["library-issues-overdue", ...(filters ? [filters] : [])] as const,
};
