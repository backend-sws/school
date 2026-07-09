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
  Check,
  Eye,
  Lock,
  LockOpen,
  MessageCircle,
  Pencil,
  Plus,
  TicketCheck,
  ToggleLeftIcon,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { getSerialNumber } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { FilterBar } from "@/components/filter-bar";
import { Switch } from "@/components/ui/switch";
import SupportTicketApi from "@/lib/api/supportTicketApi";
import {
  INITIAL_SUPPORT_TICKET_FILTERS,
  STUDENT_SUPPORT_TICKET_COLUMNS,
  STUDENT_TICKETS_BREADCRUMBS,
} from "@/constants/page/admin/supportTicket";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupportTicketMessageDialog } from "@/components/admin/supportTicketMessageDialog";
import { TicketDialog } from "@/components/admin/createTicketDialog";

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

const STATUS_COLORS = {
  open: "bg-blue-100 text-blue-800",
  closed: "bg-red-100 text-red-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
};

const Tickets = () => {
  const queryClient = useQueryClient();
  const TicketDisclosure = useDisclosure();
  const messageDialogDisclosure = useDisclosure();
  const { filter, handleFilter } = useSearchFilter({
    ...INITIAL_SUPPORT_TICKET_FILTERS,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["studentTicket", filter],
    queryFn: () => SupportTicketApi.getSupportTicket(filter),
  });
  const deleteDisclosure = useDisclosure();
  const closeSupportTicket = useMutation({
    mutationFn: (id: number | string) =>
      SupportTicketApi.closeeSupportTicket(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentTicket"] });
      deleteDisclosure.onClose();
    },
  });

  const confirmDelete = () => {
    closeSupportTicket.mutate(deleteDisclosure.data?.id);
  };
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
      queryClient.invalidateQueries({ queryKey: ["studentTicket"] });
      toggleStatusDisclosure.onClose();
    },
  });

  return (
    <>
      <Head title="Ticket" />

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
      <SupportTicketMessageDialog
        open={messageDialogDisclosure.isOpen}
        onClose={messageDialogDisclosure.onClose}
        data={messageDialogDisclosure.data}
        showpriority={false}
      />
      <TooltipProvider>
        <div className="p-4 sm:p-6 space-y-6">
          <MainPageHeader
            breadcrumbs={STUDENT_TICKETS_BREADCRUMBS}
            icon={TicketCheck}
            title="My Tickets"
            subtitle="Create and track support tickets for certificates, admission, or fee payment."
            guidance="Open a new ticket for any query. You can filter by status and view the message thread for each ticket."
          />
          <div className="flex justify-end">
            <Button
              onClick={() => TicketDisclosure.onOpen()}
              className="w-full sm:w-auto"
            >
              <Plus className="size-4" />
              <span>Create Ticket</span>
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <FilterBar values={filter} onChange={handleFilterChange}>
                <FilterBar.Renderer config={{ search: { name: "search", placeholder: "Search by Ticket Id" }, filters: [{ name: "support_for", type: "select", label: "Support For", placeholder: "Support For", options: SUPPORT_FOR_OPTIONS }, { name: "status", type: "select", label: "Status", placeholder: "Status", options: STATUS_OPTIONS }, { name: "priority", type: "select", label: "Priority", placeholder: "Priority", options: PRIORITY_OPTIONS }] }} />
              </FilterBar>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Data Table */}
              <DataTable
                columns={STUDENT_SUPPORT_TICKET_COLUMNS}
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
                      colSpan={STUDENT_SUPPORT_TICKET_COLUMNS.length}
                      message="No Ticket found"
                      description="There are no Ticket to display."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader
                      columns={STUDENT_SUPPORT_TICKET_COLUMNS.length}
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
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">
                          {val?.user?.name}
                        </span>
                      </TableCell>
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
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">
                          {new Date(val?.created_at).toLocaleDateString()}
                        </span>
                      </TableCell>{" "}
                      <TableCell>
                        <div className="flex  items-center gap-2.5">
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
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex">
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  disabled={true}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
                                >
                                  {val?.status === "open" ? (
                                    <LockOpen className="size-4" />
                                  ) : (
                                    <Lock className="size-4" />
                                  )}
                                </Button>
                              </span>
                            </TooltipTrigger>

                            <TooltipContent>
                              {val?.status === "open"
                                ? "Ticket Open"
                                : "Already Closed"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      {/* Actions */}
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

export default Tickets;
