/**
 * Fees content module — fee types, fee profiles, fee regulations, dues/overdue, analytics, ledger.
 *
 * Covers ALL user-facing strings for the Treasury & Fees hub that may vary by institution type.
 * School uses "class" terminology, college uses "stream", coaching uses "batch".
 */

import type { InstitutionType } from "@/constants/landing/types";

export interface FeesContentKeys {
  // ── Page: Fee Types ──────────────────────────────────
  fee_types_page_title: string;
  fee_types_page_subtitle: string;
  fee_types_guidance: string[];
  fee_types_add_btn: string;
  fee_types_restore_btn: string;
  fee_types_create_title: string;
  fee_types_edit_title: string;
  fee_types_create_btn: string;
  fee_types_update_btn: string;
  fee_types_cancel_btn: string;
  fee_types_empty_title: string;
  fee_types_empty_desc: string;
  fee_types_col_sl: string;
  fee_types_col_name: string;
  fee_types_col_category: string;
  fee_types_col_actions: string;

  // ── Page: Fee Profiles ───────────────────────────────
  fee_profiles_page_title: string;
  fee_profiles_page_subtitle: string;
  fee_profiles_guidance: string[];
  fee_profiles_add_btn: string;
  fee_profiles_create_title: string;
  fee_profiles_edit_title: string;
  fee_profiles_create_btn: string;
  fee_profiles_update_btn: string;
  fee_profiles_cancel_btn: string;
  fee_profiles_empty_title: string;
  fee_profiles_empty_desc: string;
  fee_profiles_col_name: string;
  fee_profiles_col_type: string;
  fee_profiles_col_category: string;
  fee_profiles_col_gender: string;
  fee_profiles_col_description: string;
  fee_profiles_col_items: string;
  fee_profiles_col_actions: string;
  fee_profiles_section_gender_category: string;
  fee_profiles_items_label: string;
  fee_profiles_items_fee_type: string;
  fee_profiles_items_amount: string;
  fee_profiles_items_add_row: string;
  fee_profiles_default_label: string;
  fee_profiles_delete_title: string;
  fee_profiles_delete_desc: string;
  fee_profiles_delete_btn: string;

  // ── Page: Fee Regulations ────────────────────────────
  fee_regulations_page_title: string;
  fee_regulations_page_subtitle: string;
  fee_regulations_guidance: string[];
  fee_regulations_search_placeholder: string;
  fee_regulations_empty_title: string;
  fee_regulations_empty_desc: string;

  // ── Page: Dues & Overdue ─────────────────────────────
  fee_dues_page_title: string;
  fee_dues_page_subtitle: string;
  fee_dues_guidance: string[];
  fee_dues_col_student: string;
  fee_dues_col_class: string;
  fee_dues_col_due_date: string;
  fee_dues_col_expected: string;
  fee_dues_col_paid: string;
  fee_dues_col_balance: string;
  fee_dues_col_status: string;
  fee_dues_col_actions: string;
  fee_dues_empty_title: string;
  fee_dues_empty_desc: string;
  fee_dues_filter_class_label: string;
  fee_dues_filter_class_all: string;

  // ── Page: Fee Analytics ──────────────────────────────
  fee_analytics_page_title: string;
  fee_analytics_page_subtitle: string;
  fee_analytics_filter_class_label: string;
  fee_analytics_filter_class_placeholder: string;
  fee_analytics_loading_text: string;
  fee_analytics_empty_title: string;
  fee_analytics_empty_desc: string;
  fee_analytics_col_month: string;
  fee_analytics_col_course_fees: string;
  fee_analytics_col_admission: string;
  fee_analytics_col_services: string;
  fee_analytics_col_total: string;
  fee_analytics_aggregate_label: string;

  // ── Shared: Breadcrumb base ──────────────────────────
  fee_hub_breadcrumb: string;
}

