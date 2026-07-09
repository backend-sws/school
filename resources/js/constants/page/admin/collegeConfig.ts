import { FORM_TYPE } from "@/constants/shared/form";

// ============================================================================
// College Profile Groups
// ============================================================================
export const COLLEGE_PROFILE_BASIC_INFO_GROUP = [
    {
        name: "college_name",
        label: "Institutional Name",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g., Apex International School, Cityville",
        required: true,
        tooltip: "The official registered name of the educational institution",
        maxLength: 255,
    },
    {
        name: "college_short_name",
        label: "Short Name / Abbreviation",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g., AIS Cityville",
        tooltip: "A shorter version of the name used in headers and navigation",
        maxLength: 100,
    },
    {
        name: "college_motto",
        label: "Institutional Motto",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. Enter institutional motto or tagline",
        tooltip: "The guiding principle or slogan of the institution",
        maxLength: 255,
    },
    {
        name: "college_code",
        label: "Institutional Code",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g., AIS-CITYVILLE",
        tooltip: "Unique identifier code assigned by the regulatory body",
        maxLength: 50,
    },
    {
        name: "udise_code",
        label: "UDISE+ Code",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g., 09060100101",
        tooltip: "11-digit UDISE+ code assigned by MHRD to all recognized institutions",
        maxLength: 11,
    },
    {
        name: "established_year",
        label: "Established Year",
        type: FORM_TYPE.NUMBER,
        placeholder: "e.g., 1980",
        tooltip: "The year the institution was founded",
    },
];

export const COLLEGE_PROFILE_IDENTITY_GROUP = [
    {
        name: "college_logo",
        label: "Institutional Logo",
        type: FORM_TYPE.FILE,
        accept: "image/*",
        tooltip: "Official crest or logo of the college (Transparent PNG recommended)",
    },
];

export const COLLEGE_PROFILE_FORM_LAYOUT = [
    ...COLLEGE_PROFILE_BASIC_INFO_GROUP,
    ...COLLEGE_PROFILE_IDENTITY_GROUP,
];

// ============================================================================
// Digital Presence Groups
// ============================================================================
export const DIGITAL_PRESENCE_CONTACT_GROUP = [
    {
        name: "contact_email",
        label: "Primary Contact Email",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. info@college.edu",
        tooltip: "Official email address for general inquiries",
    },
    {
        name: "contact_phone",
        label: "Primary Phone Number",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. +91 ...",
        tooltip: "Main contact number for the administrative office",
    },
    {
        name: "full_address",
        label: "Office Address",
        type: FORM_TYPE.TEXTAREA,
        placeholder: "e.g. Enter full institutional address",
        tooltip: "Complete physical postal address of the campus",
    },
    {
        name: "college_website",
        label: "Official Website",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. https://www.yourcollege.edu.in",
        tooltip: "The official website URL of the institution",
    },
    {
        name: "map_location_url",
        label: "Google Maps Embed URL",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. Paste the iframe src URL from Google Maps",
        tooltip: "The 'src' attribute value from the Google Maps Share > Embed iframe code",
    },
];

export const DIGITAL_PRESENCE_SOCIAL_GROUP = [
    {
        name: "facebook_url",
        label: "Facebook Page",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. https://facebook.com/...",
        tooltip: "Full URL to the official Facebook page",
    },
    {
        name: "twitter_url",
        label: "Twitter/X Profile",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. https://twitter.com/...",
        tooltip: "Full URL to the official Twitter/X profile",
    },
    {
        name: "youtube_url",
        label: "YouTube Channel",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. https://youtube.com/...",
        tooltip: "Full URL to the official YouTube channel",
    },
    {
        name: "whatsapp_number",
        label: "WhatsApp Support Number",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g., 919876543210",
        tooltip: "Primary WhatsApp number with country code (e.g., 91...)",
    },
];

export const DIGITAL_PRESENCE_FORM_LAYOUT = [
    ...DIGITAL_PRESENCE_CONTACT_GROUP,
    ...DIGITAL_PRESENCE_SOCIAL_GROUP,
];

