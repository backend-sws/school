import { z } from "zod";
import {
  safeRequiredString,
  safeOptionalString,
} from "./common";

export const LibraryBookFormSchema = z.object({
  title: safeRequiredString(300, "Title is required"),
  author: safeOptionalString(200, "Author"),
  isbn: safeOptionalString(50, "ISBN"),
  edition: safeOptionalString(50, "Edition"),
  description: safeOptionalString(2000, "Description"),
});

export type LibraryBookFormValues = z.infer<typeof LibraryBookFormSchema>;

export const LibraryCopyFormSchema = z.object({
  library_book_id: z.union([
    z.string().min(1, "Book is required"),
    z.coerce.number().int().positive("Book is required"),
  ]),
  barcode: safeOptionalString(80, "Barcode"),
  shelf_location: safeOptionalString(100, "Shelf location"),
  condition: safeOptionalString(50, "Condition"),
});

export type LibraryCopyFormValues = z.infer<typeof LibraryCopyFormSchema>;

/** For edit page: only barcode, shelf_location, condition (no library_book_id) */
export const LibraryCopyUpdateFormSchema = z.object({
  barcode: safeOptionalString(80, "Barcode"),
  shelf_location: safeOptionalString(100, "Shelf location"),
  condition: safeOptionalString(50, "Condition"),
});

export type LibraryCopyUpdateFormValues = z.infer<typeof LibraryCopyUpdateFormSchema>;

export const LibraryIssueFormSchema = z.object({
  library_copy_id: z.union([
    z.string().min(1, "Copy is required"),
    z.coerce.number().int().positive("Copy is required"),
  ]),
  user_id: z.union([
    z.string().min(1, "User ID is required"),
    z.coerce.number().int().positive("User ID is required"),
  ]),
  due_at: z.string().min(1, "Due date is required"),
  remarks: safeOptionalString(500, "Remarks"),
});

export type LibraryIssueFormValues = z.infer<typeof LibraryIssueFormSchema>;
