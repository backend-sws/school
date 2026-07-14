/**
 * Institution-type-aware public (website) navigation.
 *
 * Each institution type gets its own set of nav items and footer sections.
 * The college config is the existing `NAV_ITEMS` / `FOOTER_SECTIONS` preserved as-is.
 */

import {
    MessageSquare,
    AlertCircle,
    HelpCircle,
    Users,
    ExternalLink,
    BookOpen,
    Newspaper,
} from "lucide-react";
import type { InstitutionType, PublicNavItem, FooterSection, UtilityLink, ImportantLink } from "./types";

// ── School ───────────────────────────────────────────────────────
const SCHOOL_NAV: PublicNavItem[] = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about-us" },
    {
        title: "Classes",
        children: [
            { title: "Nursery & KG", href: "/academics#nursery" },
            { title: "Primary (1-5)", href: "/academics#primary" },
            { title: "Middle (6-8)", href: "/academics#middle" },
            { title: "Secondary (9-10)", href: "/academics#secondary" },
            { title: "Senior Secondary (11-12)", href: "/academics#senior" },
        ],
    },
    {
        title: "Faculty",
        children: [
            { title: "Teaching Staff", href: "/academics#staff" },
            { title: "Administration", href: "/about-us#administration" },
        ],
    },
    {
        title: "Facilities",
        children: [
            { title: "Library", href: "/facilities#library" },
            { title: "Playground", href: "/facilities#playground" },
            { title: "Computer Lab", href: "/facilities#computer-lab" },
            { title: "Science Lab", href: "/facilities#science-lab" },
            { title: "Transport", href: "/facilities#transport" },
        ],
    },
    { title: "Gallery", href: "/gallery" },
    { title: "Contact", href: "/contact" },
];

const SCHOOL_FOOTER: FooterSection[] = [
    {
        title: "Quick Links",
        links: [
            { title: "Admission", href: "/academics#admission" },
            { title: "Fee Payment", href: "/fee-payment" },
            { title: "PTM Calendar", href: "/academics#calendar" },
            { title: "Exam Schedule", href: "/academics#syllabus" },
            { title: "Downloads", href: "#" },
        ],
    },
    {
        title: "Classes",
        links: [
            { title: "Primary", href: "/academics#primary" },
            { title: "Middle School", href: "/academics#middle" },
            { title: "Secondary", href: "/academics#secondary" },
            { title: "Senior Secondary", href: "/academics#senior" },
        ],
    },
    {
        title: "Services",
        links: [
            { title: "Library", href: "/facilities#library" },
            { title: "Transport", href: "/facilities#transport" },
            { title: "Sports", href: "/facilities#playground" },
            { title: "Computer Lab", href: "/facilities#computer-lab" },
        ],
    },
];

// ── College (existing – preserved) ───────────────────────────────
const COLLEGE_NAV: PublicNavItem[] = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about-us" },
    {
        title: "Academics",
        children: [
            { title: "Admission", href: "/academics#admission" },
            { title: "Academic Calendar", href: "/academics#calendar" },
            { title: "Syllabus", href: "/academics#syllabus" },
            { title: "Teaching Staff", href: "/academics#staff" },
            { title: "Course Details", href: "/academics#courses" },
            { title: "Policies", href: "/academics#policies" },
        ],
    },
    {
        title: "Departments",
        children: [
            { title: "Arts", href: "/departments#arts" },
            { title: "Science", href: "/departments#science" },
            { title: "Commerce", href: "/departments#commerce" },
            { title: "Vocational", href: "/departments#vocational" },
        ],
    },
    {
        title: "Facilities",
        children: [
            { title: "Bank", href: "/facilities#bank" },
            { title: "Central Library", href: "/facilities#central-library" },
            { title: "Club", href: "/facilities#club" },
            { title: "Computer Center", href: "/facilities#computer-center" },
            { title: "Guest House", href: "/facilities#guest-house" },
            { title: "Gymnasium", href: "/facilities#gymnasium" },
            { title: "Hostels", href: "/facilities#hostels" },
            { title: "Medical Facilities", href: "/facilities#medical-facilities" },
            { title: "Sports Facilities", href: "/facilities#sports-facilities" },
            { title: "Wi-Fi Campus", href: "/facilities#wifi" },
        ],
    },
    {
        title: "Approval",
        children: [
            { title: "AISHE", href: "/approval#aishe" },
            { title: "BSEB", href: "/approval#bseb" },
            { title: "NAAC", href: "/approval#naac" },
            { title: "University", href: "/approval#university" },
            { title: "Other Bodies", href: "/approval#other-bodies" },
        ],
    },
    { title: "Training & Placement", href: "/training-placement" },
    {
        title: "Gallery",
        children: [
            { title: "Image Gallery", href: "/gallery" },
            { title: "Video Gallery", href: "/gallery" },
        ],
    },
    { title: "Contact", href: "/contact" },
];

