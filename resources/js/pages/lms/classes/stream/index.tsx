import React, { useMemo } from "react";
import FullPageLayout from "@/layouts/full-page-layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import Each from "@/components/Each";
import { Users, ArrowRight, Hash, GraduationCap, Layers } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@/hooks/useDisclosure";
import lmsApi from "@/lib/api/lmsApi";
import streamApi from "@/lib/api/streamApi";
import { LmsClassDialog, type LmsClassDialogData } from "@/components/admin/lmsClassDialog";
import { PermissionGate } from "@/components/PermissionGate";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { FilterBar } from "@/components/filter-bar";
import { DashedCard } from "@/components/shared/DashedCard";
import { Badge } from "@/components/ui/badge";
import { CardGridEmptyState, CardGridSkeleton } from "@/components/shared/CardGridStates";
import useSearchFilter from "@/hooks/useSearchfilter";
import { nextSectionLabel } from "@/lib/utils";
import { usePageConfig } from "@/hooks/usePageConfig";
import {
  getLmsStreamDetailContent,
  getLmsStreamDetailBreadcrumbs,
  LMS_CLASSES_PERMISSIONS,
} from "@/constants/lmsClasses/formConfig";
import { LmsClassesQueryKeys } from "@/lib/querykey/lmsClasses";
import { getStreamSectionsGuide } from "@/constants/guides/academic";

// ─── Types ────────────────────────────────────────────
type StreamDetail = { id: number; name: string; code?: string | null; department?: { id: number; name: string } | null };
type ClassRow = {
  id: number;
  name: string;
  code?: string | null;
  section?: string | null;
  class_teacher?: { id: number; name: string } | null;
  enrollments_count?: number;
  session?: { id: number; name: string } | null;
  fee_collection_frequency?: string | null;
  status?: number;
};

// ─── Dummy getters (card-grid – no table or form fields) ─────────
const noopColumns = () => [] as never[];

