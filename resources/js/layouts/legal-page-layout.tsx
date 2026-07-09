import ReactMarkdown from "react-markdown";
import { AppBrand } from "@/components/AppBrand";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface LegalPageLayoutProps {
  /** Page title for <Head> */
  title: string;
  /** Raw markdown string from the backend */
  content: string;
  /** Extra wrapper class */
  className?: string;
}

/**
 * Reusable layout for legal/policy pages.
 * Renders markdown content with proper typography styling.
 */
export default function LegalPageLayout({
  title,
  content,
  className,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-svh bg-gradient-to-br from-background via-background to-primary/[0.02]">
      <Head title={title} />

      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>
          <AppBrand size="sm" />
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Content */}
      <main
        className={cn(
          "mx-auto max-w-3xl px-6 py-10 sm:py-14",
          className,
        )}
      >
        <article className="prose prose-slate dark:prose-invert prose-headings:font-extrabold prose-headings:tracking-tight prose-h1:text-3xl prose-h1:mb-4 prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3 prose-h3:text-base prose-h3:mt-6 prose-p:text-sm prose-p:leading-relaxed prose-p:text-muted-foreground prose-li:text-sm prose-li:text-muted-foreground prose-strong:text-foreground prose-table:text-sm prose-th:text-left prose-th:py-2 prose-th:px-3 prose-th:font-semibold prose-td:py-2 prose-td:px-3 prose-hr:my-6 prose-hr:border-border/50 max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6">
        <div className="mx-auto max-w-3xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-muted-foreground/60">
          <p>&copy; {new Date().getFullYear()} PDS Education Technologies Pvt. Ltd.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
