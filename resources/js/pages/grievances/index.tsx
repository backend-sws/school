import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDisclosure } from "@/hooks/useDisclosure";

import { Head } from "@inertiajs/react";
import {
  Eye,
  ShieldAlert,
  Pencil,
  Trash2,
} from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { getSerialNumber } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import GrievancesApi from "@/lib/api/grievancesApi";
import {
  GRIEVANCE_BREADCRUMBS,
  GRIEVANCE_COLUMNS,
  INITIAL_GRIEVANCE_FILTERS,
} from "@/constants/page/admin/grievance";
import { GrievancesDialog } from "@/components/admin/grienvanceDialog";
import { useRegisterGuide } from "@/components/GuideProvider";
import { GRIEVANCES_GUIDE } from "@/constants/guides/redressal";
import React from 'react';
import { FilterBar } from "@/components/filter-bar";

export const GRIENVANCES_STATUS_OPTIONS = [
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
  { label: "Inprogress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
];

const STATUS_COLORS = {
  open: "bg-blue-100 text-blue-800",
  closed: "bg-red-100 text-red-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
};

const ManageGrievances = () => {
  const queryClient = useQueryClient();
  useRegisterGuide(GRIEVANCES_GUIDE);

  const grievancesDisclosure = useDisclosure();
  const { filter, handleFilter } = useSearchFilter({
    ...INITIAL_GRIEVANCE_FILTERS,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["grievances", filter],
    queryFn: () => GrievancesApi.getGrievances(filter),
  });
  const deleteDisclosure = useDisclosure();
  const deleteGrievances = useMutation({
    mutationFn: (id: number | string) =>
      GrievancesApi.deleteGrievances(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grievances"] });
      deleteDisclosure.onClose();
    },
  });

  const handleDelete = (row: any) => {
    deleteDisclosure.onOpen(row);
  };
  const confirmDelete = () => {
    deleteGrievances.mutate(deleteDisclosure.data?.id);
  };
  const handleEdit = (row: any) => grievancesDisclosure.onOpen(row);
  const handleFilterChange = (updates: Record<string, any>) => {
    handleFilter({ ...updates, page: 1 });
  };

  return (
    <>
      <Head title="Grievances" />
      <GrievancesDialog
        open={grievancesDisclosure.isOpen}
        onClose={grievancesDisclosure.onClose}
        data={grievancesDisclosure.data}
      />

      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Stream"
        description={`Are you sure you want to delete "${deleteDisclosure.data?.ticket_no}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        isLoading={deleteGrievances.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <PageContainer maxWidth="full">
          <div className="space-y-6">
            <MainPageHeader
              id="grievances-header"
              breadcrumbs={GRIEVANCE_BREADCRUMBS}
              icon={ShieldAlert}
              title="Grievance Redressal"
              subtitle="Monitor and resolve student and staff grievances with our formal redressal system."
              guidance={GRIEVANCES_GUIDE}
            />

            <Card>
              <CardHeader className="pb-4">
                <FilterBar values={filter} onChange={handleFilterChange}>
                  <FilterBar.Renderer config={{
                    filters: [{ name: "status", type: "select", label: "Status", placeholder: "Filter by Status", options: GRIENVANCES_STATUS_OPTIONS }],
                    searchGroup: {
                      selectName: "search_by",
                      searchName: "search",
                      options: [
                        { value: "name", label: "Name" },
                        { value: "ticket_no", label: "Ticket No" },
                      ],
                      placeholder: "Search grievances...",
                    },
                  }} />
                </FilterBar>
              </CardHeader>
              <CardContent className="pt-0" id="grievances-table">
                {/* Data Table */}
                <DataTable
                  columns={GRIEVANCE_COLUMNS}
                  currentPage={data?.meta?.current_page || 1}
                  lastPage={data?.meta?.last_page || 1}
                  pageSize={filter.per_page}
                  totalRecords={data?.meta?.total}
                  handlePageChange={(page) => handleFilter({ page })}
                  handlePageSizeChange={(size) =>
                    handleFilter({ per_page: size, page: 1 })
                  }
                >
                  <Each
                    isLoading={isLoading}
                    of={data?.data}
                    nodatafound={
                      <TableEmptyState
                        colSpan={GRIEVANCE_COLUMNS.length}
                        message="No Department found"
                        description="There are no Department to display."
                      />
                    }
                    fallback={
                      <TableSkeletonLoader columns={GRIEVANCE_COLUMNS.length} />
                    }
                    render={(val, index) => (
                      <TableRow key={val?.id} className="hover:bg-muted/50">
                        {/* Serial Number */}
                        <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                          {getSerialNumber(
                            data?.meta?.current_page || 1,
                            filter.per_page || 10,
                            index,
                          )}
                        </TableCell>

                        {/* Title */}
                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">{val?.ticket_no}</span>
                        </TableCell>

                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">{val?.name}</span>
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">{val?.mobile}</span>
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">{val?.subject}</span>
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px]">
                          <span
                            className={`px-2 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[val?.status as keyof typeof STATUS_COLORS] ||
                              "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {val?.status?.replace("_", " ").toUpperCase()}
                          </span>
                        </TableCell>

                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">
                            {val?.created_at}
                          </span>
                        </TableCell>
                        {/* Actions */}
                        <TableCell className="w-1/6">
                          <div className="flex  items-center gap-0.5">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(val)}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Eye className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View / Edit</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(val)}
                                  className="text-muted-foreground hover:text-foreground disabled:opacity-40"
                                >
                                  <Pencil className="size-4" />
                                </Button>
                              </TooltipTrigger>{" "}
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(val)}
                                  disabled={deleteGrievances.isPending}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  />
                </DataTable>
              </CardContent>
            </Card>
          </div>
        </PageContainer>
      </TooltipProvider>
    </>
  );
};

export default ManageGrievances;
