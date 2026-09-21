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
import { SlidersHorizontal, Plus, Pencil, Trash2, Copy, Loader2 } from "lucide-react";
import Each from "@/components/Each";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCollegeSessions } from "@/hooks/useCollegeSessions";
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
    const cloneDisclosure = useDisclosure<FeeProfile>();
    const { sessions } = useCollegeSessions();
    const [targetSessionId, setTargetSessionId] = React.useState<string>("");
    const [cloneName, setCloneName] = React.useState<string>("");

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
        session_id: "",
        page: 1,
        perPage: DEFAULT_PAGE_SIZE,
    });

    const filterConfig = useFilterRegistry("fee_profiles");

    // ─── Query (backend pagination) ──────────────────────
    const { data: profilesRes, isLoading: profilesLoading } = useQuery({
        queryKey: FeeProfileQueryKeys.list({
            page: filter.page,
            perPage: filter.perPage,
            search: filter.search,
            search_by: filter.search_by,
            profile_type: filter.profile_type,
            session_id: filter.session_id,
        }),
        queryFn: () => feeProfilesApi.index({
            page: filter.page,
            per_page: filter.perPage,
            search: filter.search || undefined,
            search_by: filter.search_by || undefined,
            profile_type: filter.profile_type === "all" ? undefined : filter.profile_type || undefined,
            session_id: filter.session_id === "all" ? undefined : filter.session_id || undefined,
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

    // ─── Clone mutation ──────────────────────────────────
    const cloneMutation = useMutation({
        mutationFn: ({ id, target_session_id, name }: { id: number; target_session_id: number; name?: string }) =>
            feeProfilesApi.clone(id, { target_session_id, name }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FeeProfileQueryKeys.all });
            cloneDisclosure.onClose();
            toast.success("Fee profile cloned successfully for the new session!");
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to clone fee profile.");
        },
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
                                                <TableCell>
                                                    {row.session?.name ? (
                                                        <Badge variant="outline" className="text-[11px] font-medium bg-muted/40">
                                                            {row.session.name}
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="text-[10px] text-muted-foreground font-normal">
                                                            All Sessions
                                                        </Badge>
                                                    )}
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
                                                        <TooltipWrapper content="Clone to New Session">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                className="text-muted-foreground hover:text-primary"
                                                                onClick={() => {
                                                                    setCloneName(`${row.name}`);
                                                                    setTargetSessionId("");
                                                                    cloneDisclosure.onOpen(row);
                                                                }}
                                                            >
                                                                <Copy className="size-4" aria-hidden />
                                                            </Button>
                                                        </TooltipWrapper>
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

                    {/* ─── Clone to New Session Dialog ─────────────────── */}
                    <Dialog
                        open={cloneDisclosure.isOpen}
                        onOpenChange={(open) => !open && cloneDisclosure.onClose()}
                    >
                        <DialogContent className="sm:max-w-[460px]">
                            <DialogHeader>
                                <DialogTitle>Clone Profile to New Session</DialogTitle>
                                <DialogDescription>
                                    Duplicate this fee profile and all its fee heads into a new academic session. Existing student ledgers in the current session will remain completely untouched.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="target-session-select" className="text-xs font-semibold">
                                        Target Academic Session <span className="text-destructive">*</span>
                                    </Label>
                                    <Select value={targetSessionId} onValueChange={setTargetSessionId}>
                                        <SelectTrigger id="target-session-select">
                                            <SelectValue placeholder="Select academic session..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sessions.map((s) => (
                                                <SelectItem key={s.value} value={s.value}>
                                                    {s.text}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="clone-profile-name" className="text-xs font-semibold">
                                        New Profile Name (Optional)
                                    </Label>
                                    <Input
                                        id="clone-profile-name"
                                        value={cloneName}
                                        onChange={(e) => setCloneName(e.target.value)}
                                        placeholder={cloneDisclosure.data?.name || "Profile Name"}
                                    />
                                    <p className="text-[11px] text-muted-foreground">
                                        Leave as is or modify. After cloning, you can edit fee items and rates anytime.
                                    </p>
                                </div>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => cloneDisclosure.onClose()}
                                    disabled={cloneMutation.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    disabled={!targetSessionId || cloneMutation.isPending}
                                    onClick={() => {
                                        if (cloneDisclosure.data && targetSessionId) {
                                            cloneMutation.mutate({
                                                id: cloneDisclosure.data.id,
                                                target_session_id: Number(targetSessionId),
                                                name: cloneName.trim() || undefined,
                                            });
                                        }
                                    }}
                                >
                                    {cloneMutation.isPending && <Loader2 className="size-4 animate-spin mr-1.5" />}
                                    Clone Profile
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </PageContainer>
            </TooltipProvider>
        </>
    );
}