// ────────────────────────────────────────────────────────
// School
// ────────────────────────────────────────────────────────
const school: FeesContentKeys = {
  // Fee Types
  fee_types_page_title: "Fee Types",
  fee_types_page_subtitle: "Define the kinds of fees your institution charges. Used in Fee Regulations to set amounts per class.",
  fee_types_guidance: [
    "Define the kinds of fees your institution charges (e.g. Tuition, Transport, Lab). These types are then used in Fee Regulations to set amounts per class.",
    "Use «Restore defaults» to add standard fee types.",
  ],
  fee_types_add_btn: "Add fee type",
  fee_types_restore_btn: "Restore defaults",
  fee_types_create_title: "Add fee type",
  fee_types_edit_title: "Edit fee type",
  fee_types_create_btn: "Create",
  fee_types_update_btn: "Update",
  fee_types_cancel_btn: "Cancel",
  fee_types_empty_title: "No fee types found",
  fee_types_empty_desc: "Add fee types or restore defaults to use them in Fee Regulations.",
  fee_types_col_sl: "#",
  fee_types_col_name: "Name",
  fee_types_col_category: "Type",
  fee_types_col_actions: "Actions",

  // Fee Profiles
  fee_profiles_page_title: "Fee Profiles",
  fee_profiles_page_subtitle: "Manage fee profiles: templates of fee types and amounts. Use them where you need a predefined fee structure.",
  fee_profiles_guidance: [
    "Fee profiles are templates that define a set of fee types and amounts. Create profiles for different fee structures (e.g. Standard, EWS, Admission).",
    "Profiles are not applied to classes here; they can be used elsewhere (e.g. application desk, ledger) to reference a fee structure.",
  ],
  fee_profiles_add_btn: "Add profile",
  fee_profiles_create_title: "New fee profile",
  fee_profiles_edit_title: "Edit fee profile",
  fee_profiles_create_btn: "Create",
  fee_profiles_update_btn: "Update",
  fee_profiles_cancel_btn: "Cancel",
  fee_profiles_empty_title: "No fee profiles found",
  fee_profiles_empty_desc: "Create a profile to define a set of fee types and amounts.",
  fee_profiles_col_name: "Name",
  fee_profiles_col_type: "Type",
  fee_profiles_col_category: "Category",
  fee_profiles_col_gender: "Gender",
  fee_profiles_col_description: "Description",
  fee_profiles_col_items: "Items",
  fee_profiles_col_actions: "Actions",
  fee_profiles_section_gender_category: "Gender & category",
  fee_profiles_items_label: "Fee items (type + amount)",
  fee_profiles_items_fee_type: "Fee type",
  fee_profiles_items_amount: "Amount",
  fee_profiles_items_add_row: "Add row",
  fee_profiles_default_label: "Mark as default profile",
  fee_profiles_delete_title: "Delete fee profile",
  fee_profiles_delete_desc: "Delete this profile? This cannot be undone.",
  fee_profiles_delete_btn: "Delete",

  // Fee Regulations
  fee_regulations_page_title: "Fee Regulations",
  fee_regulations_page_subtitle: "Configure class-specific fee structures and collection frequencies.",
  fee_regulations_guidance: [
    "Select a class to manage its specific fee structure and collection frequency.",
    "Regulations defined here will override Class or Institution level defaults in the Student Ledger.",
    "Use 'Apply Profile' to quickly populate standard fee sets from a template.",
  ],
  fee_regulations_search_placeholder: "Search classrooms...",
  fee_regulations_empty_title: "No classes found",
  fee_regulations_empty_desc: "Try adjusting your search criteria.",

  // Dues & Overdue
  fee_dues_page_title: "Dues & overdue",
  fee_dues_page_subtitle: "View fee dues by period and send reminders to guardians and students.",
  fee_dues_guidance: [
    "Review fee dues for students across different classes and periods.",
    "Send automated reminders to guardians for upcoming or overdue payments.",
    "Click 'View ledger' to see individual student payment history and detailed breakdowns.",
  ],
  fee_dues_col_student: "Student",
  fee_dues_col_class: "Class",
  fee_dues_col_due_date: "Due date",
  fee_dues_col_expected: "Expected",
  fee_dues_col_paid: "Paid",
  fee_dues_col_balance: "Balance",
  fee_dues_col_status: "Status",
  fee_dues_col_actions: "Actions",
  fee_dues_empty_title: "No dues found",
  fee_dues_empty_desc: "No fee dues match your selected filters and period.",
  fee_dues_filter_class_label: "Class",
  fee_dues_filter_class_all: "All classes",

  // Fee Analytics
  fee_analytics_page_title: "Fee Analytics",
  fee_analytics_page_subtitle: "Detailed insights into fee collection across all revenue streams.",
  fee_analytics_filter_class_label: "Class Filter",
  fee_analytics_filter_class_placeholder: "All Classes",
  fee_analytics_loading_text: "Analysing Class Data...",
  fee_analytics_empty_title: "No Collections Found",
  fee_analytics_empty_desc: "Try adjusting your time window or filter context.",
  fee_analytics_col_month: "Month",
  fee_analytics_col_course_fees: "Course Fees",
  fee_analytics_col_admission: "Admission",
  fee_analytics_col_services: "Services",
  fee_analytics_col_total: "Total",
  fee_analytics_aggregate_label: "Aggregate Period Total",

  // Shared
  fee_hub_breadcrumb: "Treasury & Fees",
};

