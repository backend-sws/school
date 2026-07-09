import api from "./api";

const API_URL = "/website/galleries";

const GalleryApi = {
    getGalleries: (params?: Record<string, any>) =>
        api.get(`${API_URL}`, { params }),

    createGallery: (data: any) => api.post(`${API_URL}`, data),

    getGalleryById: (id: number | string) => api.get(`${API_URL}/${id}`),

    updateGallery: (id: number | string, data: any) =>
        api.put(`${API_URL}/${id}`, data),

    deleteGallery: (id: number | string) => api.delete(`${API_URL}/${id}`),

    getGalleryImages: (galleryId: number | string) =>
        api.get(`${API_URL}/${galleryId}/images`),

    addGalleryImage: (galleryId: number | string, data: { media_type?: string; image_url: string; caption?: string; sort_order?: number }) =>
        api.post(`${API_URL}/${galleryId}/images`, data),

    deleteGalleryImage: (imageId: number | string) =>
        api.delete(`/website/galleries/images/${imageId}`),

    sortGalleryImages: (images: { id: number; sort_order: number }[]) =>
        api.patch("/website/gallery-images/sort", { images }),
};

export default GalleryApi;
