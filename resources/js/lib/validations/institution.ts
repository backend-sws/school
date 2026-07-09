import { z } from "zod";
import { safeRequiredString, safeOptionalString, emailSchemaOptional } from "./common";

const optionalUrl = () =>
  z.union([z.string().url("Invalid URL").max(200), z.literal("")]);

export const InstitutionFormSchema = z.object({
  name: safeRequiredString(200, "Name is required"),
  code: safeOptionalString(30, "Code"),
  type: z
    .string()
    .refine((v) => !v || ["school", "college", "coaching", "university"].includes(v), "Invalid type"),
  address: safeOptionalString(500, "Address"),
  city: safeOptionalString(100, "City"),
  state: safeOptionalString(100, "State"),
  pincode: safeOptionalString(10, "Pincode"),
  phone: safeOptionalString(20, "Phone"),
  email: emailSchemaOptional(),
  website: optionalUrl(),
});

export type InstitutionFormValues = z.infer<typeof InstitutionFormSchema>;