// ============================================================================
// SEO & Favicon Group (site-wide meta and favicon)
// Order: meta fields first (full width), then image uploads (side by side)
// ============================================================================
export const SEO_FAVICON_GROUP = [
    {
        name: "meta_title",
        label: "Default Meta Title",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g., College Name - Education & Admissions",
        tooltip: "Default title for search engines and browser tabs (used when a page doesn't set its own title).",
    },
    {
        name: "meta_description",
        label: "Default Meta Description",
        type: FORM_TYPE.TEXTAREA,
        placeholder: "e.g. Brief description of your institution for search results",
        tooltip: "Default description for search engine snippets (used when a page doesn't set its own).",
    },
    {
        name: "favicon_url",
        label: "Favicon",
        type: FORM_TYPE.FILE,
        accept: "image/x-icon,image/png,image/svg+xml,.ico",
        tooltip: "Site favicon (ICO, PNG or SVG). Shown in browser tabs and bookmarks across all pages.",
    },
    {
        name: "og_image",
        label: "Social Share Image (Open Graph)",
        type: FORM_TYPE.FILE,
        accept: "image/*",
        tooltip: "Image used when the site is shared on social media (e.g. Facebook, Twitter). Recommended 1200×630px.",
    },
];

// ============================================================================
// Landing Page Content Groups
// ============================================================================
export const LANDING_PAGE_LEADERSHIP_GROUP = [
    {
        name: "principal_name",
        label: "Principal Name",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g., Dr. John Doe",
        tooltip: "Full name and title of the current head of institution",
    },
    {
        name: "principal_photo",
        label: "Principal's Portrait",
        type: FORM_TYPE.FILE,
        accept: "image/*",
        fileMode: "avatar",
        tooltip: "Official professional portrait of the principal",
        helperText: "Click or drag to change. Recommended: square image, at least 400×400px.",
    },
    {
        name: "principal_message",
        label: "Principal's Message",
        type: FORM_TYPE.EDITOR,
        placeholder: "e.g. Enter the principal's message for visitors",
        tooltip: "A brief welcoming message shown on the home page",
    },
];

export const LANDING_PAGE_NARRATIVE_GROUP = [
    {
        name: "about_title",
        label: "About Section Heading",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g., Welcome to Our Institution",
        tooltip: "Catchy title for the introductory section on the home page",
    },
    {
        name: "about_content",
        label: "About Description",
        type: FORM_TYPE.EDITOR,
        placeholder: "e.g. Provide a detailed overview of the institution",
        tooltip: "Formal introduction to the college's history and heritage",
    },
    {
        name: "mission_statement",
        label: "Mission Statement",
        type: FORM_TYPE.EDITOR,
        tooltip: "Specific goals and the institutional purpose",
    },
    {
        name: "vision_statement",
        label: "Vision Statement",
        type: FORM_TYPE.EDITOR,
        tooltip: "Long-term aspirations and the future outlook",
    },
];

export const LANDING_PAGE_GOALS_GROUP = [
    {
        name: "core_goals",
        label: "Core Goals",
        type: FORM_TYPE.LIST,
        placeholder: "e.g. Add a goal...",
        tooltip: "List of core goals displayed on the landing page with checkmarks",
        maxItems: 4,
    },
];

