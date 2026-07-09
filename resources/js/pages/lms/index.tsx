import { Head, Link } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, ArrowRight } from "lucide-react";
import { LMS_GUIDELINES, LMS_TIP } from "@/constants/page/admin/lms";
import Each from "@/components/Each";
import { BreadcrumbItem } from "@/types";

type LmsLink = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
};

const LMS_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Academic Setup", href: "/lms" },
  { title: "LMS", href: "/lms" },
];

const setupLinks: LmsLink[] = [
  {
    title: "Courses",
    href: "/lms/courses",
    icon: BookOpen,
    description:
      "Create and manage LMS courses. Set scope (global, stream, department, or session) and link to class, subject, and session.",
  },
  {
    title: "Classrooms",
    href: "/lms/classes",
    icon: Users,
    description:
      "Running sections (classrooms) where assignments, tests, homework, live sessions, and recordings live. Add sections to streams and manage subjects.",
  },
];

const LmsIndex = () => {
  return (
    <>
      <Head title="LMS" />
      <div className="space-y-8">
        <MainPageHeader
          icon={BookOpen}
          title="LMS"
          subtitle="Courses and classrooms (sections and activities)"
          breadcrumbs={LMS_BREADCRUMBS}
          guidance={LMS_GUIDELINES}
          tip={LMS_TIP}
        />

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Setup</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Each
              of={setupLinks}
              keyExtractor={(item) => item.href}
              render={({ title, href, icon: Icon, description }) => (
                <Link href={href} className="block h-full group">
                  <Card className="h-full border border-border/60 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 group-focus-visible:ring-2 group-focus-visible:ring-ring">
                    <CardContent className="p-5 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/10">
                          <Icon className="size-5" />
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" aria-hidden />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">{title}</p>
                        <p className="text-sm text-muted-foreground leading-snug">{description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default LmsIndex;
