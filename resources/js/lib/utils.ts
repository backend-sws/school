import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CSSProperties } from 'react';
import { get as lodashGet, pickBy } from 'lodash';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isSameUrl(
    url1: NonNullable<InertiaLinkProps['href']>,
    url2: NonNullable<InertiaLinkProps['href']>,
) {
    return resolveUrl(url1) === resolveUrl(url2);
}

export function resolveUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/**
 * Converts a style object with string values to a React CSSProperties object.
 * Useful for dynamically applying inline styles from configuration.
 */
export function applyInlineStyles(styles?: Record<string, string | number>): CSSProperties | undefined {
    if (!styles) return undefined;
    return styles as CSSProperties;
}

/**
 * Strips HTML tags from a string and returns plain text, truncated.
 */
export function stripHtml(html: string, maxLength = 120): string {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "").trim().slice(0, maxLength);
}

/**
 * Converts HTML (e.g. from CMS rich text) to plain text for safe display.
 * Decodes common entities then strips all tags so raw tags/entities are never shown.
 */
export function htmlToPlainText(html: string | null | undefined): string {
    if (html == null || html === '') return '';
    const s = String(html)
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;|&apos;/gi, "'");
    return s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Removes double quotes from the beginning and end of a string.
 */
export function removeDoubleQuotes(str?: string): string | undefined {
    if (!str) return undefined;
    return str.replace(/^"|"$/g, '');
}

/**
 * Calculates the serial number for paginated lists.
 * @param currentPage - Current page number (1-indexed)
 * @param perPage - Number of items per page
 * @param index - Index of the item in the current page (0-indexed)
 * @returns The serial number starting from 1
 */
export function getSerialNumber(currentPage: number, perPage: number, index: number): number {
    return (currentPage - 1) * perPage + index + 1;
}

/**
 * Parses a paginated API response from `paginatedWithMap`.
 *
 * After the axios interceptor unwraps `response.data`, useQuery returns:
 *   `{ success: true, data: T[], meta: { current_page, last_page, per_page, total } }`
 *
 * Usage:
 *   const { data: res } = useQuery({ ... });
 *   const { items, meta } = parsePaginatedResponse<FeeTypeRow>(res);
 *
 * @returns { items, meta } where meta has current_page, last_page, per_page, total
 */
export function parsePaginatedResponse<T = any>(response: any): {
    items: T[];
    meta: { current_page: number; last_page: number; per_page: number; total: number; from?: number; to?: number };
} {
    return {
        items: (response?.data ?? []) as T[],
        meta: {
            current_page: response?.meta?.current_page ?? 1,
            last_page: response?.meta?.last_page ?? 1,
            per_page: response?.meta?.per_page ?? 15,
            total: response?.meta?.total ?? 0,
            from: response?.meta?.from,
            to: response?.meta?.to,
        },
    };
}

/** Predicate: keep value for cleanFilterParams (non-empty strings, numbers, booleans, non-empty arrays, objects). */
function keepFilterParamValue(value: unknown): boolean {
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number' || typeof value === 'boolean') return true;
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined && typeof value === 'object';
}

/**
 * Cleans filter parameters for API calls.
 * - Trims whitespace from string values
 * - Removes keys with empty, null, undefined, or whitespace-only values
 * - Keeps numeric values (including 0) and boolean values
 * @param params - The filter parameters object
 * @returns A new object with only valid, non-empty parameters
 */
export function cleanFilterParams<T extends Record<string, any>>(params: T): Partial<T> {
    const withTrimmedStrings = Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, typeof v === 'string' ? (v as string).trim() : v])
    ) as T;
    return pickBy(withTrimmedStrings, keepFilterParamValue) as Partial<T>;
}

/**
 * Retrieves a nested value from an object using a dot-notation path.
 *
 * @example
 * getNestedValue({ a: { b: { c: 1 } } }, 'a.b.c') // returns 1
 * getNestedValue({ a: { b: null } }, 'a.b.c') // returns undefined
 */
