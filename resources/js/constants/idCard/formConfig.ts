import { FORM_TYPE } from "@/constants/shared/form";
import type { FormFieldConfig } from "@/types/formTypes";
import type { InstitutionContentMap } from "@/constants/content";
import type { BreadcrumbItem } from "@/types";

// ─── Template Form Field Config ──────────────────────────────────────────────
export const TEMPLATE_FORM_FIELDS: FormFieldConfig[] = [
    {
        name: "name",
        label: "Template Name",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. Student ID Card 2025",
        required: true,
        maxLength: 200,
        layout: "half",
        tooltip: "Give this template a descriptive name.",
        permission: "field_id_card_template_name",
    },
    {
        name: "card_type",
        label: "Card Type",
        type: FORM_TYPE.SELECT,
        placeholder: "Select card type",
        required: true,
        options: [
            { key: "student", text: "Student", value: "student" },
            { key: "staff", text: "Staff", value: "staff" },
            { key: "temporary", text: "Temporary", value: "temporary" },
        ],
        layout: "half",
        tooltip: "Student cards use student profiles; staff cards use staff profiles.",
        permission: "field_id_card_template_card_type",
    },
    {
        name: "background_color",
        label: "Background Color",
        type: FORM_TYPE.COLOR,
        placeholder: "#1a237e",
        layout: "half",
        tooltip: "Primary background color for the card. Used when no background image is set.",
        permission: "field_id_card_template_bg_color",
    },
    {
        name: "is_default",
        label: "Set as Default",
        type: FORM_TYPE.CHECKBOX,
        tooltip: "Only one template per card type can be default.",
        layout: "half",
        permission: "field_id_card_template_is_default",
    },
    {
        name: "is_active",
        label: "Active",
        type: FORM_TYPE.CHECKBOX,
        tooltip: "Inactive templates cannot be used for generation.",
        layout: "half",
        permission: "field_id_card_template_is_active",
    },
];

export const COLOR_SCHEME_FIELDS: FormFieldConfig[] = [
    {
        name: "color_scheme.primary",
        label: "Primary Color",
        type: FORM_TYPE.COLOR,
        placeholder: "#1a237e",
        layout: "half",
        tooltip: "Main brand color used for headers, borders, and accents.",
        permission: "field_id_card_color_primary",
    },
    {
        name: "color_scheme.secondary",
        label: "Secondary Color",
        type: FORM_TYPE.COLOR,
        placeholder: "#ffffff",
        layout: "half",
        tooltip: "Supporting color for highlights and secondary elements.",
        permission: "field_id_card_color_secondary",
    },
    {
        name: "color_scheme.text",
        label: "Text Color",
        type: FORM_TYPE.COLOR,
        placeholder: "#ffffff",
        layout: "half",
        tooltip: "Default text color on the card. Ensure contrast with the background.",
        permission: "field_id_card_color_text",
    },
    {
        name: "color_scheme.bg",
        label: "Background",
        type: FORM_TYPE.COLOR,
        placeholder: "#000000",
        layout: "half",
        tooltip: "Card background fill. Overridden if a background image is set.",
        permission: "field_id_card_color_bg",
    },
];

// ─── Generate Cards Form ─────────────────────────────────────────────────────
export const GENERATE_FORM_FIELDS: FormFieldConfig[] = [
    {
        name: "template_id",
        label: "Template",
        type: FORM_TYPE.SELECT,
        placeholder: "Select a template",
        required: true,
        layout: "full",
        tooltip: "Choose the card design to use for generation.",
        permission: "field_id_card_gen_template",
    },
    {
        name: "session_id",
        label: "Academic Session",
        type: FORM_TYPE.SELECT,
        placeholder: "Select session",
        required: true,
        layout: "half",
        tooltip: "Cards will be generated for this session.",
        permission: "field_id_card_gen_session",
    },
    {
        name: "stream_id",
        label: "Stream / Class",
        type: FORM_TYPE.SELECT,
        placeholder: "All streams",
        layout: "half",
        tooltip: "Leave empty to generate for all streams.",
        permission: "field_id_card_gen_stream",
    },
];

// ─── Table Columns ───────────────────────────────────────────────────────────
export const TEMPLATE_TABLE_COLUMNS = [
    { key: "sl", label: "#" },
    { key: "name", label: "Template Name" },
    { key: "card_type", label: "Type" },
    { key: "is_default", label: "Default" },
    { key: "is_active", label: "Status" },
    { key: "created_at", label: "Created" },
    { key: "actions", label: "Actions" },
];

