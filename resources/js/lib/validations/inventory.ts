import { z } from "zod";
import { safeRequiredString, safeOptionalString, safeStringRefine, safeStringRefineOptional, SAFE_STRING_MESSAGE } from "./common";

export const InventoryLocationFormSchema = z.object({
  name: safeRequiredString(150, "Name is required"),
  code: safeOptionalString(50, "Code"),
});

export type InventoryLocationFormValues = z.infer<typeof InventoryLocationFormSchema>;

export const InventoryCategoryFormSchema = z.object({
  name: safeRequiredString(100, "Name is required"),
  code: safeOptionalString(50, "Code"),
  description: safeOptionalString(500, "Description"),
});

export const InventoryItemFormSchema = z.object({
  inventory_category_id: z.coerce.number().int().refine((n) => n > 0, "Category is required"),
  name: safeRequiredString(200, "Name is required"),
  code: safeOptionalString(80, "Code"),
  unit: safeOptionalString(20, "Unit"),
  min_stock: z
    .union([z.literal(""), z.coerce.number().min(0, "Min stock cannot be negative")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : Number(v))),
  purchase_price: z
    .union([z.literal(""), z.coerce.number().min(0, "Purchase price cannot be negative")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : Number(v))),
  selling_price: z
    .union([z.literal(""), z.coerce.number().min(0, "Selling price cannot be negative")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : Number(v))),
  margin_percentage: z
    .union([z.literal(""), z.coerce.number().min(0)])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : Number(v))),
  gst_rate: z
    .union([z.literal(""), z.coerce.number().min(0).max(100, "GST rate cannot exceed 100")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : Number(v))),
  hsn_code: safeOptionalString(20, "HSN code"),
  location: safeOptionalString(150, "Location"),
  description: safeOptionalString(500, "Description"),
  is_active: z.boolean().optional(),
});

export const MOVEMENT_TYPES = ["issue", "return", "receive", "adjust"] as const;

export const InventoryMovementFormSchema = z.object({
  inventory_item_id: z
    .union([z.literal(""), z.coerce.number().int().refine((n) => n > 0)])
    .transform((v) => (v === "" ? undefined : Number(v))) as any,
  type: z.enum(MOVEMENT_TYPES, { message: "Type is required" }),
  quantity: z.coerce.number().refine((n) => n !== 0, "Quantity cannot be zero"),
  remarks: safeOptionalString(500, "Remarks"),
});

const INVENTORY_SALE_LINE_SCHEMA = z.object({
  inventory_item_id: z.number().int().positive("Item is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unit_price: z.number().min(0, "Unit price cannot be negative"),
});

export const InventorySaleFormSchema = z
  .object({
    buyer_type: z.enum(["student", "parent", "other"], {
      message: "Buyer type is required",
    }),
    user_id: z
      .union([z.literal(""), z.coerce.number()])
      .optional()
      .transform((v) => (v === "" || v == null ? undefined : Number(v))),
    buyer_name: safeOptionalString(255, "Buyer name"),
    remarks: safeOptionalString(500, "Remarks"),
    lines: z.array(INVENTORY_SALE_LINE_SCHEMA).min(1, "Add at least one line item"),
    // UI-only fields for "add line" row (not sent to API)
    gst_inclusive: z.boolean().optional(),
    new_item_id: z.union([z.literal(""), z.coerce.number()]).optional(),
    new_qty: z.union([z.literal(""), z.coerce.number()]).optional(),
    new_unit_price: z.union([z.literal(""), z.coerce.number()]).optional(),
  })
  .refine(
    (data) => {
      if (data.buyer_type === "other") return true;
      return data.user_id != null && data.user_id >= 1;
    },
    { message: "User ID is required for student/parent", path: ["user_id"] }
  );

/** Form input state (allows "" for user_id). Use for useForm/defaultValues. */
export type InventorySaleFormInputValues = z.input<typeof InventorySaleFormSchema>;
export type InventorySaleFormValues = z.infer<typeof InventorySaleFormSchema>;

export type InventoryCategoryFormValues = z.infer<typeof InventoryCategoryFormSchema>;
/** Form input state (allows "" for clearable optional numerics). Use for useForm/defaultValues/reset. */
export type InventoryItemFormInputValues = z.input<typeof InventoryItemFormSchema>;
export type InventoryItemFormValues = z.infer<typeof InventoryItemFormSchema>;
export type InventoryMovementFormInputValues = z.input<typeof InventoryMovementFormSchema>;
export type InventoryMovementFormValues = z.infer<typeof InventoryMovementFormSchema>;
