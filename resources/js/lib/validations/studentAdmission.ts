import { z } from "zod";
import {
  safeStringRefine,
  safeStringRefineOptional,
  SAFE_STRING_MESSAGE,
  safeRequiredString,
  safeOptionalString,
  phoneSchema,
  phoneSchemaOptional,
  aadhaarSchema,
  pincodeSchema,
} from "./common";

/* ================================
   HELPERS
================================ */
const requiredString = safeRequiredString(255, "This field is required");
const optionalString = safeOptionalString(255, "Field");

const mobileSchema = phoneSchema();
const aadharSchema = aadhaarSchema();

/* ================================
   ADDRESS
================================ */
const addressSchema = z.object({
  address_type: z.enum(["permanent", "correspondence"]).optional(),
  village_mohalla: requiredString,
  post_office: requiredString,
  police_station: requiredString,
  district: requiredString,
  state: requiredString,
  pincode: pincodeSchema(),
});

/* ================================
   LAST ACADEMIC
================================ */
const lastAcademicSchema = z.object({
  institute_name: requiredString,
  class: requiredString,
  session: requiredString,
  section: requiredString,
  roll_number: requiredString,
});

/* ================================
   DOCUMENT
================================ */
const documentSchema = z.object({
  doc_type: z.enum(["photo", "migration", "clc"]),
  doc_path: z.string().nullable().optional(),
});

/* ================================
   SUBJECT
================================ */
const subjectSchema = z.object({
  subject_id: z.number(),
  subject_category_id: z.number(),
});

/* ================================
   MAIN FORM SCHEMA
================================ */
export const StudentAdmissionFormSchema = z.object({
  admission_head_id: z.union([z.string(), z.number()]).optional(),

  applicant_name: requiredString,
  father_name: requiredString,
  mother_name: requiredString,

  father_qualification: requiredString,
  father_occupation: requiredString,

  dob: requiredString,

  gender: z.enum(["Male", "Female", "Other"]),

  category: z.enum(["general", "sc", "st", "bc1", "bc2", "ews"]).optional(),

  caste: requiredString,

  mobile: mobileSchema,
  father_mobile: mobileSchema,

  aadhar_no: aadharSchema,
  abc_no: requiredString,
  apaar_id: optionalString,

  blood_group: z
    .enum(["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"])
    .optional(),

  nationality: optionalString,
  religion: requiredString,

  marital_status: z.enum(["Married", "Unmarried"]),

  is_differently_abled: z.boolean(),

  university_confidential_no: optionalString,
  // university_roll_no: optionalString,
  // reg_no: optionalString,
  roll_no: optionalString,

  place: optionalString,
  signature_url: optionalString,

  addresses: z
    .array(addressSchema)
    .length(2, "Both permanent and correspondence address are required"),

  last_academic: lastAcademicSchema,

  previous_exams: z.array(z.any()).optional(),

  selected_subjects: z.array(subjectSchema).optional(),

  documents: z.array(documentSchema),
});

/* ================================
   TYPE
================================ */
export type StudentAdmissionFormType = z.infer<
  typeof StudentAdmissionFormSchema
>;
