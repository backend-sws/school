import { useMemo } from "react";
import { FilterBarConfig, FilterOption } from "@/components/filter-bar";
import { useCollegeStreams } from "@/hooks/useCollegeStreams";
import { useCollegeSessions } from "@/hooks/useCollegeSessions";
import { toOptions } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import inventoryApi from "@/lib/api/inventoryApi";
import { useInstitutionLabels } from "@/hooks/useInstitutionLabels";
import { FORM_TYPE } from "@/constants";
import {
    APPLICATION_STATUS_OPTIONS,
    APPLICATION_PAYMENT_OPTIONS,
    APPLICATION_TYPE_OPTIONS,
    APPLICATION_SEARCH_OPTIONS,
} from "@/constants/page/admission/applications";
import {
    STUDENT_SEARCH_TYPES,
    STUDENT_VERIFIED_OPTIONS,
    STUDENT_STATUS_OPTIONS,
    STUDENT_ABC_OPTIONS,
    STUDENT_HOSTEL_OPTIONS,
    STUDENT_TRANSPORT_OPTIONS,
} from "@/constants/page/admin/student";
import {
    CANDIDATE_SEARCH_TYPES,
    CANDIDATE_VERIFIED_OPTIONS,
} from "@/constants/page/admin/candidate";
import { FeeCategory } from "@/constants/feeCategory";
import { FEE_SLOT_PROFILE_TYPES, FEE_SLOT_GENDERS } from "@/constants/feeSlot";

import { usePage } from "@inertiajs/react";
import { getStudentListDisplayConfig } from "@/constants/scopeTypeDisplay";

export type FilterRegistryType = 
    | "admission_applications" 
    | "student_management" 
    | "candidate_management"
    | "inventory_sales"
    | "dues_overdue"
    | "fee_types"
    | "fee_profiles"
    | "fee_regulations";

/**
 * Shared hook to get common filter options (streams, sessions, etc.)
 */
export function useSharedFilterOptions() {
    const { props } = usePage();
    const scopeType = (props as { institution?: { type?: string } }).institution?.type ?? null;
    const listConfig = getStudentListDisplayConfig(scopeType);

    const { data: streamsResponse } = useCollegeStreams();
    const { data: sessionResponse } = useCollegeSessions();
    const { streamLabel } = useInstitutionLabels();

    const streams = streamsResponse?.data || [];
    const sessions = sessionResponse?.data || [];

    const streamOptions = useMemo(() => [
        { key: "all", text: listConfig.filterStreamOptionAll || `All ${streamLabel}s`, value: "all" },
        ...streams.map((s: any) => ({ key: String(s.id), text: s.name, value: String(s.id) })),
    ], [streams, streamLabel, listConfig.filterStreamOptionAll]);

    const sessionOptions = useMemo(() => [
        { key: "all", text: "All Sessions", value: "all" },
        ...sessions.map((s: any) => ({ key: String(s.id), text: s.name, value: String(s.id) })),
    ], [sessions]);

    return { streamLabel, streamOptions, sessionOptions, listConfig };
}

/** Convert FilterOption[] to FieldOption[] for ControlledFormComponent */
function toFieldOptions(options: FilterOption[]): { key: string; text: string; value: string }[] {
    return options.map((o) => ({ key: o.value, text: o.label, value: o.value }));
}

/**
 * Main Registry — returns FilterBarConfig by type
 */
