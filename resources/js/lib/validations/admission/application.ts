import { z } from "zod";
import { 
    emailSchemaRequired, 
    numericString, 
    numericStringOptional, 
    aadhaarSchema, 
    pincodeSchema, 
    phoneSchema, 
    phoneSchemaOptional, 
    safeRequiredString, 
    safeOptionalString, 
    safeStringRefine, 
    safeStringRefineOptional, 
    SAFE_STRING_MESSAGE 
} from "../common";

/** Single address block (correspondence or permanent) */
const addressBlockSchema = z
  .object({
    line1: safeOptionalString(255, "Address line 1"),
    line2: safeOptionalString(255, "Address line 2"),
    city: safeOptionalString(100, "City"),
    state: safeOptionalString(100, "State"),
    pincode: pincodeSchema(),
  })
  .optional()
  .default({});

/** Address snapshot: correspondence and permanent address */
const addressSnapshotSchema = z
  .object({
    correspondence: addressBlockSchema,
    permanent: addressBlockSchema,
  })
  .optional()
  .default({ correspondence: {}, permanent: {} });

/** Local guardian (optional) */
const localGuardianSchema = z
  .object({
    name: safeOptionalString(150, "Name"),
    phone: phoneSchemaOptional(),
    relationship: safeOptionalString(50, "Relationship"),
  })
  .optional()
  .default({});

/** Emergency contact */
const emergencyContactSchema = z
  .object({
    name: safeOptionalString(150, "Name"),
    relationship: safeOptionalString(50, "Relationship"),
    mobile: phoneSchemaOptional(),
    alternate_mobile: phoneSchemaOptional(),
  })
  .optional()
  .default({ mobile: "" });

/** Guardian snapshot: guardian details captured at admission */
const guardianSnapshotSchema = z
  .object({
    name: safeOptionalString(150, "Guardian name"),
    occupation: safeOptionalString(100, "Occupation"),
    aadhaar_no: aadhaarSchema(),
    income: numericStringOptional(),
    local_guardian: localGuardianSchema,
    emergency_contact: emergencyContactSchema,
  })
  .optional()
  .default({ local_guardian: {}, emergency_contact: { mobile: "" }, income: 0 });

