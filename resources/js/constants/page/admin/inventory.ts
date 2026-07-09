import type { BreadcrumbItem, AsyncSelectConfig } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";
import inventoryApi from "@/lib/api/inventoryApi";
import StudentApi from "@/lib/api/studentApi";
import { InventoryQueryKeys } from "@/lib/querykey/inventory";
import { StudentQueryKeys } from "@/lib/querykey/student";

export const INVENTORY_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Inventory", href: "/inventory" },
  { title: "Overview", href: "/inventory" },
];

export const INVENTORY_CATEGORIES_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Inventory", href: "/inventory" },
  { title: "Categories", href: "/inventory/categories" },
];

export const INVENTORY_ITEMS_BREADCRUMBS: BreadcrumbItem[] = [
  ...INVENTORY_BREADCRUMBS,
  { title: "Items", href: "/inventory/items" },
];

export const INVENTORY_LOCATIONS_BREADCRUMBS: BreadcrumbItem[] = [
  ...INVENTORY_BREADCRUMBS,
  { title: "Locations", href: "/inventory/locations" },
];

export const INVENTORY_MOVEMENTS_BREADCRUMBS: BreadcrumbItem[] = [
  ...INVENTORY_BREADCRUMBS,
  { title: "Movements", href: "/inventory/movements" },
];

export const INVENTORY_LOW_STOCK_BREADCRUMBS: BreadcrumbItem[] = [
  ...INVENTORY_BREADCRUMBS,
  { title: "Low Stock", href: "/inventory/reports/low-stock" },
];

export const INVENTORY_SALES_BREADCRUMBS: BreadcrumbItem[] = [
  ...INVENTORY_BREADCRUMBS,
  { title: "Sales", href: "/inventory/sales" },
];

/** Buyer type options for Point of Sale */
export const INVENTORY_SALE_BUYER_TYPES = [
  { key: "student", text: "Student", value: "student" },
  { key: "parent", text: "Parent", value: "parent" },
  { key: "other", text: "Other (Walk-in)", value: "other" },
];

export const INVENTORY_SALES_GUIDELINES = [
  "Sell inventory items to students, parents, or walk-in customers.",
  "Payment is recorded via the fee module; collect payment to complete the sale and reduce stock.",
];

/** Guidance text for MainPageHeader (same pattern as department/organization pages). */
export const INVENTORY_GUIDELINES = [
  "Manage asset categories, items, and stock levels per institution.",
  "Record movements (issue, return, receive, adjust) to keep quantities up to date.",
];

export const INVENTORY_TIP = "Set 'Min Stock' levels for critical items to see them automatically in the Low Stock report when they need restocking.";

export const INVENTORY_CATEGORIES_GUIDELINES = [
  "Categories group items (e.g. Lab Equipment, Stationery, IT Assets).",
  "Delete only when the category has no items, or reassign items first.",
];

export const INVENTORY_ITEMS_GUIDELINES = [
  "Each item belongs to a category and has a current quantity and min-stock threshold.",
  "Use Stock Movements to issue, receive, or adjust quantities.",
];

export const INVENTORY_LOCATIONS_GUIDELINES = [
  "Define storage locations (e.g. Store Room A, Lab 2).",
  "Select a location when adding or editing an inventory item.",
];

// ─── Location dialog form ─────────────────────────────────────────────────
export const INVENTORY_LOCATION_FORM_INITIAL = {
  name: "",
  code: "",
};

export const INVENTORY_LOCATION_DIALOG_FORM_LAYOUT = [
  {
    name: "name",
    label: "Name",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Store Room A",
    required: true,
    maxLength: 150,
    tooltip: "Display name for this location.",
  },
  {
    name: "code",
    label: "Code",
    type: FORM_TYPE.TEXT,
    placeholder: "Optional short code",
    maxLength: 50,
    tooltip: "Short code for reports. Leave blank if not needed.",
  },
];

export const INVENTORY_MOVEMENTS_GUIDELINES = [
  "Record issue (out), return, receive (in), or adjust to correct stock.",
  "Quantity after each movement is stored for audit.",
];

export const INVENTORY_LOW_STOCK_GUIDELINES = [
  "Items shown have current quantity at or below their minimum stock level.",
  "Use this list to reorder or adjust stock.",
];

// ─── Category dialog form ─────────────────────────────────────────────────
export const INVENTORY_CATEGORY_FORM_INITIAL = {
  name: "",
  code: "",
  description: "",
};

