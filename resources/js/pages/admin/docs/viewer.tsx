import { type BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import Each from "@/components/Each";
import { BookOpen, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";

interface Guide {
  slug: string;
  title: string;
}

interface Props {
  slug: string;
  title: string;
  html: string;
  allGuides: Guide[];
}

export default function DocsViewer({ slug, title, html, allGuides }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Admin", href: "/dashboard" },
    { title: "Guides", href: "/admin/guides" },
    { title: title, href: `/admin/guides/${slug}` },
  ];

  // Initialize mermaid diagrams after mount
  useEffect(() => {
    if (!contentRef.current) return;

    const codeBlocks = contentRef.current.querySelectorAll(
      "code.language-mermaid",
    );
    if (codeBlocks.length === 0) return;

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    script.onload = () => {
      // @ts-expect-error mermaid global
      window.mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          primaryColor: "#1e293b",
          primaryTextColor: "#e2e8f0",
          lineColor: "#3b82f6",
          fontSize: "14px",
        },
      });

      codeBlocks.forEach((block, i) => {
        const pre = block.parentElement;
        if (!pre) return;
        const div = document.createElement("div");
        div.className = "mermaid";
        div.textContent = block.textContent ?? "";
        div.id = `mermaid-${i}`;
        pre.replaceWith(div);
      });

      // @ts-expect-error mermaid global
      window.mermaid.run();
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [html]);

  return (
    <>
      <Head title={title} />

      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={breadcrumbs}
          icon={BookOpen}
          title={title}
        />

        <div className="flex min-h-[calc(100vh-12rem)]">
          {/* Sidebar */}
          <aside className="border-border hidden w-64 shrink-0 border-r lg:block">
            <div className="sticky top-0 overflow-y-auto p-4">
            <h3 className="text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-wider">
              All Guides
            </h3>
            <nav className="flex flex-col gap-0.5">
              <Each
                of={allGuides}
                keyExtractor={(g) => g.slug}
                render={(guide) => (
                  <Link
                    href={`/admin/guides/${guide.slug}`}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      guide.slug === slug
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{guide.title}</span>
                    {guide.slug === slug && (
                      <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0" />
                    )}
                  </Link>
                )}
              />
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 overflow-x-hidden">
          <article className="mx-auto max-w-4xl p-6 md:p-10">
            {/* Article prose */}
            <div
              ref={contentRef}
              className="prose prose-invert prose-headings:font-bold prose-h1:text-3xl prose-h2:mt-10 prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-h3:mt-6 prose-a:text-primary prose-code:before:content-none prose-code:after:content-none prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-table:border prose-table:border-border prose-th:border prose-th:border-border prose-th:px-3 prose-th:py-2 prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2 max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </article>
        </main>
      </div>
      </div>
    </>
  );
}
