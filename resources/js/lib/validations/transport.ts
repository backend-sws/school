import { z } from "zod";
import { safeRequiredString, safeOptionalString, phoneSchemaOptional, emailSchemaOptional } from "./common";

export const TransportStopFormSchema = z.object({
  name: safeRequiredString(150, "Name is required"),
  code: safeOptionalString(50, "Code"),
  address: safeOptionalString(255, "Address"),
  landmark: safeOptionalString(150, "Landmark"),
  latitude: z
    .union([z.literal(""), z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : Number(v))),
  longitude: z
    .union([z.literal(""), z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : Number(v))),
  is_active: z.boolean().optional().default(true),
});
export type TransportStopFormValues = z.infer<typeof TransportStopFormSchema>;
export type TransportStopFormInputValues = z.input<typeof TransportStopFormSchema>;


export const TransportRouteFormSchema = z.object({
  name: safeRequiredString(150, "Name is required"),
  code: safeOptionalString(50, "Code"),
  description: safeOptionalString(2000, "Description"),
  is_active: z.boolean().optional().default(true),
});
export type TransportRouteFormValues = z.infer<typeof TransportRouteFormSchema>;

export const TransportDriverFormSchema = z.object({
  name: safeRequiredString(150, "Name is required"),
  license_number: safeOptionalString(80, "License number"),
  license_valid_until: z.preprocess((val) => {
    if (typeof val === "string") {
      if (val.includes("T")) return val.split("T")[0];
      if (val.includes("/")) {
        const [d, m, y] = val.split("/");
        if (d && m && y && y.length === 4) return `${y}-${m}-${d}`;
      }
    }
    return val;
  }, z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD")
    .optional()
    .or(z.literal(""))
    .nullable()),
  mobile: phoneSchemaOptional(),
  email: emailSchemaOptional(100),
  is_active: z.boolean().optional().default(true),
});
export type TransportDriverFormValues = z.infer<typeof TransportDriverFormSchema>;

export const TransportVehicleFormSchema = z.object({
  registration_number: safeRequiredString(30, "Registration number is required"),
  vehicle_type: z.enum(["bus", "van", "cab"], { message: "Select vehicle type" }),
  capacity: z.union([z.literal(""), z.coerce.number().int().min(1, "Capacity must be at least 1")], { message: "Enter seat capacity" }),
  transport_route_id: z.union([z.literal(""), z.coerce.number().int()]).optional(),
  transport_driver_id: z.union([z.literal(""), z.coerce.number().int()]).optional(),
  status: z.enum(["active", "maintenance", "inactive"], { message: "Select status" }),
  notes: safeOptionalString(500, "Notes"),
});
export type TransportVehicleFormValues = z.infer<typeof TransportVehicleFormSchema>;

export const TransportAssignmentFormSchema = z.object({
  user_id: z.union([z.literal(""), z.coerce.number().int().positive("Select a student")], { message: "Select a student" }),
  transport_route_id: z.union([z.literal(""), z.coerce.number().int().positive("Select a route")], { message: "Select a route" }),
  transport_stop_id: z.union([z.literal(""), z.coerce.number().int().positive("Select a stop")], { message: "Select a stop" }),
  effective_from: safeRequiredString(50, "Effective from date is required"),
  effective_until: safeOptionalString(50, "Effective until"),
  remarks: safeOptionalString(500, "Remarks"),
}).refine(
  (v) => v.user_id !== "" && v.transport_route_id !== "" && v.transport_stop_id !== "",
  { message: "Student, route and stop are required", path: ["transport_route_id"] }
);
export type TransportAssignmentFormValues = z.infer<typeof TransportAssignmentFormSchema>;
