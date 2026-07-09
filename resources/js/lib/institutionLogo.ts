/**
 * Resolve institution logo src for <img> tags.
 * Prefer same-origin API stream URL so logos work across dev ports / proxies.
 */
export function getInstitutionLogoSrc(logoUrl?: string | null): string {
    if (!logoUrl?.trim()) {
        return "";
    }

    const url = logoUrl.trim();

    if (/^https?:\/\//i.test(url)) {
        if (url.includes("/api/v1/public/institution-logo")) {
            return "/api/v1/public/institution-logo";
        }
        return url;
    }

    if (url.startsWith("/")) {
        return url;
    }

    return "/api/v1/public/institution-logo";
}
