export const GrievanceQueryKeys = {
    all: ["grievance"] as const,
    list: (filters?: Record<string, unknown>) =>
        ["grievances", ...(filters ? [filters] : [])] as const,
    contacts: (filters?: Record<string, unknown>) =>
        ["Contacts", ...(filters ? [filters] : [])] as const,
    feedback: (filters?: Record<string, unknown>) =>
        ["Feedback", ...(filters ? [filters] : [])] as const,
    supportTickets: (filters?: Record<string, unknown>) =>
        ["SupportTicket", ...(filters ? [filters] : [])] as const,
    studentTicket: (id: number | string) =>
        ["studentTicket", id] as const,
};