const COLLEGE_FOOTER: FooterSection[] = [
    {
        title: "Quick Links",
        links: [
            { title: "Admission", href: "/academics#admission" },
            { title: "Exam Notice", href: "#" },
            { title: "Result", href: "#" },
            { title: "Academic Calendar", href: "/academics#calendar" },
            { title: "Syllabus", href: "/academics#syllabus" },
            { title: "Approvals", href: "/approval" },
        ],
    },
    {
        title: "Department",
        links: [
            { title: "Arts", href: "/departments#arts" },
            { title: "Science", href: "/departments#science" },
            { title: "Commerce", href: "/departments#commerce" },
            { title: "Vocational", href: "/departments#vocational" },
            { title: "Teaching Staff", href: "/academics#staff" },
        ],
    },
    {
        title: "Services",
        links: [
            { title: "Library", href: "#" },
            { title: "Hostel", href: "#" },
            { title: "Training & Placement", href: "/training-placement" },
            { title: "Computer Center", href: "#" },
            { title: "NSS / NCC", href: "#" },
        ],
    },
];

// ── Coaching ─────────────────────────────────────────────────────
const COACHING_NAV: PublicNavItem[] = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about-us" },
    {
        title: "Programs",
        children: [
            { title: "All Programs", href: "/academics#courses" },
            { title: "Batches & Timings", href: "/academics#calendar" },
            { title: "Syllabus", href: "/academics#syllabus" },
            { title: "Study Material", href: "#" },
        ],
    },
    {
        title: "Faculty",
        children: [
            { title: "Our Faculty", href: "/academics#staff" },
            { title: "Guest Lecturers", href: "/about-us#administration" },
        ],
    },
    { title: "Results", href: "/approval" },
    { title: "Gallery", href: "/gallery" },
    { title: "Contact", href: "/contact" },
];

const COACHING_FOOTER: FooterSection[] = [
    {
        title: "Quick Links",
        links: [
            { title: "Enroll Now", href: "/academics#admission" },
            { title: "Current Batches", href: "/academics#calendar" },
            { title: "Results", href: "/approval" },
            { title: "Study Material", href: "#" },
            { title: "Mock Tests", href: "#" },
        ],
    },
    {
        title: "Programs",
        links: [
            { title: "All Programs", href: "/academics#courses" },
            { title: "Crash Courses", href: "#" },
            { title: "Weekend Batches", href: "#" },
            { title: "Online Classes", href: "#" },
        ],
    },
    {
        title: "Support",
        links: [
            { title: "FAQs", href: "#" },
            { title: "Grievance", href: "#" },
            { title: "Feedback", href: "#" },
        ],
    },
];

// ── University ───────────────────────────────────────────────────
const UNIVERSITY_NAV: PublicNavItem[] = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about-us" },
    {
        title: "Faculties",
        children: [
            { title: "Arts & Humanities", href: "/departments#arts" },
            { title: "Science & Technology", href: "/departments#science" },
            { title: "Commerce & Management", href: "/departments#commerce" },
            { title: "Engineering", href: "/departments#engineering" },
            { title: "Law", href: "/departments#law" },
            { title: "Medicine", href: "/departments#medicine" },
        ],
    },
    {
        title: "Admissions",
        children: [
            { title: "UG Admissions", href: "/academics#admission" },
            { title: "PG Admissions", href: "/academics#admission" },
            { title: "PhD Admissions", href: "/academics#admission" },
            { title: "Fee Structure", href: "/academics#courses" },
        ],
    },
    { title: "Research", href: "/approval" },
    { title: "Placements", href: "/training-placement" },
    {
        title: "Campus",
        children: [
            { title: "Library", href: "/facilities#central-library" },
            { title: "Hostels", href: "/facilities#hostels" },
            { title: "Sports", href: "/facilities#sports-facilities" },
            { title: "Labs & Centers", href: "/facilities#computer-center" },
        ],
    },
    { title: "Gallery", href: "/gallery" },
    { title: "Contact", href: "/contact" },
];

