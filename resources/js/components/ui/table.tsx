import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const tableVariants = cva(
  "w-full caption-bottom text-sm",
  {
    variants: {
      variant: {
        default: "bg-background",
        glass: "bg-card/40 backdrop-blur-md",
        elevated: "bg-card shadow-sm border rounded-xl overflow-hidden",
        outline: "bg-transparent border-t border-b",
      }
    },
    defaultVariants: {
      variant: "default",
    }
  }
);

interface TableProps extends React.ComponentProps<"table">, VariantProps<typeof tableVariants> {
  containerClassName?: string;
}

function Table({ className, containerClassName, variant, ...props }: TableProps) {
  return (
    <div
      data-slot="table-container"
      className={cn(
        "relative w-full overflow-auto scrollbar-hide",
        variant === "elevated" && "rounded-xl border border-border shadow-sm bg-card",
        variant === "glass" && "rounded-xl border border-white/10 glass-morphism",
        containerClassName
      )}
      style={props.style}
    >
      <table
        data-slot="table"
        className={cn(tableVariants({ variant, className }))}
        {...props}
        style={undefined}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b bg-muted/20 backdrop-blur-md", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}


function TableRow({ className, ...props }: HTMLMotionProps<"tr">) {
  return (
    <motion.tr
      data-slot="table-row"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "border-b transition-all duration-200 hover:bg-primary/[0.04] data-[state=selected]:bg-primary/[0.06] group/row",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-primary h-12 px-6 text-left align-middle font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-6 py-4 text-sm font-medium text-foreground/90 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] transition-colors group-hover/row:text-foreground",
        className
      )}
      {...props}
    />
  );
}


function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
