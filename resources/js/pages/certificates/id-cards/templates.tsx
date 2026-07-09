import { Head, router } from "@inertiajs/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IdCardTemplateApi } from "@/lib/api/idCardApi";
import { IdCardQueryKeys } from "@/lib/querykey/idCard";
import { ID_CARD_TEMPLATES_BREADCRUMBS, ID_CARD_TEMPLATES_GUIDELINES, ID_CARD_TEMPLATES_TIP } from "@/constants/page/idCard";
import {
    TEMPLATE_TABLE_COLUMNS,
    INITIAL_TEMPLATE_FILTERS,
    ID_CARD_CONTENT,
    ID_CARD_PERMISSIONS,
} from "@/constants/idCard/formConfig";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { IdCard as IdCardIcon, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DataTable, { TableEmptyState, TableSkeletonLoader } from "@/components/dataTable";
import Each from "@/components/Each";
import { TableCell, TableRow } from "@/components/ui/table";
import { FilterBar } from "@/components/filter-bar";
import useSearchFilter from "@/hooks/useSearchfilter";
import { Badge } from "@/components/ui/badge";
import { getSerialNumber } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipWrapper } from "@/components/shared";
import { useAuth } from "@/hooks/use-can";
import { useDisclosure } from "@/hooks/useDisclosure";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

const { templates: CONTENT } = ID_CARD_CONTENT;

const IdCardTemplates = () => {
    const { can } = useAuth();
    const queryClient = useQueryClient();
    const canCreate =
        can(ID_CARD_PERMISSIONS.create) || can(ID_CARD_PERMISSIONS.generate);
    const canEdit = can(ID_CARD_PERMISSIONS.edit);
    const canDelete = can(ID_CARD_PERMISSIONS.delete);
    const { filter, handleFilter } = useSearchFilter(INITIAL_TEMPLATE_FILTERS);
    const deleteDisclosure = useDisclosure<any>();

    const deleteMutation = useMutation({
        mutationFn: (id: number) => IdCardTemplateApi.destroy(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: IdCardQueryKeys.templates.all });
            deleteDisclosure.onClose();
            toast.success("Template deleted successfully");
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message ?? "Failed to delete template");
        },
    });

    const confirmDelete = () => {
        deleteMutation.mutate(deleteDisclosure?.data?.id);
    };

    const handleFilterChange = (updates: Record<string, any>) => {
        handleFilter({ ...updates, page: 1 });
    };

    const { data: templatesData, isLoading } = useQuery({
        queryKey: IdCardQueryKeys.templates.list(filter),
        queryFn: () => IdCardTemplateApi.index(filter),
    });

    const templates = templatesData?.data ?? [];
    const meta = templatesData?.meta;

    return (
        <>
            <Head title={CONTENT.title} />

            <ConfirmDialog
                open={deleteDisclosure.isOpen}
                onOpenChange={deleteDisclosure.onClose}
                title="Delete Template"
                description={`Are you sure you want to delete "${deleteDisclosure?.data?.name}"? This action cannot be undone.`}
                onConfirm={confirmDelete}
                isLoading={deleteMutation.isPending}
                confirmText="Delete"
                variant="danger"
                confirmationKeyword="DELETE"
            />

            <TooltipProvider>
                <div className="space-y-6">
                    <MainPageHeader
                        id="id-card-templates-header"
                        breadcrumbs={ID_CARD_TEMPLATES_BREADCRUMBS}
                        icon={IdCardIcon}
                        title={CONTENT.title}
                        subtitle={CONTENT.subtitle}
                        guidance={ID_CARD_TEMPLATES_GUIDELINES}
                        tip={ID_CARD_TEMPLATES_TIP}
                    />

                    {canCreate && (
                        <div className="flex justify-end">
                            <Button
                                onClick={() => router.visit("/certificates/id-cards/templates/create")}
                                className="w-full sm:w-auto"
                            >
                                <Plus className="size-4" />
                                <span>{CONTENT.newTemplateBtn}</span>
                            </Button>
                        </div>
                    )}

                    <Card>
                        <CardHeader className="pb-4">
                            <FilterBar values={filter} onChange={handleFilterChange}>
                            <FilterBar.Renderer config={{
                                filters: [],
                                searchGroup: {
                                    selectName: "search_by",
                                    searchName: "search",
                                    options: [
                                        { value: "name", label: "Name" },
                                        { value: "card_type", label: "Card Type" },
                                    ],
                                    placeholder: CONTENT.searchPlaceholder,
                                },
                            }} />
                            </FilterBar>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <DataTable
                                columns={TEMPLATE_TABLE_COLUMNS}
                                currentPage={meta?.current_page ?? 1}
                                lastPage={meta?.last_page ?? 1}
                                pageSize={filter.per_page}
                                totalRecords={meta?.total}
                                handlePageChange={(page) => handleFilter({ page })}
                                handlePageSizeChange={(size) => handleFilter({ per_page: size, page: 1 })}
                            >
                                <Each
                                    isLoading={isLoading}
                                    of={templates}
                                    nodatafound={
                                        <TableEmptyState
                                            colSpan={TEMPLATE_TABLE_COLUMNS.length}
                                            message={CONTENT.emptyTitle}
                                            description={CONTENT.emptyDesc}
                                        />
                                    }
                                    fallback={<TableSkeletonLoader columns={TEMPLATE_TABLE_COLUMNS.length} />}
                                    render={(val: any, index: number) => (
                                        <TableRow key={val.id} className="hover:bg-muted/50">
                                            <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                                                {getSerialNumber(meta?.current_page ?? 1, filter.per_page, index)}
                                            </TableCell>
                                            <TableCell className="font-medium">{val.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">{val.card_type}</Badge>
                                            </TableCell>
                                            <TableCell>{val.is_default ? "Yes" : "—"}</TableCell>
                                            <TableCell>
                                                <Badge variant={val.is_active ? "default" : "secondary"}>
                                                    {val.is_active ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {new Date(val.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="w-1/6">
                                                <div className="flex items-center gap-0.5">
                                                    {canEdit && (
                                                        <TooltipWrapper content="Edit">
                                                            <Button
                                                                size="icon-sm"
                                                                variant="ghost"
                                                                onClick={() => router.visit(`/certificates/id-cards/templates/${val.id}/edit`)}
                                                                className="text-muted-foreground hover:text-foreground"
                                                            >
                                                                <Pencil className="size-4" />
                                                            </Button>
                                                        </TooltipWrapper>
                                                    )}
                                                    {canDelete && (
                                                        <TooltipWrapper content="Delete">
                                                            <Button
                                                                size="icon-sm"
                                                                variant="ghost"
                                                                onClick={() => deleteDisclosure.onOpen(val)}
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </TooltipWrapper>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                />
                            </DataTable>
                        </CardContent>
                    </Card>
                </div>
            </TooltipProvider>
        </>
    );
};

export default IdCardTemplates;
