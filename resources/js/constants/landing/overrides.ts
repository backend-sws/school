/**
 * Institution-type-aware label overrides and default theme mappings.
 *
 * These are used by:
 * - Sidebar groups to show institution-appropriate labels
 * - Layout resolver to apply default theme per institution type
 * - `PrincipalsDesk` component to show "Principal" vs "Vice Chancellor" etc.
 */

import type { InstitutionType } from "./types";

// ── Sidebar Group Label Overrides ────────────────────────────────
// Key = default group label from unifiedSidebarConfig → Value = override per type

export const GROUP_LABEL_OVERRIDES: Record<InstitutionType, Record<string, string>> = {
    school: {
        "Admission Cell": "Enrollment Office",
        "Academic Setup": "Class Setup",
        "Accounts Room": "Fee Office",
    },
    college: {
        // Use defaults — no overrides
    },
    coaching: {
        "Admission Cell": "Enrollment Desk",
        "Academic Setup": "Program Setup",
        "Accounts Room": "Fee Desk",
    },
    university: {
        "Admission Cell": "Admissions Office",
        "Academic Setup": "Faculty & Programs",
        "Accounts Room": "Finance Office",
    },
};

// ── Head of Institution Label ────────────────────────────────────
// Used in PrincipalsDesk, landing page, and sidebar

export const HEAD_LABEL: Record<InstitutionType, string> = {
    school: "Principal",
    college: "Principal",
    coaching: "Director",
    university: "Vice Chancellor",
};

export const HEAD_DESK_LABEL: Record<InstitutionType, string> = {
    school: "Principal's Message",
    college: "Principal's Desk",
    coaching: "Director's Desk",
    university: "Vice Chancellor's Desk",
};

// ── Default Theme per Institution Type ───────────────────────────
// Institution admin can override via Settings → Theme

export const DEFAULT_THEME: Record<InstitutionType, string> = {
    school: "royal",
    college: "royal",
    coaching: "energy",
    university: "oxford",
};

// ── Default Font per Institution Type ────────────────────────────
export const DEFAULT_FONT: Record<InstitutionType, string | undefined> = {
    school: undefined,     // Sans (Inter) — default
    college: undefined,    // Sans (Inter) — default
    coaching: "display",   // Outfit — bold feel
    university: "serif",   // Playfair Display — grand feel
};

// ── CTA Button Label per Institution Type ────────────────────────
export const PRIMARY_CTA_LABEL: Record<InstitutionType, string> = {
    school: "Apply for Admission",
    college: "Apply Now",
    coaching: "Enroll Now",
    university: "Apply for Admission",
};
