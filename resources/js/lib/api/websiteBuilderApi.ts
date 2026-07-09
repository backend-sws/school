import api from "./api";

const BASE = "/website/builder";

const WebsiteBuilderApi = {
    /** List all available themes with is_active flag. */
    themes: () => api.get(`${BASE}/themes`),

    /** Activate a specific theme by slug. */
    activateTheme: (slug: string) => api.post(`${BASE}/themes/activate`, { slug }),

    /** Get section order for a page (default: home). */
    sections: (page = "home") => api.get(`${BASE}/sections/${page}`),

    /** Bulk reorder sections for a page. */
    reorderSections: (page: string, sections: Array<{ section_id: string; sort_order: number; is_visible: boolean }>) =>
        api.post(`${BASE}/sections/${page}/reorder`, { sections }),

    /** Toggle visibility of a single section. */
    toggleSection: (page: string, sectionId: string, isVisible: boolean) =>
        api.patch(`${BASE}/sections/${page}/${sectionId}`, { is_visible: isVisible }),

    /** Get website navigation config. */
    getNavConfig: () => api.get(`${BASE}/nav`),

    /** Save website navigation config. */
    saveNavConfig: (data: Record<string, any>) => api.post(`${BASE}/nav`, data),
};

export default WebsiteBuilderApi;
