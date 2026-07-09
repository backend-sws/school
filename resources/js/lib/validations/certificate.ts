import { z } from "zod";
import { safeOptionalString } from "./common";

export const CertificateRulesSchema = z.object({
  certification_instruction: safeOptionalString(5000, "Instruction"),
  certificate_tc: safeOptionalString(5000, "Terms"),
});

export type CertificateSettingsFormValues = z.infer<
  typeof CertificateRulesSchema
>;