export const LANDING_PAGE_JOURNEY_GROUP = [
    {
        name: "journey_tag",
        label: "Journey Tag",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g., OUR JOURNEY",
        tooltip: "Small tag text displayed above the journey heading",
    },
    {
        name: "journey_heading_line1",
        label: "Journey Heading (Line 1)",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g., A Legacy of Knowledge",
        tooltip: "First line of the journey section heading",
    },
    {
        name: "journey_heading_line2",
        label: "Journey Heading (Line 2)",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g., Since 1978",
        tooltip: "Second line of the journey section heading (typically founding year)",
    },
    {
        name: "founding_year",
        label: "Founding Year",
        type: FORM_TYPE.NUMBER,
        placeholder: "e.g., 1978",
        tooltip: "Year the institution was established (used for calculating years of service)",
    },
    {
        name: "historical_foundations_title",
        label: "Historical Foundations - Title",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g., Historical Foundations",
        tooltip: "Title for the first timeline point",
    },
    {
        name: "historical_foundations_content",
        label: "Historical Foundations - Description",
        type: FORM_TYPE.EDITOR,
        placeholder: "e.g. Describe the institution's founding and early history",
        tooltip: "Detailed description of the institution's historical foundations",
    },
    {
        name: "academic_evolution_title",
        label: "Academic Evolution - Title",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g., Academic Evolution",
        tooltip: "Title for the second timeline point",
    },
    {
        name: "academic_evolution_content",
        label: "Academic Evolution - Description",
        type: FORM_TYPE.EDITOR,
        placeholder: "e.g. Describe how the institution has grown academically",
        tooltip: "Detailed description of academic growth and program expansion",
    },
    {
        name: "modern_era_title",
        label: "Modern Era - Title",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g., Modern Era",
        tooltip: "Title for the third timeline point",
    },
    {
        name: "modern_era_content",
        label: "Modern Era - Description",
        type: FORM_TYPE.EDITOR,
        placeholder: "e.g. Describe the institution's current state and future direction",
        tooltip: "Detailed description of the modern era and contemporary approach",
    },
];

export const LANDING_PAGE_CONTENT_LAYOUT = [
    ...LANDING_PAGE_LEADERSHIP_GROUP,
    ...LANDING_PAGE_NARRATIVE_GROUP,
    ...LANDING_PAGE_GOALS_GROUP,
    ...LANDING_PAGE_JOURNEY_GROUP,
];

// ============================================================================
// Profile Settings (no grouping needed - too small)
// ============================================================================
export const PROFILE_FORM_LAYOUT = [
    {
        name: "avatar",
        label: "Profile Picture",
        type: FORM_TYPE.FILE,
        accept: "image/*",
        fileMode: "avatar",
        required: false,
        tooltip: "Upload a professional photo for your profile",
        helperText: "Recommended: Square image, at least 400x400px",
    },
    {
        name: "name",
        label: "Full Name",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. Enter your full name",
        required: false,
        tooltip: "Your legal name as it should appear in reports and documents",
        maxLength: 100,
    },
    {
        name: "email",
        label: "Email Address",
        type: FORM_TYPE.EMAIL,
        placeholder: "e.g. admin@college.edu",
        required: false,
        disabled: true,
        tooltip: "Primary contact email (cannot be changed for security reasons)",
    },
];

// ============================================================================
// Admission Settings Groups
// ============================================================================
export const ADMISSION_SETTINGS_CONTROL_GROUP = [
    {
        name: "admission_readmission_enabled",
        label: "Course Re-admission",
        type: FORM_TYPE.RADIO,
        options: [
            { key: "yes", text: "Yes, Enable.", value: "1" },
            { key: "no", text: "No, Disable.", value: "0" },
        ],
        tooltip: "Enable or disable course re-admission across the portal",
    },
];

export const ADMISSION_RE_ADMISSION_GROUP = [
    {
        name: "instruction_re_admission_header",
        label: "Instruction and Terms & Condition for Re-Admission",
        type: FORM_TYPE.TITLE,
    },
    {
        name: "admission_re_instruction",
        label: "Instruction for Re-Admission",
        type: FORM_TYPE.EDITOR,
        tooltip: "Detailed instructions shown to students during re-admission",
    },
    {
        name: "admission_re_tc",
        label: "Terms & Conditions for Re-Admission",
        type: FORM_TYPE.EDITOR,
        tooltip: "Legal terms and conditions for re-admission",
    },
];