export const INVENTORY_CATEGORY_DIALOG_FORM_LAYOUT = [
  {
    name: "name",
    label: "Name",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Lab Equipment",
    required: true,
    maxLength: 100,
    tooltip: "Display name for this category (e.g. Lab Equipment, Stationery).",
  },
  {
    name: "code",
    label: "Code",
    type: FORM_TYPE.TEXT,
    placeholder: "Optional short code",
    maxLength: 50,
    tooltip: "Short code for reports or imports. Leave blank if not needed.",
  },
  {
    name: "description",
    label: "Description",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "Optional description",
    rows: 3,
    tooltip: "Optional notes about this category.",
  },
];

// ─── Item dialog form (category options injected in component) ─────────────
export const INVENTORY_ITEM_FORM_INITIAL = {
  inventory_category_id: "" as number | "",
  name: "",
  code: "",
  unit: "piece",
  min_stock: "" as number | "",
  purchase_price: "" as number | "",
  selling_price: "" as number | "",
  margin_percentage: "" as number | "",
  gst_rate: "" as number | "",
  hsn_code: "",
  location: "",
  description: "",
  is_active: true,
};

/** Item details (top section): category, name, code, unit, stock, location, description, active */
export const INVENTORY_ITEM_DIALOG_FORM_LAYOUT_DETAILS = [
  {
    name: "inventory_category_id",
    label: "Category",
    type: FORM_TYPE.SELECT,
    searchable: true,
    placeholder: "Select category",
    required: true,
    tooltip: "Category this item belongs to (e.g. Lab Equipment, Stationery).",
  },
  {
    name: "name",
    label: "Name",
    type: FORM_TYPE.TEXT,
    placeholder: "Item name",
    required: true,
    maxLength: 200,
    tooltip: "Display name of the item.",
  },
  {
    name: "code",
    label: "Code",
    type: FORM_TYPE.TEXT,
    placeholder: "SKU / code",
    maxLength: 80,
    tooltip: "SKU or internal code for this item. Optional.",
  },
  {
    name: "unit",
    label: "Unit",
    type: FORM_TYPE.TEXT,
    placeholder: "piece, box, set...",
    maxLength: 20,
    tooltip: "Unit of measure (e.g. piece, box, set, kg).",
  },
  {
    name: "min_stock",
    label: "Min stock",
    type: FORM_TYPE.NUMBER_TEXT,
    placeholder: "0",
    tooltip: "Alert when quantity falls at or below this level. Use 0 to disable.",
  },
  {
    name: "location",
    label: "Location",
    type: FORM_TYPE.SELECT,
    searchable: true,
    placeholder: "Select location",
    tooltip: "Storage location. Define locations in Inventory → Locations.",
  },
  {
    name: "description",
    label: "Description",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "Optional",
    rows: 2,
    maxLength: 500,
    tooltip: "Optional notes or specs. Max 500 characters.",
  },
];

/** Pricing, margin & final price (bottom section) */
export const INVENTORY_ITEM_DIALOG_FORM_LAYOUT_PRICING = [
  {
    name: "purchase_price",
    label: "Purchase price (₹)",
    type: FORM_TYPE.NUMBER_TEXT,
    placeholder: "0.00",
    tooltip: "Cost price per unit for margin and GST planning.",
  },
  {
    name: "selling_price",
    label: "Selling price (₹)",
    type: FORM_TYPE.NUMBER_TEXT,
    placeholder: "0.00",
    tooltip: "Default sale price per unit (exclusive of GST). Used when creating a sale line.",
  },
  {
    name: "margin_percentage",
    label: "Margin %",
    type: FORM_TYPE.NUMBER_TEXT,
    placeholder: "0",
    tooltip: "Target or actual margin %: (Selling − Purchase) / Purchase × 100. For planning.",
  },
  {
    name: "gst_rate",
    label: "GST rate (%)",
    type: FORM_TYPE.NUMBER_TEXT,
    placeholder: "0",
    tooltip: "GST slab for this item (e.g. 0, 5, 12, 18, 28). For invoicing and planning.",
  },
  {
    name: "hsn_code",
    label: "HSN code",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. 8471",
    maxLength: 20,
    tooltip: "HSN code for GST compliance. Optional.",
  },
];

/** Combined layout (for any code that still expects a single array) */
export const INVENTORY_ITEM_DIALOG_FORM_LAYOUT = [
  ...INVENTORY_ITEM_DIALOG_FORM_LAYOUT_DETAILS,
  ...INVENTORY_ITEM_DIALOG_FORM_LAYOUT_PRICING,
];

// ─── Movement dialog (item options injected in component) ───────────────────
export const INVENTORY_MOVEMENT_FORM_INITIAL = {
  inventory_item_id: "" as number | "",
  type: "receive" as const,
  quantity: 0,
  remarks: "",
};

