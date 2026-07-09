import { z } from "zod";
import {
  safeRequiredString,
  safeOptionalString,
} from "./common";

export const StudentSupportTicketSchema = z.object({
  support_for: safeRequiredString(100, "Support For is required"),
  issue_type: safeRequiredString(100, "Issue Type is required"),
  subject: safeRequiredString(255, "Subject must be at least 3 characters"),
  description: safeRequiredString(5000, "Description must be at least 10 characters"),
  attachment: safeOptionalString(500, "Attachment"),
});
