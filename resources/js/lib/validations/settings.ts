import { z } from "zod";
import {
  safeStringRefine,
  safeStringRefineOptional,
  SAFE_STRING_MESSAGE,
  safeRequiredString,
  safeOptionalString,
  emailSchemaOptional,
  phoneSchemaOptional,
  numericStringOptional,
} from "./common";

// Helper for optional URL validation
const optionalUrl = z
  .string()
  .url("Please enter a valid URL")
  .optional()
  .or(z.literal(""));

// Helper for optional email validation
const optionalEmail = emailSchemaOptional();

// Helper for optional phone validation
const optionalPhone = phoneSchemaOptional();

// College Profile Schema

const maxnumber = new Date().getFullYear();
export const collegeProfileSchema = z.object({
  college_name: safeRequiredString(255, "Institution name is required"),
  college_short_name: safeOptionalString(100, "Short name"),
  college_motto: safeOptionalString(255, "Motto"),
  college_code: safeOptionalString(50, "Institution code"),
  udise_code: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || /^\d{11}$/.test(val),
      "UDISE code must be exactly 11 digits"
    ),
  established_year: numericStringOptional(),
  college_logo: z.any().optional(),
});

export type CollegeProfileFormValues = z.infer<typeof collegeProfileSchema>;

// Digital Presence Schema
export const digitalPresenceSchema = z.object({
  contact_email: optionalEmail,
  contact_phone: optionalPhone,
  full_address: safeOptionalString(500, "Address"),
  college_website: optionalUrl,
  map_location_url: optionalUrl,
  facebook_url: optionalUrl,
  twitter_url: optionalUrl,
  youtube_url: optionalUrl,
  whatsapp_number: safeOptionalString(20, "WhatsApp number"),
});

export type DigitalPresenceFormValues = z.infer<typeof digitalPresenceSchema>;

// SEO & Favicon Schema
export const seoSchema = z.object({
  favicon_url: z.any().optional(),
  meta_title: safeOptionalString(255, "Meta title"),
  meta_description: safeOptionalString(500, "Meta description"),
  og_image: z.any().optional(),
});

export type SeoFormValues = z.infer<typeof seoSchema>;

// Landing Page Content Schema
export const landingPageContentSchema = z.object({
  principal_name: safeOptionalString(200, "Name"),
  principal_photo: z.any().optional(),
  principal_message: safeOptionalString(5000, "Message"),
  about_title: safeOptionalString(255, "Title"),
  about_content: safeOptionalString(5000, "Content"),
  mission_statement: safeOptionalString(2000, "Mission"),
  vision_statement: safeOptionalString(2000, "Vision"),
  core_goals: safeOptionalString(5000, "Goals"),
  journey_tag: safeOptionalString(50, "Tag"),
  journey_heading_line1: safeOptionalString(255, "Heading 1"),
  journey_heading_line2: safeOptionalString(255, "Heading 2"),
  founding_year: safeOptionalString(4, "Year"),
  historical_foundations_title: safeOptionalString(255, "Foundations title"),
  historical_foundations_content: safeOptionalString(5000, "Foundations content"),
  academic_evolution_title: safeOptionalString(255, "Evolution title"),
  academic_evolution_content: safeOptionalString(5000, "Evolution content"),
  modern_era_title: safeOptionalString(255, "Modern era title"),
  modern_era_content: safeOptionalString(5000, "Modern era content"),
});

export type LandingPageContentFormValues = z.infer<
  typeof landingPageContentSchema
>;

// Admission Settings Schema
export const admissionSettingsSchema = z.object({
  admission_readmission_enabled: safeOptionalString(10, "Status"),
  admission_re_instruction: safeOptionalString(5000, "Instruction"),
  admission_re_tc: safeOptionalString(5000, "Terms"),
  admission_new_instruction: safeOptionalString(5000, "Instruction"),
  admission_new_tc: safeOptionalString(5000, "Terms"),
  reg_no_prefix: safeOptionalString(50, "Prefix"),
  reg_no_include_year: safeOptionalString(10, "Include Year"),
  reg_no_sequence_padding: z.union([z.number(), z.string(), z.undefined(), z.null()]),
});

export type AdmissionSettingsFormValues = z.infer<
  typeof admissionSettingsSchema
>;

// Stream Form Mapping Schema
export const streamFormMappingSchema = z.object({
  ug_form_type: z
    .string()
    .refine(safeStringRefineOptional, SAFE_STRING_MESSAGE)
    .optional()
    .or(z.literal("")),
  vocational_form_type: z
    .string()
    .refine(safeStringRefineOptional, SAFE_STRING_MESSAGE)
    .optional()
    .or(z.literal("")),
});

export type StreamFormMappingFormValues = z.infer<
  typeof streamFormMappingSchema
>;

// User Profile Schema
export const userProfileSchema = z.object({
  name: safeRequiredString(255, "Full name is required"),
  email: z
    .string()
    .refine(safeStringRefine, SAFE_STRING_MESSAGE)
    .email("Please enter a valid email address"),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