const UNIVERSITY_FOOTER: FooterSection[] = [
    {
        title: "Admissions",
        links: [
            { title: "UG Programs", href: "/academics#admission" },
            { title: "PG Programs", href: "/academics#admission" },
            { title: "PhD Programs", href: "/academics#admission" },
            { title: "Fee Structure", href: "/academics#courses" },
            { title: "Scholarships", href: "#" },
        ],
    },
    {
        title: "Faculties",
        links: [
            { title: "Arts & Humanities", href: "/departments#arts" },
            { title: "Science & Technology", href: "/departments#science" },
            { title: "Commerce & Management", href: "/departments#commerce" },
            { title: "Engineering", href: "/departments#engineering" },
            { title: "Law", href: "/departments#law" },
        ],
    },
    {
        title: "Resources",
        links: [
            { title: "Library", href: "/facilities#central-library" },
            { title: "Research Portal", href: "#" },
            { title: "Alumni Connect", href: "#" },
            { title: "Placements", href: "/training-placement" },
            { title: "International Office", href: "#" },
        ],
    },
];

// ── Exported Maps ────────────────────────────────────────────────

export const PUBLIC_NAV: Record<InstitutionType, PublicNavItem[]> = {
    school: SCHOOL_NAV,
    college: COLLEGE_NAV,
    coaching: COACHING_NAV,
    university: UNIVERSITY_NAV,
};

export const PUBLIC_FOOTER: Record<InstitutionType, FooterSection[]> = {
    school: SCHOOL_FOOTER,
    college: COLLEGE_FOOTER,
    coaching: COACHING_FOOTER,
    university: UNIVERSITY_FOOTER,
};

// ── Top Bar Tag (left corner badge) ─────────────────────────────

export const TOP_BAR_TAG: Record<InstitutionType, string> = {
    school: "CBSE Affiliated",
    college: "Govt. of Bihar",
    coaching: "Since 2010",
    university: "Estd. 1917",
};

// ── Utility Links (top-right quick actions) ─────────────────────

export const PUBLIC_UTILITY_LINKS: Record<InstitutionType, UtilityLink[]> = {
    school: [
        { icon: Users, href: "/login", label: "Parent Login" },
        { icon: ExternalLink, href: "/login", label: "ERP Login" },
        { icon: MessageSquare, href: "/contact", label: "Feedback" },
        { icon: AlertCircle, href: "/contact", label: "Grievance" },
    ],
    college: [
        { icon: MessageSquare, href: "/contact", label: "Feedback" },
        { icon: AlertCircle, href: "/contact", label: "Grievance" },
        { icon: HelpCircle, href: "/contact", label: "Enquire" },
    ],
    coaching: [
        { icon: BookOpen, href: "#", label: "Study Material" },
        { icon: HelpCircle, href: "/contact", label: "Enquire" },
    ],
    university: [
        { icon: MessageSquare, href: "/contact", label: "Feedback" },
        { icon: AlertCircle, href: "/contact", label: "Grievance" },
        { icon: Newspaper, href: "#", label: "RTI" },
        { icon: HelpCircle, href: "/contact", label: "Enquire" },
    ],
};

// ── Important Links Bar (sub-header, desktop only) ──────────────

export const PUBLIC_IMPORTANT_LINKS: Record<InstitutionType, ImportantLink[]> = {
    school: [
        { title: "CBSE", url: "https://cbse.gov.in", description: "Central Board" },
        { title: "NCERT", url: "https://ncert.nic.in", description: "National Council" },
        { title: "Fee Payment", url: "/fee-payment", description: "Online Fee" },
        { title: "Results", url: "#", description: "Board Results" },
        { title: "DigiLocker", url: "https://www.digilocker.gov.in/", description: "Digital Documents" },
    ],
    college: [
        { title: "PPU", url: "http://www.ppup.ac.in/", description: "Patliputra University" },
        { title: "UGC", url: "https://ugc.ac.in/", description: "University Grants Commission" },
        { title: "AISHE", url: "https://aishe.gov.in/", description: "Higher Education Survey" },
        { title: "NAAC", url: "http://www.naac.gov.in/", description: "Accreditation" },
        { title: "RUSA", url: "http://rusa.nic.in/", description: "Rashtriya Uchchatar Shiksha Abhiyan" },
        { title: "National Digital Library", url: "https://ndl.iitkgp.ac.in/", description: "Digital Library" },
        { title: "e-PG Pathshala", url: "https://epgp.inflibnet.ac.in/", description: "PG E-Content" },
        { title: "DigiLocker", url: "https://www.digilocker.gov.in/", description: "Digital Documents" },
    ],
    coaching: [],  // empty = bar hidden for coaching
    university: [
        { title: "UGC", url: "https://ugc.ac.in/", description: "University Grants Commission" },
        { title: "NAAC", url: "http://www.naac.gov.in/", description: "Accreditation" },
        { title: "NIRF", url: "https://www.nirfindia.org/", description: "Rankings" },
        { title: "National Digital Library", url: "https://ndl.iitkgp.ac.in/", description: "Digital Library" },
        { title: "DigiLocker", url: "https://www.digilocker.gov.in/", description: "Digital Documents" },
    ],
};
