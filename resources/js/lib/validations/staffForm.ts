import { z } from "zod";
import { emailSchemaRequired, safeRequiredString } from "./common";

export const staffFormSchema = z.object({
  avatar: z.union([z.string(), z.instanceof(File)]).optional(),
  name: safeRequiredString(150, "Name is required"),
  email: emailSchemaRequired(),
  role_id: safeRequiredString(50, "Please select a role"),
  category: safeRequiredString(50, "Please select a category"),
  department_ids: z.array(z.any()).optional(),
  subject_ids: z.array(z.any()).optional(),
  send_invitation: z.boolean().optional(),
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;
