import { z } from "zod";
import {
  safeRequiredString,
  safeOptionalString,
  phoneSchema,
  pincodeSchema,
  aadhaarSchema,
} from "./common";

/* ================================
   ADDRESS
================================ */
const addressSchema = z.object({
  address_type: z.enum(["permanent", "correspondence"]).optional(),
  village_mohalla: safeRequiredString(255, "Village is required"),
  post_office: safeRequiredString(255, "Post office is required"),
  police_station: safeRequiredString(255, "Police station is required"),
  district: safeRequiredString(100, "District is required"),
  state: safeRequiredString(100, "State is required"),
  pincode: pincodeSchema,
});

/* ================================
   LAST ACADEMIC
================================ */
const lastAcademicSchema = z.object({
  institute_name: safeRequiredString(255, "Institute name is required"),
  class: safeRequiredString(100, "Class is required"),
  session: safeRequiredString(100, "Session is required"),
  section: safeRequiredString(50, "Section is required"),
  roll_number: safeRequiredString(50, "Roll number is required"),
});

/* ================================
   DOCUMENT
================================ */

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
export const StudentReAdmissionFormSchema = z.object({
  admission_head_id: z.union([z.string(), z.number()]).optional(),

  applicant_name: safeRequiredString(255, "Name is required"),
  father_name: safeRequiredString(255, "Father name is required"),
  mother_name: safeRequiredString(255, "Mother name is required"),

  father_qualification: safeRequiredString(255, "Qualification is required"),
  father_occupation: safeRequiredString(255, "Occupation is required"),

  dob: safeRequiredString(50, "DOB is required"),

  gender: z.enum(["Male", "Female", "Other"]),

  category: z.enum(["general", "sc", "st", "bc1", "bc2", "ews"]).optional(),

  caste: safeRequiredString(100, "Caste is required"),

  mobile: phoneSchema,
  father_mobile: phoneSchema,

  aadhar_no: aadhaarSchema,
  abc_no: safeOptionalString(20, "ABC no"),

  blood_group: z
    .enum(["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"])
    .optional(),

  nationality: safeOptionalString(100, "Nationality"),
  religion: safeRequiredString(100, "Religion is required"),

  marital_status: z.enum(["Married", "Unmarried"]),

  is_differently_abled: z.boolean(),

  university_confidential_no: safeOptionalString(100, "Confidential no"),
  university_roll_no: safeOptionalString(100, "Univ roll no"),
  reg_no: safeRequiredString(100, "Reg no is required"),
  roll_no: safeOptionalString(100, "Roll no"),

  place: safeOptionalString(100, "Place"),
  signature_url: safeOptionalString(500, "Signature URL"),

  addresses: z
    .array(addressSchema)
    .length(2, "Both permanent and correspondence address are required"),

  last_academic: lastAcademicSchema,

  previous_exams: z.array(z.any()).optional(),

  selected_subjects: z.array(subjectSchema).optional(),
});

/* ================================
   TYPE
================================ */
export type StudentReAdmissionFormType = z.infer<
  typeof StudentReAdmissionFormSchema
>;
