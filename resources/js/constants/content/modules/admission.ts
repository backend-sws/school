/**
 * Admission content module — form sections, step labels, step subtitles.
 *
 * Covers the application desk wizard, admission forms, candidate forms.
 * School says "Class enrolment", college says "Academic enrolment", coaching says "Program enrolment".
 */

import type { InstitutionType } from "@/constants/landing/types";

export interface AdmissionContentKeys {
  // ── Form section titles ─────────────────────────────
  form_section_academic_details: string;
  form_section_applicant_details: string;
  form_section_additional_details: string;
  form_section_class_section: string;
  form_section_documents: string;
  form_section_accommodation: string;

  // ── Form field labels & placeholders ────────────────
  form_stream_program: string;
  form_select_stream: string;
  form_tooltip_stream: string;
  form_class: string;
  form_select_class: string;
  form_tooltip_class: string;
  form_section_label: string;
  form_select_section: string;

  // ── Application desk step labels ────────────────────
  step_identity: string;
  step_address_guardian: string;
  step_medical_documents: string;
  step_academic: string;
  step_services: string;
  step_review: string;

  // ── Services step content ──────────────────────────
  services_add_fee_placeholder: string;
  services_fee_section_label: string;
  services_inventory_section_label: string;
  services_transport_section_label: string;
  services_hostel_section_label: string;

  // ── Application desk step subtitles ─────────────────
  step_identity_subtitle: string;
  step_address_guardian_subtitle: string;
  step_medical_documents_subtitle: string;
  step_academic_subtitle: string;
  step_services_subtitle: string;
  step_review_subtitle: string;
}

const school: AdmissionContentKeys = {
  form_section_academic_details: "Class details",
  form_section_applicant_details: "Applicant details",
  form_section_additional_details: "Additional details",
  form_section_class_section: "Class & section",
  form_section_documents: "Documents",
  form_section_accommodation: "Accommodation",

  form_stream_program: "Main class",
  form_select_stream: "Select main class",
  form_tooltip_stream: "Select the main class (stream/program). Classes will load based on this.",
  form_class: "Class",
  form_select_class: "Select class",
  form_tooltip_class: "Select a class. Loaded based on main class. Section will load after you select a class.",
  form_section_label: "Section",
  form_select_section: "Select section",

  services_add_fee_placeholder: "Search fee types...",
  services_fee_section_label: "Academic Fees",
  services_inventory_section_label: "Inventory & Kits",
  services_transport_section_label: "Transport Services",
  services_hostel_section_label: "Hostel Accommodation",

  step_identity: "Applicant details",
  step_address_guardian: "Address & guardian",
  step_medical_documents: "Medical & documents",
  step_academic: "Class enrolment",
  step_services: "Fees & services",
  step_review: "Review & submit",

  step_identity_subtitle: "Enter applicant details as per certificates.",
  step_address_guardian_subtitle: "Address and guardian details.",
  step_medical_documents_subtitle: "Medical information and document upload.",
  step_academic_subtitle: "Define class and section.",
  step_services_subtitle: "Confirm fees and add optional services.",
  step_review_subtitle: "Final confirmation of onboarding details.",
};

const college: AdmissionContentKeys = {
  form_section_academic_details: "Academic details",
  form_section_applicant_details: "Applicant details",
  form_section_additional_details: "Additional details",
  form_section_class_section: "Class & section",
  form_section_documents: "Documents",
  form_section_accommodation: "Accommodation",

  form_stream_program: "Stream / Program",
  form_select_stream: "Select stream",
  form_tooltip_stream: "Select the stream or program for this application.",
  form_class: "Class",
  form_select_class: "Select class",
  form_tooltip_class: "Assign the student to a class. Loaded based on stream and session.",
  form_section_label: "Section",
  form_select_section: "Select section",

  services_add_fee_placeholder: "Search fee types...",
  services_fee_section_label: "Academic Fees",
  services_inventory_section_label: "Inventory & Kits",
  services_transport_section_label: "Transport Services",
  services_hostel_section_label: "Hostel Accommodation",

  step_identity: "Applicant details",
  step_address_guardian: "Address & guardian",
  step_medical_documents: "Medical & documents",
  step_academic: "Academic enrolment",
  step_services: "Fees & services",
  step_review: "Review & submit",

  step_identity_subtitle: "Enter applicant details as per certificates.",
  step_address_guardian_subtitle: "Address and guardian details.",
  step_medical_documents_subtitle: "Medical information and document upload.",
  step_academic_subtitle: "Define program, class, and section.",
  step_services_subtitle: "Confirm fees and add optional services.",
  step_review_subtitle: "Final confirmation of onboarding details.",
};

