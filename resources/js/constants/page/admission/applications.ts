import { FilterOption, FilterBarConfig } from "@/components/filter-bar";
import { FilterParamMapping } from "@/hooks/useSearchfilter";

export const APPLICATION_STATUS_OPTIONS: FilterOption[] = [
    { value: "all", label: "All statuses" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
];

export const APPLICATION_PAYMENT_OPTIONS: FilterOption[] = [
    { value: "all", label: "All payments" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "success", label: "Success" },
    { value: "failed", label: "Failed" },
];

export const APPLICATION_TYPE_OPTIONS: FilterOption[] = [
    { value: "all", label: "All types" },
    { value: "new", label: "New" },
    { value: "re-admission", label: "Re-admission" },
];

export const APPLICATION_SEARCH_OPTIONS: FilterOption[] = [
    { value: "name", label: "Name" },
    { value: "app_id", label: "App ID" },
    { value: "mobile", label: "Mobile" },
    { value: "email", label: "Email" },
];

export const INITIAL_APPLICATION_FILTERS = {
    stream_id: "all",
    session_id: "all",
    status: "all",
    payment_status: "all",
    application_type: "all",
    start_date: "",
    end_date: "",
    search_by: "name",
    search_text: "",
    per_page: 15,
    page: 1,
};

export const APPLICATION_FILTER_MAPPING: FilterParamMapping = {
    stream_id: { paramName: 'stream_id', skipValues: ['all'] },
    session_id: { paramName: 'session_id', skipValues: ['all'] },
    status: { paramName: 'status', skipValues: ['all'] },
    payment_status: { paramName: 'payment_status', skipValues: ['all'] },
    application_type: { paramName: 'application_type', skipValues: ['all'] },
    start_date: { paramName: 'start_date', skipValues: [''] },
    end_date: { paramName: 'end_date', skipValues: [''] },
};
