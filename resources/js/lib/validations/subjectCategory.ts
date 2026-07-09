import { z } from "zod";
import { safeRequiredString } from "./common";

// Duration options as a tuple

export const subjectCategoryDialogFormSchema = z.object({
  name: safeRequiredString(255, "Name is required"),
  code: safeRequiredString(100, "Code is required"),
});
