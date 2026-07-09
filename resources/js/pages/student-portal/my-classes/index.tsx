import { Head, Link } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Calendar, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import lmsApi from "@/lib/api/lmsApi";
import { useRegisterGuide } from '@/components/GuideProvider';
import { STUDENT_CLASSES_GUIDE } from "@/constants/guides/studentPortal";
import Each from '@/components/Each';
;

type ClassRow = {
  id: number;
  name: string;
  code?: string | null;
  stream?: { id: number; name: string; code?: string | null } | null;
  session?: { id: number; name: string } | null;
};

const STUDENT_MY_CLASSES_BREADCRUMBS = [
  { title: "My Portal", href: "/student-portal/dashboard" },
  { title: "My Classes", href: "/student-portal/my-classes" },
];

const StudentMyClassesIndex = () => {
useRegisterGuide(STUDENT_CLASSES_GUIDE);

  const { data, isLoading } = useQuery({
    queryKey: ["lms-my-classes"],
    queryFn: () => lmsApi.classes.myClasses({ per_page: 50 }),
  });

  const classes = ((data as { data?: ClassRow[] })?.data ?? []) as ClassRow[];

  return (
    <>
      <Head title="My Classes" />
      <div className="p-4 sm:p-6 space-y-6">
        <MainPageHeader
          id="student-classes-header"
          breadcrumbs={STUDENT_MY_CLASSES_BREADCRUMBS}
          icon={Users}
          title="My Classes"
          subtitle="View your enrolled classes and course content"
        />
        {isLoading && <p className="text-muted-foreground text-sm">Loading...</p>}
        {!isLoading && classes.length === 0 && (
          <p className="text-muted-foreground">You are not enrolled in any classes yet.</p>
        )}
        {!isLoading && classes.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Each
                of={classes}
                keyExtractor={(c) => String(c.id)}
                render={(c) => (
              <Link key={c.id} href={`/student-portal/my-classes/${c.id}`}>
                <Card className="border border-border/60 hover:border-accent/50 hover:bg-muted/30 transition-colors h-full">
                  <CardContent className="p-4 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground">{c.name}</h3>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                    </div>
                    {c.code && (
                      <p className="text-sm text-muted-foreground">Code: {c.code}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-auto pt-2">
                      {c.stream && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground">
                          <BookOpen className="size-3" />
                          {c.stream.name}
                        </span>
                      )}
                      {c.session && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground">
                          <Calendar className="size-3" />
                          {c.session.name}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default StudentMyClassesIndex;