// ────────────────────────────────────────────────────────
// College
// ────────────────────────────────────────────────────────
const college: FeesContentKeys = {
  // Fee Types
  fee_types_page_title: "Fee Types",
  fee_types_page_subtitle: "Define the kinds of fees your institution charges. Used in Fee Regulations to set amounts per stream.",
  fee_types_guidance: [
    "Define the kinds of fees your institution charges (e.g. Tuition, Transport, Lab). These types are then used in Fee Regulations to set amounts per stream.",
    "Use «Restore defaults» to add standard fee types.",
  ],
  fee_types_add_btn: "Add fee type",
  fee_types_restore_btn: "Restore defaults",
  fee_types_create_title: "Add fee type",
  fee_types_edit_title: "Edit fee type",
  fee_types_create_btn: "Create",
  fee_types_update_btn: "Update",
  fee_types_cancel_btn: "Cancel",
  fee_types_empty_title: "No fee types found",
  fee_types_empty_desc: "Add fee types or restore defaults to use them in Fee Regulations.",
  fee_types_col_sl: "#",
  fee_types_col_name: "Name",
  fee_types_col_category: "Type",
  fee_types_col_actions: "Actions",

  // Fee Profiles
  fee_profiles_page_title: "Fee Profiles",
  fee_profiles_page_subtitle: "Manage fee profiles: templates of fee types and amounts. Use them where you need a predefined fee structure.",
  fee_profiles_guidance: [
    "Fee profiles are templates that define a set of fee types and amounts. Create profiles for different fee structures (e.g. Standard, EWS, Admission).",
    "Profiles are not applied to streams here; they can be used elsewhere (e.g. application desk, ledger) to reference a fee structure.",
  ],
  fee_profiles_add_btn: "Add profile",
  fee_profiles_create_title: "New fee profile",
  fee_profiles_edit_title: "Edit fee profile",
  fee_profiles_create_btn: "Create",
  fee_profiles_update_btn: "Update",
  fee_profiles_cancel_btn: "Cancel",
  fee_profiles_empty_title: "No fee profiles found",
  fee_profiles_empty_desc: "Create a profile to define a set of fee types and amounts.",
  fee_profiles_col_name: "Name",
  fee_profiles_col_type: "Type",
  fee_profiles_col_category: "Category",
  fee_profiles_col_gender: "Gender",
  fee_profiles_col_description: "Description",
  fee_profiles_col_items: "Items",
  fee_profiles_col_actions: "Actions",
  fee_profiles_section_gender_category: "Gender & category",
  fee_profiles_items_label: "Fee items (type + amount)",
  fee_profiles_items_fee_type: "Fee type",
  fee_profiles_items_amount: "Amount",
  fee_profiles_items_add_row: "Add row",
  fee_profiles_default_label: "Mark as default profile",
  fee_profiles_delete_title: "Delete fee profile",
  fee_profiles_delete_desc: "Delete this profile? This cannot be undone.",
  fee_profiles_delete_btn: "Delete",

  // Fee Regulations
  fee_regulations_page_title: "Fee Regulations",
  fee_regulations_page_subtitle: "Configure stream-specific fee structures and collection frequencies.",
  fee_regulations_guidance: [
    "Select a stream to manage its specific fee structure and collection frequency.",
    "Regulations defined here will override Stream or Institution level defaults in the Student Ledger.",
    "Use 'Apply Profile' to quickly populate standard fee sets from a template.",
  ],
  fee_regulations_search_placeholder: "Search streams...",
  fee_regulations_empty_title: "No streams found",
  fee_regulations_empty_desc: "Try adjusting your search criteria.",

  // Dues & Overdue
  fee_dues_page_title: "Dues & overdue",
  fee_dues_page_subtitle: "View fee dues by period and send reminders to guardians and students.",
  fee_dues_guidance: [
    "Review fee dues for students across different streams and periods.",
    "Send automated reminders to guardians for upcoming or overdue payments.",
    "Click 'View ledger' to see individual student payment history and detailed breakdowns.",
  ],
  fee_dues_col_student: "Student",
  fee_dues_col_class: "Stream",
  fee_dues_col_due_date: "Due date",
  fee_dues_col_expected: "Expected",
  fee_dues_col_paid: "Paid",
  fee_dues_col_balance: "Balance",
  fee_dues_col_status: "Status",
  fee_dues_col_actions: "Actions",
  fee_dues_empty_title: "No dues found",
  fee_dues_empty_desc: "No fee dues match your selected filters and period.",
  fee_dues_filter_class_label: "Stream",
  fee_dues_filter_class_all: "All streams",

  // Fee Analytics
  fee_analytics_page_title: "Fee Analytics",
  fee_analytics_page_subtitle: "Detailed insights into fee collection across all revenue streams.",
  fee_analytics_filter_class_label: "Stream Filter",
  fee_analytics_filter_class_placeholder: "All Streams",
  fee_analytics_loading_text: "Analysing Stream Data...",
  fee_analytics_empty_title: "No Collections Found",
  fee_analytics_empty_desc: "Try adjusting your time window or filter context.",
  fee_analytics_col_month: "Month",
  fee_analytics_col_course_fees: "Course Fees",
  fee_analytics_col_admission: "Admission",
  fee_analytics_col_services: "Services",
  fee_analytics_col_total: "Total",
  fee_analytics_aggregate_label: "Aggregate Period Total",

  // Shared
  fee_hub_breadcrumb: "Treasury & Fees",
};