export const CARD_TABLE_COLUMNS = [
    { key: "sl", label: "#" },
    { key: "reg_no", label: "Reg No" },
    { key: "name", label: "Name" },
    { key: "stream", label: "Stream" },
    { key: "status", label: "Status" },
    { key: "generated_at", label: "Generated" },
    { key: "actions", label: "Actions" },
];

// ─── Initial Filter State ────────────────────────────────────────────────────
export const INITIAL_TEMPLATE_FILTERS = {
    page: 1,
    per_page: 15,
    search: "",
    search_by: "name",
};

export const INITIAL_CARD_FILTERS = {
    page: 1,
    per_page: 15,
    search: "",
    search_by: "name",
    status: "",
    session_id: "",
    stream_id: "",
};

// ─── Status Config (Polymorphic) ─────────────────────────────────────────────
export const CARD_STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    generated: "default",
    printed: "secondary",
    revoked: "destructive",
    expired: "outline",
};

export const CARD_STATUS_OPTIONS = [
    { key: "generated", text: "Generated", value: "generated" },
    { key: "printed", text: "Printed", value: "printed" },
    { key: "revoked", text: "Revoked", value: "revoked" },
    { key: "expired", text: "Expired", value: "expired" },
];

// ─── Template Placeholder Fields (scope-aware & categorized) ─────────────────

const ALL = ["school", "college", "coaching", "university"] as const;
const HIGHER = ["college", "coaching", "university"] as const;

export interface PlaceholderField {
    key: string;
    label: string;
    contentKey?: string; // resolves label via content engine per scope
    locked?: boolean;
    category: "identity" | "academic" | "personal" | "branding";
    scope_types: readonly string[];
    side: "front" | "back" | "both";
}

export const PLACEHOLDER_CATEGORIES = [
    { key: "identity", label: "Identity" },
    { key: "academic", label: "Academic" },
    { key: "personal", label: "Personal" },
    { key: "branding", label: "Card Branding" },
] as const;

export const STUDENT_CARD_PLACEHOLDERS: PlaceholderField[] = [
    // Identity
    { key: "reg_no", label: "Reg No", locked: true, category: "identity", scope_types: ALL, side: "front" },
    { key: "name", label: "Student Name", locked: true, category: "identity", scope_types: ALL, side: "front" },
    { key: "photo", label: "Photo", locked: true, category: "identity", scope_types: ALL, side: "front" },
    { key: "roll_no", label: "Roll No", category: "identity", scope_types: ALL, side: "front" },
    // Academic
    { key: "stream", label: "Class / Stream", contentKey: "stream", category: "academic", scope_types: ALL, side: "front" },
    { key: "department", label: "Department", category: "academic", scope_types: HIGHER, side: "back" },
    { key: "session", label: "Session", category: "academic", scope_types: HIGHER, side: "back" },
    // Personal
    { key: "dob", label: "Date of Birth", category: "personal", scope_types: ALL, side: "front" },
    { key: "blood_group", label: "Blood Group", category: "personal", scope_types: ALL, side: "front" },
    { key: "father_name", label: "Father's Name", category: "personal", scope_types: ALL, side: "back" },
    { key: "mother_name", label: "Mother's Name", category: "personal", scope_types: ALL, side: "back" },
    { key: "address", label: "Address", category: "personal", scope_types: ALL, side: "back" },
    { key: "mobile", label: "Mobile", category: "personal", scope_types: ALL, side: "back" },
    // Branding
    { key: "qr_code", label: "QR Code", locked: true, category: "branding", scope_types: ALL, side: "back" },
    { key: "institution_name", label: "Institution", locked: true, category: "branding", scope_types: ALL, side: "front" },
    { key: "institution_logo", label: "Logo", category: "branding", scope_types: ALL, side: "front" },
    { key: "valid_until", label: "Valid Until", category: "branding", scope_types: ALL, side: "front" },
];

