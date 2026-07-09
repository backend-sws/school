export const InventoryQueryKeys = {
    all: ["inventory"] as const,
    categories: (filters?: Record<string, unknown>) =>
        ["inventory-categories", ...(filters ? [filters] : [])] as const,
    categoriesList: () => ["inventory-categories-list"] as const,
    category: (id: number | string) =>
        ["inventory-category", id] as const,
    items: (filters?: Record<string, unknown>) =>
        ["inventory-items", ...(filters ? [filters] : [])] as const,
    itemsList: () => ["inventory-items-list"] as const,
    item: (id: number | string) =>
        ["inventory-item", id] as const,
    locations: (filters?: Record<string, unknown>) =>
        ["inventory-locations", ...(filters ? [filters] : [])] as const,
    movements: (filters?: Record<string, unknown>) =>
        ["inventory-movements", ...(filters ? [filters] : [])] as const,
    sales: (filters?: Record<string, unknown>) =>
        ["inventory-sales", ...(filters ? [filters] : [])] as const,
    sale: (id: number | string) =>
        ["inventory-sale", id] as const,
    lowStock: (filters?: Record<string, unknown>) =>
        ["inventory-low-stock", ...(filters ? [filters] : [])] as const,
};
