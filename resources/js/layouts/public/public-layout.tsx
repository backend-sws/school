import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { PublicHeader } from "./public-header";
import { PublicFooter } from "./public-footer";
import { Head } from "@inertiajs/react";
import { useLayoutContext } from "@/lib/layout-resolver";
import { brandColorOverrides } from "@/lib/utils/color";
import { PublicWebsiteProvider } from "@/providers/PublicWebsiteProvider";

interface PublicLayoutProps {
    /** Page title for browser tab */
    title?: string;
    /** Optional meta description */
    description?: string;
}

/**
 * PublicLayout — the wrapper for all public/website pages.
 *
 * Wraps children with PublicWebsiteProvider so all public pages
 * can consume website builder config (section order, etc.) from context.
 * Theme is applied globally via data-theme attribute (brand-palettes.css).
 */
export default function PublicLayout({
    children,
    title,
    description,
}: PropsWithChildren<PublicLayoutProps>) {
    const { brandColor } = useLayoutContext();

    const brandStyle = useMemo(
        () => (brandColor ? brandColorOverrides(brandColor) : undefined),
        [brandColor],
    );

    return (
        <PublicWebsiteProvider>
            {title && (
                <Head>
                    <title>{title}</title>
                    {description && <meta name="description" content={description} />}
                </Head>
            )}
            <div
                className="flex h-full flex-col bg-background text-foreground selection:bg-primary/10 selection:text-primary relative overflow-y-auto"
                style={brandStyle as React.CSSProperties | undefined}
            >
                <PublicHeader />
                <main className="flex-1 relative">{children}</main>
                <PublicFooter />
            </div>
        </PublicWebsiteProvider>
    );
}

