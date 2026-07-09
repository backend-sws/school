import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDisclosure } from "@/hooks/useDisclosure";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { Download, Megaphone, Wallet } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { getSerialNumber } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { StatusBadge } from "@/components/ui/status-badge";
import StudentCertificateApi from "@/lib/api/certificateApi";
import {
  INITIAL_CERTIFICATE_FILTERS,
  MY_CERTIFICATE_COLUMNS,
} from "@/constants/page/admin/certificate";
import useSearchFilter from "@/hooks/useSearchfilter";
import { usePayment } from "@/hooks/usePaymentHook";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "My Applications",
    href: "",
  },
];

const MyCertificate = () => {
  const queryClient = useQueryClient();
  const { filter, handleFilter } = useSearchFilter({
    ...INITIAL_CERTIFICATE_FILTERS,
  });
  const { mutate: startPayment, isPending: isPaymentLoading } = usePayment();

  const { data, isLoading } = useQuery({
    queryKey: ["mycertificate", filter],
    queryFn: () => StudentCertificateApi.getMyApplications(filter),
  });
  const deleteDisclosure = useDisclosure();

  return (
    <>
      <Head title="My Certificates" />

      <TooltipProvider>
        <div className="p-4 sm:p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Heading
              title="My Certificates"
              description="Manage all your Certifications."
              icon={<Megaphone className="size-5" />}
            />
          </div>

          <Card>
            <CardHeader className="pb-4"></CardHeader>
            <CardContent className="pt-0">
              {/* Data Table */}
              <DataTable
                columns={MY_CERTIFICATE_COLUMNS}
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
                      colSpan={MY_CERTIFICATE_COLUMNS.length}
                      message="No Certificate found"
                      description="There are no certificate to display."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader
                      columns={MY_CERTIFICATE_COLUMNS.length}
                    />
                  }
                  render={(val, index) => (
                    <TableRow key={val?.id} className="hover:bg-muted/50">
                      {/* Serial Number */}
                      <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                        {getSerialNumber(
                          data?.meta?.current_page || 1,
                          10,
                          index,
                        )}
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">
                          {val?.application_id}
                        </span>
                      </TableCell>
                      {/* Title */}
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">
                          {val?.certificate_name}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">{val?.amount}</span>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">
                          <StatusBadge status={val?.payment_status} />
                        </span>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">
                          <StatusBadge status={val?.process_status} />
                        </span>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">
                          {val?.remarks || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">
                          {val?.submitted_at || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">
                          {val?.completed_at || "N/A"}
                        </span>
                      </TableCell>{" "}
                      <TableCell>
                        <div className="flex  items-center gap-2.5">
                          {val?.payment_status == "pending" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex">
                                  <Button
                                    onClick={() => {
                                      startPayment({
                                        id: val?.id,
                                        type: "certificate",
                                      });
                                    }}
                                    size="icon-sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
                                  >
                                    <Wallet className="size-4" />
                                  </Button>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>Pay Now</TooltipContent>
                            </Tooltip>
                          )}
                          {val?.can_download && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex">
                                  <Button
                                    size="icon-sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
                                  >
                                    <Download className="size-4" />
                                  </Button>
                                </span>
                              </TooltipTrigger>{" "}
                              <TooltipContent>Download</TooltipContent>
                            </Tooltip>
                          )}
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

export default MyCertificate;
