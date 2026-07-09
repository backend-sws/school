import { Head, router } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { IdCardApi } from "@/lib/api/idCardApi";
import { IdCardQueryKeys } from "@/lib/querykey/idCard";
import { ID_CARDS_BREADCRUMBS, ID_CARDS_GUIDELINES, ID_CARDS_TIP } from "@/constants/page/idCard";
import {
    CARD_TABLE_COLUMNS,
    INITIAL_CARD_FILTERS,
    CARD_STATUS_VARIANT,
    CARD_STATUS_OPTIONS,
    ID_CARD_CONTENT,
    ID_CARD_PERMISSIONS,
} from "@/constants/idCard/formConfig";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { IdCard as IdCardIcon, Printer, Download } from "lucide-react";
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

const CONTENT = ID_CARD_CONTENT?.generatedCards || {
    title: "Generated ID Cards",
    subtitle: "View, download, and manage all generated student and staff identity cards.",
    generateBtn: "Generate Cards",
    searchPlaceholder: "Search by name or reg no...",
    emptyTitle: "No cards generated",
    emptyDesc: "Generate ID cards from the Generate page.",
};

const IdCardsIndex = () => {
    const { can } = useAuth();
    const canGenerate = can(ID_CARD_PERMISSIONS.generate);
    const { filter, handleFilter } = useSearchFilter(INITIAL_CARD_FILTERS);

    const handleFilterChange = (updates: Record<string, any>) => {
        handleFilter({ ...updates, page: 1 });
    };

    const { data: cardsData, isLoading } = useQuery({
        queryKey: IdCardQueryKeys.cards.list(filter),
        queryFn: () => IdCardApi.index(filter),
    });

    const cards = cardsData?.data ?? [];
    const meta = cardsData?.meta;

    return (
        <>
            <Head title={CONTENT.title} />

            <TooltipProvider>
                <div className="space-y-6">
                    <MainPageHeader
                        id="id-cards-header"
                        breadcrumbs={ID_CARDS_BREADCRUMBS}
                        icon={IdCardIcon}
                        title={CONTENT.title}
                        subtitle={CONTENT.subtitle}
                        guidance={ID_CARDS_GUIDELINES}
                        tip={ID_CARDS_TIP}
                    />

                    {canGenerate && (
                        <div className="flex justify-end">
                            <Button
                                onClick={() => router.visit("/certificates/id-cards/generate")}
                                className="w-full sm:w-auto"
                            >
                                <Printer className="size-4" />
                                <span>{CONTENT.generateBtn}</span>
                            </Button>
                        </div>
                    )}

                    <Card>
                        <CardHeader className="pb-4">
                            <FilterBar values={filter} onChange={handleFilterChange}>
                                <FilterBar.Renderer config={{
                                    filters: [
                                        { name: "status", type: "select", label: "Status", placeholder: "Status", options: CARD_STATUS_OPTIONS.map((o) => ({ label: o.text, value: o.value })) },
                                    ],
                                    searchGroup: {
                                        selectName: "search_by",
                                        searchName: "search",
                                        options: [
                                            { value: "name", label: "Name" },
                                            { value: "reg_no", label: "Reg No" },
                                        ],
                                        placeholder: CONTENT.searchPlaceholder,
                                    },
                                }} />
                            </FilterBar>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <DataTable
                                columns={CARD_TABLE_COLUMNS}
                                currentPage={meta?.current_page ?? 1}
                                lastPage={meta?.last_page ?? 1}
                                pageSize={filter.per_page}
                                totalRecords={meta?.total}
                                handlePageChange={(page) => handleFilter({ page })}
                                handlePageSizeChange={(size) => handleFilter({ per_page: size, page: 1 })}
                            >
                                <Each
                                    isLoading={isLoading}
                                    of={cards}
                                    nodatafound={
                                        <TableEmptyState
                                            colSpan={CARD_TABLE_COLUMNS.length}
                                            message={CONTENT.emptyTitle}
                                            description={CONTENT.emptyDesc}
                                        />
                                    }
                                    fallback={<TableSkeletonLoader columns={CARD_TABLE_COLUMNS.length} />}
                                    render={(val: any, index: number) => (
                                        <TableRow
                                            key={val.id}
                                            className="hover:bg-muted/50 cursor-pointer"
                                            onClick={() => router.visit(`/certificates/id-cards/${val.id}`)}
                                        >
                                            <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                                                {getSerialNumber(meta?.current_page ?? 1, filter.per_page, index)}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm font-semibold">
                                                {val.snapshot_data?.reg_no}
                                            </TableCell>
                                            <TableCell className="font-medium">{val.snapshot_data?.name || "—"}</TableCell>
                                            <TableCell>{val.snapshot_data?.stream ?? "—"}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={CARD_STATUS_VARIANT[val.status] ?? "outline"}
                                                    className="capitalize"
                                                >
                                                    {val.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {val.generated_at ? new Date(val.generated_at).toLocaleDateString() : "—"}
                                            </TableCell>
                                            <TableCell>
                                                <TooltipWrapper content="Download">
                                                    <Button size="icon-sm" variant="ghost">
                                                        <Download className="size-4" />
                                                    </Button>
                                                </TooltipWrapper>
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

export default IdCardsIndex;