// ────────────────────────────────────────────────────────
// Coaching
// ────────────────────────────────────────────────────────
const coaching: FeesContentKeys = {
  // Fee Types
  fee_types_page_title: "Fee Types",
  fee_types_page_subtitle: "Define the kinds of fees your institution charges. Used in Fee Regulations to set amounts per batch.",
  fee_types_guidance: [
    "Define the kinds of fees your institution charges (e.g. Tuition, Transport, Lab). These types are then used in Fee Regulations to set amounts per batch.",
    "Use «Restore defaults» to add standard fee types.",
  ],
  fee_types_add_btn: "Add fee type",
  fee_types_restore_btn: "Restore defaults",
  fee_types_create_title: "Add fee type",
  fee_types_edit_title: "Edit fee type",
  fee_types_create_btn: "Create",
  fee_types_update_btn: "Update",
  fee_types_cancel_btn: "Cancel",
  fee_types_empty_title: "No fee types found",
  fee_types_empty_desc: "Add fee types or restore defaults to use them in Fee Regulations.",
  fee_types_col_sl: "#",
  fee_types_col_name: "Name",
  fee_types_col_category: "Type",
  fee_types_col_actions: "Actions",

  // Fee Profiles
  fee_profiles_page_title: "Fee Profiles",
  fee_profiles_page_subtitle: "Manage fee profiles: templates of fee types and amounts. Use them where you need a predefined fee structure.",
  fee_profiles_guidance: [
    "Fee profiles are templates that define a set of fee types and amounts. Create profiles for different fee structures (e.g. Standard, EWS, Admission).",
    "Profiles are not applied to batches here; they can be used elsewhere (e.g. application desk, ledger) to reference a fee structure.",
  ],
  fee_profiles_add_btn: "Add profile",
  fee_profiles_create_title: "New fee profile",
  fee_profiles_edit_title: "Edit fee profile",
  fee_profiles_create_btn: "Create",
  fee_profiles_update_btn: "Update",
  fee_profiles_cancel_btn: "Cancel",
  fee_profiles_empty_title: "No fee profiles found",
  fee_profiles_empty_desc: "Create a profile to define a set of fee types and amounts.",
  fee_profiles_col_name: "Name",
  fee_profiles_col_type: "Type",
  fee_profiles_col_category: "Category",
  fee_profiles_col_gender: "Gender",
  fee_profiles_col_description: "Description",
  fee_profiles_col_items: "Items",
  fee_profiles_col_actions: "Actions",
  fee_profiles_section_gender_category: "Gender & category",
  fee_profiles_items_label: "Fee items (type + amount)",
  fee_profiles_items_fee_type: "Fee type",
  fee_profiles_items_amount: "Amount",
  fee_profiles_items_add_row: "Add row",
  fee_profiles_default_label: "Mark as default profile",
  fee_profiles_delete_title: "Delete fee profile",
  fee_profiles_delete_desc: "Delete this profile? This cannot be undone.",
  fee_profiles_delete_btn: "Delete",

  // Fee Regulations
  fee_regulations_page_title: "Fee Regulations",
  fee_regulations_page_subtitle: "Configure batch-specific fee structures and collection frequencies.",
  fee_regulations_guidance: [
    "Select a batch to manage its specific fee structure and collection frequency.",
    "Regulations defined here will override Batch or Institution level defaults in the Student Ledger.",
    "Use 'Apply Profile' to quickly populate standard fee sets from a template.",
  ],
  fee_regulations_search_placeholder: "Search batches...",
  fee_regulations_empty_title: "No batches found",
  fee_regulations_empty_desc: "Try adjusting your search criteria.",

  // Dues & Overdue
  fee_dues_page_title: "Dues & overdue",
  fee_dues_page_subtitle: "View fee dues by period and send reminders to guardians and students.",
  fee_dues_guidance: [
    "Review fee dues for students across different batches and periods.",
    "Send automated reminders to guardians for upcoming or overdue payments.",
    "Click 'View ledger' to see individual student payment history and detailed breakdowns.",
  ],
  fee_dues_col_student: "Student",
  fee_dues_col_class: "Batch",
  fee_dues_col_due_date: "Due date",
  fee_dues_col_expected: "Expected",
  fee_dues_col_paid: "Paid",
  fee_dues_col_balance: "Balance",
  fee_dues_col_status: "Status",
  fee_dues_col_actions: "Actions",
  fee_dues_empty_title: "No dues found",
  fee_dues_empty_desc: "No fee dues match your selected filters and period.",
  fee_dues_filter_class_label: "Batch",
  fee_dues_filter_class_all: "All batches",

  // Fee Analytics
  fee_analytics_page_title: "Fee Analytics",
  fee_analytics_page_subtitle: "Detailed insights into fee collection across all revenue batches.",
  fee_analytics_filter_class_label: "Batch Filter",
  fee_analytics_filter_class_placeholder: "All Batches",
  fee_analytics_loading_text: "Analysing Batch Data...",
  fee_analytics_empty_title: "No Collections Found",
  fee_analytics_empty_desc: "Try adjusting your time window or filter context.",
  fee_analytics_col_month: "Month",
  fee_analytics_col_course_fees: "Course Fees",
  fee_analytics_col_admission: "Admission",
  fee_analytics_col_services: "Services",
  fee_analytics_col_total: "Total",
  fee_analytics_aggregate_label: "Aggregate Period Total",

  // Shared
  fee_hub_breadcrumb: "Treasury & Fees",
};

