import { z } from "zod";

/**
 * Standard address schema for student profiles.
 * Mirrors StudentAddress model fields and backend validation.
 */
export const studentAddressSchema = z.object({
  village_mohalla: z.string().max(100).optional().nullable(),
  post_office: z.string().max(100).optional().nullable(),
  police_station: z.string().max(100).optional().nullable(),
  district: z.string().max(50).optional().nullable(),
  state: z.string().max(50).or(z.literal("")).optional().nullable(),
  pincode: z
    .union([z.string(), z.number()])
    .optional()
    .nullable(),
});

/**
 * Robust validation schema for Student Edit form.
 * Follows Rule 0: React Hook Form + Zod.
 */
export const studentEditSchema = z.object({
  // --- User-level fields ---
  name: z.string().min(1, "Student name is required").max(255),
  email: z.string().min(1, "Email address is required").email("Invalid email format"),
  mobile: z
    .string()
    .min(10, "Mobile number is too short")
    .max(15, "Mobile number is too long")
    .regex(/^\+?[1-9]\d{1,14}$/, "Enter a valid mobile number with country code")
    .or(z.literal(""))
    .optional()
    .nullable(),
  reg_no: z.string().min(1, "Registration number is required").max(50),
  photo_url: z.string().url("Invalid photo URL").or(z.literal("")).optional().nullable(),

  // --- Profile-level fields ---
  main_stream_id: z.coerce.number().min(1, "Please select main stream"),
  stream_id: z.coerce.number().min(1, "Please select stream"),
  session_id: z.coerce.number().min(1, "Please select session"),
  roll_no: z.string().max(50).optional().nullable(),
  dob: z.string().optional().nullable(),
  gender: z.string().min(1, "Gender is required"),
  blood_group: z.string().optional().nullable(),
  aadhar_no: z
    .string()
    .length(12, "Aadhar must be 12 digits")
    .regex(/^\d+$/, "Aadhar must be numeric")
    .or(z.literal(""))
    .optional()
    .nullable(),
  father_name: z.string().max(255).optional().nullable(),
  father_mobile: z
    .string()
    .min(10, "Contact number is too short")
    .max(15, "Contact number is too long")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid mobile number")
    .or(z.literal(""))
    .optional()
    .nullable(),
  father_qualification: z.string().max(255).optional().nullable(),
  father_occupation: z.string().max(255).optional().nullable(),
  mother_name: z.string().max(255).optional().nullable(),
  category: z.string().optional().nullable(),
  caste: z.string().max(255).optional().nullable(),
  religion: z.string().max(255).optional().nullable(),
  nationality: z.string().optional().nullable(),
  is_differently_abled: z.boolean().optional().default(false),
  disability_type: z.string().optional().nullable(),
  medical_condition: z.string().optional().nullable(),
  allergy: z.string().optional().nullable(),
  abc_no: z.string().optional().nullable(),
  apaar_id: z.string().optional().nullable(),
  has_government_portal: z.boolean().optional().default(false),
  government_portal_name: z.string().optional().nullable(),
  previous_school_name: z.string().optional().nullable(),
  previous_board: z.string().optional().nullable(),
  previous_marks: z.coerce.number().optional().nullable(),
  previous_roll_no: z.string().optional().nullable(),
  has_tc: z.boolean().optional().default(false),
  guardian_snapshot: z.object({
    name: z.string().optional().nullable(),
    occupation: z.string().optional().nullable(),
    aadhaar_no: z.string().optional().nullable(),
    income: z.coerce.number().optional().nullable(),
    local_guardian: z.object({
      name: z.string().optional().nullable(),
      phone: z.string().optional().nullable(),
      relationship: z.string().optional().nullable(),
    }).optional().nullable()
  }).optional().nullable(),

  // --- Addresses ---
  permanent_address: studentAddressSchema,
  correspondence_address: studentAddressSchema,

  // --- Documents ---
  documents: z.record(z.string(), z.any()).optional().nullable(),

  // --- UI Helpers ---
  copy_correspondence: z.boolean().optional().default(false),
});

export type StudentEditFormValues = z.infer<typeof studentEditSchema>;
