import React, { useEffect, useMemo } from "react";
import { getSerialNumber, parsePaginatedResponse } from "@/lib/utils";
import useSearchFilter from "@/hooks/useSearchfilter";
import { Head } from "@inertiajs/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import feeTypesApi from "@/lib/api/feeTypesApi";
import { feeTypeSchema, type FeeTypeFormData } from "@/lib/validations/feeType";
import { usePermittedFields } from "@/hooks/usePermittedFields";
import { useInstitutionContent } from "@/hooks/useInstitutionContent";
import {
    FEE_TYPE_FORM_FIELDS,
    FEE_TYPE_DEFAULT_VALUES,
    getFeeTypeContent,
    getFeeTypeBreadcrumbs,
    getFeeTypeColumns,
} from "@/constants/feeType/formConfig";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    IndianRupee,
    Plus,
    Pencil,
    Trash2,
    Loader2,
    RotateCcw,
} from "lucide-react";
import Each from "@/components/Each";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import {
    TableCell,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import DataTable, { TableEmptyState, TableSkeletonLoader } from "@/components/dataTable";
import { FilterBar } from "@/components/filter-bar";
import { useFilterRegistry } from "@/hooks/useFilterRegistry";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useRegisterGuide } from '@/components/GuideProvider';
import { FEE_TYPES_GUIDE } from "@/constants/guides/fees";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";

type FeeTypeRow = {
    id: number;
    name: string;
    category: string;
    profile_type?: string | null;
    reservation_category?: string | null;
    gender?: string | null;
};

const DEFAULT_PAGE_SIZE = 15;

