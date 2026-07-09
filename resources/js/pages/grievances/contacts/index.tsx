import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
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
  Contact,
  Trash2,
} from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { getSerialNumber } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import ContactApi from "@/lib/api/contactApi";
import {
  CONTACT_BREADCRUMBS,
  CONTACT_COLUMNS,
  INITIAL_CONTACT_FILTERS,
} from "@/constants/page/admin/contact";
import { useRegisterGuide } from '@/components/GuideProvider';
import { CONTACTS_GUIDE } from "@/constants/guides/redressal";
import React from 'react';
import { FilterBar } from "@/components/filter-bar";

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Read", value: "true" },
  { label: "Unread", value: "false" },
];

const ManageContacts = () => {
  const queryClient = useQueryClient();
useRegisterGuide(CONTACTS_GUIDE);

  const { filter, handleFilter } = useSearchFilter({
    ...INITIAL_CONTACT_FILTERS,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["Contacts", filter],
    queryFn: () => ContactApi.getContacts(filter),
  });
  const deleteDisclosure = useDisclosure();
  const deleteContactMutation = useMutation({
    mutationFn: (id: number | string) =>
      ContactApi.deleteContacts(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Contacts"] });
      deleteDisclosure.onClose();
    },
  });

  const handleDelete = (row: any) => {
    deleteDisclosure.onOpen(row);
  };
  const confirmDelete = () => {
    deleteContactMutation.mutate(deleteDisclosure.data?.id);
  };
  const handleFilterChange = (updates: Record<string, any>) => {
    handleFilter({ ...updates, page: 1 });
  };

  return (
    <>
      <Head title="Contacts" />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Contact"
        description={`Are you sure you want to delete "${deleteDisclosure.data?.id}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        isLoading={deleteContactMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
          <div className="space-y-6">
            <MainPageHeader
              id="contacts-header"
              breadcrumbs={CONTACT_BREADCRUMBS}
              icon={Contact}
              guidance={CONTACTS_GUIDE}
            />

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
                        { value: "email", label: "Email" },
                      ],
                      placeholder: "Search contacts...",
                    },
                  }} />
                </FilterBar>{" "}
              </CardHeader>
              <CardContent className="pt-0" id="contacts-table">
                {/* Data Table */}
                <DataTable
                  columns={CONTACT_COLUMNS}
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
                        colSpan={CONTACT_COLUMNS.length}
                        message="No Contact found"
                        description="There are no Contact to display."
                      />
                    }
                    fallback={
                      <TableSkeletonLoader columns={CONTACT_COLUMNS.length} />
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
                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">{val?.name}</span>
                        </TableCell>
                        {/* Title */}
                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">{val?.email}</span>
                        </TableCell>

                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">{val?.mobile}</span>
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">{val?.subject}</span>
                        </TableCell>

                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">{val?.message}</span>
                        </TableCell>

                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">
                            {new Date(val?.created_at).toLocaleDateString()}
                          </span>
                        </TableCell>
                        {/* Actions */}
                        <TableCell className="">
                          <div className="flex  items-center gap-0.5">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(val)}
                                  disabled={deleteContactMutation.isPending}
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
      </TooltipProvider>
    </>
  );
};

export default ManageContacts;