export function getNestedValue<T = any>(obj: any, path: string): T | undefined {
    if (!obj || typeof path !== 'string') return undefined;
    return lodashGet(obj, path) as T | undefined;
}

/**
 * Gets values from an object with support for:
 * - Single key (string): Returns the value at that path
 * - Array of keys: Returns an object with all requested values
 * 
 * Supports nested paths using dot notation and default values.
 * Optimized for performance with path caching.
 * 
 * @param keys - String key or array of keys (supports dot notation for nested values)
 * @param source - Source object to extract values from
 * @param fallback - Default value when key is not found (default: null)
 * @param defaults - Object with default values per key
 * @returns Single value or object with values
 * 
 * @example
 * // Single key
 * get('user.name', data) // returns data.user.name or null
 * 
 * // Array of keys
 * get(['name', 'email', 'user.profile.avatar'], data) 
 * // returns { name: '...', email: '...', 'user.profile.avatar': '...' }
 * 
 * // With defaults
 * get(['name', 'age'], data, null, { age: 0 })
 */
export function get<T = any>(
    keys: string | string[],
    source: Record<string, any>,
    fallback: T | null = null,
    defaults: Record<string, T> = {}
): T | Record<string, T | null> {
    const defaultValue = fallback ?? null;

    const applyDefault = (key: string, value: any): T | null => {
        if (value !== undefined && value !== null) {
            return value as T;
        }
        return key in defaults ? defaults[key] : defaultValue;
    };

    // Single string key
    if (typeof keys === 'string') {
        const value = getNestedValue(source, keys);
        return applyDefault(keys, value) as T;
    }

    // Single-item array optimization
    if (keys.length === 1) {
        const key = keys[0];
        const value = getNestedValue(source, key);
        return applyDefault(key, value) as T;
    }

    // Multiple keys - return object
    const result: Record<string, T | null> = {};
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = getNestedValue(source, key);
        result[key] = applyDefault(key, value);
    }
    return result;
}

/**
 * Picks specific keys from an object with nested path support.
 * Useful for resetting form fields to specific values from source data.
 * 
 * @param keys - Array of keys to pick (supports dot notation)
 * @param source - Source object
 * @param defaults - Default values for missing keys
 * @returns New object with only the picked keys
 * 
 * @example
 * const formData = pick(['name', 'email', 'profile.bio'], userData, { 
 *   'profile.bio': '' 
 * });
 */
export function pick<T extends Record<string, any>>(
    keys: string[],
    source: T,
    defaults: Record<string, any> = {}
): Record<string, any> {
    const result: Record<string, any> = {};

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = getNestedValue(source, key);

        if (value !== undefined && value !== null) {
            result[key] = value;
        } else if (key in defaults) {
            result[key] = defaults[key];
        }
    }

    return result;
}

/**
 * Creates a reset function for react-hook-form that extracts specific fields
 * from source data with default values.
 * 
 * @param keys - Array of field names to reset
 * @param defaults - Default values for each field
 * @returns A function that takes source data and returns reset values
 * 
 * @example
 * const resetFn = createResetValues(['name', 'email', 'age'], { age: 0 });
 * form.reset(resetFn(apiData));
 */
export function createResetValues<T extends Record<string, any>>(
    keys: string[],
    defaults: Record<string, any> = {}
): (source: T) => Record<string, any> {
    return (source: T) => pick(keys, source, defaults);
}

// ============================================
// Analytics Utilities
// ============================================

/**
 * Formats large numbers with K, M, B suffixes
 * @example formatNumber(1234) // "1.2K"
 * @example formatNumber(1234567) // "1.2M"
 */
export function formatNumber(num: number): string {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + "B";
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
}

/**
 * Format a currency value.
 */
export function formatCurrency(value: number | string, onlyPositive = false): string {
    const num = Number(value);
    if (onlyPositive && num <= 0) return "—";
    return `₹${num.toLocaleString()}`;
}

/**
 * Calculates percentage change between two numbers
 * @example calculatePercentageChange(120, 100) // 20
 * @example calculatePercentageChange(80, 100) // -20
 */
