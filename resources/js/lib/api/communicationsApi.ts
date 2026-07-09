import api from "./api";

const CommunicationsApi = {
    // SMS
    smsLogs: (params?: { page?: number; per_page?: number; status?: string; category?: string }) =>
        api.get("/communications/sms-logs", { params }),
    sendSms: (data: { recipients: { phone: string; name?: string; user_id?: number }[]; message: string; category?: string; template_id?: string }) =>
        api.post("/communications/sms/send", data),
    smsStats: (params?: { from?: string; to?: string }) =>
        api.get("/communications/sms/stats", { params }),

    // WhatsApp
    whatsappLogs: (params?: { page?: number; per_page?: number; status?: string; category?: string }) =>
        api.get("/communications/whatsapp-logs", { params }),
    sendWhatsapp: (data: {
        recipients: { phone: string; name?: string; user_id?: number }[];
        message: string;
        template_name: string;
        category?: string;
        media_url?: string;
        media_type?: "image" | "document" | "video";
    }) => api.post("/communications/whatsapp/send", data),
    whatsappStats: (params?: { from?: string; to?: string }) =>
        api.get("/communications/whatsapp/stats", { params }),

    // Alert Rules
    alertRules: () => api.get("/communications/alert-rules"),
    storeAlertRule: (data: Record<string, unknown>) => api.post("/communications/alert-rules", data),
    updateAlertRule: (id: number, data: Record<string, unknown>) => api.put(`/communications/alert-rules/${id}`, data),
    destroyAlertRule: (id: number) => api.delete(`/communications/alert-rules/${id}`),
    triggerAlertRules: () => api.post("/communications/alert-rules/trigger"),
};

export default CommunicationsApi;