// ────────────────────────────────────────────────────────
// University
// ────────────────────────────────────────────────────────
const university: FeesContentKeys = {
  // Fee Types
  fee_types_page_title: "Fee Types",
  fee_types_page_subtitle: "Define the kinds of fees your institution charges. Used in Fee Regulations to set amounts per stream.",
  fee_types_guidance: [
    "Define the kinds of fees your institution charges (e.g. Tuition, Transport, Lab). These types are then used in Fee Regulations to set amounts per stream.",
    "Use «Restore defaults» to add standard fee types.",
  ],
  fee_types_add_btn: "Add fee type",
  fee_types_restore_btn: "Restore defaults",
  fee_types_create_title: "Add fee type",
  fee_types_edit_title: "Edit fee type",
  fee_types_create_btn: "Create",
  fee_types_update_btn: "Update",
  fee_types_cancel_btn: "Cancel",
  fee_types_empty_title: "No fee types found",
  fee_types_empty_desc: "Add fee types or restore defaults to use them in Fee Regulations.",
  fee_types_col_sl: "#",
  fee_types_col_name: "Name",
  fee_types_col_category: "Type",
  fee_types_col_actions: "Actions",

  // Fee Profiles
  fee_profiles_page_title: "Fee Profiles",
  fee_profiles_page_subtitle: "Manage fee profiles: templates of fee types and amounts. Use them where you need a predefined fee structure.",
  fee_profiles_guidance: [
    "Fee profiles are templates that define a set of fee types and amounts. Create profiles for different fee structures (e.g. Standard, EWS, Admission).",
    "Profiles are not applied to streams here; they can be used elsewhere (e.g. application desk, ledger) to reference a fee structure.",
  ],
  fee_profiles_add_btn: "Add profile",
  fee_profiles_create_title: "New fee profile",
  fee_profiles_edit_title: "Edit fee profile",
  fee_profiles_create_btn: "Create",
  fee_profiles_update_btn: "Update",
  fee_profiles_cancel_btn: "Cancel",
  fee_profiles_empty_title: "No fee profiles found",
  fee_profiles_empty_desc: "Create a profile to define a set of fee types and amounts.",
  fee_profiles_col_name: "Name",
  fee_profiles_col_type: "Type",
  fee_profiles_col_category: "Category",
  fee_profiles_col_gender: "Gender",
  fee_profiles_col_description: "Description",
  fee_profiles_col_items: "Items",
  fee_profiles_col_actions: "Actions",
  fee_profiles_section_gender_category: "Gender & category",
  fee_profiles_items_label: "Fee items (type + amount)",
  fee_profiles_items_fee_type: "Fee type",
  fee_profiles_items_amount: "Amount",
  fee_profiles_items_add_row: "Add row",
  fee_profiles_default_label: "Mark as default profile",
  fee_profiles_delete_title: "Delete fee profile",
  fee_profiles_delete_desc: "Delete this profile? This cannot be undone.",
  fee_profiles_delete_btn: "Delete",

  // Fee Regulations
  fee_regulations_page_title: "Fee Regulations",
  fee_regulations_page_subtitle: "Configure stream-specific fee structures and collection frequencies.",
  fee_regulations_guidance: [
    "Select a stream to manage its specific fee structure and collection frequency.",
    "Regulations defined here will override Stream or Institution level defaults in the Student Ledger.",
    "Use 'Apply Profile' to quickly populate standard fee sets from a template.",
  ],
  fee_regulations_search_placeholder: "Search streams...",
  fee_regulations_empty_title: "No streams found",
  fee_regulations_empty_desc: "Try adjusting your search criteria.",

  // Dues & Overdue
  fee_dues_page_title: "Dues & overdue",
  fee_dues_page_subtitle: "View fee dues by period and send reminders to guardians and students.",
  fee_dues_guidance: [
    "Review fee dues for students across different streams and periods.",
    "Send automated reminders to guardians for upcoming or overdue payments.",
    "Click 'View ledger' to see individual student payment history and detailed breakdowns.",
  ],
  fee_dues_col_student: "Student",
  fee_dues_col_class: "Stream",
  fee_dues_col_due_date: "Due date",
  fee_dues_col_expected: "Expected",
  fee_dues_col_paid: "Paid",
  fee_dues_col_balance: "Balance",
  fee_dues_col_status: "Status",
  fee_dues_col_actions: "Actions",
  fee_dues_empty_title: "No dues found",
  fee_dues_empty_desc: "No fee dues match your selected filters and period.",
  fee_dues_filter_class_label: "Stream",
  fee_dues_filter_class_all: "All streams",

  // Fee Analytics
  fee_analytics_page_title: "Fee Analytics",
  fee_analytics_page_subtitle: "Detailed insights into fee collection across all revenue streams.",
  fee_analytics_filter_class_label: "Stream Filter",
  fee_analytics_filter_class_placeholder: "All Streams",
  fee_analytics_loading_text: "Analysing Stream Data...",
  fee_analytics_empty_title: "No Collections Found",
  fee_analytics_empty_desc: "Try adjusting your time window or filter context.",
  fee_analytics_col_month: "Month",
  fee_analytics_col_course_fees: "Course Fees",
  fee_analytics_col_admission: "Admission",
  fee_analytics_col_services: "Services",
  fee_analytics_col_total: "Total",
  fee_analytics_aggregate_label: "Aggregate Period Total",

  // Shared
  fee_hub_breadcrumb: "Treasury & Fees",
};

export const feesContent: Record<InstitutionType, FeesContentKeys> = {
  school,
  college,
  coaching,
  university,
};
