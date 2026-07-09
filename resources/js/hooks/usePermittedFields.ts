import { useMemo } from "react";
import { useAuth } from "@/hooks/use-can";
import { z, type ZodRawShape, type ZodTypeAny } from "zod";
import type { FormFieldConfig } from "@/types/formTypes";

/**
 * Filters form fields by user permissions/features and builds a dynamic Zod schema
 * that makes hidden fields optional (so validation won't fail for gated fields).
 *
 * @param fields      - Full field config array from constants (with optional `permission` / `feature`)
 * @param fullSchema  - Complete Zod object schema (all fields)
 * @returns { visibleFields, permittedSchema }
 *
 * @example
 * const { visibleFields, permittedSchema } = usePermittedFields(
 *     FEE_TYPE_FORM_FIELDS,
 *     feeTypeSchema,
 * );
 *
 * const { control } = useForm({
 *     resolver: zodResolver(permittedSchema) as any,
 * });
 *
 * <Each of={visibleFields} render={(field) => (
 *     <ControlledFormComponent {...field} control={control} />
 * )} />
 */
export function usePermittedFields<T extends FormFieldConfig>(
    fields: readonly T[],
    fullSchema: z.ZodObject<ZodRawShape>,
) {
    const { can, hasFeature } = useAuth();

    return useMemo(() => {
        // 1. Filter fields by permission + feature gates
        const visibleFields = fields.filter((f) => {
            if (f.permission && !can(f.permission)) return false;
            if (f.feature && !hasFeature(f.feature)) return false;
            return true;
        });

        // 2. Build a schema where hidden fields become optional
        const visibleNames = new Set(visibleFields.map((f) => f.name));
        const shape = { ...fullSchema.shape } as Record<string, ZodTypeAny>;

        const permittedShape = Object.fromEntries(
            Object.entries(shape).map(([key, validator]) => [
                key,
                visibleNames.has(key) ? validator : (validator as any).optional(),
            ]),
        );

        const permittedSchema = z.object(permittedShape);

        return { visibleFields, permittedSchema };
    }, [fields, fullSchema, can, hasFeature]);
}
