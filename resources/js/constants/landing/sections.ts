/**
 * Landing-page section registry per institution type.
 *
 * Each type declares an ordered array of section IDs.
 * `welcome.tsx` maps these IDs to actual components at render time.
 *
 * We use string IDs (not component imports) here to keep the config
 * serializable and to allow lazy-loading of components in welcome.tsx.
 */

import type { InstitutionType } from "./types";

// ── Section Meta ─────────────────────────────────────────────────
export interface SectionMeta {
    /** Unique section key */
    id: string;
    /** Human label (used in admin settings for toggle) */
    label: string;
    /** Grid layout hint for how welcome.tsx should position this section */
    layout: "full" | "hero-3col" | "2col" | "3col";
}

// ── School ───────────────────────────────────────────────────────
const SCHOOL_SECTIONS: SectionMeta[] = [
    { id: "hero", label: "Hero Slider", layout: "full" },
    { id: "school-trust-bar", label: "Trust Bar / Stats", layout: "full" },
    { id: "why-choose-us", label: "Why Choose Us", layout: "full" },
    { id: "classes-overview", label: "Classes Overview", layout: "full" },
    { id: "principal", label: "Principal's Message", layout: "full" },
    { id: "notices", label: "Notice Board", layout: "3col" },
    { id: "parent-corner", label: "Parent Corner", layout: "3col" },
    { id: "student-zone", label: "Student Zone", layout: "3col" },
    { id: "academic-calendar", label: "Academic Calendar", layout: "full" },
    { id: "gallery", label: "Gallery Preview", layout: "full" },
    { id: "admissions-cta", label: "Admissions CTA", layout: "full" },
];

// ── College (existing welcome.tsx order) ─────────────────────────
const COLLEGE_SECTIONS: SectionMeta[] = [
    { id: "hero-3col", label: "Hero + News + Events", layout: "hero-3col" },
    { id: "student-zone", label: "Student Zone", layout: "3col" },
    { id: "principal", label: "Principal's Desk", layout: "3col" },
    { id: "stats", label: "Stats Grid", layout: "3col" },
    { id: "quick-links", label: "Quick Links", layout: "3col" },
    { id: "notices", label: "Notice Board", layout: "3col" },
    { id: "videos", label: "Featured Videos", layout: "3col" },
    { id: "departments", label: "Departments Showcase", layout: "full" },
    { id: "gallery", label: "Gallery Preview", layout: "full" },
];

// ── Coaching ─────────────────────────────────────────────────────
const COACHING_SECTIONS: SectionMeta[] = [
    { id: "hero", label: "Hero Banner", layout: "full" },
    { id: "programs", label: "Programs Grid", layout: "full" },
    { id: "results", label: "Results & Achievements", layout: "full" },
    { id: "faculty-spotlight", label: "Faculty Spotlight", layout: "full" },
    { id: "batches", label: "Current Batches", layout: "full" },
    { id: "stats", label: "Stats Counter", layout: "full" },
    { id: "testimonials", label: "Testimonials", layout: "full" },
    { id: "notices", label: "Notice Board", layout: "full" },
    { id: "quick-links", label: "Quick Links", layout: "full" },
];

// ── University ───────────────────────────────────────────────────
const UNIVERSITY_SECTIONS: SectionMeta[] = [
    { id: "hero", label: "Hero Panorama", layout: "full" },
    { id: "principal", label: "Vice Chancellor's Desk", layout: "full" },
    { id: "faculties-overview", label: "Faculties Overview", layout: "full" },
    { id: "research", label: "Research & Innovation", layout: "full" },
    { id: "departments", label: "Departments Directory", layout: "full" },
    { id: "news-events-2col", label: "News & Events", layout: "2col" },
    { id: "collaborations", label: "International Collaborations", layout: "full" },
    { id: "gallery", label: "Gallery Preview", layout: "full" },
    { id: "quick-links", label: "Quick Links", layout: "full" },
];

// ── Exported Map ─────────────────────────────────────────────────
export const LANDING_SECTIONS: Record<InstitutionType, SectionMeta[]> = {
    school: SCHOOL_SECTIONS,
    college: COLLEGE_SECTIONS,
    coaching: COACHING_SECTIONS,
    university: UNIVERSITY_SECTIONS,
};