export function useFilterRegistry(type: FilterRegistryType): FilterBarConfig {
    const { streamLabel, streamOptions, sessionOptions, listConfig } = useSharedFilterOptions();

    const { data: itemsRes } = useQuery({
        queryKey: ["inventory-items-filter-list"],
        queryFn: () => inventoryApi.items.index({ per_page: 500 }),
        enabled: type === "inventory_sales",
    });
    const items = itemsRes?.data || [];
    const itemOptions = useMemo(() => [
        { key: "all", text: "All Items", value: "all" },
        ...items.map((i: any) => ({ key: String(i.id), text: i.name, value: String(i.id) })),
    ], [items]);

    const registry: Record<FilterRegistryType, FilterBarConfig> = useMemo(() => ({
        admission_applications: {
            filters: [
                { name: "session_id", type: FORM_TYPE.SELECT, label: "Session", placeholder: "Select session", options: sessionOptions, tooltip: "Filter by academic session" },
                { name: "stream_id", type: FORM_TYPE.SELECT, label: streamLabel || "Stream", placeholder: `Select ${streamLabel}`, options: streamOptions, tooltip: `Filter by ${streamLabel}` },
                { name: "status", type: FORM_TYPE.SELECT, label: "Status", placeholder: "Select status", options: toFieldOptions(APPLICATION_STATUS_OPTIONS), tooltip: "Filter by application status" },
                { name: "payment_status", type: FORM_TYPE.SELECT, label: "Payment", placeholder: "Select payment status", options: toFieldOptions(APPLICATION_PAYMENT_OPTIONS), tooltip: "Filter by payment status" },
                { name: "application_type", type: FORM_TYPE.SELECT, label: "Type", placeholder: "Select type", options: toFieldOptions(APPLICATION_TYPE_OPTIONS), tooltip: "Filter by application type" },
                { name: "start_date", type: FORM_TYPE.DATE, label: "Start Date", placeholder: "Select start date", tooltip: "Filter by submission start date" },
                { name: "end_date", type: FORM_TYPE.DATE, label: "End Date", placeholder: "Select end date", tooltip: "Filter by submission end date" },
            ],
            searchGroup: {
                selectName: "search_by",
                searchName: "search_text",
                options: APPLICATION_SEARCH_OPTIONS,
                tooltip: "Search by specific field",
            },
        },
        student_management: {
            filters: [
                { name: "session", type: FORM_TYPE.SELECT, label: "Session", placeholder: "Select session", options: sessionOptions, tooltip: "Filter by academic session" },
                { name: "stream", type: FORM_TYPE.SELECT, label: listConfig.filterStreamPlaceholder || streamLabel || "Stream", placeholder: `Select ${streamLabel}`, options: streamOptions, tooltip: `Filter by ${streamLabel}` },
                { name: "email_verified", type: FORM_TYPE.SELECT, label: "Verification", placeholder: "Select verification", options: toFieldOptions(STUDENT_VERIFIED_OPTIONS), tooltip: "Filter by email verification status" },
                { name: "status", type: FORM_TYPE.SELECT, label: "Status", placeholder: "Select status", options: toFieldOptions(STUDENT_STATUS_OPTIONS), tooltip: "Filter by student status" },
                { name: "abc_status", type: FORM_TYPE.SELECT, label: "Government Portal", placeholder: "Select portal status", options: toFieldOptions(STUDENT_ABC_OPTIONS), tooltip: "Filter by ABC registration status" },
                { name: "hostel_status", type: FORM_TYPE.SELECT, label: "Hostel Facility", placeholder: "Select hostel status", options: toFieldOptions(STUDENT_HOSTEL_OPTIONS), tooltip: "Filter by Hostel facility status" },
                { name: "transport_status", type: FORM_TYPE.SELECT, label: "Transport Facility", placeholder: "Select transport status", options: toFieldOptions(STUDENT_TRANSPORT_OPTIONS), tooltip: "Filter by Transport facility status" },
                { name: "gender", type: FORM_TYPE.SELECT, label: "Gender", placeholder: "Select gender", options: [{ key: "Male", text: "Male", value: "Male" }, { key: "Female", text: "Female", value: "Female" }, { key: "Other", text: "Other", value: "Other" }], tooltip: "Filter by student gender" },
                { name: "category", type: FORM_TYPE.SELECT, label: "Category", placeholder: "Select category", options: [{ key: "general", text: "General", value: "general" }, { key: "sc", text: "SC", value: "sc" }, { key: "st", text: "ST", value: "st" }, { key: "bc", text: "BC", value: "bc" }, { key: "obc", text: "OBC", value: "obc" }, { key: "ews", text: "EWS", value: "ews" }], tooltip: "Filter by social category" },
            ],
            searchGroup: {
                selectName: "searchType",
                searchName: "search",
                options: STUDENT_SEARCH_TYPES,
                tooltip: "Search by specific field",
            },
        },
        candidate_management: {
            filters: [
                { name: "is_verified", type: FORM_TYPE.SELECT, label: "Verification", placeholder: "Select verification", options: toFieldOptions(CANDIDATE_VERIFIED_OPTIONS), tooltip: "Filter by verification status" },
            ],
            searchGroup: {
                selectName: "searchType",
                searchName: "search",
                options: CANDIDATE_SEARCH_TYPES,
                tooltip: "Search by specific field",
            },
        },
        inventory_sales: {
            filters: [
                {
                    name: "payment_status",
                    type: FORM_TYPE.SELECT,
                    label: "Status",
                    placeholder: "Select status",
                    tooltip: "Filter sales by payment status",
                    options: [
                        { key: "all", text: "All Status", value: "all" },
                        { key: "pending", text: "Pending", value: "pending" },
                        { key: "paid", text: "Paid", value: "paid" },
                    ],
                },
                {
                    name: "buyer_type",
                    type: FORM_TYPE.SELECT,
                    label: "Buyer Type",
                    placeholder: "Select buyer type",
                    tooltip: "Filter by buyer type (Student, Parent, or Walk-in/Other)",
                    options: [
                        { key: "all", text: "All Types", value: "all" },
                        { key: "student", text: "Student", value: "student" },
                        { key: "parent", text: "Parent", value: "parent" },
                        { key: "other", text: "Other", value: "other" },
                    ],
                },
                {
                    name: "inventory_item_id",
                    type: FORM_TYPE.SELECT,
                    label: "Item",
                    placeholder: "Select item",
                    tooltip: "Filter by a specific inventory item",
                    options: itemOptions,
                },
                {
                    name: "from_date",
                    type: FORM_TYPE.DATE,
                    label: "From Date",
                    placeholder: "Select start date",
                    tooltip: "Show sales from this date onwards",
                },
                {
                    name: "to_date",
                    type: FORM_TYPE.DATE,
                    label: "To Date",
                    placeholder: "Select end date",
                    tooltip: "Show sales up to this date",
                },
                {
                    name: "min_amount",
                    type: FORM_TYPE.NUMBER_TEXT,
                    label: "Min Amount",
                    placeholder: "e.g. 100",
                    tooltip: "Show sales with total amount greater than or equal to this",
                },
                {
                    name: "max_amount",
                    type: FORM_TYPE.NUMBER_TEXT,
                    label: "Max Amount",
                    placeholder: "e.g. 5000",
                    tooltip: "Show sales with total amount less than or equal to this",
                },
            ],
            searchGroup: {
                selectName: "search_by",
                searchName: "search",
                options: [
                    { value: "buyer_name", label: "Buyer Name" },
                ],
                tooltip: "Search by buyer name or student name",
            },
        },
        dues_overdue: {
            filters: [
                { name: "period", type: FORM_TYPE.SELECT, label: "Period", placeholder: "Select period", tooltip: "Select the billing period", options: [] },
                { name: "academicSessionId", type: FORM_TYPE.SELECT, label: "Session", placeholder: "Select session", tooltip: "Filter by academic session", options: sessionOptions },
                { name: "startDate", type: FORM_TYPE.DATE, label: "Start Date", placeholder: "Select start date", tooltip: "Filter by due date range start" },
                { name: "endDate", type: FORM_TYPE.DATE, label: "End Date", placeholder: "Select end date", tooltip: "Filter by due date range end" },
                { name: "dateFilter", type: FORM_TYPE.DATE, label: "Specific Date", placeholder: "Select date", tooltip: "Filter by specific due date" },
                { name: "classId", type: FORM_TYPE.SELECT, label: "Class", placeholder: "Select class", tooltip: "Filter by class", options: [] },
                { name: "statusFilter", type: FORM_TYPE.SELECT, label: "Status", placeholder: "Select status", tooltip: "Filter by payment status", options: [] },
            ],
            searchGroup: {
                selectName: "search_by",
                searchName: "search",
                options: [
                    { value: "name", label: "Name" },
                    { value: "reg_no", label: "Reg No" },
                ],
                tooltip: "Search by student name or registration number",
            },
        },
        fee_types: {
            filters: [
                {
                    name: "profile_type",
                    type: FORM_TYPE.SELECT,
                    label: "Type",
                    placeholder: "Select type",
                    tooltip: "Filter by profile type",
                    options: [
                        { key: "all", text: "All Types", value: "all" },
                        ...FEE_SLOT_PROFILE_TYPES.map((o) => ({ ...o })),
                    ],
                },
            ],
            searchGroup: {
                selectName: "search_by",
                searchName: "search",
                options: [
                    { value: "name", label: "Name" },
                    { value: "description", label: "Description" },
                ],
                tooltip: "Search by specific field",
            },
        },
        fee_profiles: {
            filters: [
                {
                    name: "profile_type",
                    type: FORM_TYPE.SELECT,
                    label: "Type",
                    placeholder: "Select type",
                    tooltip: "Filter by profile type",
                    options: [
                        { key: "all", text: "All Types", value: "all" },
                        ...FEE_SLOT_PROFILE_TYPES.map((o) => ({ ...o })),
                    ],
                },
            ],
            searchGroup: {
                selectName: "search_by",
                searchName: "search",
                options: [
                    { value: "name", label: "Name" },
                    { value: "description", label: "Description" },
                ],
                tooltip: "Search by specific field",
            },
        },
        fee_regulations: {
            filters: [],
            searchGroup: {
                selectName: "search_by",
                searchName: "search",
                options: [
                    { value: "name", label: "Name" },
                    { value: "code", label: "Code" },
                ],
                tooltip: "Search classrooms",
            },
        },
    }), [streamLabel, streamOptions, sessionOptions, listConfig]);

    return registry[type] || { filters: [] };
}
