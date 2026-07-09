import api from "./api";

export interface AnalyticsParams {
    start_date?: string;
    end_date?: string;
    [key: string]: any;
}

const AnalyticsApi = {
    get: <T = any>(type: string, params?: AnalyticsParams) =>
        api.get<{ success: boolean; data: T }>(`/analytics/${type}`, { params }),
};

export default AnalyticsApi;
