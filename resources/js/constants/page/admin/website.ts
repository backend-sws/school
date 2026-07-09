import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";
import { PUBLISH_STATUS_OPTIONS, PUBLISH_STATUS } from "@/constants/shared/status";

// Home Ticker Constants
export const TICKER_BREADCRUMBS: BreadcrumbItem[] = [
    { title: "Website & PR", href: "/website/sliders" },
    { title: "Live Tickers", href: "/website/tickers" },
];

export const TICKER_COLUMNS = [
    { key: "serial", label: "#" },
    { key: "content", label: "Ticker Message" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Added On" },
    { key: "action", label: "Actions" },
];

export const TICKER_FORM_INITIAL_DATA = {
    content: "",
    tags: [],
    status: PUBLISH_STATUS.DRAFT, // Default to Draft
};

export const TICKER_DIALOG_FORM_LAYOUT = [
    {
        name: "content",
        label: "Ticker Message",
        type: FORM_TYPE.EDITOR,
        placeholder: "e.g. Semester exams begin 15 Mar. Check schedule on portal.",
        required: true,
        tooltip: "Short message that scrolls on the homepage. Keep it concise; HTML is supported.",
    },
    {
        name: "tags",
        label: "Category Tags",
        type: FORM_TYPE.MULTI_TAG,
        placeholder: "Add tags...",
        tooltip: "Categorize this ticker with relevant tags",
        helperText: "Max 3 tags, 20 characters each",
        maxTags: 3,
        predefinedTags: ["New", "Latest", "Upcoming", "Urgent", "Event", "Notice", "Alert", "Important"],
    },
    {
        name: "status",
        label: "Status",
        type: FORM_TYPE.SELECT,
        options: [...PUBLISH_STATUS_OPTIONS],
        tooltip: "Set visibility status: Published (visible on website) or Draft (hidden)",
    },
];

// Manage News Constants
export const NEWS_BREADCRUMBS: BreadcrumbItem[] = [
    { title: "Website & PR", href: "/website/sliders" },
    { title: "Press & News", href: "/website/news" },
];

export const NEWS_COLUMNS = [
    { key: "serial", label: "#" },
    { key: "title", label: "Title" },
    { key: "type", label: "Type" },
    { key: "target", label: "News For" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Published" },
    { key: "action", label: "Actions" },
];

export const NEWS_FORM_INITIAL_DATA = {
    title: "",
    content: "",
    type: "notice",
    target: "all",
    event_date: "",
    event_location: "",
    tags: [] as string[],
    status: PUBLISH_STATUS.DRAFT, // Default to Draft
};

export const NEWS_DIALOG_FORM_LAYOUT = [
    {
        name: "title",
        label: "Title / Heading",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. Annual Sports Day 2025",
        required: true,
        maxLength: 255,
        tooltip: "Main headline for the news article. Shown in lists and on the article page.",
    },
    {
        name: "content",
        label: "News Content",
        type: FORM_TYPE.EDITOR,
        placeholder: "e.g. Write the full article here...",
        required: true,
        tooltip: "Full content with rich text. Include date, venue, and links as needed.",
    },
    {
        name: "type",
        label: "News Category",
        type: FORM_TYPE.SELECT,
        searchable: true,
        options: [
            { key: "notice", text: "Notice", value: "notice" },
            { key: "event", text: "Event", value: "event" },
            { key: "admission", text: "Admission", value: "admission" },
            { key: "exam", text: "Examination", value: "exam" },
            { key: "result", text: "Result", value: "result" },
            { key: "holiday", text: "Holiday", value: "holiday" },
            { key: "announcement", text: "Announcement", value: "announcement" },
        ],
        placeholder: "Select category (notice, event, admission, etc.)",
        tooltip: "Choose one category. Form shows extra fields (e.g. Event date & location) when needed for the website.",
        helperText: "Select one category; form adjusts to show relevant details for the website.",
    },
    {
        name: "tags",
        label: "Tags (for reference)",
        type: FORM_TYPE.MULTI_TAG,
        placeholder: "Add tags...",
        maxTags: 5,
        predefinedTags: ["New", "Latest", "Upcoming", "Urgent", "Important", "Featured", "Highlight"],
        tooltip: "Optional reference tags for filtering or display (e.g. New, Featured).",
        helperText: "Add tags for quick reference; max 5.",
    },
    {
        name: "target",
        label: "Target Audience",
        type: FORM_TYPE.RADIO,
        options: [
            { key: "all", text: "All", value: "all" },
            { key: "student", text: "For Students", value: "student" },
            { key: "others", text: "For Others", value: "others" },
        ],
        tooltip: "Who should see this news article",
    },
    {
        name: "status",
        label: "Status",
        type: FORM_TYPE.SELECT,
        options: [...PUBLISH_STATUS_OPTIONS],
        tooltip: "Set visibility status: Published (visible on website) or Draft (hidden)",
    },
];

// Manage Gallery Constants
export const GALLERY_BREADCRUMBS: BreadcrumbItem[] = [
    { title: "Website & PR", href: "/website/sliders" },
    { title: "Media Gallery", href: "/website/galleries" },
];

export const GALLERY_FORM_INITIAL_DATA = {
    title: "",
    description: "",
    status: PUBLISH_STATUS.PUBLISHED,
};

export const GALLERY_DIALOG_FORM_LAYOUT = [
    {
        name: "title",
        label: "Gallery Title / Heading",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. Campus Events 2025",
        required: true,
        maxLength: 200,
        className: "sm:col-span-2",
        tooltip: "Unique, descriptive title for the gallery. Shown on the website gallery page.",
    },
    {
        name: "description",
        label: "Gallery Description",
        type: FORM_TYPE.TEXTAREA,
        placeholder: "e.g. Photos from annual day and sports meet...",
        maxLength: 1000,
        className: "sm:col-span-2",
        tooltip: "Brief description of the gallery contents. Optional but helps visitors.",
    },
    {
        name: "status",
        label: "Status",
        type: FORM_TYPE.SELECT,
        options: [...PUBLISH_STATUS_OPTIONS],
        className: "sm:col-span-2",
        tooltip: "Published: visible on website. Draft: hidden until you publish.",
    },
];

export const GALLERY_COLUMNS = [
    { key: "serial", label: "#" },
    { key: "title", label: "Gallery Title" },
    { key: "image_count", label: "Images" },
    { key: "status", label: "Status" },
    { key: "action", label: "Actions" },
];

// Manage Faculty Constants
export const FACULTY_BREADCRUMBS: BreadcrumbItem[] = [
    { title: "Website & PR", href: "/website/sliders" },
    { title: "Faculty Members", href: "/website/faculties" },
];

export const FACULTY_FORM_INITIAL_DATA = {
    name: "",
    designation: "",
    phone: "",
    email: "",
    department_id: "",
    hide_phone: 0,
    hide_email: 0,
    status: 1,
};

export const FACULTY_DIALOG_FORM_LAYOUT = [
    {
        name: "name",
        label: "Faculty Name",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. Dr. Jane Smith",
        tooltip: "Full name as it should appear on the staff directory and website.",
        required: true,
        maxLength: 100,
    },
    {
        name: "designation",
        label: "Designation",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. Assistant Professor, HOD",
        tooltip: "Official designation or role in the department.",
        required: true,
        maxLength: 100,
    },
    {
        name: "department_id",
        label: "Department",
        type: FORM_TYPE.SELECT,
        optionsKey: "departments",
        placeholder: "e.g. Mathematics, Computer Science",
        tooltip: "Department this faculty belongs to. Used for filtering and display.",
        required: true,
    },
    {
        name: "phone",
        label: "Phone Number",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. +91 98765 43210",
        tooltip: "Contact number. Can be hidden on public profile if preferred.",
        maxLength: 20,
    },
    {
        name: "hide_phone",
        label: "Hide phone on profile",
        type: FORM_TYPE.CHECKBOX,
        tooltip: "When checked, phone number is not shown on the public staff directory.",
    },
    {
        name: "email",
        label: "Email Address",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. jane.smith@college.edu",
        tooltip: "Official email. Can be hidden on public profile if preferred.",
        maxLength: 100,
    },
    {
        name: "hide_email",
        label: "Hide email on profile",
        type: FORM_TYPE.CHECKBOX,
        tooltip: "When checked, email is not shown on the public staff directory.",
    },
    {
        name: "status",
        label: "Status",
        type: FORM_TYPE.SELECT,
        options: [
            { key: "active", text: "Active", value: 1 },
            { key: "inactive", text: "Inactive", value: 0 },
        ],
        tooltip: "Inactive faculty are hidden from the public staff directory.",
    },
];

export const FACULTY_COLUMNS = [
    { key: "serial", label: "#" },
    { key: "name", label: "Faculty Name" },
    { key: "department", label: "Department" },
    { key: "designation", label: "Designation" },
    { key: "phone", label: "Phone" },
    { key: "action", label: "Actions" },
];