export const ADMISSION_NEW_ADMISSION_GROUP = [
    {
        name: "instruction_new_admission_header",
        label: "Instruction and Terms & Condition for New Admission",
        type: FORM_TYPE.TITLE,
    },
    {
        name: "admission_new_instruction",
        label: "Instruction for New Admission",
        type: FORM_TYPE.EDITOR,
        tooltip: "Detailed instructions shown to students during new admission",
    },
    {
        name: "admission_new_tc",
        label: "Terms & Conditions for New Admission",
        type: FORM_TYPE.EDITOR,
        tooltip: "Legal terms and conditions for new admission",
    },
];

export const ADMISSION_FORM_LAYOUT = [
    ...ADMISSION_SETTINGS_CONTROL_GROUP,
    ...ADMISSION_RE_ADMISSION_GROUP,
    ...ADMISSION_NEW_ADMISSION_GROUP,
];

// ============================================================================
// Stream Form Mapping (no grouping needed - too small)
// ============================================================================
export const STREAM_FORM_MAPPING_LAYOUT = [
    {
        name: "ug_form_type",
        label: "Under Graduate (UG)",
        type: FORM_TYPE.DROPDOWN,
        placeholder: "e.g. Select Form Type",
        options: [
            { key: "ug", text: "Under Graduate Form", value: "ug" },
            { key: "pg", text: "Post Graduate Form", value: "pg" },
            { key: "diploma", text: "Diploma Form", value: "diploma" },
        ],
    },
    {
        name: "vocational_form_type",
        label: "Vocational Courses",
        type: FORM_TYPE.DROPDOWN,
        placeholder: "e.g. Select Form Type",
        options: [
            { key: "ug", text: "Under Graduate Form", value: "ug" },
            { key: "certificate", text: "Certificate Form", value: "certificate" },
        ],
    },
];
// ============================================================================
// Institutional Data Groups
// ============================================================================

export const ACADEMICS_ADMISSION_GROUP = [
    {
        name: "admission_procedure",
        label: "Admission Procedure",
        type: FORM_TYPE.EDITOR,
        placeholder: "e.g. Detail the steps for admission...",
        tooltip: "Overview of the institutional admission process",
    },
    {
        name: "admission_policy",
        label: "Admission Policy",
        type: FORM_TYPE.EDITOR,
        placeholder: "e.g. Institutional admission policies...",
        tooltip: "Rules and regulations governing admissions",
    },
    {
        name: "admission_documents",
        label: "Required Documents",
        type: FORM_TYPE.EDITOR,
        placeholder: "e.g. List required documents...",
        tooltip: "List of documents students must provide",
    },
];

export const ACADEMICS_CALENDAR_GROUP = [
    {
        name: "academic_calendar_file",
        label: "Academic Calendar (PDF)",
        type: FORM_TYPE.FILE,
        accept: ".pdf",
        tooltip: "Upload the current academic year's calendar",
    },
    {
        name: "academic_calendar_text",
        label: "Calendar Overview",
        type: FORM_TYPE.EDITOR,
        placeholder: "e.g. Summary of key dates...",
        tooltip: "Brief text summary of important academic dates",
    },
];

export const ACADEMICS_STAFF_GROUP = [
    {
        name: "staff_overview",
        label: "Staff & Faculty Overview",
        type: FORM_TYPE.EDITOR,
        placeholder: "e.g. General information about staff...",
        tooltip: "Overall description of the institution's human resources",
    },
    {
        name: "faculty_count",
        label: "Total Faculty Count",
        type: FORM_TYPE.NUMBER,
        placeholder: "e.g., 50",
        tooltip: "Total number of teaching members",
    },
];

export const ACADEMICS_POLICIES_GROUP = [
    {
        name: "general_policies",
        label: "General Institutional Polices",
        type: FORM_TYPE.EDITOR,
        placeholder: "e.g. Code of conduct, etc...",
        tooltip: "General rules and guidelines for students and staff",
    },
    {
        name: "anti_ragging_policy",
        label: "Anti-Ragging Policy",
        type: FORM_TYPE.EDITOR,
        placeholder: "e.g. Details about anti-ragging measures...",
        tooltip: "Institutional policy against ragging",
    },
];

