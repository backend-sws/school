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
import { useAuth } from "@/hooks/use-can";
import { TicketDialog } from "@/components/admin/createTicketDialog";
import {
  Ticket,
  Check,
  Lock,
  MessageCircle,
  Plus,
} from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { getSerialNumber } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { FilterBar } from "@/components/filter-bar";
import SupportTicketApi from "@/lib/api/supportTicketApi";
import {
  INITIAL_SUPPORT_TICKET_FILTERS,
  SUPPORT_TICKET_BREADCRUMBS,
  SUPPORT_TICKET_COLUMNS,
  STUDENT_TICKETS_BREADCRUMBS,
  STUDENT_SUPPORT_TICKET_COLUMNS,
} from "@/constants/page/admin/supportTicket";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupportTicketMessageDialog } from "@/components/admin/supportTicketMessageDialog";
import { useRegisterGuide } from '@/components/GuideProvider';
import { TICKETS_GUIDE } from "@/constants/guides/redressal";
import React from 'react';

const SUPPORT_FOR_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Certificate", value: "Certificate" },
  { label: "Admission", value: "Admission" },
  { label: "Fee Payment", value: "Fee Payment" },
];
const STATUS_OPTIONS = [
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in-progress" },
  { label: "Closed", value: "closed" },
];
const PRIORITY_OPTIONS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const SupportTicket = () => {
  const queryClient = useQueryClient();
useRegisterGuide(TICKETS_GUIDE);
  const { can } = useAuth();
  const isStudent = can("portal");

  const breadcrumbs = isStudent
    ? STUDENT_TICKETS_BREADCRUMBS
    : SUPPORT_TICKET_BREADCRUMBS;
  const columns = isStudent
    ? STUDENT_SUPPORT_TICKET_COLUMNS
    : SUPPORT_TICKET_COLUMNS;

  const SupportTicketDisclosure = useDisclosure();
  const TicketDisclosure = useDisclosure();
  const messageDialogDisclosure = useDisclosure();
  const { filter, handleFilter } = useSearchFilter({
    ...INITIAL_SUPPORT_TICKET_FILTERS,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["SupportTicket", filter],
    queryFn: () => SupportTicketApi.getSupportTicket(filter),
  });
  const deleteDisclosure = useDisclosure();
  const closeSupportTicket = useMutation({
    mutationFn: (id: number | string) =>
      SupportTicketApi.closeeSupportTicket(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["SupportTicket"] });
      deleteDisclosure.onClose();
    },
  });
  const updatePriorityMutation = useMutation({
    mutationFn: ({ id, priority }: { id: number | string; priority: string }) =>
      SupportTicketApi.updateSupportTicket(id as string, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["SupportTicket"] });
    },
  });

  const handleDelete = (row: any) => {
    deleteDisclosure.onOpen(row);
  };
  const confirmDelete = () => {
    closeSupportTicket.mutate(deleteDisclosure.data?.id);
  };
  const handleEdit = (row: any) => SupportTicketDisclosure.onOpen(row);
  const handleViewMessages = (row: any) => {
    messageDialogDisclosure.onOpen(row);
  };
  const handleFilterChange = (updates: Record<string, any>) => {
    handleFilter({ ...updates, page: 1 });
  };
  const toggleStatusDisclosure = useDisclosure<any>();
  const toggleStatusMutation = useMutation({
    mutationFn: (id: number | string) =>
      SupportTicketApi.togglSupportTicket(
        toggleStatusDisclosure?.data?.id as any,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["SupportTicket"] });
      toggleStatusDisclosure.onClose();
    },
  });

  // Status filter options
  const handleToggleStatus = (row: any) => {
    toggleStatusDisclosure.onOpen(row);
  };
  const confirmToggleStatus = () => {
    toggleStatusMutation.mutate(toggleStatusDisclosure.data?.id);
  };

  return (
    <>
      <Head title={isStudent ? "My Tickets" : "Support Ticket"} />
      <TicketDialog
        open={TicketDisclosure.isOpen}
        onClose={TicketDisclosure.onClose}
        data={TicketDisclosure.data}
      />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Close Ticket"
        description={`Are you sure you want to close "${deleteDisclosure.data?.id}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        isLoading={closeSupportTicket.isPending}
        confirmText="close"
        variant="danger"
        confirmationKeyword="CLOSE"
      />
      <ConfirmDialog
        open={toggleStatusDisclosure.isOpen}
        onOpenChange={toggleStatusDisclosure.onClose}
        title={toggleStatusDisclosure.data?.is_read ? "Unread" : "Read"}
        description={`Are you sure you want to ${toggleStatusDisclosure.data?.is_read === true ? "Unread" : "Read"
          }?`}
        onConfirm={confirmToggleStatus}
        isLoading={toggleStatusMutation.isPending}
        variant={
          toggleStatusDisclosure.data?.status === true ? "info" : "warning"
        }
        confirmText={
          toggleStatusDisclosure.data?.is_read === true ? "UnRead" : "Read"
        }
      />
      <SupportTicketMessageDialog
        open={messageDialogDisclosure.isOpen}
        onClose={messageDialogDisclosure.onClose}
        data={messageDialogDisclosure.data}
      />
      <TooltipProvider>
          <div className="space-y-6">
            <MainPageHeader
              id="tickets-header"
              breadcrumbs={isStudent ? STUDENT_TICKETS_BREADCRUMBS : SUPPORT_TICKET_BREADCRUMBS}
              icon={Ticket}
              guidance={TICKETS_GUIDE}
            />

            {isStudent && (
              <div className="flex justify-end">
                <Button
                  onClick={() => TicketDisclosure.onOpen()}
                  className="w-full sm:w-auto"
                >
                  <Plus className="size-4" />
                  <span>Create Ticket</span>
                </Button>
              </div>
            )}

            <Card>
              <CardHeader className="pb-4">
                <FilterBar id="tickets-filters" values={filter} onChange={handleFilterChange}>
                  <FilterBar.Renderer config={{
                    filters: [{ name: "support_for", type: "select", label: "Support For", placeholder: "Support For", options: SUPPORT_FOR_OPTIONS }, { name: "status", type: "select", label: "Status", placeholder: "Status", options: STATUS_OPTIONS }, { name: "priority", type: "select", label: "Priority", placeholder: "Priority", options: PRIORITY_OPTIONS }],
                    searchGroup: {
                      selectName: "search_by",
                      searchName: "search",
                      options: [
                        { value: "ticket_id", label: "Ticket ID" },
                        { value: "subject", label: "Subject" },
                      ],
                      placeholder: "Search tickets...",
                    },
                  }} />
                </FilterBar>
              </CardHeader>
              <CardContent className="pt-0" id="tickets-table">
                {/* Data Table */}
                <DataTable
                  columns={columns}
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
                        colSpan={columns.length}
                        message={isStudent ? "No tickets found" : "No Ticket found"}
                        description={
                          isStudent
                            ? "You haven't raised any support tickets yet."
                            : "There are no Ticket to display."
                        }
                      />
                    }
                    fallback={
                      <TableSkeletonLoader
                        columns={columns.length}
                      />
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
                          <span className="truncate block">{val?.ticket_id}</span>
                        </TableCell>
                        {/* Title */}
                        {!isStudent && (
                          <TableCell className="font-medium max-w-[200px]">
                            <span className="truncate block">
                              {val?.user?.name}
                            </span>
                          </TableCell>
                        )}

                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">
                            {val?.issue_type}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">{val?.subject}</span>
                        </TableCell>

                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">
                            {val?.description}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">{val?.status}</span>
                        </TableCell>
                        {!isStudent && (
                          <TableCell className="font-medium max-w-[200px]">
                            <span className="truncate block">
                              {val?.priority}
                            </span>
                          </TableCell>
                        )}
                        <TableCell className="font-medium max-w-[200px]">
                          <span className="truncate block">
                            {new Date(val?.created_at).toLocaleDateString()}
                          </span>
                        </TableCell>
                        {/* Actions */}
                        <TableCell>
                          <div className="flex  items-center gap-2.5">
                            {!isStudent && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Select
                                      value={val?.priority}
                                      onValueChange={(priority) =>
                                        updatePriorityMutation.mutate({
                                          id: val?.id,
                                          priority,
                                        })
                                      }
                                      disabled={updatePriorityMutation.isPending}
                                    >
                                      <SelectTrigger className="h-8 w-[110px]">
                                        <SelectValue placeholder="Priority" />
                                      </SelectTrigger>

                                      <SelectContent>
                                        <Each
                                            of={PRIORITY_OPTIONS}
                                            keyExtractor={(p) => String(p.value)}
                                            render={(p) => (
                                          <SelectItem key={p.value} value={p.value}>
                                            {p.label}
                                          </SelectItem>
                                        )}
                                        />
                                      </SelectContent>
                                    </Select>
                                  </TooltipTrigger>

                                  <TooltipContent>Change Priority</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex">
                                    <Button
                                      size="icon-sm"
                                      variant="ghost"
                                      onClick={() => handleViewMessages(val)}
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <MessageCircle className="size-4" />
                                    </Button>
                                  </span>
                                </TooltipTrigger>

                                <TooltipContent>View Messages</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            {!isStudent && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="inline-flex">
                                      <Button
                                        size="icon-sm"
                                        variant="ghost"
                                        onClick={() => handleDelete(val)}
                                        disabled={
                                          val?.status !== "open" ||
                                          closeSupportTicket.isPending
                                        }
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
                                      >
                                        {val?.status === "open" ? (
                                          <Check className="size-4" />
                                        ) : (
                                          <Lock className="size-4" />
                                        )}
                                      </Button>
                                    </span>
                                  </TooltipTrigger>

                                  <TooltipContent>
                                    {val?.status === "open"
                                      ? "Close Ticket"
                                      : "Already Closed"}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
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

export default SupportTicket;
