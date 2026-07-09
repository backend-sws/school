import type { FilterOption } from "@/components/filter-bar";
import type { BreadcrumbItem } from "@/types";
import type { FilterParamMapping } from "@/hooks/useSearchfilter";
import { FORM_TYPE } from "@/constants/shared/form";

export const STAFF_DIRECTORY_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Settings", href: "/settings/profile" },
  { title: "Staff Directory", href: "/settings/staff-directory" },
];

export const INITIAL_STAFF_FILTERS = {
  search: "",
  searchType: "search",
  department: "all",
  subject: "all",
  category: "all",
  role: "all",
  status: "all",
  page: 1,
  perPage: 10,
};

export const STAFF_FILTER_MAPPING: FilterParamMapping = {
  department: { paramName: "department_id", skipValues: ["all"] },
  subject: { paramName: "subject_id", skipValues: ["all"] },
  category: { paramName: "category", skipValues: ["all"] },
  role: { paramName: "role", skipValues: ["all"] },
  status: { paramName: "status", skipValues: ["all"] },
};

export const STAFF_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "category", label: "Category" },
  { key: "role", label: "Role" },
  { key: "phone", label: "Phone" },
  { key: "status", label: "Status" },
  { key: "action", label: "Actions" },
];

export const STAFF_SEARCH_TYPES: FilterOption[] = [
  { value: "search", label: "Name / Email" },
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
];

export const STAFF_STATUS_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Status" },
  { value: "1", label: "Active" },
  { value: "0", label: "Inactive" },
];

export const STAFF_CATEGORY_FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Categories" },
  { value: "232", label: "Teaching" },
  { value: "233", label: "Non-teaching" },
];

export const STAFF_TOOLTIPS = {
  search: "Search staff by name or email",
  department: "Filter by department",
  subject: "Filter by subject",
  category: "Filter by staff category",
  role: "Filter by role or designation",
  status: "Filter by account status",
};

export const ADD_STAFF_BREADCRUMBS: BreadcrumbItem[] = [
  ...STAFF_DIRECTORY_BREADCRUMBS,
  { title: "Add staff user", href: "/settings/staff-directory/create" },
];

export const STAFF_CATEGORY_OPTIONS = [
  { key: "232", text: "Teaching staff", value: "232" },
  { key: "233", text: "Non-teaching staff", value: "233" },
];

export const ADD_STAFF_FORM_LAYOUT = [
  {
    name: "avatar",
    label: "Avatar",
    type: FORM_TYPE.FILE,
    accept: "image/jpeg,image/png,image/gif,image/webp",
    fileMode: "avatar",
    required: false,
    tooltip: "Profile picture (JPG, PNG, GIF or WebP only)",
  },
  {
    name: "name",
    label: "Name",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Dr. Jane Smith",
    required: true,
    requiredMessage: "Name is required",
    maxLength: 150,
    tooltip: "Full name of the staff member (max 150 characters)",
  },
  {
    name: "email",
    label: "Email",
    type: FORM_TYPE.EMAIL,
    placeholder: "e.g. staff@college.edu.in",
    required: true,
    requiredMessage: "Valid email is required",
    tooltip: "College or institutional email address. Cannot be changed after create.",
  },
  {
    name: "role_id",
    label: "Role",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "Select role",
    required: true,
    requiredMessage: "Please select a role",
    tooltip: "System role that defines permissions for this staff member",
    options: [] as { key: string; text: string; value: string }[],
  },
  {
    name: "category",
    label: "Category",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "Teaching or non-teaching",
    required: true,
    requiredMessage: "Please select a category",
    tooltip: "Teaching staff (faculty) or non-teaching (administrative/support)",
    options: STAFF_CATEGORY_OPTIONS,
  },
  {
    name: "department_ids",
    label: "Departments",
    type: FORM_TYPE.MULTI_SELECT,
    placeholder: "Select departments",
    required: false,
    tooltip: "Departments this staff member is associated with. Shown in details only.",
    options: [] as { key: string; text: string; value: string }[],
    can: "view_staff_links",
  },
  {
    name: "subject_ids",
    label: "Subjects",
    type: FORM_TYPE.MULTI_SELECT,
    placeholder: "Select subjects",
    required: false,
    tooltip: "Subjects this staff member teaches or is associated with. Shown in details only.",
    options: [] as { key: string; text: string; value: string }[],
    can: "view_staff_links",
  },
  {
    name: "send_invitation",
    label: "Send Invitation Email",
    type: FORM_TYPE.CHECKBOX,
    required: false,
    tooltip: "Send a secure link to the staff member's email to set up their own password.",
    className: "col-span-2",
  },
];
