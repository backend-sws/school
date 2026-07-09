import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Head } from "@inertiajs/react";
import { History, Eye, Clock, User, Globe } from "lucide-react";
import { getSerialNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { FilterBar } from "@/components/filter-bar";
import AuditLogApi, { type AuditLogEntry } from "@/lib/api/auditLogApi";
import {
  AUDIT_LOG_BREADCRUMBS,
  AUDIT_LOG_COLUMNS,
  INITIAL_AUDIT_LOG_FILTERS,
  AUDIT_ACTION_OPTIONS,
} from "@/constants/page/admin/auditLog";
import { useRegisterGuide } from '@/components/GuideProvider';
import { AUDIT_LOGS_GUIDE } from "@/constants/guides/analytics";
import React from 'react';

const formatDateTime = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "medium",
    });
  } catch {
    return iso;
  }
};

/** Humanize key: photo_url → Photo url */
const humanizeKey = (key: string) =>
  key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^\w/, (c) => c.toUpperCase());

/** Format a value for display (dates, nulls, long strings) */
const formatValue = (v: unknown): string => {
  if (v === null || v === undefined) return "—";
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T?\d*/.test(v)) {
    try {
      return formatDateTime(v);
    } catch {
      return v;
    }
  }
  const s = String(v);
  return s.length > 60 ? s.slice(0, 57) + "…" : s;
};

/** Build rows for before/after diff from old and new value objects */
const buildDiffRows = (
  oldVal: Record<string, unknown> | null,
  newVal: Record<string, unknown> | null,
  action: string
): { key: string; before: unknown; after: unknown }[] => {
  const keys = new Set([
    ...Object.keys(oldVal ?? {}),
    ...Object.keys(newVal ?? {}),
  ]);
  return Array.from(keys)
    .sort()
    .map((key) => ({
      key,
      before: (oldVal ?? {})[key],
      after: (newVal ?? {})[key],
    }))
    .filter((row) => {
      if (action === "created") return row.after !== undefined && row.after !== null;
      if (action === "deleted") return row.before !== undefined && row.before !== null;
      return true;
    });
};

