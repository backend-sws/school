import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";

export const ROLE_BREADCRUMBS: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Institutional Settings", href: "/settings/institution" },
    { title: "Security Roles", href: "/admin/roles" },
];

export const INITIAL_ROLE_FILTERS = {
    page: 1,
    per_page: 15,
};

export const ROLE_COLUMNS = [
    { key: "serial", label: "#" },
    { key: "name", label: "Role Name" },
    { key: "key", label: "System Key" },
    { key: "level", label: "Access Level" },
    { key: "description", label: "Description" },
    { key: "action", label: "Actions" },
];

/** Create/edit form: name and description only. Access level is set by the backend for custom roles. */
export const ROLE_FORM_LAYOUT = [
    {
        name: "name",
        label: "Role Name",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. Dept Head, Clerk",
        required: true,
        maxLength: 100,
        requiredMessage: "Role name is required",
        className: "md:col-span-2",
        tooltip: "Display name for this role. Used in the staff directory and when assigning roles to users. Max 100 characters. The system key (e.g. dept_head_abc1) is auto-generated from this name: slug of the name plus a short random suffix for uniqueness.",
    },
    {
        name: "description",
        label: "Description",
        type: FORM_TYPE.TEXTAREA,
        placeholder: "What are the responsibilities of this role?",
        className: "md:col-span-2",
        maxLength: 500,
        tooltip: "Optional summary of the role's purpose and responsibilities. Shown in the roles list. Max 500 characters.",
    },
];

export const ROLE_FORM_INITIAL_DATA = {
    name: "",
    description: "",
};
