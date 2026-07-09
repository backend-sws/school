import api from "./api";



const CommonApi = {
  uploadImage: async (file: File) => {
        const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload-media", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  
  },
};

export default CommonApi;
