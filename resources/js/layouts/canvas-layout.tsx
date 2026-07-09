import { type ReactNode } from "react";

interface CanvasLayoutProps {
    children: ReactNode;
    className?: string;
}

/**
 * CanvasLayout: A "No-UI" white-sheet layout.
 * Best for print previews, certificates, high-focus forms, or presentation modes.
 * No headers, no sidebars, no footers. Just the canvas.
 */
export default function CanvasLayout({ children, className = "" }: CanvasLayoutProps) {
    return (
        <div className={`h-full w-full overflow-y-auto bg-background print:bg-white ${className}`}>
            <main className="w-full">
                {children}
            </main>
        </div>
    );
}