const AuditLogsPage = () => {
useRegisterGuide(AUDIT_LOGS_GUIDE);
  const detailDisclosure = useDisclosure();
  const { filter, handleFilter } = useSearchFilter(INITIAL_AUDIT_LOG_FILTERS);

  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs", filter],
    queryFn: () => AuditLogApi.getAuditLogs(filter),
  });

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const list = data?.data ?? [];
  const meta = data?.meta;

  return (
    <>
      <Head title="Audit Logs" />

      <Sheet
        open={detailDisclosure.isOpen}
        onOpenChange={detailDisclosure.onClose}
      >
        <SheetContent className="sm:max-w-2xl overflow-y-auto p-0 flex flex-col">
          {detailDisclosure.data && (
            <>
              <SheetHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
                <div className="flex items-center gap-3">
                  <span className="capitalize inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                    {detailDisclosure.data.action}
                  </span>
                  <span className="text-muted-foreground">
                    {detailDisclosure.data.entity_type ?? "—"} #
                    {detailDisclosure.data.entity_id ?? "—"}
                  </span>
                </div>
                <SheetTitle className="text-left text-lg mt-2">
                  Audit log detail
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {/* Log details card */}
                <div className="rounded-lg border bg-card p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">
                    Details
                  </h4>
                  <dl className="grid gap-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Clock className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <dt className="text-muted-foreground">Time</dt>
                        <dd className="font-medium">
                          {formatDateTime(detailDisclosure.data.created_at)}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <dt className="text-muted-foreground">User</dt>
                        <dd className="font-medium">
                          {detailDisclosure.data.user ? (
                            <>
                              {detailDisclosure.data.user.name}
                              <span className="text-muted-foreground font-normal">
                                {" "}
                                ({detailDisclosure.data.user.email})
                              </span>
                            </>
                          ) : (
                            "—"
                          )}
                        </dd>
                      </div>
                    </div>
                    {detailDisclosure.data.ip_address && (
                      <div className="flex items-start gap-3">
                        <Globe className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <dt className="text-muted-foreground">IP address</dt>
                          <dd className="font-mono text-xs">
                            {detailDisclosure.data.ip_address}
                          </dd>
                        </div>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Changes: before / after table */}
                {(() => {
                  const rows = buildDiffRows(
                    detailDisclosure.data.old_values,
                    detailDisclosure.data.new_values,
                    detailDisclosure.data.action
                  );
                  if (rows.length === 0) {
                    return (
                      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                        No field changes recorded for this entry.
                      </div>
                    );
                  }
                  return (
                    <div className="rounded-lg border bg-card overflow-hidden">
                      <div className="px-4 py-3 border-b bg-muted/30">
                        <h4 className="text-sm font-semibold text-foreground">
                          Changes
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Before and after values for this{" "}
                          {detailDisclosure.data.action} action.
                        </p>
                      </div>
                      <div className="overflow-x-auto max-h-[min(50vh,400px)] overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="w-[180px] font-medium">
                                Field
                              </TableHead>
                              <TableHead className="font-medium">
                                Before
                              </TableHead>
                              <TableHead className="font-medium">
                                After
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {rows.map((row) => {
                              const changed =
                                String(row.before) !== String(row.after);
                              return (
                                <TableRow
                                  key={row.key}
                                  className={
                                    changed
                                      ? "bg-amber-50/50 dark:bg-amber-950/20"
                                      : "hover:bg-muted/30"
                                  }
                                >
                                  <TableCell className="font-medium text-foreground align-top py-2.5">
                                    {humanizeKey(row.key)}
                                  </TableCell>
                                  <TableCell className="text-sm text-muted-foreground align-top py-2.5 font-mono max-w-[200px] break-all">
                                    {formatValue(row.before)}
                                  </TableCell>
                                  <TableCell className="text-sm text-muted-foreground align-top py-2.5 font-mono max-w-[200px] break-all">
                                    {formatValue(row.after)}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <div className="space-y-6">
        <MainPageHeader
          id="audit-logs-header"
          breadcrumbs={AUDIT_LOG_BREADCRUMBS}
          icon={History}
          title="Audit Logs"
          subtitle="View system activity: who changed what and when."
        />

        <Card>
          <CardHeader className="pb-4">
            <FilterBar values={filter} onChange={handleFilterChange}>
              <FilterBar.Renderer config={{ search: { name: "entity_type", placeholder: "Entity type" }, filters: [{ name: "action", type: "select", label: "Action", placeholder: "Action", options: AUDIT_ACTION_OPTIONS }, { name: "from_date", type: "date", label: "From Date" }, { name: "to_date", type: "date", label: "To Date" }] }} />
            </FilterBar>
          </CardHeader>
          <CardContent className="pt-0" id="audit-logs-table">
            <DataTable
              columns={AUDIT_LOG_COLUMNS}
              currentPage={meta?.current_page ?? 1}
              lastPage={meta?.last_page ?? 1}
              pageSize={filter.per_page}
              totalRecords={meta?.total ?? 0}
              handlePageChange={(page) => handleFilter({ page })}
              handlePageSizeChange={(size) =>
                handleFilter({ per_page: size, page: 1 })
              }
            >
              <Each
                isLoading={isLoading}
                of={list}
                nodatafound={
                  <TableEmptyState
                    colSpan={AUDIT_LOG_COLUMNS.length}
                    message="No audit logs found"
                    description="Activity will appear here when users create, update, or delete records."
                  />
                }
                fallback={
                  <TableSkeletonLoader columns={AUDIT_LOG_COLUMNS.length} />
                }
                render={(val: AuditLogEntry, index: number) => (
                  <TableRow
                    key={val.id}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                      {getSerialNumber(
                        meta?.current_page ?? 1,
                        filter.per_page ?? 25,
                        index
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap max-w-[140px]">
                      {formatDateTime(val.created_at)}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize font-medium">
                        {val.action}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm max-w-[120px] truncate">
                      {val.entity_type ?? "—"}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {val.entity_id ?? "—"}
                    </TableCell>
                    <TableCell className="max-w-[180px]">
                      {val.user ? (
                        <span className="truncate block" title={val.user.email}>
                          {val.user.name}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="w-16">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => detailDisclosure.onOpen(val)}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="View detail"
                      >
                        <Eye className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              />
            </DataTable>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AuditLogsPage;
