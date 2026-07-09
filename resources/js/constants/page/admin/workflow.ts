import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";

export const WORKFLOW_BREADCRUMBS: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Institutional Settings", href: "/settings/institution" },
    { title: "Security Workflows", href: "/admin/workflows" },
];

export const WORKFLOW_COLUMNS = [
    { key: "serial", label: "#" },
    { key: "name", label: "Workflow Name" },
    { key: "description", label: "Description" },
    { key: "permissions_count", label: "Permissions Count" },
    { key: "action", label: "Actions" },
];

export const WORKFLOW_FORM_LAYOUT = [
    {
        name: "name",
        label: "Workflow Name",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. Admission Cell, NSS Management",
        required: true,
    },
    {
        name: "description",
        label: "Description",
        type: FORM_TYPE.TEXTAREA,
        placeholder: "Define the set of duties this workflow covers",
        className: "md:col-span-2",
    },
];

export const WORKFLOW_FORM_INITIAL_DATA = {
    name: "",
    description: "",
};
