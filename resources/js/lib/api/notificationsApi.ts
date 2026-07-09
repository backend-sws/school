import { api } from "./api";

const BASE = "/notifications";

export interface NotificationItem {
  id: string;
  type: string;
  data: {
    type?: string;
    title?: string;
    body?: string;
    url?: string;
    [key: string]: unknown;
  };
  channels_sent?: string[];
  read_at: string | null;
  created_at: string;
}

export interface NotificationsResponse {
  data: NotificationItem[];
  unread_count: number;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ChannelInfo {
  type: string;
  configured: string[];
  active: string[];
}

export const notificationsApi = {
  list: (params?: { filter?: "all" | "unread"; per_page?: number; page?: number }) =>
    api.get<NotificationsResponse>(BASE, { params }),

  markAsRead: (id: string) => api.post(`${BASE}/${id}/read`),

  markAllAsRead: () => api.post(`${BASE}/read-all`),

  getChannels: (type: string) => api.get<ChannelInfo>(`${BASE}/channels/${type}`),
};

