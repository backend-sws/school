import { FilterOption } from "@/components/filter-bar";
import { BreadcrumbItem } from "@/types";
import { FilterParamMapping } from "@/hooks/useSearchfilter";

// Filter-to-API param mapping configuration for candidate list
export const CANDIDATE_FILTER_MAPPING: FilterParamMapping = {
    is_verified: { paramName: "is_verified", skipValues: ["all"] },
};

export const CANDIDATE_BREADCRUMBS: BreadcrumbItem[] = [
    { title: "Admission Cell", href: "/admission/applications" },
    { title: "Candidates", href: "/students/candidate" },
];

export const INITIAL_CANDIDATE_FILTERS = {
    is_verified: "all",
    page: 1,
    perPage: 10,
    searchType: "email",
    search: "",
};

export const CANDIDATE_COLUMNS = [
    { key: "serial", label: "#" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "mobile", label: "Mobile" },
    { key: "email_verified", label: "Email Verification" },
    { key: "status", label: "Status" },
    { key: "action", label: "Actions" },
];

export const CANDIDATE_VERIFIED_OPTIONS: FilterOption[] = [
    { value: "all", label: "All Candidates" },
    { value: "1", label: "Verified Only" },
    { value: "0", label: "Unverified Only" },
];

export const CANDIDATE_SEARCH_TYPES: FilterOption[] = [
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "name", label: "Name" },
];

export const CANDIDATE_TOOLTIPS = {
    search: "Search candidates by name, email or mobile number",
    verification: "Filter by email verification status",
};

export const CANDIDATE_GUIDELINES = [
    "Manage the pool of registered applicants before they are finalized for admission.",
    "Verify contact details and monitor email verification status to ensure communication integrity.",
];

export const CANDIDATE_TIP = "Filter by 'Unverified Only' to periodically follow up with candidates who haven't confirmed their email addresses yet.";
