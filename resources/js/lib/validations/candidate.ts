import { z } from "zod";
import {
    safeRequiredString,
    safeOptionalString,
    pincodeSchema,
    safeStringRefine,
    safeStringRefineOptional,
    SAFE_STRING_MESSAGE,
} from "./common";

/**
 * Address schema for both permanent and correspondence addresses
 */
const addressSchema = z.object({
    village_mohalla: safeOptionalString(255, "Village/Mohalla"),
    post_office: safeOptionalString(255, "Post Office"),
    police_station: safeOptionalString(255, "Police Station"),
    district: safeOptionalString(100, "District"),
    state: safeRequiredString(100, "State is required"),
    pincode: pincodeSchema,
}).optional();

/**
 * Candidate/Student form validation schema
 */
export const candidateFormSchema = z.object({
    // User fields
    name: z.string().min(1, "Name is required").max(255).regex(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces").refine(val => !val || safeStringRefine(val), SAFE_STRING_MESSAGE),
    email: z.string().email("Please enter a valid email address"),
    mobile: z.string().min(1, "Mobile number is required").regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number").refine(val => !val || safeStringRefine(val), SAFE_STRING_MESSAGE),

    // Profile fields
    roll_no: safeOptionalString(50, "Roll no"),
    current_semester: z.number().min(1).max(12).optional().nullable(),
    dob: safeOptionalString(50, "DOB"),
    gender: z
        .string()
        .min(1, "Please select a gender")
        .refine(
            (val: string) => ["Male", "Female", "Other"].includes(val),
            "Invalid gender selection"
        ),
    blood_group: safeOptionalString(10, "Blood group"),
    aadhar_no: z.string().max(12).optional().or(z.literal("")).refine(val => !val || safeStringRefineOptional(val), SAFE_STRING_MESSAGE).refine(val => !val || /^\d{12}$/.test(val), "Aadhar number must be 12 digits"),

    // Father details
    father_name: z.string().max(255).optional().or(z.literal("")).refine(val => !val || safeStringRefineOptional(val), SAFE_STRING_MESSAGE).refine(val => !val || /^[a-zA-Z\s]*$/.test(val), "Name should only contain letters and spaces"),
    father_mobile: z.string().optional().or(z.literal("")).refine(val => !val || safeStringRefineOptional(val), SAFE_STRING_MESSAGE).refine(val => !val || /^([6-9]\d{9})?$/.test(val), "Please enter a valid 10-digit mobile number"),
    father_qualification: safeOptionalString(255, "Qualification"),
    father_occupation: safeOptionalString(255, "Occupation"),

    // Mother details
    mother_name: z.string().max(255).optional().or(z.literal("")).refine(val => !val || safeStringRefineOptional(val), SAFE_STRING_MESSAGE).refine(val => !val || /^[a-zA-Z\s]*$/.test(val), "Name should only contain letters and spaces"),

    // Category and other details
    category: safeOptionalString(50, "Category"),
    caste: safeOptionalString(100, "Caste"),
    nationality: safeOptionalString(100, "Nationality"),
    is_differently_abled: z.boolean().optional().nullable(),

    // Addresses
    permanent_address: addressSchema,
    correspondence_address: addressSchema,

    // Copy correspondence checkbox (not sent to API)
    copy_correspondence: z.boolean().optional(),
});

/**
 * Type inference from schema
 */
export type CandidateFormData = z.infer<typeof candidateFormSchema>;

/**
 * Schema for updating candidate status
 */
export const candidateStatusSchema = z.object({
    status: z.boolean(),
});

export type CandidateStatusData = z.infer<typeof candidateStatusSchema>;
