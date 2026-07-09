import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Each from "./Each";
import { Skeleton } from "./ui/skeleton";
import { Pagination } from "./ui/pagination";
import { FileX, SearchX, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Column<T = Record<string, unknown>> {
  key: string;
  label: string;
  render?: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T = Record<string, unknown>> {
  columns: Column<T>[];
  handlePageChange?: (page: number) => void;
  handlePageSizeChange?: (size: number) => void;
  totalRecords?: number;
  currentPage?: number;
  lastPage?: number;
  pageSize?: number;
  isPaginated?: boolean;
  children?: React.ReactNode;
  maxHeight?: string;
  variant?: "default" | "glass" | "elevated" | "outline";
}

// Table Skeleton Row
function TableSkeletonRow({ columns }: { columns: number }) {
  return (
    <TableRow className="hover:bg-transparent">
      <Each
        of={Array.from({ length: columns }, (_, i) => i)}
        render={() => (
          <TableCell>
            <Skeleton className="h-4 w-full max-w-[200px]" />
          </TableCell>
        )}
      />
    </TableRow>
  );
}

// Table Skeleton Loader
function TableSkeletonLoader({
  columns,
  rows = 5,
}: {
  columns: number;
  rows?: number;
}) {
  return (
    <Each
      of={Array.from({ length: rows }, (_, i) => i)}
      render={() => <TableSkeletonRow columns={columns} />}
    />
  );
}

// Empty State Component
function TableEmptyState({
  colSpan,
  message = "No records found",
  description = "Adjust your filters or try a different search term.",
  icon: Icon = SearchX,
}: {
  colSpan: number;
  message?: string;
  description?: string;
  icon?: any;
}) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="h-[400px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center text-center p-12 max-w-md mx-auto"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative size-20 rounded-3xl bg-card border border-border/50 flex items-center justify-center">
              <Icon className="size-8 text-primary/40" />
            </div>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">{message}</h3>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {description}
          </p>
        </motion.div>
      </TableCell>
    </TableRow>
  );
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  handlePageChange,
  handlePageSizeChange,
  totalRecords = 0,
  currentPage = 1,
  lastPage = 1,
  pageSize = 10,
  isPaginated = true,
  children,
  maxHeight = "calc(100vh - 350px)",
  variant = "default",
}: DataTableProps<T>) {
  return (
    <div className="space-y-6">
      {/* Table Container */}
      <div className="relative group/table">
        <Table
          variant={variant}
          style={{ maxHeight }}
          containerClassName={cn(
            "transition-all duration-300",
            variant === "default" && "rounded-xl border border-border/50"
          )}
        >
          <TableHeader className="sticky top-0 z-30 bg-background/95 backdrop-blur-md">
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
              <Each
                of={columns}
                render={(col: Column<T>) => (
                  <TableHead 
                    key={col.key} 
                    className={cn(
                      "h-14 font-black text-[10px] uppercase tracking-[0.2em] text-primary/70",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center"
                    )}
                  >
                    {col.label}
                  </TableHead>
                )}
              />
            </TableRow>
          </TableHeader>

          <TableBody>
            {children}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {isPaginated && handlePageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={lastPage}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalRecords={totalRecords}
          showPageSize={!!handlePageSizeChange}
          className="pb-2"
        />
      )}
    </div>
  );
}

export { TableSkeletonLoader, TableEmptyState };
