import { usePage } from "@inertiajs/react";
import { useMemo } from "react";
import { type SharedData } from "@/types";
import { getInstitutionContent, type InstitutionContentMap } from "@/constants/content";

/**
 * Returns institution-type-aware content (labels, section titles, step labels, etc.)
 * for the current workspace. Use in forms, tables, and steps so school sees "Class"/"Term",
 * college sees "Stream"/"Semester", etc.
 */
export function useInstitutionContent(): InstitutionContentMap {
  const { institution } = usePage<SharedData>().props;
  return useMemo(() => getInstitutionContent(institution?.type), [institution?.type]);
}