const coaching: AdmissionContentKeys = {
  form_section_academic_details: "Program details",
  form_section_applicant_details: "Applicant details",
  form_section_additional_details: "Additional details",
  form_section_class_section: "Batch & section",
  form_section_documents: "Documents",
  form_section_accommodation: "Accommodation",

  form_stream_program: "Batch / Program",
  form_select_stream: "Select batch",
  form_tooltip_stream: "Select the batch or program for this application.",
  form_class: "Class",
  form_select_class: "Select class",
  form_tooltip_class: "Assign the student to a class. Loaded based on batch and session.",
  form_section_label: "Section",
  form_select_section: "Select section",

  services_add_fee_placeholder: "Search fee types...",
  services_fee_section_label: "Academic Fees",
  services_inventory_section_label: "Inventory & Kits",
  services_transport_section_label: "Transport Services",
  services_hostel_section_label: "Hostel Accommodation",

  step_identity: "Applicant details",
  step_address_guardian: "Address & guardian",
  step_medical_documents: "Medical & documents",
  step_academic: "Program enrolment",
  step_services: "Fees & services",
  step_review: "Review & submit",

  step_identity_subtitle: "Enter applicant details as per certificates.",
  step_address_guardian_subtitle: "Address and guardian details.",
  step_medical_documents_subtitle: "Medical information and document upload.",
  step_academic_subtitle: "Define program, class, and section.",
  step_services_subtitle: "Confirm fees and add optional services.",
  step_review_subtitle: "Final confirmation of onboarding details.",
};

const university: AdmissionContentKeys = {
  form_section_academic_details: "Academic details",
  form_section_applicant_details: "Applicant details",
  form_section_additional_details: "Additional details",
  form_section_class_section: "Class & section",
  form_section_documents: "Documents",
  form_section_accommodation: "Accommodation",

  form_stream_program: "Stream / Program",
  form_select_stream: "Select stream",
  form_tooltip_stream: "Select the stream or program for this application.",
  form_class: "Class",
  form_select_class: "Select class",
  form_tooltip_class: "Assign the student to a class. Loaded based on stream and session.",
  form_section_label: "Section",
  form_select_section: "Select section",

  services_add_fee_placeholder: "Search fee types...",
  services_fee_section_label: "Academic Fees",
  services_inventory_section_label: "Inventory & Kits",
  services_transport_section_label: "Transport Services",
  services_hostel_section_label: "Hostel Accommodation",

  step_identity: "Applicant details",
  step_address_guardian: "Address & guardian",
  step_medical_documents: "Medical & documents",
  step_academic: "Academic enrolment",
  step_services: "Fees & services",
  step_review: "Review & submit",

  step_identity_subtitle: "Enter applicant details as per certificates.",
  step_address_guardian_subtitle: "Address and guardian details.",
  step_medical_documents_subtitle: "Medical information and document upload.",
  step_academic_subtitle: "Define program, class, and section.",
  step_services_subtitle: "Confirm fees and add optional services.",
  step_review_subtitle: "Final confirmation of onboarding details.",
};

export const admissionContent: Record<InstitutionType, AdmissionContentKeys> = {
  school,
  college,
  coaching,
  university,
};
