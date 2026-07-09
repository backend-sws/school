import React, { useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import feeProfilesApi, { type FeeProfile } from "@/lib/api/feeProfilesApi";
import { useInstitutionContent } from "@/hooks/useInstitutionContent";
import useSearchFilter from "@/hooks/useSearchfilter";
import { getSerialNumber, parsePaginatedResponse } from "@/lib/utils";
import {
    getFeeProfileContent,
    getFeeProfileBreadcrumbs,
    getFeeProfileColumns,
} from "@/constants/feeProfile/formConfig";
import { FeeProfileQueryKeys } from "@/lib/querykey/feeProfile";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SlidersHorizontal, Plus, Pencil, Trash2 } from "lucide-react";
import Each from "@/components/Each";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import DataTable, { TableEmptyState, TableSkeletonLoader } from "@/components/dataTable";
import { FilterBar } from "@/components/filter-bar";
import { useFilterRegistry } from "@/hooks/useFilterRegistry";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useRegisterGuide } from "@/components/GuideProvider";
import { FEE_PROFILES_GUIDE } from "@/constants/guides/fees";
import { Badge } from "@/components/ui/badge";

const DEFAULT_PAGE_SIZE = 15;

export default function Profiles() {
    const queryClient = useQueryClient();
    const deleteDisclosure = useDisclosure<FeeProfile>();
    useRegisterGuide(FEE_PROFILES_GUIDE);
    const contentMap = useInstitutionContent();
    const CONTENT = useMemo(() => getFeeProfileContent(contentMap), [contentMap]);
    const BREADCRUMBS = useMemo(() => getFeeProfileBreadcrumbs(contentMap), [contentMap]);
    const COLUMNS = useMemo(() => getFeeProfileColumns(contentMap), [contentMap]);

    // ─── Search + Pagination (Rule 20) ───────────────────
    const { filter, handleFilter } = useSearchFilter({
        search: "",
        search_by: "name",
        profile_type: "",
        page: 1,
        perPage: DEFAULT_PAGE_SIZE,
    });

    const filterConfig = useFilterRegistry("fee_profiles");

    // ─── Query (backend pagination) ──────────────────────
    const { data: profilesRes, isLoading: profilesLoading } = useQuery({
        queryKey: FeeProfileQueryKeys.list({ page: filter.page, perPage: filter.perPage, search: filter.search, search_by: filter.search_by, profile_type: filter.profile_type }),
        queryFn: () => feeProfilesApi.index({
            page: filter.page,
            per_page: filter.perPage,
            search: filter.search || undefined,
            search_by: filter.search_by || undefined,
            profile_type: filter.profile_type || undefined,
        }),
    });

    const { items: profiles, meta } = parsePaginatedResponse<FeeProfile>(profilesRes);

    // ─── Delete mutation ─────────────────────────────────
    const destroyMutation = useMutation({
        mutationFn: (id: number) => feeProfilesApi.destroy(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FeeProfileQueryKeys.all });
            deleteDisclosure.onClose();
            toast.success("Fee profile deleted.");
        },
        onError: () => toast.error("Failed to delete fee profile."),
    });

    return (
        <>
            <Head title={`${CONTENT.pageTitle} - Treasury & Fees`} />

            <TooltipProvider>
                <PageContainer maxWidth="full">
                    <div className="space-y-6">
                        <MainPageHeader
                            id="fee-profiles-header"
                            breadcrumbs={BREADCRUMBS}
                            icon={SlidersHorizontal}
                            title={CONTENT.pageTitle}
                            subtitle={CONTENT.pageSubtitle}
                            guidance={CONTENT.guidance}
                        />

                        <div className="flex flex-wrap items-center justify-end gap-3">
                            <Button
                                id="new-profile-btn"
                                size="default"
                                onClick={() => router.visit("/accounts/fee-hub/profiles/create")}
                            >
                                <Plus className="size-4" /> {CONTENT.addBtn}
                            </Button>
                        </div>

                        <Card>
                            <CardHeader className="pb-4">
                            <FilterBar values={filter} onChange={handleFilter}>
                                    <FilterBar.Renderer config={filterConfig} />
                                </FilterBar>
                            </CardHeader>

                            <CardContent className="pt-0" id="profiles-table">
                                <DataTable
                                    columns={COLUMNS}
                                    isPaginated
                                    currentPage={meta.current_page}
                                    lastPage={meta.last_page}
                                    totalRecords={meta.total}
                                    pageSize={meta.per_page}
                                    handlePageChange={(p) => handleFilter({ page: p })}
                                    handlePageSizeChange={(size) => handleFilter({ perPage: size, page: 1 })}
                                >
                                    <Each
                                        of={profiles}
                                        isLoading={profilesLoading}
                                        nodatafound={
                                            <TableEmptyState
                                                colSpan={COLUMNS.length}
                                                message={CONTENT.emptyTitle}
                                                description={CONTENT.emptyDescription}
                                            />
                                        }
                                        fallback={<TableSkeletonLoader columns={COLUMNS.length} />}
                                        keyExtractor={(r: FeeProfile) => String(r.id)}
                                        render={(row: FeeProfile, index: number) => (
                                            <TableRow key={row.id} className="hover:bg-muted/50">
                                                <TableCell className="text-muted-foreground font-mono text-xs w-12">
                                                    {getSerialNumber(meta.current_page, meta.per_page, index)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{row.name}</span>
                                                        {row.is_default && (
                                                            <Badge variant="success" className="text-[10px] font-semibold uppercase tracking-wide shrink-0">
                                                                Default
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="capitalize">{(row.profile_type ?? "—").replace("_", " ")}</TableCell>
                                                <TableCell className="uppercase">{row.category ?? "—"}</TableCell>
                                                <TableCell className="capitalize">{row.gender ?? "—"}</TableCell>
                                                <TableCell className="max-w-[200px] truncate text-muted-foreground" title={row.description ?? ""}>
                                                    {row.description ?? "—"}
                                                </TableCell>
                                                <TableCell>{row.items?.length ?? 0} item(s)</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-0.5">
                                                        <TooltipWrapper content="Edit">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                className="text-muted-foreground hover:text-foreground"
                                                                onClick={() => router.visit(`/accounts/fee-hub/profiles/${row.id}/edit`)}
                                                            >
                                                                <Pencil className="size-4" aria-hidden />
                                                            </Button>
                                                        </TooltipWrapper>
                                                        <TooltipWrapper content="Delete">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                className="text-muted-foreground hover:text-destructive"
                                                                onClick={() => deleteDisclosure.onOpen(row)}
                                                            >
                                                                <Trash2 className="size-4" aria-hidden />
                                                            </Button>
                                                        </TooltipWrapper>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    />
                                </DataTable>
                            </CardContent>
                        </Card>
                    </div>

                    <ConfirmDialog
                        open={deleteDisclosure.isOpen}
                        onOpenChange={(open) => !open && deleteDisclosure.onClose()}
                        title={CONTENT.deleteTitle}
                        description={
                            deleteDisclosure.data
                                ? `${CONTENT.deleteDesc.replace("?", "")} "${deleteDisclosure.data.name}"?`
                                : ""
                        }
                        confirmText={CONTENT.deleteBtn}
                        variant="danger"
                        onConfirm={() => {
                            if (deleteDisclosure.data) destroyMutation.mutate(deleteDisclosure.data.id);
                        }}
                        isLoading={destroyMutation.isPending}
                    />
                </PageContainer>
            </TooltipProvider>
        </>
    );
}
