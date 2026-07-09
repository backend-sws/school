/**
 * Formats API response data into options suitable for dropdown/select components.
 * 
 * @param res - The API response data (array or object with data array)
 * @returns Array of options with key, text, and value properties
 */
export function mapToOptions(res: unknown): { key: string; text: string; value: number }[] {
    const list = (res as { data?: unknown[] })?.data ?? (res as unknown[]) ?? [];
    const arr = Array.isArray(list) ? list : [];
    return arr.map((item: any) => ({
        key: String(item.id),
        text: `${item.name ?? item.id}${item.email ? ` – ${item.email}` : ""}`,
        value: Number(item.id),
    }));
}
