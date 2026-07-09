import { useMemo } from "react";
import { usePage } from "@inertiajs/react";
import { useInstitutionContent } from "@/hooks/useInstitutionContent";
import { usePermittedFields } from "@/hooks/usePermittedFields";
import { useAuth } from "@/hooks/use-can";
import { useRegisterGuide } from "@/components/GuideProvider";
import type { GuideDefinition } from "@/types/guide";
import type { InstitutionContentMap } from "@/constants/content";
import type { FormFieldConfig } from "@/types/formTypes";
import type { BreadcrumbItem, SharedData } from "@/types";
import type { z, ZodRawShape } from "zod";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PagePermissions {
  view: string;
  create: string;
  edit: string;
  delete: string;
}

interface PageConfigOptions<TContent, TColumns> {
  /** CRUD permission keys */
  permissions: PagePermissions;
  /** Base form field configs (from constants, with permission gates) */
  formFields: readonly FormFieldConfig[];
  /** Full Zod schema for the form */
  schema: z.ZodObject<ZodRawShape>;
  /** Builds page content (titles, buttons, labels) from institution content map */
  getContent: (c: InstitutionContentMap) => TContent;
  /** Builds breadcrumbs from institution content map */
  getBreadcrumbs: (c: InstitutionContentMap) => BreadcrumbItem[];
  /** Builds table columns from institution content map */
  getColumns: (c: InstitutionContentMap) => TColumns[];
  /** Optionally resolves scope-type-aware form field labels from content map */
  getFormFields?: (c: InstitutionContentMap, fields: readonly FormFieldConfig[]) => FormFieldConfig[];
  /** Optional: builds a scope-type-aware interactive guide definition */
  getGuide?: (scopeType?: string | null) => GuideDefinition;
}

interface PageConfigResult<TContent, TColumns> {
  /** Resolved page content (titles, buttons, etc.) */
  content: TContent;
  /** Resolved breadcrumbs */
  breadcrumbs: BreadcrumbItem[];
  /** Resolved table columns */
  columns: TColumns[];
  /** Permission-filtered + label-resolved form fields */
  visibleFields: FormFieldConfig[];
  /** Dynamic Zod schema (hidden fields made optional) */
  permittedSchema: z.ZodObject<ZodRawShape>;
  /** Raw institution content map (for custom use) */
  contentMap: InstitutionContentMap;
  /** Institution scope type (e.g. 'school', 'college') */
  scopeType: string | null;
  /** CRUD permission gates */
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Generic page configuration hook.
 *
 * Resolves scope-type-aware content, breadcrumbs, columns, form fields,
 * permissions, and a dynamic Zod schema — all from a single config object.
 *
 * @example
 * const { content, breadcrumbs, columns, visibleFields, permittedSchema, canCreate }
 *   = usePageConfig({
 *       permissions: STREAM_PERMISSIONS,
 *       formFields: STREAM_FORM_FIELDS,
 *       schema: streamSchema,
 *       getContent: getStreamContent,
 *       getBreadcrumbs: getStreamBreadcrumbs,
 *       getColumns: getStreamColumns,
 *       getFormFields: getStreamFormFields,
 *     });
 */
export function usePageConfig<
  TContent extends Record<string, unknown>,
  TColumns extends Record<string, unknown>,
>(options: PageConfigOptions<TContent, TColumns>): PageConfigResult<TContent, TColumns> {
  const {
    permissions,
    formFields,
    schema,
    getContent,
    getBreadcrumbs,
    getColumns,
    getFormFields,
    getGuide,
  } = options;

  const contentMap = useInstitutionContent();
  const { can } = useAuth();
  const { institution } = usePage<SharedData>().props;
  const scopeType = institution?.type ?? null;

  // Register interactive guide (if provided)
  const guideDefinition = useMemo(
    () => getGuide?.(scopeType) ?? null,
    [getGuide, scopeType],
  );
  useRegisterGuide(guideDefinition as GuideDefinition);

  // Resolve scope-type-aware content
  const content = useMemo(() => getContent(contentMap), [contentMap, getContent]);
  const breadcrumbs = useMemo(() => getBreadcrumbs(contentMap), [contentMap, getBreadcrumbs]);
  const columns = useMemo(() => getColumns(contentMap), [contentMap, getColumns]);

  // Resolve form fields with content-engine labels (if provided)
  const resolvedFields = useMemo(() => {
    if (getFormFields) {
      return getFormFields(contentMap, formFields);
    }
    return [...formFields];
  }, [contentMap, formFields, getFormFields]);

  // Filter by permissions + build dynamic schema
  const { visibleFields, permittedSchema } = usePermittedFields(
    resolvedFields,
    schema,
  );

  // CRUD permission gates
  const canCreate = can(permissions.create);
  const canEdit = can(permissions.edit);
  const canDelete = can(permissions.delete);

  return {
    content,
    breadcrumbs,
    columns,
    visibleFields,
    permittedSchema,
    contentMap,
    scopeType,
    canCreate,
    canEdit,
    canDelete,
  };
}
