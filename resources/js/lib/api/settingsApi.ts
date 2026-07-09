import api from "./api";

const API_URL = "/settings";

const SettingsApi = {
  getSettings: (params?: Record<string, any>) =>
    api.get(API_URL, {
      params,
    }),
};

export default SettingsApi;
