import { ReactNode } from "react";

export function PageLoader() {
  return (
    <div className="space-y-6 animate-pulse p-4 sm:p-6 w-full">
      <div className="h-24 bg-muted rounded-lg w-full"></div>
      <div className="flex gap-2">
        <div className="h-9 bg-muted rounded w-24"></div>
        <div className="h-9 bg-muted rounded w-24"></div>
      </div>
      <div className="h-64 bg-muted rounded-lg w-full"></div>
    </div>
  );
}
