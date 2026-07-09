import { z } from "zod";
import { safeRequiredString } from "./common";

export const GrievanceDialogFormSchema = z.object({
  resolution: safeRequiredString(5000, "Resolution is required"),

  status: z.enum(["closed", "resolved"]).refine(Boolean, {
    message: "Status is required",
  }),
});
