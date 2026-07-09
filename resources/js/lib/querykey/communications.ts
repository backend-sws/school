export const CommunicationsQueryKeys = {
    all: ["communications"] as const,
    smsLogs: (filters?: { status?: string; category?: string }) =>
        [...CommunicationsQueryKeys.all, "sms-logs", filters] as const,
    smsStats: (params?: { from?: string; to?: string }) =>
        [...CommunicationsQueryKeys.all, "sms-stats", params] as const,
    whatsappLogs: (filters?: { status?: string; category?: string }) =>
        [...CommunicationsQueryKeys.all, "whatsapp-logs", filters] as const,
    whatsappStats: (params?: { from?: string; to?: string }) =>
        [...CommunicationsQueryKeys.all, "whatsapp-stats", params] as const,
    alertRules: () => [...CommunicationsQueryKeys.all, "alert-rules"] as const,
};

export const GrowthQueryKeys = {
    all: ["growth"] as const,
    entranceTests: () => [...GrowthQueryKeys.all, "entrance-tests"] as const,
    pyqPapers: (filters?: { exam_name?: string; year?: number }) =>
        [...GrowthQueryKeys.all, "pyq-papers", filters] as const,
    demoClasses: () => [...GrowthQueryKeys.all, "demo-classes"] as const,
    facultyFeedback: (facultyId?: number) =>
        [...GrowthQueryKeys.all, "faculty-feedback", facultyId] as const,
    installmentPlans: () => [...GrowthQueryKeys.all, "installment-plans"] as const,
};
