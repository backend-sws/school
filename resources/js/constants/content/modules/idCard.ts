/**
 * ID Card content module — scope-type-aware strings for the Generate page.
 *
 * School uses "Class" instead of "Stream"; all other types use "Stream" or "Batch".
 */

import type { InstitutionType } from "@/constants/landing/types";

export interface IdCardContentKeys {
    // Generate Page
    id_card_gen_page_title: string;
    id_card_gen_page_subtitle: string;
    id_card_gen_submit_btn: string;
    id_card_gen_cancel_btn: string;
    id_card_gen_card_title: string;
    id_card_gen_card_desc: string;
    id_card_gen_success_msg: string;
    id_card_gen_error_msg: string;
    id_card_gen_stream_label: string;
    id_card_gen_stream_all: string;
    id_card_gen_stream_placeholder: string;
    id_card_gen_session_label: string;
    id_card_gen_template_label: string;
    id_card_gen_breadcrumb_parent: string;
    id_card_gen_breadcrumb_self: string;
}

// ────────────────────────────────────────────────────────
// School
// ────────────────────────────────────────────────────────
const school: IdCardContentKeys = {
    id_card_gen_page_title: "Generate ID Cards",
    id_card_gen_page_subtitle: "Select a template, session, and class to bulk generate student ID cards.",
    id_card_gen_submit_btn: "Generate Cards",
    id_card_gen_cancel_btn: "Cancel",
    id_card_gen_card_title: "Generation Settings",
    id_card_gen_card_desc: "Select a template and session. ID cards will be generated for all enrolled students matching the filters.",
    id_card_gen_success_msg: "ID cards generated successfully",
    id_card_gen_error_msg: "Generation failed. Please try again.",
    id_card_gen_stream_label: "Class",
    id_card_gen_stream_all: "All Classes",
    id_card_gen_stream_placeholder: "Select class",
    id_card_gen_session_label: "Academic Session",
    id_card_gen_template_label: "Template",
    id_card_gen_breadcrumb_parent: "ID Cards",
    id_card_gen_breadcrumb_self: "Generate",
};

// ────────────────────────────────────────────────────────
// College
// ────────────────────────────────────────────────────────
const college: IdCardContentKeys = {
    id_card_gen_page_title: "Generate ID Cards",
    id_card_gen_page_subtitle: "Select a template, session, and stream to bulk generate student ID cards.",
    id_card_gen_submit_btn: "Generate Cards",
    id_card_gen_cancel_btn: "Cancel",
    id_card_gen_card_title: "Generation Settings",
    id_card_gen_card_desc: "Select a template and session. ID cards will be generated for all enrolled students matching the filters.",
    id_card_gen_success_msg: "ID cards generated successfully",
    id_card_gen_error_msg: "Generation failed. Please try again.",
    id_card_gen_stream_label: "Stream",
    id_card_gen_stream_all: "All Streams",
    id_card_gen_stream_placeholder: "Select stream",
    id_card_gen_session_label: "Academic Session",
    id_card_gen_template_label: "Template",
    id_card_gen_breadcrumb_parent: "ID Cards",
    id_card_gen_breadcrumb_self: "Generate",
};

// ────────────────────────────────────────────────────────
// Coaching
// ────────────────────────────────────────────────────────
const coaching: IdCardContentKeys = {
    id_card_gen_page_title: "Generate ID Cards",
    id_card_gen_page_subtitle: "Select a template, session, and batch to bulk generate student ID cards.",
    id_card_gen_submit_btn: "Generate Cards",
    id_card_gen_cancel_btn: "Cancel",
    id_card_gen_card_title: "Generation Settings",
    id_card_gen_card_desc: "Select a template and session. ID cards will be generated for all enrolled students matching the filters.",
    id_card_gen_success_msg: "ID cards generated successfully",
    id_card_gen_error_msg: "Generation failed. Please try again.",
    id_card_gen_stream_label: "Batch",
    id_card_gen_stream_all: "All Batches",
    id_card_gen_stream_placeholder: "Select batch",
    id_card_gen_session_label: "Academic Session",
    id_card_gen_template_label: "Template",
    id_card_gen_breadcrumb_parent: "ID Cards",
    id_card_gen_breadcrumb_self: "Generate",
};

// ────────────────────────────────────────────────────────
// University
// ────────────────────────────────────────────────────────
const university: IdCardContentKeys = {
    ...college,
};

// ────────────────────────────────────────────────────────
// Export
// ────────────────────────────────────────────────────────
export const idCardContent: Record<InstitutionType, IdCardContentKeys> = {
    school,
    college,
    coaching,
    university,
};
