import { useCallback, useEffect, useRef } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    applicationDeskFormSchema,
    type ApplicationDeskFormValues,
} from "@/lib/validations/admission/application";
import { APPLICATION_DESK_FORM_DEFAULT_VALUES } from "@/constants/admission/application";

const STORAGE_KEY = "ems:readmission-form";
const DEBOUNCE_MS = 400;

/**
 * Default values for re-admission — same as admission but with type set to 're-admission'.
 */
const READMISSION_DEFAULT_VALUES: ApplicationDeskFormValues = {
    ...APPLICATION_DESK_FORM_DEFAULT_VALUES,
    application_type: "re-admission" as any,
};

/**
 * Reads stored form values from sessionStorage **synchronously**.
 */
function getInitialValues(): ApplicationDeskFormValues {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
            const stored = JSON.parse(raw);
            return { ...READMISSION_DEFAULT_VALUES, ...stored };
        }
    } catch {
        /* ignore corrupt data */
    }
    return READMISSION_DEFAULT_VALUES;
}

/**
 * Re-admission form store — mirrors useAdmissionFormStore but with:
 * - Separate sessionStorage key (no collision with new admission)
 * - `prefillFromStudent(data)` to hydrate from backend prefill API
 *
 * Uses the same Zod schema and step components as the admission wizard.
 */

function sanitizeNulls(obj: any): any {
    if (obj === null) return "";
    if (typeof obj === "object") {
        if (Array.isArray(obj)) return obj.map(sanitizeNulls);
        const res: any = {};
        for (const [k, v] of Object.entries(obj)) {
            res[k] = sanitizeNulls(v);
        }
        return res;
    }
    return obj;
}

export function useReadmissionFormStore(): UseFormReturn<ApplicationDeskFormValues> & {
    clearStorage: () => void;
    saveNow: () => void;
    resetForm: () => void;
    prefillFromStudent: (prefillData: Record<string, unknown>) => void;
} {
    const form = useForm<ApplicationDeskFormValues>({
        defaultValues: getInitialValues(),
        resolver: zodResolver(applicationDeskFormSchema) as any,
        mode: "onChange",
        reValidateMode: "onChange",
    });

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const latestValuesRef = useRef<Record<string, unknown> | null>(null);

    // ── Persist helper ─────────────────────────────────────────────────
    const persist = useCallback((values: Record<string, unknown>) => {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        } catch {
            /* quota exceeded — ignore */
        }
    }, []);

    // ── Debounced save on every change + flush on unmount ──────────────
    useEffect(() => {
        const subscription = form.watch((values) => {
            latestValuesRef.current = values;
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                persist(values);
            }, DEBOUNCE_MS);
        });

        return () => {
            subscription.unsubscribe();
            if (timerRef.current) clearTimeout(timerRef.current);
            if (latestValuesRef.current) {
                persist(latestValuesRef.current);
            }
        };
    }, [form, persist]);

    // ── Public helpers ─────────────────────────────────────────────────
    const clearStorage = useCallback(() => {
        sessionStorage.removeItem(STORAGE_KEY);
        latestValuesRef.current = null;
    }, []);

    const resetForm = useCallback(() => {
        clearStorage();
        form.reset(READMISSION_DEFAULT_VALUES);
    }, [clearStorage, form]);

    const resetFormRef = useRef(resetForm);
    resetFormRef.current = resetForm;

    const saveNow = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        const current = form.getValues();
        persist(current);
    }, [form, persist]);

    /**
     * Hydrate form from backend prefill API response.
     * Maps the `prefill` object into form-compatible field values.
     */
    const prefillFromStudent = useCallback(
        (prefillData: Record<string, unknown>) => {
            const merged: Record<string, unknown> = {
                ...READMISSION_DEFAULT_VALUES,
                application_type: "re-admission",
            };

            // Map known fields from prefill
            const sanitizedData = sanitizeNulls(prefillData);
            const directFields = [
                "id", "application_id", "process_status",
                "applicant_name", "father_name", "mother_name", "dob", "gender",
                "category", "religion", "nationality", "mobile", "email",
                "aadhaar_no", "blood_group", "address_snapshot", "guardian_snapshot",
                "father_mobile", "father_qualification", "caste", "abc_id", "apaar_id",
                "medical_condition", "disability", "allergy", "previous_school_name",
                "previous_board", "previous_marks", "has_tc", "has_government_portal",
                "government_portal_name", "documents",
                "transport_route_id", "transport_stop_id", "transport_amount",
                "hostel_required", "hostel_id", "hostel_room_id", "hostel_amount",
                "has_local_guardian"
            ] as const;

            for (const key of directFields) {
                if (prefillData[key] !== undefined && prefillData[key] !== null) {
                    merged[key] = prefillData[key];
                }
            }

            // Store _from metadata for display in AcademicStep
            for (const key of Object.keys(prefillData)) {
                if (key.startsWith("_from_") || key === "_previous_session_dues") {
                    merged[key] = prefillData[key];
                }
            }

            form.reset(merged as ApplicationDeskFormValues);
            persist(merged);
        },
        [form, persist],
    );

    // ── Handle fresh start from URL ───────────────────────────────────
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("fresh") === "true") {
            resetFormRef.current();
            const url = new URL(window.location.href);
            url.searchParams.delete("fresh");
            window.history.replaceState({}, "", url.toString());
        }
    }, []);

    return Object.assign(form, { clearStorage, saveNow, resetForm, prefillFromStudent });
}
