import api from "./api";

const API_URL = "/settings";

const SettingApi = {
  getSettingsByGroup: (group: string) => api.get(`${API_URL}/group/${group}`),
  getSettingByKey: (key: string) => api.get(`${API_URL}/${key}`),
  updateSettings: (group: string, data: Record<string, any>) =>
    api.post(`${API_URL}/group/${group}`, data),
  updateSettingbulk: (data: Record<string, any>) => api.put(`${API_URL}`, data),
  // Individual setting update if needed
  updateSetting: (key: string, value: any) =>
    api.patch(`${API_URL}/${key}`, { value }),
};

export default SettingApi;
