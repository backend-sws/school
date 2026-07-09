import type { BreadcrumbItem, AsyncSelectConfig } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";
import libraryApi from "@/lib/api/libraryApi";
import { LibraryQueryKeys } from "@/lib/querykey/library";

export const LIBRARY_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Library Desk", href: "/library/books" },
];

export const LIBRARY_BOOKS_BREADCRUMBS: BreadcrumbItem[] = [
  ...LIBRARY_BREADCRUMBS,
  { title: "Books", href: "/library/books" },
];

export const LIBRARY_COPIES_BREADCRUMBS: BreadcrumbItem[] = [
  ...LIBRARY_BREADCRUMBS,
  { title: "Copies", href: "/library/copies" },
];

export const LIBRARY_ISSUES_BREADCRUMBS: BreadcrumbItem[] = [
  ...LIBRARY_BREADCRUMBS,
  { title: "Issues & Returns", href: "/library/issues" },
];

export const LIBRARY_OVERDUE_BREADCRUMBS: BreadcrumbItem[] = [
  ...LIBRARY_BREADCRUMBS,
  { title: "Overdue", href: "/library/reports/overdue" },
];

export const LIBRARY_GUIDELINES = [
  "Manage the book catalog, physical copies, and issue/return transactions.",
  "Books are titles; copies are physical units. Issue and return operate on copies.",
];

export const LIBRARY_TIP = "Use Barcode scanning during issue/return to minimize manual entry errors and speed up the desk workflow.";

export const LIBRARY_BOOKS_GUIDELINES = [
  "Add book titles (author, ISBN, edition). Create copies for each physical unit.",
];

export const LIBRARY_COPIES_GUIDELINES = [
  "Each copy belongs to a book. Use barcode and shelf location for tracking. Issue/return from the Issues page.",
];

export const LIBRARY_ISSUES_GUIDELINES = [
  "Issue books to users (students/staff). Set due date. Record return to free the copy.",
];

// ─── Table columns ───────────────────────────────────────────────────────
export const LIBRARY_BOOKS_TABLE_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "title", label: "Title" },
  { key: "author", label: "Author" },
  { key: "isbn", label: "ISBN" },
  { key: "copies_count", label: "Copies" },
  { key: "action", label: "Actions" },
];

export const LIBRARY_COPIES_TABLE_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "book", label: "Book" },
  { key: "barcode", label: "Barcode" },
  { key: "shelf_location", label: "Shelf" },
  { key: "is_available", label: "Status" },
  { key: "action", label: "Actions" },
];

export const LIBRARY_ISSUES_TABLE_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "book", label: "Book" },
  { key: "borrower", label: "Borrower" },
  { key: "issued_at", label: "Issued" },
  { key: "due_at", label: "Due" },
  { key: "returned_at", label: "Returned" },
  { key: "action", label: "Actions" },
];

// ─── Book form ───────────────────────────────────────────────────────────
export const LIBRARY_BOOK_FORM_INITIAL = {
  title: "",
  author: "",
  isbn: "",
  edition: "",
  description: "",
};

export const LIBRARY_BOOK_FORM_LAYOUT = [
  {
    name: "title",
    label: "Title",
    type: FORM_TYPE.TEXT,
    placeholder: "Book title",
    required: true,
    maxLength: 300,
    tooltip: "Title of the book.",
  },
  {
    name: "author",
    label: "Author",
    type: FORM_TYPE.TEXT,
    placeholder: "Author name",
    maxLength: 200,
    tooltip: "Author(s) of the book.",
  },
  {
    name: "isbn",
    label: "ISBN",
    type: FORM_TYPE.TEXT,
    placeholder: "ISBN",
    maxLength: 50,
    tooltip: "International Standard Book Number.",
  },
  {
    name: "edition",
    label: "Edition",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. 2nd",
    maxLength: 50,
    tooltip: "Edition of the book.",
  },
  {
    name: "description",
    label: "Description",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "Optional description",
    rows: 3,
    tooltip: "Optional description or notes.",
  },
];

// ─── Copy form ───────────────────────────────────────────────────────────
export const LIBRARY_COPY_FORM_INITIAL = {
  library_book_id: "" as string | number,
  barcode: "",
  shelf_location: "",
  condition: "",
};

export const LIBRARY_COPY_FORM_LAYOUT = [
  {
    name: "library_book_id",
    label: "Book",
    type: FORM_TYPE.ASYNC_SELECT,
    placeholder: "Select book",
    required: true,
    asyncConfig: {
      queryFn: (params: Record<string, any>) => libraryApi.books.index(params),
      queryKey: LibraryQueryKeys.all,
      labelKey: "title",
      valueKey: "id",
    } as AsyncSelectConfig,
    tooltip: "Book title this copy belongs to.",
  },
  {
    name: "barcode",
    label: "Barcode",
    type: FORM_TYPE.TEXT,
    placeholder: "Optional barcode",
    maxLength: 80,
    tooltip: "Barcode for scanning. Optional.",
  },
  {
    name: "shelf_location",
    label: "Shelf location",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. A-12",
    maxLength: 100,
    tooltip: "Physical shelf or location.",
  },
  {
    name: "condition",
    label: "Condition",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. good, damaged",
    maxLength: 50,
    tooltip: "Condition of this copy.",
  },
];

// ─── Issue form (dialog) ───────────────────────────────────────────────────
export const LIBRARY_ISSUE_FORM_INITIAL = {
  library_copy_id: "" as string | number,
  user_id: "" as string | number,
  due_at: "",
  remarks: "",
};

export const LIBRARY_ISSUE_FORM_LAYOUT = [
  {
    name: "library_copy_id",
    label: "Copy",
    type: FORM_TYPE.SELECT,
    placeholder: "Select copy",
    required: true,
    options: [] as { value: string; label: string }[],
    tooltip: "Available copy to issue.",
  },
  {
    name: "user_id",
    label: "User ID (borrower)",
    type: FORM_TYPE.NUMBER_TEXT,
    placeholder: "User ID",
    required: true,
    tooltip: "User ID of the borrower (student or staff).",
  },
  {
    name: "due_at",
    label: "Due date",
    type: FORM_TYPE.DATE,
    required: true,
    tooltip: "Date by which the book must be returned.",
  },
  {
    name: "remarks",
    label: "Remarks",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "Optional",
    rows: 2,
    tooltip: "Optional notes for this issue.",
  },
];