const LmsStreamClassesIndex = () => {
  const { props } = usePage();
  const streamId = (props as { streamId?: number }).streamId as number;

  // ─── Single source of truth (usePageConfig) ────────
  const {
    content: CONTENT,
    contentMap,
    canCreate,
  } = usePageConfig({
    permissions: LMS_CLASSES_PERMISSIONS,
    formFields: [],
    schema: {} as any, // no form on this card page
    getContent: getLmsStreamDetailContent,
    getBreadcrumbs: (c) => getLmsStreamDetailBreadcrumbs(c),
    getColumns: noopColumns,
    getGuide: getStreamSectionsGuide,
  });

  // ─── Filters ────────────────────────────────────────
  const { filter, handleFilterBykey } = useSearchFilter({
    session_id: (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("session_id") : "") || "",
    search: "",
  });
  const sessionId = filter.session_id ? Number(filter.session_id) : undefined;

  const dialogDisclosure = useDisclosure<LmsClassDialogData>();

  // ─── Stream detail ─────────────────────────────────
  const { data: streamRes } = useQuery({
    queryKey: LmsClassesQueryKeys.streamDetail(streamId),
    queryFn: () => streamApi.show(streamId),
    enabled: !!streamId,
  });

  const streamDetail = (streamRes as { data?: StreamDetail })?.data as StreamDetail | undefined;

  // ─── Classrooms list ───────────────────────────────
  const { data: classesRes, isLoading } = useQuery({
    queryKey: LmsClassesQueryKeys.streamClasses({
      stream_id: streamId,
      session_id: sessionId,
      search: filter.search,
    }),
    queryFn: () =>
      lmsApi.classes.index({
        stream_id: streamId,
        ...(sessionId ? { session_id: sessionId } : {}),
        ...(filter.search ? { search: filter.search } : {}),
        per_page: 50,
      }),
    enabled: !!streamId,
  });

  const classes = ((classesRes as { data?: ClassRow[] })?.data ?? []) as ClassRow[];

  const defaultSection = useMemo(
    () => nextSectionLabel(classes.map((c) => c.section ?? "")),
    [classes],
  );
  const defaultStreamName = streamDetail?.name ?? null;

  // ─── Breadcrumbs (dynamic — includes stream name) ──
  const breadcrumbs = useMemo(
    () => getLmsStreamDetailBreadcrumbs(contentMap, streamDetail?.name, streamId),
    [contentMap, streamDetail?.name, streamId],
  );

  const backHref = sessionId != null ? `/lms/classes?session_id=${sessionId}` : "/lms/classes";

  // ─── Page title (content engine) ───────────────────
  const pageTitle = streamDetail?.name
    ? `${streamDetail.name} – ${CONTENT.sectionTitle}`
    : CONTENT.sectionTitle;

  // ─── Render ────────────────────────────────────────
  return (
    <>
      <Head title={pageTitle} />
      <LmsClassDialog
        open={dialogDisclosure.isOpen}
        onClose={() => dialogDisclosure.onClose()}
        data={dialogDisclosure.data ?? undefined}
        defaultStreamId={streamId}
        defaultSessionId={sessionId ?? undefined}
        defaultStreamName={defaultStreamName ?? undefined}
        defaultSection={defaultSection}
      />
      <PageContainer maxWidth="2xl" className="space-y-8">
        <MainPageHeader
          breadcrumbs={breadcrumbs}
          icon={GraduationCap}
          title={streamDetail?.name ?? CONTENT.sectionTitle}
          subtitle={streamDetail?.code ? `Code: ${streamDetail.code}` : undefined}
        />

        <section className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-black tracking-tight text-foreground whitespace-nowrap">
              {CONTENT.sectionTitle}
            </h2>
            <FilterBar values={filter} onChange={(updates) => {
              if (updates.search !== undefined) handleFilterBykey("search", updates.search);
            }}>
              <FilterBar.Renderer config={{ filters: [], search: { name: "search", placeholder: CONTENT.searchPlaceholder } }} />
            </FilterBar>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {!isLoading && (
              <PermissionGate can="create_lms_classes">
                <DashedCard
                  label={CONTENT.addLabel}
                  description={`${CONTENT.addDesc} ${streamDetail?.name ?? ""}`}
                  onClick={() => dialogDisclosure.onOpen(null)}
                  className="h-full min-h-[220px]"
                />
              </PermissionGate>
            )}
            <Each
              of={classes}
              isLoading={isLoading}
              keyExtractor={(cls: ClassRow) => cls.id}
              fallback={<CardGridSkeleton count={6} />}
              nodatafound={
                <CardGridEmptyState
                  icon={Layers}
                  title={CONTENT.emptyTitle}
                  description={CONTENT.emptyDesc}
                />
              }
              render={(cls: ClassRow) => (
                <Link href={`/lms/classes/${cls.id}`} className="block group h-full">
                  <Card className="h-full relative overflow-hidden rounded-3xl border-border/40 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 bg-card">
                    <CardContent className="p-6 flex flex-col h-full space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent-foreground border border-accent/10">
                          <Hash className="size-5" />
                        </div>
                        <div className="flex size-8 items-center justify-center rounded-full bg-muted/30 opacity-0 group-hover:opacity-100 transition-all">
                          <ArrowRight className="size-4" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {cls.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {cls.section && (
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                              Section {cls.section}
                            </Badge>
                          )}
                          {cls.code && (
                            <Badge variant="secondary" className="bg-muted/50 text-[10px] uppercase font-bold tracking-wider">
                              {cls.code}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="mt-auto pt-4 space-y-3 border-t border-border/10">
                        {cls.class_teacher && (
                          <div className="flex items-center gap-2">
                            <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                              {cls.class_teacher.name.charAt(0)}
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground truncate">
                              {cls.class_teacher.name}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                            <Users className="size-3.5" />
                            {cls.enrollments_count ?? 0} {CONTENT.studentLabel}
                          </div>
                          {cls.fee_collection_frequency && (
                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter bg-primary/5 text-primary border-primary/20">
                              {cls.fee_collection_frequency}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )}
            />
          </div>
        </section>
      </PageContainer>
    </>
  );
};

LmsStreamClassesIndex.layoutProps = (props: any) => {
  const sessionId = props.sessionId;
  const backHref = sessionId != null ? `/lms/classes?session_id=${sessionId}` : "/lms/classes";
  return {
    backHref,
    backLabel: "Back to Class List",
  };
};

export default LmsStreamClassesIndex;
