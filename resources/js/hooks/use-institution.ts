import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { getInstitutionLogoSrc } from '@/lib/institutionLogo';

/**
 * Institution branding from shared Inertia data (HandleInertiaRequests).
 * Use everywhere for logo, name, location, and contact so the app shows DB-driven institution info.
 * No hardcoded fallbacks — all values come from the DB or remain null.
 */
export function useInstitution() {
    const { institution } = usePage<SharedData>().props;

    const name = institution?.name || institution?.short_name || '';
    const location = [institution?.city, institution?.state].filter(Boolean).join(', ') || '';
    /** e.g. "PATNA, BIHAR" for header/footer branding */
    const locationLine = institution?.city && institution?.state
        ? `${institution.city.toUpperCase()}, ${institution.state.toUpperCase()}`
        : '';
    const contact = {
        phone: institution?.phone || '',
        email: institution?.email || '',
        address: institution?.address || '',
    };
    const established = institution?.established || '';
    const affiliation = ''; // not in institution profile yet

    return {
        institution: institution ?? null,
        name,
        shortName: institution?.short_name || '',
        /** e.g. "School", "College", "University" for type-aware labels */
        typeLabel: institution?.type_label ?? '',
        profileSettingsTitle: institution?.profile_settings_title ?? '',
        location,
        /** e.g. "PATNA, BIHAR" for header/footer */
        locationLine,
        contact,
        established,
        affiliation,
        logoUrl: getInstitutionLogoSrc(institution?.logo_url),
        is_brand: !!institution?.is_brand,
    };
}
