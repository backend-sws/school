import { useCallback, useEffect, useRef } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    applicationDeskFormSchema,
    type ApplicationDeskFormValues,
} from "@/lib/validations/admission/application";
import { APPLICATION_DESK_FORM_DEFAULT_VALUES } from "@/constants/admission/application";

const STORAGE_KEY = "ems:admission-desk-form";
const DEBOUNCE_MS = 400;

/**
 * Reads stored form values from sessionStorage **synchronously**.
 * Called once when the hook initialises — ensures data is available
 * on the very first render (before any child useEffect fires).
 */
function getInitialValues(): ApplicationDeskFormValues {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
            const stored = JSON.parse(raw);
            return { ...APPLICATION_DESK_FORM_DEFAULT_VALUES, ...stored };
        }
    } catch {
        /* ignore corrupt data */
    }
    return APPLICATION_DESK_FORM_DEFAULT_VALUES;
}

/**
 * Persists form values to sessionStorage so data survives Inertia page
 * navigations (router.visit with preserveState: false).
 *
 * - **Synchronous hydration** — initial values are read from sessionStorage
 *   at call time (not in useEffect), so child components see saved data
 *   on their first render. This eliminates race conditions with steps
 *   that auto-populate fields (e.g. ServicesStep fee profile loading).
 * - Debounced save on every field change (400 ms).
 * - Immediate flush on unmount so data isn't lost when navigating.
 * - `saveNow()` for explicit save before programmatic navigation.
 * - `clearStorage()` to wipe after successful submission.
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

export function useAdmissionFormStore(): UseFormReturn<ApplicationDeskFormValues> & {
    clearStorage: () => void;
    saveNow: () => void;
    resetForm: () => void;
} {
    const form = useForm<ApplicationDeskFormValues>({
        defaultValues: getInitialValues(),
        resolver: zodResolver(applicationDeskFormSchema) as any,
        mode: "onChange",
        reValidateMode: "onChange",
    });

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    /** Always holds the latest form snapshot so we can flush on unmount */
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
            // Cancel pending debounce and flush immediately
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
        form.reset(APPLICATION_DESK_FORM_DEFAULT_VALUES);
    }, [clearStorage, form]);

    // Keep a ref so the mount-only effect can call the latest resetForm
    const resetFormRef = useRef(resetForm);
    resetFormRef.current = resetForm;

    /** Force an immediate save (useful before programmatic navigation) */
    const saveNow = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        const current = form.getValues();
        persist(current);
    }, [form, persist]);

    /**
     * Hydrate form from backend prefill API response.
     */
    const prefillFromApplication = useCallback(
        (prefillData: Record<string, any>) => {
            const merged: Record<string, unknown> = {
                ...APPLICATION_DESK_FORM_DEFAULT_VALUES,
            };

            // Map known fields from prefill
            const sanitizedData = sanitizeNulls(prefillData);
            const directFields = [
                "id", "application_id", "process_status", "application_type",
                "applicant_name", "father_name", "mother_name", "dob", "gender",
                "category", "religion", "nationality", "mobile", "email",
                "aadhaar_no", "blood_group", "address_snapshot", "guardian_snapshot",
                "father_mobile", "father_qualification", "caste", "abc_id", "apaar_id",
                "medical_condition", "disability", "allergy", "previous_school_name",
                "previous_board", "previous_marks", "has_tc", "has_government_portal",
                "government_portal_name", "documents", "class_id", "section_id",
                "transport_route_id", "transport_stop_id", "transport_amount",
                "hostel_required", "hostel_id", "hostel_room_id", "hostel_amount",
                "has_local_guardian", "discount_amount", "discount_reason", "cash_amount",
                "online_amount", "online_transaction_id", "fee_regulation_profile_id"
            ];

            for (const key of directFields) {
                if (sanitizedData[key] !== undefined && sanitizedData[key] !== null && sanitizedData[key] !== "") {
                    merged[key] = sanitizedData[key];
                }
            }

            // Handle relations
            if (prefillData.admission_head?.main_stream_id) {
                merged.stream_id = String(prefillData.admission_head.main_stream_id);
            } else if (prefillData.stream?.main_stream_id) {
                merged.stream_id = String(prefillData.stream.main_stream_id);
            } else if (prefillData.subject_preferences?._draft_stream_id) {
                merged.stream_id = String(prefillData.subject_preferences._draft_stream_id);
            }
            if (prefillData.class_id) {
                merged.class_id = String(prefillData.class_id);
            }

            form.reset(merged as any);
            persist(merged);
        },
        [form, persist],
    );

    // ── Handle fresh start from URL (runs once on mount) ──────────────
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("fresh") === "true") {
            resetFormRef.current();
            // Clean URL
            const url = new URL(window.location.href);
            url.searchParams.delete("fresh");
            window.history.replaceState({}, "", url.toString());
        }

    }, []);

    return Object.assign(form, { clearStorage, saveNow, resetForm, prefillFromApplication });
}

