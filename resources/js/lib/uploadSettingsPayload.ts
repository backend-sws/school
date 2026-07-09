import R2Api from "./api/r2Api";

/**
 * Process form data for settings API - upload File values via R2 and replace with path.
 */
export async function processSettingsPayload(
  data: Record<string, unknown>
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value instanceof File) {
      result[key] = await R2Api.uploadFile(value);
    } else if (typeof value === "object" && value !== null) {
      result[key] = JSON.stringify(value);
    } else {
      result[key] = value != null ? String(value) : "";
    }
  }

  return result;
}