export function calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
}

/**
 * Generates year range array
 * @example generateYearRange(5) // [2026, 2025, 2024, 2023, 2022]
 * @example generateYearRange(3, 2020) // [2020, 2019, 2018]
 */
export function generateYearRange(count: number = 5, startYear?: number): number[] {
    const start = startYear || new Date().getFullYear();
    return Array.from({ length: count }, (_, i) => start - i);
}

/**
 * Generates year options for dropdown/select components
 * Returns options in the format: { key, text, value }
 * @param minYear - Starting year (default: 1900)
 * @param maxYear - Ending year (default: 2100)
 * @param order - 'desc' for newest first, 'asc' for oldest first (default: 'desc')
 * @returns Array of year options formatted for dropdown components
 * 
 * @example
 * generateYearOptions() // Returns years from 2100 to 1900
 * generateYearOptions(2020, 2030) // Returns years from 2030 to 2020
 * generateYearOptions(2020, 2030, 'asc') // Returns years from 2020 to 2030
 */
export function generateYearOptions(
    minYear: number = 1900,
    maxYear: number = 2100,
    order: 'asc' | 'desc' = 'desc'
): Array<{ key: string; text: string; value: number }> {
    const years: Array<{ key: string; text: string; value: number }> = [];

    if (order === 'desc') {
        // Newest to oldest
        for (let year = maxYear; year >= minYear; year--) {
            years.push({
                key: String(year),
                text: String(year),
                value: year
            });
        }
    } else {
        // Oldest to newest
        for (let year = minYear; year <= maxYear; year++) {
            years.push({
                key: String(year),
                text: String(year),
                value: year
            });
        }
    }

    return years;
}

/**
 * Checks if data is empty or has no meaningful values
 * @example isEmptyAnalytics([]) // true
 * @example isEmptyAnalytics({ total: 0 }) // true
 * @example isEmptyAnalytics({ total: 10 }) // false
 */
export function isEmptyAnalytics(data: any): boolean {
    if (!data) return true;
    if (Array.isArray(data)) return data.length === 0;
    if (typeof data === 'object') {
        if ('total' in data) return data.total === 0;
        return Object.keys(data).length === 0;
    }
    return false;
}

/**
 * Auto-generates a code base on the name provided.
 * If single word: Takes first 3 characters in uppercase.
 * If multiple words: Takes first character of each word in uppercase.
 * @param name - The name to generate code from
 * @returns Generated code string
 */
export function generateCodeFromName(name: string): string {
    if (!name) return "";

    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
        return words[0].substring(0, 3).toUpperCase();
    }

    return words
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();
}

/**
 * Capitalizes the first letter of each word in a string.
 * @param str - The string to capitalize
 * @returns Capitalized string
 */
