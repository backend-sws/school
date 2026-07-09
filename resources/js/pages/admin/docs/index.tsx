import { type BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import Each from "@/components/Each";
import { BookOpen, ArrowRight } from "lucide-react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";

interface Guide {
  slug: string;
  title: string;
}

interface Props {
  guides: Guide[];
}

export default function DocsIndex({ guides }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Admin", href: "/dashboard" },
    { title: "Guides", href: "/admin/guides" },
  ];

  return (
    <>
      <Head title="Documentation Guides" />

      <div className="flex flex-col gap-6">
        <MainPageHeader
          breadcrumbs={breadcrumbs}
          icon={BookOpen}
          title="Documentation Guides"
          subtitle="Technical and workflow documentation generated from the codebase."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Each
            of={guides}
            keyExtractor={(g) => g.slug}
            render={(guide) => (
              <Link
                href={`/admin/guides/${guide.slug}`}
                className="border-border hover:border-primary/40 bg-card group flex flex-col gap-3 rounded-xl border p-5 transition-all hover:shadow-md"
              >
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="group-hover:text-primary text-sm font-semibold transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {guide.slug}.md
                  </p>
                </div>
                <div className="text-primary mt-auto flex items-center gap-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
                  Read Guide <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            )}
          />
        </div>
      </div>
    </>
  );
}
