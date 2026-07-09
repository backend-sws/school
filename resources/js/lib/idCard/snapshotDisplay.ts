import type { LucideIcon } from "lucide-react";
import { User, Phone, MapPin, Droplets, IdCard as IdCardIcon } from "lucide-react";
import { FIELD_EDITOR_MAP } from "@/constants/idCard/editorConfig";
import {
    STUDENT_CARD_PLACEHOLDERS,
    STAFF_CARD_PLACEHOLDERS,
    TEMPORARY_CARD_PLACEHOLDERS,
    type PlaceholderField,
} from "@/constants/idCard/formConfig";

const PLACEHOLDERS_BY_TYPE: Record<string, PlaceholderField[]> = {
    student: STUDENT_CARD_PLACEHOLDERS,
    staff: STAFF_CARD_PLACEHOLDERS,
    temporary: TEMPORARY_CARD_PLACEHOLDERS,
};

const HIDDEN_SNAPSHOT_KEYS = new Set(["photo", "institution_logo", "qr_code", "photo_url"]);

const FIELD_ICONS: Record<string, LucideIcon> = {
    name: User,
    reg_no: IdCardIcon,
    roll_no: User,
    stream: IdCardIcon,
    department: IdCardIcon,
    session: IdCardIcon,
    dob: User,
    blood_group: Droplets,
    father_name: User,
    mother_name: User,
    mobile: Phone,
    email: User,
    address: MapPin,
    designation: User,
    employee_id: User,
    joining_date: User,
    organization: IdCardIcon,
    purpose: User,
    host_name: User,
    valid_until: IdCardIcon,
    institution_name: IdCardIcon,
};

export interface SnapshotDisplayField {
    key: string;
    label: string;
    icon: LucideIcon;
}

export function parseSnapshotData(raw: unknown): Record<string, unknown> {
    if (!raw) return {};
    if (typeof raw === "string") {
        try {
            const parsed = JSON.parse(raw);
            return typeof parsed === "object" && parsed !== null ? parsed : {};
        } catch {
            return {};
        }
    }
    if (typeof raw === "object") {
        return raw as Record<string, unknown>;
    }
    return {};
}

function humanizeKey(key: string): string {
    return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function labelForField(key: string, cardType?: string): string {
    const placeholders = PLACEHOLDERS_BY_TYPE[cardType ?? "student"] ?? STUDENT_CARD_PLACEHOLDERS;
    const fromPlaceholder = placeholders.find((p) => p.key === key)?.label;
    if (fromPlaceholder) return fromPlaceholder;
    return FIELD_EDITOR_MAP[key]?.label ?? humanizeKey(key);
}

/** Fields to show in Snapshot Data — driven by template layout + card type labels */
export function getSnapshotDisplayFields(
    cardType: string | undefined,
    frontLayout: string[] = [],
    backLayout: string[] = [],
): SnapshotDisplayField[] {
    const type = cardType ?? "student";
    const layoutKeys = [...new Set([...frontLayout, ...backLayout])].filter(
        (key) => !HIDDEN_SNAPSHOT_KEYS.has(key),
    );

    const keys = [...new Set(["name", "reg_no", ...layoutKeys])];

    return keys.map((key) => ({
        key,
        label: labelForField(key, type),
        icon: FIELD_ICONS[key] ?? User,
    }));
}

export function getSnapshotFieldValue(
    key: string,
    snapshot: Record<string, unknown>,
    card?: {
        session?: { name?: string } | null;
        valid_from?: string | null;
        valid_until?: string | null;
        institution?: { name?: string } | null;
    },
): string {
    const raw = snapshot[key];

    if (key === "session") {
        return String(raw ?? card?.session?.name ?? "").trim();
    }
    if (key === "institution_name") {
        return String(raw ?? card?.institution?.name ?? "").trim();
    }
    if (key === "valid_until") {
        return String(raw ?? card?.valid_until ?? "").trim();
    }
    if (key === "valid_from") {
        return String(raw ?? card?.valid_from ?? "").trim();
    }
    if (key === "institution_logo") {
        return raw ? "Included on card" : "";
    }

    if (raw === null || raw === undefined) return "";
    if (typeof raw === "object") return JSON.stringify(raw);
    return String(raw).trim();
}
