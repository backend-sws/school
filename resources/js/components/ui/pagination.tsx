import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "./button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize?: number;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
    totalRecords?: number;
    showPageNumbers?: boolean;
    showFirstLast?: boolean;
    showPageSize?: boolean;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    pageSize = 10,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 15, 25],
    totalRecords,
    showPageNumbers = true,
    showFirstLast = true,
    showPageSize = true,
    className,
}: PaginationProps) {
    // Generate array of page numbers to show
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push("...");
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }

            if (currentPage < totalPages - 2) {
                pages.push("...");
            }

            if (!pages.includes(totalPages)) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const canGoPrev = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    // Calculate record range
    const startRecord = (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, totalRecords || currentPage * pageSize);

    if (totalPages <= 1 && !showPageSize) return null;

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2", className)}>
            {/* Left Side - Page Size & Info */}
            <div className="flex items-center gap-6">
                {/* Page Size Selector */}
                {showPageSize && onPageSizeChange && (
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Show</span>
                        <Select
                            value={String(pageSize)}
                            onValueChange={(value) => onPageSizeChange(Number(value))}
                        >
                            <SelectTrigger className="h-9 w-[75px] rounded-xl border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors font-bold text-xs ring-offset-background focus:ring-1 focus:ring-primary/20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/50 bg-card/95 backdrop-blur-xl">
                                {pageSizeOptions.map((size) => (
                                    <SelectItem key={size} value={String(size)} className="text-xs font-bold rounded-lg m-1">
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">per page</span>
                    </div>
                )}

                {/* Records Info */}
                {totalRecords !== undefined && (
                    <div className="text-[11px] font-bold text-muted-foreground/80 hidden lg:block tracking-tight">
                        Displaying <span className="text-foreground px-1">{startRecord}</span>
                        <span className="text-muted-foreground/40 font-medium mx-1">—</span>
                        <span className="text-foreground px-1">{endRecord}</span>
                        <span className="text-muted-foreground/40 font-medium mx-1">of</span>
                        <span className="text-foreground px-1">{totalRecords}</span>
                        <span className="ml-1 uppercase tracking-widest text-[9px] opacity-60">Results</span>
                    </div>
                )}
            </div>

            {/* Right Side - Pagination Controls */}
            <div className="flex items-center gap-1 p-1 bg-card/40 backdrop-blur-md rounded-2xl border border-border/40">
                {/* First Page */}
                {showFirstLast && (
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onPageChange(1)}
                        disabled={!canGoPrev}
                        className="size-9 rounded-xl text-muted-foreground/40 hover:text-primary transition-all hover:bg-primary/5 disabled:opacity-20"
                    >
                        <ChevronsLeft className="size-4" />
                    </Button>
                )}

                {/* Previous */}
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!canGoPrev}
                    className="size-9 rounded-xl text-muted-foreground/40 hover:text-primary transition-all hover:bg-primary/5 disabled:opacity-20"
                >
                    <ChevronLeft className="size-4" />
                </Button>

                {/* Page Numbers */}
                {showPageNumbers && totalPages >= 1 && (
                    <div className="flex items-center gap-1 mx-1">
                        {getPageNumbers().map((page, index) =>
                            typeof page === "string" ? (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="w-8 h-9 flex items-center justify-center text-muted-foreground/30 text-[10px] font-black tracking-widest"
                                >
                                    •••
                                </span>
                            ) : (
                                <Button
                                    key={page}
                                    variant={page === currentPage ? "default" : "ghost"}
                                    size="icon-sm"
                                    onClick={() => onPageChange(page)}
                                    className={cn(
                                        "size-9 text-xs font-black rounded-xl transition-all duration-300",
                                        page === currentPage
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                            : "text-muted-foreground/60 hover:bg-primary/5 hover:text-primary"
                                    )}
                                >
                                    {page}
                                </Button>
                            )
                        )}
                    </div>
                )}

                {/* Next */}
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!canGoNext}
                    className="size-9 rounded-xl text-muted-foreground/40 hover:text-primary transition-all hover:bg-primary/5 disabled:opacity-20"
                >
                    <ChevronRight className="size-4" />
                </Button>

                {/* Last Page */}
                {showFirstLast && (
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onPageChange(totalPages)}
                        disabled={!canGoNext}
                        className="size-9 rounded-xl text-muted-foreground/40 hover:text-primary transition-all hover:bg-primary/5 disabled:opacity-20"
                    >
                        <ChevronsRight className="size-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}

// Simple pagination with just prev/next
interface SimplePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function SimplePagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: SimplePaginationProps) {
    const canGoPrev = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    if (totalPages <= 1) return null;

    return (
        <div className={cn("flex items-center justify-center gap-4 py-4", className)}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!canGoPrev}
                className="gap-2 rounded-xl border-border/50 bg-card hover:bg-primary/5 hover:text-primary transition-all font-bold text-xs h-9 px-4 disabled:opacity-30"
            >
                <ChevronLeft className="size-3.5 stroke-[2.5]" />
                Previous
            </Button>

            <div className="flex items-center justify-center px-6 py-2 bg-primary/[0.03] border border-primary/10 rounded-xl">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mr-2">Page</span>
                <span className="text-sm font-black text-primary">{currentPage}</span>
                <span className="text-primary/20 font-medium mx-2">—</span>
                <span className="text-sm font-bold text-primary/60">{totalPages}</span>
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!canGoNext}
                className="gap-2 rounded-xl border-border/50 bg-card hover:bg-primary/5 hover:text-primary transition-all font-bold text-xs h-9 px-4 disabled:opacity-30"
            >
                Next
                <ChevronRight className="size-3.5 stroke-[2.5]" />
            </Button>
        </div>
    );
}
