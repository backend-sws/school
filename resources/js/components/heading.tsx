import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
  icon?: ReactNode;
  category?: string;
}

export default function Heading({
  title,
  description,
  size = "md",
  icon,
  category,
  className,
  ...props
}: HeadingProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {category && (
        <div className="flex items-center gap-2 px-0.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
            {category}
          </span>
          <div className="h-[1px] w-10 bg-gradient-to-r from-primary/20 to-transparent" />
        </div>
      )}

      <div className="space-y-1.5">
        <h1
          className={cn(
            "flex items-center gap-3 font-extrabold tracking-tight text-foreground",
            size === "sm" && "text-xl",
            size === "md" && "text-2xl sm:text-3xl",
            size === "lg" && "text-3xl sm:text-4xl",
            size === "xl" && "text-4xl sm:text-5xl",
          )}
        >
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/5">
              <span className="size-5 flex items-center justify-center">{icon}</span>
            </div>
          )}
          <span>{title}</span>
        </h1>
        {description && (
          <p className="text-[15px] text-muted-foreground/90 font-medium leading-relaxed pl-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
