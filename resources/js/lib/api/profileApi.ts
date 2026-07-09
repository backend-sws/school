import api from "./api";

const API_URL = "/settings/profile";

interface ProfileUpdateData {
  name: string;
  email: string;
  avatar_url?: string;
}

const ProfileApi = {
  getProfile: () => api.get(API_URL),
  
  updateProfile: (data: ProfileUpdateData) => api.patch(API_URL, data),
};

export default ProfileApi;
