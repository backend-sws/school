/**
 * Layout Config — Page → Layout Hashmap
 *
 * Maps page path prefixes to layout keys.
 * The factory uses this to auto-assign layouts in the Inertia resolve() callback.
 *
 * To add a new mapping: just add a prefix → LayoutKey entry.
 */

import type { LayoutKey } from "./layout-factory";

/**
 * Page path prefix → LayoutKey hashmap.
 *
 * Resolution: longest-prefix-first match wins.
 * Pages not matching any prefix get the DEFAULT_LAYOUT.
 */
export const PAGE_LAYOUT_MAP: Record<string, LayoutKey> = {
    // ── Auth ─────────────────────────────────────────
    "auth/":                "auth",

    // ── Onboarding ───────────────────────────────────
    "Onboarding/":          "onboarding",

    // ── Student Portal (same layout as admin — PermissionGate handles nav visibility) ──
    "student-portal/":      "admin",

    // ── Public / Landing ─────────────────────────────
    "Landing/":             "public",
    "main-landing":         "public",
    "welcome":              "public",
    "about-us":             "public",
    "contact":              "public",
    "gallery":              "public",

    // ── Legal / Policy ───────────────────────────────
    "Legal/":               "legal",

    // ── Full-Page (minimal header, no sidebar) ─────
    "timetable/daily":                       "fullpage",
    "timetable/builder":                     "fullpage",
    "admission/applications/show":           "fullpage",
    "admission/applications/pay":            "fullpage",
    "admission/applications/new":            "fullpage",
    "admission/readmissions/new":            "fullpage",
    "students/show":                         "fullpage",
    "students/edit":                         "fullpage",
    "accounts/fee-hub/StudentLedgers":       "fullpage",
    "accounts/fee-hub/ClassRegulation":      "fullpage",
    "accounts/fee-hub/FeeProfileForm":       "fullpage",
    "certificates/id-cards/templates/create": "fullpage",
    "certificates/id-cards/templates/edit":   "fullpage",
    "certificates/id-cards/generate":         "fullpage",
    "certificates/id-cards/show":               "fullpage",
    "lms/classes/subjects":                  "fullpage",
    "lms/classes/stream/":                   "fullpage",

    // ── Canvas (no chrome) ───────────────────────────
    "certificates/preview": "canvas",



    // ── Settings (admin shell + settings sub-sidebar)─
    "settings/":            "settings",

    // ── Admin (explicit — no default fallback) ───────
    "dashboard":            "admin",
    "academics/":           "admin",
    "accounts/":            "admin",
    "admin/":               "admin",
    "hr/":                  "admin",
    "examination/":         "admin",
    "admission/":           "admin",
    "analytics/":           "admin",
    "approval":             "admin",
    "attendance/":          "admin",
    "billing/":             "admin",
    "certificates/":        "admin",
    "departments/":         "admin",
    "facilities/":          "admin",
    "fee-payment/":         "admin",
    "grievances/":          "admin",
    "inventory/":           "admin",
    "library/":             "admin",
    "lms/":                 "admin",
    "my-organisation/":     "admin",
    "notifications/":       "admin",
    "organization/":        "admin",
    "payment/":             "admin",
    "question-bank/":       "admin",
    "students/":            "admin",
    "timetable/":           "admin",
    "training-placement/":  "admin",
    "transport/":           "admin",
    "hostel/":              "admin",
    "verify/":              "admin",
    "website/":             "admin",
};

/**
 * Sorted prefixes for longest-prefix-first matching.
 * Cached at module level — no re-sorting on each resolve call.
 */
const SORTED_PREFIXES = Object.keys(PAGE_LAYOUT_MAP)
    .sort((a, b) => b.length - a.length);

/**
 * Resolve a LayoutKey from a page name.
 * Uses longest-prefix-first matching against PAGE_LAYOUT_MAP.
 *
 * @param pageName - The Inertia page component name (e.g., "dashboard", "auth/login")
 * @returns The matched LayoutKey, or undefined if no match (caller should use DEFAULT_LAYOUT)
 */
export function resolveLayoutKey(pageName: string): LayoutKey | undefined {
    for (const prefix of SORTED_PREFIXES) {
        if (pageName.startsWith(prefix)) {
            return PAGE_LAYOUT_MAP[prefix];
        }
    }
    return undefined;
}
