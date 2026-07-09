export const WebsiteBuilderQueryKeys = {
    all: ["website-builder"] as const,
    themes: () => [...WebsiteBuilderQueryKeys.all, "themes"] as const,
    sections: (page = "home") => [...WebsiteBuilderQueryKeys.all, "sections", page] as const,
    navConfig: () => [...WebsiteBuilderQueryKeys.all, "nav-config"] as const,
};