export const STAFF_CARD_PLACEHOLDERS: PlaceholderField[] = [
    // Identity
    { key: "reg_no", label: "Reg No", locked: true, category: "identity", scope_types: ALL, side: "front" },
    { key: "name", label: "Staff Name", locked: true, category: "identity", scope_types: ALL, side: "front" },
    { key: "photo", label: "Photo", locked: true, category: "identity", scope_types: ALL, side: "front" },
    { key: "employee_id", label: "Employee ID", category: "identity", scope_types: ALL, side: "front" },
    // Academic
    { key: "designation", label: "Designation", category: "academic", scope_types: ALL, side: "front" },
    { key: "department", label: "Department", category: "academic", scope_types: ALL, side: "front" },
    { key: "session", label: "Session", category: "academic", scope_types: ALL, side: "front" },
    { key: "joining_date", label: "Joining Date", category: "academic", scope_types: ALL, side: "back" },
    // Personal
    { key: "dob", label: "Date of Birth", category: "personal", scope_types: ALL, side: "front" },
    { key: "blood_group", label: "Blood Group", category: "personal", scope_types: ALL, side: "front" },
    { key: "mobile", label: "Mobile", category: "personal", scope_types: ALL, side: "both" },
    { key: "email", label: "Email", category: "personal", scope_types: ALL, side: "back" },
    { key: "address", label: "Address", category: "personal", scope_types: ALL, side: "back" },
    // Branding
    { key: "qr_code", label: "QR Code", locked: true, category: "branding", scope_types: ALL, side: "back" },
    { key: "institution_name", label: "Institution", locked: true, category: "branding", scope_types: ALL, side: "front" },
    { key: "institution_logo", label: "Logo", category: "branding", scope_types: ALL, side: "front" },
    { key: "valid_until", label: "Valid Until", category: "branding", scope_types: ALL, side: "front" },
];

export const TEMPORARY_CARD_PLACEHOLDERS: PlaceholderField[] = [
    { key: "reg_no", label: "Visitor ID", locked: true, category: "identity", scope_types: ALL, side: "front" },
    { key: "name", label: "Visitor Name", locked: true, category: "identity", scope_types: ALL, side: "front" },
    { key: "photo", label: "Photo", locked: true, category: "identity", scope_types: ALL, side: "front" },
    { key: "organization", label: "Organization", category: "identity", scope_types: ALL, side: "front" },
    { key: "purpose", label: "Purpose of Visit", category: "personal", scope_types: ALL, side: "front" },
    { key: "host_name", label: "Host / Contact", category: "personal", scope_types: ALL, side: "both" },
    { key: "mobile", label: "Mobile", category: "personal", scope_types: ALL, side: "both" },
    { key: "email", label: "Email", category: "personal", scope_types: ALL, side: "back" },
    { key: "address", label: "Address", category: "personal", scope_types: ALL, side: "back" },
    { key: "valid_until", label: "Valid Until", category: "branding", scope_types: ALL, side: "front" },
    { key: "qr_code", label: "QR Code", locked: true, category: "branding", scope_types: ALL, side: "back" },
    { key: "institution_name", label: "Institution", locked: true, category: "branding", scope_types: ALL, side: "front" },
    { key: "institution_logo", label: "Logo", category: "branding", scope_types: ALL, side: "front" },
];

export type IdCardTemplateCardType = "student" | "staff" | "temporary";

/** Toolbar fields visible per card type on the generate page */
export function getGenerateToolbarFieldNames(cardType: IdCardTemplateCardType): string[] {
    switch (cardType) {
        case "student":
            return ["template_id", "session_id", "stream_id"];
        case "staff":
            return ["template_id", "session_id"];
        case "temporary":
            return ["template_id"];
        default:
            return ["template_id", "session_id", "stream_id"];
    }
}

// ─── Permissions ─────────────────────────────────────────────────────────────
export const ID_CARD_PERMISSIONS = {
    view: "view_id_card_templates",
    create: "create_id_card_templates",
    edit: "update_id_card_templates",
    delete: "delete_id_card_templates",
    generate: "generate_id_cards",
    viewCards: "view_id_cards",
    download: "download_id_cards",
    revoke: "revoke_id_cards",
} as const;