export default function FeeTypes() {
    const queryClient = useQueryClient();
    const formDisclosure = useDisclosure<FeeTypeRow>();
    const deleteDisclosure = useDisclosure<FeeTypeRow>();
    const contentMap = useInstitutionContent();
    const CONTENT = useMemo(() => getFeeTypeContent(contentMap), [contentMap]);
    const BREADCRUMBS = useMemo(() => getFeeTypeBreadcrumbs(contentMap), [contentMap]);
    const COLUMNS = useMemo(() => getFeeTypeColumns(contentMap), [contentMap]);
    useRegisterGuide(FEE_TYPES_GUIDE);

    // ─── Search + Pagination ──────────────────────────────
    const { filter, handleFilter, handleFilterDebounce } = useSearchFilter({
        search: "",
        search_by: "name",
        category: "",
        profile_type: "",
        gender: "",
        page: 1,
        perPage: DEFAULT_PAGE_SIZE,
    });

    const filterConfig = useFilterRegistry("fee_types");

    // ─── Permission-gated fields ─────────────────────────
    const { visibleFields, permittedSchema } = usePermittedFields(
        FEE_TYPE_FORM_FIELDS,
        feeTypeSchema,
    );

    // ─── Form (react-hook-form + Zod) ─────────────────────
    const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<FeeTypeFormData>({
        resolver: zodResolver(permittedSchema) as any,
        mode: "onChange",
        defaultValues: FEE_TYPE_DEFAULT_VALUES,
    });

    // ─── Query ────────────────────────────────────────────
    const { data: feeTypesRes, isLoading: feeTypesLoading } = useQuery({
        queryKey: ["fee-types", filter.page, filter.perPage, filter.search, filter.search_by, filter.profile_type],
        queryFn: () => feeTypesApi.index({
            page: filter.page,
            per_page: filter.perPage,
            search: filter.search || undefined,
            search_by: filter.search_by || undefined,
            profile_type: filter.profile_type || undefined,
        }),
    });

    const { items: feeTypes, meta } = parsePaginatedResponse<FeeTypeRow>(feeTypesRes);

    // ─── Mutations ────────────────────────────────────────
    const createMutation = useMutation({
        mutationFn: (data: FeeTypeFormData) => feeTypesApi.store(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fee-types"] });
            formDisclosure.onClose();
            reset(FEE_TYPE_DEFAULT_VALUES);
            toast.success("Fee type created.");
        },
        onError: () => toast.error("Failed to create fee type."),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: FeeTypeFormData }) =>
            feeTypesApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fee-types"] });
            formDisclosure.onClose();
            reset(FEE_TYPE_DEFAULT_VALUES);
            toast.success("Fee type updated.");
        },
        onError: () => toast.error("Failed to update fee type."),
    });

    const destroyMutation = useMutation({
        mutationFn: (id: number) => feeTypesApi.destroy(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fee-types"] });
            toast.success("Fee type deleted.");
        },
        onError: () => toast.error("Failed to delete fee type."),
    });

    // const restoreDefaultsMutation = useMutation({
    //     mutationFn: () => feeTypesApi.restoreDefaults(),
    //     onSuccess: (res: { data?: { created?: number }; message?: string }) => {
    //         queryClient.invalidateQueries({ queryKey: ["fee-types"] });
    //         const created = (res?.data as { created?: number })?.created ?? 0;
    //         toast.success(res?.message ?? (created > 0 ? `${created} default fee type(s) added.` : "No new fee types added."));
    //     },
    //     onError: () => toast.error("Failed to restore default fee types."),
    // });

    // ─── Helpers ──────────────────────────────────────────
    const openCreate = () => {
        reset(FEE_TYPE_DEFAULT_VALUES);
        formDisclosure.onOpen();
    };

    const openEdit = (row: FeeTypeRow) => {
        reset({
            name: row.name,
            category: row.category || "recurring",
            profile_type: row.profile_type || "_none",
            reservation_category: row.reservation_category || "_none",
            gender: row.gender || "_none",
        });
        formDisclosure.onOpen(row);
    };

    const closeFormModal = () => {
        formDisclosure.onClose();
        reset(FEE_TYPE_DEFAULT_VALUES);
    };

    const onSubmit = (data: FeeTypeFormData) => {
        const payload: FeeTypeFormData = {
            ...data,
            profile_type: data.profile_type === "_none" ? null : data.profile_type,
            reservation_category: data.reservation_category === "_none" ? null : data.reservation_category,
            gender: data.gender === "_none" ? null : data.gender,
        };

        if (formDisclosure.data?.id) {
            updateMutation.mutate({ id: formDisclosure.data.id, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <>
            <Head title="Fee Types - Treasury & Fees" />

            <TooltipProvider>
                <PageContainer maxWidth="full">
                    <div className="space-y-6">
                        <MainPageHeader
                            id="fee-types-header"
                            breadcrumbs={BREADCRUMBS}
                            icon={IndianRupee}
                            title={CONTENT.pageTitle}
                            subtitle={CONTENT.pageSubtitle}
                            guidance={CONTENT.guidance}
                        />

                        <div className="flex flex-wrap items-center justify-end gap-3">
                            {/* <Button
                                size="sm"
                                variant="outline"
                                onClick={() => restoreDefaultsMutation.mutate()}
                                disabled={restoreDefaultsMutation.isPending}
                                className="gap-1.5"
                            >
                                {restoreDefaultsMutation.isPending ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <RotateCcw className="size-4" />
                                )}
                                {CONTENT.restoreBtn}
                            </Button> */}
                            <Button
                                id="new-fee-type-btn"
                                size="default"
                                onClick={openCreate}
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

                            <CardContent className="pt-0" id="fee-types-table">
                                <DataTable
                                    columns={COLUMNS}
                                    isPaginated={meta.last_page > 1}
                                    currentPage={meta.current_page}
                                    lastPage={meta.last_page}
                                    totalRecords={meta.total}
                                    pageSize={meta.per_page}
                                    handlePageChange={(p) => handleFilter({ page: p })}
                                    handlePageSizeChange={(size) => handleFilter({ perPage: size, page: 1 })}
                                >
                                    <Each
                                        of={feeTypes}
                                        isLoading={feeTypesLoading}
                                        nodatafound={
                                            <TableEmptyState
                                                colSpan={COLUMNS.length}
                                                message={CONTENT.emptyTitle}
                                                description={CONTENT.emptyDescription}
                                            />
                                        }
                                        fallback={
                                            <TableSkeletonLoader columns={COLUMNS.length} />
                                        }
                                        keyExtractor={(r: FeeTypeRow) => String(r.id)}
                                        render={(row: FeeTypeRow, index: number) => (
                                            <TableRow key={row.id} className="hover:bg-muted/50">
                                                <TableCell className="text-muted-foreground font-mono text-xs w-12">
                                                    {getSerialNumber(meta.current_page, meta.per_page, index)}
                                                </TableCell>
                                                <TableCell className="font-medium">{row.name}</TableCell>
                                                <TableCell className="capitalize">
                                                    {(row.category || "recurring").replace("_", " ")}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-0.5">
                                                        <TooltipWrapper content="Edit">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                className="text-muted-foreground hover:text-foreground"
                                                                onClick={() => openEdit(row)}
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

                    {/* ─── Create / Edit Dialog ──────────────────── */}
                    <Dialog open={formDisclosure.isOpen} onOpenChange={(open) => !open && closeFormModal()}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {formDisclosure.data?.id ? CONTENT.editTitle : CONTENT.createTitle}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <Each
                                    of={visibleFields}
                                    render={(field) => (
                                        <div key={field.name}>
                                            <ControlledFormComponent
                                                control={control}
                                                name={field.name as any}
                                                type={field.type}
                                                label={field.label}
                                                placeholder={field.placeholder}
                                                required={field.required}
                                                tooltip={field.tooltip}
                                                options={field.options as any}
                                            />
                                        </div>
                                    )}
                                />
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={closeFormModal}
                                    >
                                        {CONTENT.cancelBtn}
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isPending || isSubmitting}
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="size-4 animate-spin" />
                                                Saving…
                                            </>
                                        ) : formDisclosure.data?.id ? (
                                            CONTENT.updateBtn
                                        ) : (
                                            CONTENT.createBtn
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <ConfirmDialog
                        open={deleteDisclosure.isOpen}
                        onOpenChange={(open) => !open && deleteDisclosure.onClose()}
                        title="Delete fee type"
                        description={
                            deleteDisclosure.data
                                ? `Remove "${deleteDisclosure.data.name}"? This may affect fee structures that use it.`
                                : ""
                        }
                        onConfirm={() => deleteDisclosure.data && destroyMutation.mutate(deleteDisclosure.data.id)}
                        isLoading={destroyMutation.isPending}
                        confirmText="Delete"
                        variant="danger"
                    />
                </PageContainer>
            </TooltipProvider>
        </>
    );
}
