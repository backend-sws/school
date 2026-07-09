import { Card, CardContent } from "@/components/ui/card";
import Each from "@/components/Each";
import { Head, Link } from "@inertiajs/react";
import { Users, ArrowRight, Calendar, Layers } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useMemo } from "react";
import lmsApi from "@/lib/api/lmsApi";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { FilterBar } from "@/components/filter-bar";
import useSearchFilter from "@/hooks/useSearchfilter";
import { Badge } from "@/components/ui/badge";
import { useCollegeSessions } from "@/hooks/useCollegeSessions";
import { usePageConfig } from "@/hooks/usePageConfig";
import {
  LMS_CLASSES_PERMISSIONS,
  getLmsClassesContent,
  getLmsClassesBreadcrumbs,
} from "@/constants/lmsClasses/formConfig";
import { LmsClassesQueryKeys } from "@/lib/querykey/lmsClasses";
import { getClassroomsGuide } from "@/constants/guides/academic";

// ─── Types ────────────────────────────────────────────
type StreamCard = {
  id: number;
  name: string;
  code?: string | null;
  duration_years?: number | null;
  department?: { id: number; name: string; code?: string | null } | null;
  lms_classes_count?: number;
};

const PER_PAGE = 20;

// ─── Dummy getters (card page — no table or form fields) ──────────
const noopColumns = () => [] as never[];

const LmsClassesIndex = () => {
  // ─── Single source of truth ────────────────────────
  const {
    content: CONTENT,
    breadcrumbs: BREADCRUMBS,
  } = usePageConfig({
    permissions: LMS_CLASSES_PERMISSIONS,
    formFields: [],
    schema: {} as any, // no form on this card page
    getContent: getLmsClassesContent,
    getBreadcrumbs: getLmsClassesBreadcrumbs,
    getColumns: noopColumns,
    getGuide: getClassroomsGuide,
  });

  // ─── Sessions (reusable hook) ──────────────────────
  const { filterOptions: sessionOptions } = useCollegeSessions();

  // ─── Filters ────────────────────────────────────────
  const { filter, handleFilterBykey } = useSearchFilter({
    session_id: "",
    search: "",
    search_by: "name",
  });

  const selectedSessionId = filter.session_id;

  // No auto-select — default to showing all sessions

  const sessionIdParam =
    selectedSessionId !== "" ? selectedSessionId : undefined;
  const searchParam = filter.search || undefined;

  // ─── Streams (infinite scroll) ─────────────────────
  const {
    data: streamsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: LmsClassesQueryKeys.streams({
      session_id: sessionIdParam,
      search: searchParam,
    }),
    queryFn: ({ pageParam = 1 }) =>
      lmsApi.streams.index({
        per_page: PER_PAGE,
        page: pageParam,
        ...(sessionIdParam != null ? { session_id: sessionIdParam } : {}),
        ...(searchParam != null ? { search: searchParam, search_by: filter.search_by } : {}),
      }),
    getNextPageParam: (lastPage: unknown) => {
      const meta = (lastPage as { meta?: { current_page?: number; last_page?: number } })?.meta;
      if (!meta || meta.current_page == null) return undefined;
      return meta.current_page < (meta.last_page ?? 1) ? meta.current_page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: true,
  });

  const streams: StreamCard[] = useMemo(() => {
    if (!streamsData?.pages) return [];
    return streamsData.pages.flatMap(
      (page: unknown) =>
        ((page as { data?: StreamCard[] })?.data ?? []) as StreamCard[],
    );
  }, [streamsData]);

  // ─── Infinite scroll sentinel ──────────────────────
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ─── Render ────────────────────────────────────────
  return (
    <>
      <Head title={CONTENT.pageTitle} />
      <PageContainer maxWidth="2xl" className="space-y-8">
        <MainPageHeader
          id="classrooms-header"
          icon={Users}
          title={CONTENT.pageTitle}
          subtitle={CONTENT.pageSubtitle}
          breadcrumbs={BREADCRUMBS}
          guidance={CONTENT.guidance}
        />

        <section className="space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <FilterBar
              values={filter}
              onChange={(updates) => {
                if (updates.session_id !== undefined)
                  handleFilterBykey("session_id", updates.session_id);
                if (updates.search !== undefined)
                  handleFilterBykey("search", updates.search);
              }}
            >
              <FilterBar.Renderer config={{
                filters: [
                  { name: "session_id", type: "select", label: CONTENT.sessionLabel, options: sessionOptions },
                ],
                searchGroup: {
                  selectName: "search_by",
                  searchName: "search",
                  options: [
                    { value: "name", label: "Name" },
                    { value: "code", label: "Code" },
                  ],
                  placeholder: CONTENT.searchPlaceholder,
                },
              }} />
            </FilterBar>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 rounded-3xl bg-muted/40 animate-pulse border border-border/40"
                />
              ))}
            </div>
          ) : streams.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/5 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
                <Layers className="size-8" />
              </div>
              <h3 className="text-lg font-bold">{CONTENT.emptyTitle}</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-1">
                {CONTENT.emptyDesc}
              </p>
            </div>
          ) : (
            <div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              id="classrooms-grid"
            >
              <Each
                of={streams}
                keyExtractor={(stream: StreamCard) => stream.id}
                render={(stream: StreamCard) => (
                  <Link
                    href={`/lms/classes/stream/${stream.id}${sessionIdParam ? `?session_id=${sessionIdParam}` : ""}`}
                    className="block group h-full"
                  >
                    <Card className="h-full relative overflow-hidden rounded-3xl border-border/40 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 bg-card">
                      <CardContent className="p-6 flex flex-col h-full space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Layers className="size-6" />
                          </div>
                          <div className="flex size-8 items-center justify-center rounded-full bg-muted/30 opacity-0 group-hover:opacity-100 transition-all">
                            <ArrowRight className="size-4" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {stream.name}
                          </h3>
                          {stream.code && (
                            <Badge
                              variant="secondary"
                              className="bg-muted/50 text-[10px] uppercase font-bold tracking-wider"
                            >
                              {stream.code}
                            </Badge>
                          )}
                        </div>

                        <div className="mt-auto pt-4 flex flex-wrap gap-2 border-t border-border/10">
                          {stream.lms_classes_count != null && (
                            <div className="flex items-center gap-1.5 rounded-lg bg-primary/5 px-2.5 py-1 text-xs font-bold text-primary">
                              <Users className="size-3.5" />
                              {stream.lms_classes_count}{" "}
                              {CONTENT.classroomCountLabel}
                            </div>
                          )}
                          {stream.duration_years != null &&
                            stream.duration_years > 0 && (
                              <div className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1 text-xs font-bold text-muted-foreground whitespace-nowrap">
                                <Calendar className="size-3.5" />
                                {stream.duration_years} {CONTENT.durationLabel}
                              </div>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )}
              />
            </div>
          )}
        </section>

        <div
          ref={sentinelRef}
          className="h-10 w-full flex items-center justify-center"
        >
          {isFetchingNextPage && (
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </PageContainer>
    </>
  );
};

export default LmsClassesIndex;