export const INVENTORY_MOVEMENT_TYPE_OPTIONS = [
  { key: "receive", text: "Receive", value: "receive" },
  { key: "issue", text: "Issue", value: "issue" },
  { key: "return", text: "Return", value: "return" },
  { key: "adjust", text: "Adjust", value: "adjust" },
];

export const INVENTORY_MOVEMENT_DIALOG_FORM_LAYOUT = [
  {
    name: "inventory_item_id",
    label: "Item",
    type: FORM_TYPE.SELECT,
    searchable: true,
    placeholder: "Select item",
    required: true,
    tooltip: "Select the inventory item this movement applies to.",
  },
  {
    name: "type",
    label: "Type",
    type: FORM_TYPE.SELECT,
    placeholder: "Select type",
    required: true,
    options: INVENTORY_MOVEMENT_TYPE_OPTIONS,
    tooltip: "Receive = stock in; Issue = stock out; Return = back from use; Adjust = correction.",
  },
  {
    name: "quantity",
    label: "Quantity",
    type: FORM_TYPE.NUMBER_TEXT,
    placeholder: "e.g. 10 or -5 for issue",
    required: true,
    tooltip: "Positive for receive/return, negative for issue. Adjust can be + or -.",
  },
  {
    name: "remarks",
    label: "Remarks",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "Optional",
    rows: 2,
    tooltip: "Optional note (e.g. reason for adjust, recipient for issue).",
  },
];

// ─── Sale dialog form (buyer section + line-add row via layout) ─────────────────
export const INVENTORY_SALE_FORM_INITIAL = {
  buyer_type: "student" as const,
  user_id: "" as number | "",
  buyer_name: "",
  remarks: "",
  lines: [] as { inventory_item_id: number; quantity: number; unit_price: number }[],
  gst_inclusive: false,
  new_item_id: "" as number | "",
  new_qty: 1 as number | "",
  new_unit_price: "" as number | "",
};

/** Layout for "add line" row: GST checkbox + Item, Qty, Unit price (options injected in dialog). */
export const INVENTORY_SALE_LINE_ADD_LAYOUT = [
  {
    name: "gst_inclusive",
    label: "GST inclusive",
    type: FORM_TYPE.CHECKBOX,
    helperText: "When on, unit price uses item's selling price + GST.",
    tooltip: "Unit price includes GST when checked.",
  },
  {
    name: "new_item_id",
    label: "Item",
    type: FORM_TYPE.SELECT,
    placeholder: "Select item",
    options: [] as { key: string; text: string; value: string }[],
    tooltip: "Choose an inventory item to add.",
  },
  {
    name: "new_qty",
    label: "Qty",
    type: FORM_TYPE.NUMBER_TEXT,
    placeholder: "1",
    tooltip: "Quantity to sell.",
  },
  {
    name: "new_unit_price",
    label: "Unit price",
    type: FORM_TYPE.NUMBER_TEXT,
    placeholder: "—",
    tooltip: "Auto-filled from item; include GST if GST inclusive is on.",
  },
];

/** Async config for searching students/parents in buyer fields */
export const STUDENT_BUYER_ASYNC_CONFIG = {
  queryFn: (params: Record<string, any>) => StudentApi.getStudentList(params),
  queryKey: StudentQueryKeys.all,
  labelKey: "name",
  valueKey: "id",
} as AsyncSelectConfig;

export const INVENTORY_SALE_DIALOG_FORM_LAYOUT = [
  {
    name: "buyer_type",
    label: "Buyer type",
    type: FORM_TYPE.SELECT,
    placeholder: "Select buyer type",
    required: true,
    options: INVENTORY_SALE_BUYER_TYPES,
    tooltip: "Student or parent links the sale to a user; Other is for walk-in customers.",
  },
  {
    name: "user_id",
    label: "Student / Parent",
    type: FORM_TYPE.ASYNC_SELECT,
    placeholder: "Search student by name or ID",
    asyncConfig: STUDENT_BUYER_ASYNC_CONFIG,
    tooltip: "Required when buyer is student or parent. Search and select from the list.",
  },
  {
    name: "buyer_name",
    label: "Buyer name",
    type: FORM_TYPE.TEXT,
    placeholder: "Loads from user ID or enter name",
    tooltip: "For student/parent: auto-filled when user is loaded; editable. For Other: enter walk-in customer name.",
  },
  {
    name: "remarks",
    label: "Remarks (optional)",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "Optional notes",
    rows: 3,
    tooltip: "Optional note for this sale.",
  },
];