/** Schema for the Application Desk one-go form (multi-step) */
export const applicationDeskFormSchema = z
  .object({
    id: z.number().optional(),
    application_id: safeOptionalString(50, "Application ID"),
    process_status: z.enum(["draft", "pending", "approved", "rejected"]).optional(),
    application_type: z.enum(["new", "re-admission"]),
    student_id: z.union([z.string().refine(safeStringRefineOptional, SAFE_STRING_MESSAGE), z.number()]).optional().or(z.literal("")),

    // Academic (required on academic step). Session is never from frontend; backend uses current session from model.
    stream_id: z.preprocess(
      (val) => (val === undefined ? "" : val),
      z.union([
        z.string().min(1, "Please select a stream or program."),
        z.number().positive("Please select a stream or program."),
      ], { message: "Please select a stream or program." })
    ),

    // Identity – required (preprocess undefined so we get "X is required" instead of "expected string, received undefined")
    applicant_name: z.preprocess((val) => (val === undefined ? "" : val), safeRequiredString(150, "Applicant name is required.")),
    dob: z.preprocess(
      (val) => (val === undefined || val === null ? "" : String(val)),
      z.string().min(1, "Date of birth is required.").refine(safeStringRefine, SAFE_STRING_MESSAGE)
    ),
    gender: z.preprocess((val) => (val === undefined ? "" : val), safeRequiredString(10, "Please select gender.")),

    // Identity – required
    father_name: z.preprocess((val) => (val === undefined ? "" : val), safeRequiredString(150, "Father's name is required.")),
    mother_name: z.preprocess((val) => (val === undefined ? "" : val), safeRequiredString(150, "Mother's name is required.")),

    // Identity – optional with max length
    category: safeOptionalString(50, "Category"),
    caste: safeOptionalString(50, "Caste"),
    religion: safeOptionalString(50, "Religion"),
    nationality: safeOptionalString(50, "Nationality"),
    blood_group: safeOptionalString(10, "Blood group"),
    aadhaar_no: aadhaarSchema(),
    abc_id: safeOptionalString(100, "ABC ID"),
    apaar_id: safeOptionalString(50, "APAAR ID"),
    father_mobile: phoneSchemaOptional(),
    father_qualification: safeOptionalString(100, "Father qualification"),
    previous_school_name: safeOptionalString(200, "Previous school name"),
    previous_board: safeOptionalString(100, "Previous board"),
    previous_marks: z
      .union([
        z.string().refine(safeStringRefineOptional, SAFE_STRING_MESSAGE),
        z.number().min(0, "Marks must be 0 or more.").max(9999, "Marks must be at most 9999."),
      ])
      .optional()
      .or(z.literal("")),

    has_tc: z.boolean().optional().default(false),
    has_government_portal: z.boolean().optional().default(false),
    government_portal_name: safeOptionalString(200, "Government portal name"),
    // Hostel
    hostel_required: z.boolean().default(false),
    hostel_id: z.coerce.number().nullable().optional(),
    hostel_room_id: z.coerce.number().nullable().optional(),
    hostel_amount: numericStringOptional(),

    // Contact – mobile and email required (preprocess so undefined becomes "" and we get a clear validation message)
    mobile: z.preprocess((val) => (val === undefined ? "" : val), phoneSchema()),
    email: z.preprocess((val) => (val === undefined ? "" : val), emailSchemaRequired("Enter a valid email address.")),

    address_snapshot: addressSnapshotSchema,
    permanent_address_type: z.enum(["same", "different"]).default("same"),
    has_local_guardian: z.boolean().optional().default(false),
    guardian_snapshot: guardianSnapshotSchema,

    medical_condition: safeOptionalString(200, "Medical condition"),
    disability: safeOptionalString(200, "Disability"),
    allergy: safeOptionalString(200, "Allergy"),

    // Academic – class required; section optional
    class_id: z.preprocess(
      (val) => (val === undefined ? "" : val),
      z.union([
        z.string().min(1, "Please select a class."),
        z.number().positive("Please select a class."),
      ], { message: "Please select a class." })
    ),
    section_id: z.union([z.string().refine(safeStringRefineOptional, SAFE_STRING_MESSAGE), z.number()]).optional().or(z.literal("")),

    fee_regulation_profile_id: z.union([z.string().refine(safeStringRefineOptional, SAFE_STRING_MESSAGE), z.number()]).optional().or(z.literal("")),

    // Fees and services (preprocess coerces undefined amount/quantity/price so Zod doesn't throw "expected string, received undefined")
    fees: z
      .preprocess(
        (val) =>
          Array.isArray(val)
            ? (val as any[]).map((f) => ({
              ...f,
              amount: f?.amount != null && f?.amount !== "" ? f.amount : 0,
              fee_particular_id: f?.fee_particular_id ?? "",
            }))
            : val,
        z.array(
          z.object({
            fee_particular_id: z.union([
              z.string().min(1, "Fee particular is required."),
              z.number().positive("Fee particular is required."),
            ]),
            amount: numericString("Amount is required"),
            _title: safeOptionalString(255, "Title"),
            category: safeOptionalString(50, "Category"),
          })
        )
      )
      .default([]),

    inventory_items: z
      .preprocess(
        (val) =>
          Array.isArray(val)
            ? (val as any[]).map((i) => ({
              ...i,
              quantity: i?.quantity != null && i?.quantity !== "" ? i.quantity : 0,
              price: i?.price != null && i?.price !== "" ? i.price : 0,
              item_id: i?.item_id ?? "",
            }))
            : val,
        z.array(
          z.object({
            item_id: z.union([
              z.string().min(1, "Item is required."),
              z.number().positive("Item is required."),
            ]),
            quantity: numericString("Quantity must be at least 1"),
            price: numericStringOptional(),
            _title: safeOptionalString(255, "Title"),
          })
        )
      )
      .default([]),

    transport_route_id: z.union([z.string(), z.number()]).optional().or(z.literal("")),
    transport_stop_id: z.union([z.string(), z.number()]).optional().or(z.literal("")),
    transport_amount: numericStringOptional(),
    discount_amount: numericStringOptional(),
    discount_reason: safeOptionalString(200, "Discount reason"),

    cash_amount: numericStringOptional(),
    online_amount: numericStringOptional(),
    online_transaction_id: safeOptionalString(100, "Transaction ID"),

    // Coerce undefined document values to "" so z.record(z.string(), z.string()) doesn't throw "expected string, received undefined"
    documents: z.preprocess(
      (val) => {
        if (val != null && typeof val === "object") {
          const out: Record<string, string> = {};
          for (const k of Object.keys(val)) {
            const v = (val as Record<string, unknown>)[k];
            out[k] = v != null && v !== "" ? String(v) : "";
          }
          return out;
        }
        return {};
      },
      z.record(z.string(), z.string()).optional().default({})
    ),

    // Re-Admission Metadata (Read-only UI context)
    _from_stream_name: z.string().optional(),
    _from_session_name: z.string().optional(),
    _from_reg_no: z.string().optional(),
    _from_student_id: z.union([z.string(), z.number()]).optional(),

    // Live Transition Metadata (Selection Preview)
    _to_stream_name: z.string().optional(),
    _to_class_name: z.string().optional(),
  })
  .superRefine((data: any, ctx: z.RefinementCtx) => {

    // Payment Validation
    const cash = Number(data.cash_amount) || 0;
    const online = Number(data.online_amount) || 0;
    const totalPaid = cash + online;

    const feeSum = data.fees?.reduce((a: number, f: any) => a + (f.category === 'discount' ? 0 : (Number(f.amount) || 0)), 0) ?? 0;
    const computedDiscount = data.fees?.reduce((a: number, f: any) => a + (f.category === 'discount' ? (Number(f.amount) || 0) : 0), 0) ?? 0;
    const invSum = data.inventory_items?.reduce((a: number, f: any) => a + (Number(f.price) || 0) * (Number(f.quantity) || 0), 0) ?? 0;
    const transportAmt = Number(data.transport_amount) || 0;
    const hostelAmt = data.hostel_required ? (Number(data.hostel_amount) || 0) : 0;
    const discountAmt = (Number(data.discount_amount) || 0) + computedDiscount;
    const grandTotal = Math.max(0, feeSum + invSum + transportAmt + hostelAmt - discountAmt);

    if (totalPaid > grandTotal) {
      const message = `Total payment (₹${totalPaid.toLocaleString()}) cannot exceed Grand Total (₹${grandTotal.toLocaleString()}).`;
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["cash_amount"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["online_amount"],
      });
    }

    if (online > 0 && !(data.online_transaction_id ?? "").trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Transaction / UTR ID is required for online payments.",
        path: ["online_transaction_id"],
      });
    }


  })
  .refine(
    (data) => {
      const d = data.dob ? new Date(data.dob) : null;
      if (!d || isNaN(d.getTime())) return true;
      return d <= new Date();
    },
    { message: "Date of birth cannot be in the future.", path: ["dob"] }
  );

export type ApplicationDeskFormValues = z.infer<typeof applicationDeskFormSchema>;