// ─── Content Strings ─────────────────────────────────────────────────────────
export const ID_CARD_CONTENT = {
    templates: {
        title: "ID Card Templates",
        subtitle: "Design and manage ID card templates for students and staff.",
        newTemplateBtn: "New Template",
        searchPlaceholder: "Search templates...",
        emptyTitle: "No templates yet",
        emptyDesc: "Create your first ID card template to get started.",
    },
    generatedCards: {
        title: "Generated ID Cards",
        subtitle: "View, download, and manage all generated student and staff identity cards.",
        generateBtn: "Generate Cards",
        searchPlaceholder: "Search by name or reg no...",
        emptyTitle: "No cards generated",
        emptyDesc: "Generate ID cards from the Generate page.",
    },
    templateCreate: {
        title: "Create ID Card Template",
        subtitle: "Design a new ID card template with custom layout, colors, and fields.",
        submitBtn: "Create Template",
        fieldsTitle: "Template Fields",
        fieldsSubtitle: "Select which fields appear on the card.",
        colorsTitle: "Color Scheme",
        colorsSubtitle: "Customize the card appearance.",
    },
    templateEdit: {
        title: "Edit ID Card Template",
        subtitle: "Modify the layout, colors, and fields of this template.",
        submitBtn: "Save Changes",
    },
    generate: {
        title: "Generate ID Cards",
        subtitle: "Select a template, session, and stream to bulk generate ID cards.",
        submitBtn: "Generate Cards",
        previewLabel: "Students to generate",
    },
    editor: {
        backBtn: "Back to ID Cards",
        detailsTitle: "Card Details",
        detailsSubtitle: "Fill in the details for this card. Preview updates as you type.",
        loadStudentLabel: "Load from student",
        loadStaffLabel: "Load from staff",
        loadPlaceholder: "Search by name or ID...",
        loadClear: "Clear",
        loadHint: "Optional — search to prefill from directory, or type manually below.",
        sidebarSearch: "Search...",
        sidebarSelectAll: "Select All",
        sidebarDeselectAll: "Deselect All",
        sidebarReadyReady: "All fields filled",
        sidebarReadyPartial: "Some fields filled",
        sidebarReadyEmpty: "No data",
        // Preview canvas
        previewLive: "Live Preview",
        previewPlaceholder: "Live Preview",
        previewFront: "Front",
        previewBack: "Back",
        previewEmptyTitle: "Select a template to begin",
        previewEmptyDesc: "Choose a template from the toolbar to load the card editor.",
        canvasHint: "Scroll to zoom · Drag to pan · Double-click to reset",
        // Detail editor
        detailPhotoLabel: "Photo",
        detailPhotoBtn: "Upload Photo",
        detailEmptyTitle: "No editable fields",
        detailEmptyDesc: "This template has no user-editable fields.",
    },
    show: {
        title: "ID Card Details",
        subtitle: "View card details, download PDF, or regenerate.",
        downloadBtn: "Download PDF",
        regenerateBtn: "Regenerate",
        revokeBtn: "Revoke Card",
    },
    verify: {
        title: "ID Card Verification",
        invalidMessage: "Invalid or expired verification code",
        statusLabels: {
            generated: "Active",
            printed: "Active (Printed)",
            revoked: "Revoked",
            expired: "Expired",
        } as Record<string, string>,
    },
};

// ─── Content Engine Getters (scope-type-aware) ───────────────────────────────

export function getIdCardGenerateContent(c: InstitutionContentMap) {
    return {
        pageTitle: c.id_card_gen_page_title,
        pageSubtitle: c.id_card_gen_page_subtitle,
        submitBtn: c.id_card_gen_submit_btn,
        cancelBtn: c.id_card_gen_cancel_btn,
        cardTitle: c.id_card_gen_card_title,
        cardDesc: c.id_card_gen_card_desc,
        successMsg: c.id_card_gen_success_msg,
        errorMsg: c.id_card_gen_error_msg,
        streamAll: c.id_card_gen_stream_all,
    };
}

export function getIdCardGenerateBreadcrumbs(c: InstitutionContentMap): BreadcrumbItem[] {
    return [
        { title: "Dashboard", href: "/dashboard" },
        { title: "Certificates", href: "/certificates" },
        { title: c.id_card_gen_breadcrumb_parent, href: "/certificates/id-cards" },
        { title: c.id_card_gen_breadcrumb_self, href: "/certificates/id-cards/generate" },
    ];
}

export function getGenerateFormFields(
    c: InstitutionContentMap,
    fields: readonly FormFieldConfig[],
    cardType?: IdCardTemplateCardType,
): FormFieldConfig[] {
    const allowed = cardType ? new Set(getGenerateToolbarFieldNames(cardType)) : null;
    return fields
        .filter((f) => !allowed || allowed.has(f.name))
        .map((f) => {
        if (f.name === "stream_id") {
            return {
                ...f,
                label: c.id_card_gen_stream_label,
                placeholder: c.id_card_gen_stream_placeholder,
            };
        }
        if (f.name === "session_id") {
            return { ...f, label: c.id_card_gen_session_label };
        }
        if (f.name === "template_id") {
            return { ...f, label: c.id_card_gen_template_label };
        }
        return { ...f };
    });
}

