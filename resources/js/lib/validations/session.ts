import { z } from "zod";

export const sessionDialogFormSchema = z
  .object({
    start_year: z
      .number({ message: "Start Year is required" })
      .int("Start Year must be an integer")
      .min(1900, "Start Year must be after 1900")
      .max(2100, "Start Year must be before 2100"),

    end_year: z
      .number({ message: "End Year is required" })
      .int("End Year must be an integer")
      .min(1900, "End Year must be after 1900")
      .max(2100, "End Year must be before 2100"),
  })
  .refine((data) => data.end_year >= data.start_year, {
    message: "End Year must be greater than or equal to Start Year",
    path: ["end_year"],
  });