export function capitalizeWords(str: string): string {
    if (!str) return "";
    return str
        .toLowerCase()
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

// ============================================
// Card / Payment Utilities
// ============================================

/**
 * Formats a card number string with spaces every 4 digits.
 * Strips non-digit characters and caps at 16 digits.
 * @example formatCardNumber("4111111111111111") // "4111 1111 1111 1111"
 */
export function formatCardNumber(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
}

/**
 * Formats a card expiry string as MM/YY.
 * Strips non-digit characters and caps at 4 digits.
 * @example formatExpiry("1225") // "12/25"
 */
export function formatExpiry(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
}

/**
 * Extract the host (hostname + port if present) from an APP_URL string.
 * e.g. "http://lvh.me:18088" → "lvh.me:18088"
 *      "https://pdseducation.in" → "pdseducation.in"
 */
export function getAppHost(appUrl: string): string {
    try {
        const url = new URL(appUrl);
        return url.host; // includes port if present
    } catch {
        return appUrl.replace(/^https?:\/\//, "");
    }
}

// ============================================
// Fee & Payment Computation Helpers
// ============================================

interface FeeBreakdownInput {
    fees?: { amount?: number | string; category?: string }[];
    inventory_items?: { price?: number | string; quantity?: number | string }[];
    transport_amount?: number | string;
    transport_stop_id?: string | number;
    hostel_required?: boolean;
    hostel_amount?: number | string;
    discount_amount?: number | string;
}

interface FeeBreakdown {
    feeTotal: number;
    inventoryTotal: number;
    transportTotal: number;
    hostelTotal: number;
    discountTotal: number;
    grandTotal: number;
}

/**
 * Computes the fee breakdown totals from form values.
 * Single source of truth for fee, inventory, transport, hostel, and discount calculations.
 */
export function computeFeeBreakdown(values: FeeBreakdownInput): FeeBreakdown {
    const feeTotal = values.fees?.reduce((a, f) => a + (f.category === 'discount' ? -(Number(f.amount) || 0) : (Number(f.amount) || 0)), 0) ?? 0;
    const inventoryTotal = values.inventory_items?.reduce(
        (a, i) => a + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0
    ) ?? 0;
    const transportTotal = (Number(values.transport_amount) || 0);
    const hostelTotal = values.hostel_required ? (Number(values.hostel_amount) || 0) : 0;
    const discountTotal = Number(values.discount_amount) || 0;
    const grandTotal = Math.max(0, feeTotal + inventoryTotal + transportTotal + hostelTotal - discountTotal);

    return { feeTotal, inventoryTotal, transportTotal, hostelTotal, discountTotal, grandTotal };
}

interface PaymentSummaryInput {
    cash_amount?: number | string;
    online_amount?: number | string;
}

interface PaymentSummary {
    totalPaid: number;
    dueAmount: number;
}

/**
 * Computes net payment received and due amount from form values + grand total.
 */
export function computePaymentSummary(values: PaymentSummaryInput, grandTotal: number): PaymentSummary {
    const totalPaid = (Number(values.cash_amount) || 0) + (Number(values.online_amount) || 0);
    const dueAmount = Math.max(0, grandTotal - totalPaid);
    return { totalPaid, dueAmount };
}

interface AdmissionApplicationSummaryInput {
    amount?: number | string;
    transport_amount?: number | string;
    hostel_amount?: number | string;
    discount_amount?: number | string;
    cash_amount?: number | string;
    online_amount?: number | string;
    due_amount?: number | string;
}

interface AdmissionApplicationSummary {
    feeTotal: number;
    transportTotal: number;
    hostelTotal: number;
    inventoryTotal: number;
    discountTotal: number;
    cashAmount: number;
    onlineAmount: number;
    grandTotal: number;
    totalPaid: number;
    dueAmount: number;
}

/**
 * Computes a full financial summary for an admission application record.
 * This is designed for the application detail page (show.tsx) where data is flattened.
 * It handles fallback calculation for due amount if the backend value is missing or zero.
 * 
 * @param application - The application object from the API
 * @returns A consolidated financial summary object
 */
export function computeAdmissionDetailSummary(application: AdmissionApplicationSummaryInput | null | undefined): AdmissionApplicationSummary {
    if (!application) {
        return {
            feeTotal: 0,
            transportTotal: 0,
            hostelTotal: 0,
            inventoryTotal: 0,
            discountTotal: 0,
            cashAmount: 0,
            onlineAmount: 0,
            totalPaid: 0,
            dueAmount: 0,
            grandTotal: 0,
        };
    }
    const amount = Number(application.amount ?? 0);
    const transportTotal = Number(application.transport_amount ?? 0);
    const hostelTotal = Number(application.hostel_amount ?? 0);
    const discountTotal = Number(application.discount_amount ?? 0);
    const cashAmount = Number(application.cash_amount ?? 0);
    const onlineAmount = Number(application.online_amount ?? 0);

    // Extract totals from breakdown if available, otherwise fallback to amount math
    const feeBreakdown = (application as any).fee_breakdown as any[] || [];
    const inventoryTotalFromBreakdown = feeBreakdown
        .filter(item => item.type === 'inventory' || item.category === 'inventory')
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const inventoryTotal = inventoryTotalFromBreakdown || 0;
    const feeTotal = Math.max(0, amount - transportTotal - hostelTotal - inventoryTotal);

    const grandTotal = Math.max(0, feeTotal + transportTotal + hostelTotal - discountTotal);
    const totalPaid = cashAmount + onlineAmount;

    // Use backend due_amount if available and > 0, otherwise calculate it
    const dueAmount = application.due_amount && Number(application.due_amount) > 0
        ? Number(application.due_amount)
        : Math.max(0, grandTotal - totalPaid);

    return {
        feeTotal,
        transportTotal,
        hostelTotal,
        inventoryTotal,
        discountTotal,
        cashAmount,
        onlineAmount,
        grandTotal,
        totalPaid,
        dueAmount
    };
}

/**
 * Compute payment-desk totals for an admission application.
 * Returns existing payments, due, new collection total, and remaining balance.
 */
export function computePaymentDeskTotals(
    application: Record<string, any> | null | undefined,
    newPayments: { cash?: number; online?: number; cheque?: number; bank?: number },
    concessionOverride?: number
) {
    const amount = Number(application?.amount ?? 0);
    const transportAmount = Number(application?.transport_amount ?? 0);
    const hostelAmount = Number(application?.hostel_amount ?? 0);
    const admissionFee = Math.max(0, amount - transportAmount - hostelAmount);
    const subtotal = amount;
    const concession = concessionOverride !== undefined ? concessionOverride : (Number(application?.discount_amount) || 0);

    const existingCash = Number(application?.cash_amount ?? 0);
    const existingOnline = Number(application?.online_amount ?? 0);
    const alreadyPaid = existingCash + existingOnline;

    const dueAmount = Math.max(0, subtotal - concession - alreadyPaid);

    const totalCollected =
        (newPayments.cash ?? 0) +
        (newPayments.online ?? 0) +
        (newPayments.cheque ?? 0) +
        (newPayments.bank ?? 0);

    const remaining = dueAmount - totalCollected;

    return {
        admissionFee,
        subtotal,
        transportAmount,
        hostelAmount,
        concession,
        existingCash,
        existingOnline,
        alreadyPaid,
        dueAmount,
        totalCollected,
        remaining,
    };
}

/**
 * Check if an admission application is fully paid (no outstanding balance).
 */
export function computeIsFullyPaid(application: Record<string, any> | null | undefined): boolean {
    if (!application) return false;
    const amount = Number(application.amount ?? 0);
    const discount = Number(application.discount_amount) || 0;
    const existingPaid = (Number(application.cash_amount) || 0) + (Number(application.online_amount) || 0);
    return application.payment_status === "success" && Math.max(0, amount - discount - existingPaid) <= 0;
}

/**
 * Picks the next sequential section label (A, B, C … or 1, 2, 3 …) from existing sections.
 * Falls back to "A" if no existing sections are found.
 */
export function nextSectionLabel(sections: string[]): string {
    const cleaned = sections.map((s) => s.trim()).filter(Boolean);
    const letters = cleaned.filter((s) => /^[A-Z]$/i.test(s));
    const numbers = cleaned.filter((s) => /^\d+$/.test(s));
    if (letters.length > 0) {
        const max = letters.reduce((m, s) => Math.max(m, s.toUpperCase().charCodeAt(0)), 64);
        return String.fromCharCode(max + 1);
    }
    if (numbers.length > 0) {
        const max = numbers.reduce((m, s) => Math.max(m, parseInt(s, 10)), 0);
        return String(max + 1);
    }
    return "A";
}

// ============================================
// API Response & Dropdown Helpers
// ============================================

/**
 * Safely extracts a flat array from an Axios/Laravel API response.
 * Handles the three common shapes returned after the axios interceptor:
 *   - Direct array
 *   - `{ data: T[] }` (simple Laravel resource)
 *   - `{ data: { data: T[] } }` (Laravel pagination via axios)
 *
 * @example
 *   const items = extractApiList<{ id: number; name: string }>(queryData);
 */
export function extractApiList<T = any>(res: unknown): T[] {
    if (Array.isArray(res)) return res;
    const outer = (res as any)?.data;
    if (Array.isArray(outer)) return outer;
    const inner = outer?.data;
    if (Array.isArray(inner)) return inner;
    return [];
}

interface FieldOption {
    key: string;
    value: string | number;
    text: string;
}

/**
 * Transforms `{ id, name }[]` (or similarly shaped items) into dropdown-compatible
 * `{ key, value, text }[]` options.
 *
 * @param items - Source array of objects
 * @param opts  - Optional field mapping overrides (default: `{ key: 'id', value: 'id', text: 'name' }`)
 *
 * @example
 *   const options = toFieldOptions(allParticulars); // uses id → key/value, name → text
 *   const options = toFieldOptions(profiles, { text: (p) => `${p.name}${p.is_default ? ' (Default)' : ''}` });
 */
export function toFieldOptions<T extends Record<string, any>>(
    items: T[],
    opts: {
        key?: keyof T | ((item: T) => string);
        value?: keyof T | ((item: T) => string | number);
        text?: keyof T | ((item: T) => string);
    } = {},
): FieldOption[] {
    const resolveKey = opts.key ?? "id";
    const resolveValue = opts.value ?? "id";
    const resolveText = opts.text ?? "name";

    return items.map((item) => ({
        key: String(typeof resolveKey === "function" ? resolveKey(item) : item[resolveKey]),
        value: typeof resolveValue === "function" ? resolveValue(item) : item[resolveValue],
        text: String(typeof resolveText === "function" ? resolveText(item) : item[resolveText]),
    }));
}

// ============================================
// Date Formatting Helpers
// ============================================

/**
 * Converts an ISO date string (e.g. "1998-12-20T18:30:00.000000Z") to a
 * human-readable format (e.g. "20 December 1998").
 * Returns empty string for falsy/invalid inputs.
 *
 * @param dateStr - ISO date string or parseable date
 * @param locale  - Intl locale (default: "en-IN")
 * @example formatHumanDate("1998-12-20T18:30:00.000000Z") // "20 December 1998"
 */
export function formatHumanDate(dateStr: string | null | undefined, locale = "en-IN"): string {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}

// ═══════════════════════════════════════════════════════════════════
//  INVENTORY SALE HELPERS
// ═══════════════════════════════════════════════════════════════════

/**
 * Compute GST-inclusive selling price for an inventory item.
 * Single formula: base * (1 + gstRate/100), rounded to 2 decimals.
 */
export function computeGstInclusivePrice(
    basePrice: number,
    gstRate: number,
    gstInclusive: boolean,
): number {
    if (!gstInclusive || gstRate <= 0) return basePrice;
    return Math.round(basePrice * (1 + gstRate / 100) * 100) / 100;
}

/**
 * Compute line amount: qty * unitPrice, rounded to 2 decimals.
 */
export function computeLineAmount(quantity: number, unitPrice: number): number {
    return Math.round(quantity * unitPrice * 100) / 100;
}

/**
 * Detects the user's preferred language based on browser locale and timezone.
 * Defaults to "en" (English), but suggests "hi" (Hindi) for India-based users.
 * @returns { "en" | "hi" } The detected language code.
 */
export function detectUserLanguage(): "en" | "hi" {
    try {
        const locale = navigator.language || "";
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        
        // Suggest Hindi for India-based locales or timezones
        if (locale.includes("IN") || timeZone.includes("Kolkata") || timeZone.includes("India")) {
            return "hi";
        }
    } catch (e) {
        // Silently fallback on errors (e.g. non-browser environments)
    }
    
    return "en";
}

/**
 * Copies text to the clipboard with fallback support for non-secure contexts or older browsers.
 * @param text - The string to copy
 * @returns Promise resolving to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    // 1. Try modern API
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.warn("Modern clipboard API failed, trying fallback...", err);
        }
    }

    // 2. Fallback to legacy textarea approach
    try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // Ensure not visible but part of DOM
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
    } catch (err) {
        console.error("Clipboard fallback failed:", err);
        return false;
    }
}