export const ACADEMICS_CURRICULUM_GROUP = [
    {
        name: "curriculum_overview",
        label: "Curriculum Overview",
        type: FORM_TYPE.EDITOR,
        placeholder: "e.g. General approach to education...",
        tooltip: "Overview of the institutional teaching philosophy and structure",
    },
    {
        name: "syllabi_links",
        label: "Syllabi & Resources",
        type: FORM_TYPE.EDITOR,
        placeholder: "e.g. Links to syllabi or study materials...",
        tooltip: "Links to academic resources for students",
    },
];

export const DEPARTMENTS_CATEGORIES_GROUP = [
    {
        name: "department_categories",
        label: "Department Categories",
        type: FORM_TYPE.LIST,
        placeholder: "Add category (e.g., Science, Arts...)",
        tooltip: "Broad categories for grouping departments",
    },
];

export const DEPARTMENTS_LIST_GROUP = [
    {
        name: "departments_list",
        label: "Hierarchical Departments List (JSON)",
        type: FORM_TYPE.EDITOR,
        placeholder: "[\n  {\n    \"name\": \"Department Name\",\n    \"code\": \"DEPT01\",\n    \"faculty\": [\n      {\"name\": \"Prof. Name\", \"designation\": \"Professor\"}\n    ]\n  }\n]",
        className: "font-mono",
        tooltip: "Raw JSON structure for departments and faculty. Use with caution.",
        helperText: "Format strictly as a JSON array of objects.",
    },
];

export const FACILITIES_GROUP = [
    {
        name: "facilities_list",
        label: "Institutional Facilities",
        type: FORM_TYPE.REPEATER,
        fields: [
            { name: "id", label: "Unique ID", type: FORM_TYPE.TEXT, placeholder: "e.g., library" },
            { name: "title", label: "Facility Title", type: FORM_TYPE.TEXT, placeholder: "e.g., Central Library" },
            { name: "icon", label: "Icon Name (Lucide)", type: FORM_TYPE.TEXT, placeholder: "e.g., Book" },
            { name: "description", label: "Brief Description", type: FORM_TYPE.TEXTAREA, placeholder: "e.g. Enter details..." },
        ],
        tooltip: "List of key facilities available on campus",
    },
];

export const APPROVALS_GROUP = [
    {
        name: "approvals_list",
        label: "Regulatory Approvals & Affiliations",
        type: FORM_TYPE.REPEATER,
        fields: [
            { name: "id", label: "Authority ID", type: FORM_TYPE.TEXT, placeholder: "e.g., naac" },
            { name: "title", label: "Body Name", type: FORM_TYPE.TEXT, placeholder: "e.g., NAAC Accredited" },
            { name: "subtitle", label: "Accreditation Level", type: FORM_TYPE.TEXT, placeholder: "e.g., Grade A++" },
            { name: "color", label: "Color Theme (CSS/TW)", type: FORM_TYPE.TEXT, placeholder: "e.g., bg-red-500/10 text-red-500" },
        ],
        tooltip: "Official bodies that recognize or accredit the institution",
    },
];

export const PLACEMENT_GROUP = [
    {
        name: "placement_overview",
        label: "Placement Cell Overview",
        type: FORM_TYPE.EDITOR,
        placeholder: "e.g. Describe the placement cell's work...",
        tooltip: "Introduction to the Training & Placement cell",
    },
    {
        name: "placement_statistics",
        label: "Placement Statistics",
        type: FORM_TYPE.REPEATER,
        fields: [
            { name: "label", label: "Stat Label", type: FORM_TYPE.TEXT, placeholder: "e.g., Highest Package" },
            { name: "value", label: "Stat Value", type: FORM_TYPE.TEXT, placeholder: "e.g., 12 LPA" },
        ],
        tooltip: "Key performance indicators for placements",
    },
    {
        name: "placement_partners",
        label: "Recruiting Partners",
        type: FORM_TYPE.LIST,
        placeholder: "e.g. Add company name...",
        tooltip: "List of companies that regularly recruit from the institution",
    },
];
