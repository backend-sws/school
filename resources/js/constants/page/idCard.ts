import { BreadcrumbItem } from "@/types";

export const ID_CARD_TEMPLATES_BREADCRUMBS: BreadcrumbItem[] = [
    { title: "Certificates", href: "/certificates/applications" },
    { title: "ID Templates", href: "/certificates/id-cards/templates" },
];

export const ID_CARDS_BREADCRUMBS: BreadcrumbItem[] = [
    { title: "Certificates", href: "/certificates/applications" },
    { title: "ID Cards", href: "/certificates/id-cards" },
];

export const ID_CARD_TEMPLATE_CREATE_BREADCRUMBS: BreadcrumbItem[] = [
    ...ID_CARD_TEMPLATES_BREADCRUMBS,
    { title: "Create Template", href: "/certificates/id-cards/templates/create" },
];

export const ID_CARD_TEMPLATE_EDIT_BREADCRUMBS: BreadcrumbItem[] = [
    ...ID_CARD_TEMPLATES_BREADCRUMBS,
    { title: "Edit Template", href: "#" },
];

export const ID_CARD_GENERATE_BREADCRUMBS: BreadcrumbItem[] = [
    ...ID_CARDS_BREADCRUMBS,
    { title: "Generate", href: "/certificates/id-cards/generate" },
];

export const ID_CARD_SHOW_BREADCRUMBS: BreadcrumbItem[] = [
    ...ID_CARDS_BREADCRUMBS,
    { title: "Card Details", href: "#" },
];

export const ID_CARD_TEMPLATES_GUIDELINES = [
    "Create and manage ID card layouts for students and staff.",
    "Define card orientation (Vertical/Horizontal) and choose a design theme.",
    "Toggle fields like Father's Name, Mobile, and Address to match your institutional policy.",
];

export const ID_CARD_TEMPLATES_TIP = "Set a template as 'Default' to automatically apply it to all new ID card generations for that category.";

export const ID_CARDS_GUIDELINES = [
    "View all generated student and staff identity cards in one place.",
    "Filter by status or search by name to quickly locate a specific card.",
    "Click any row to preview the full card with front and back details.",
];

export const ID_CARDS_TIP = "Cards marked 'Generated' are ready for printing. Use the bulk download option to export multiple cards at once.";

export const ID_CARD_GENERATE_GUIDELINES = [
    "Search and select students to generate and print their ID cards.",
    "Verify student details (Photo, Roll No, Stream) before generating to avoid reprints.",
];

export const ID_CARD_GENERATE_TIP = "Use the 'Class' filter to batch-generate ID cards for an entire section once the session setup is complete.";
