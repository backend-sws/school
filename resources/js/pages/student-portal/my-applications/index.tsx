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
import { Head } from "@inertiajs/react";
import { Download, File, Wallet } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { getSerialNumber } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import AdmissionApi from "@/lib/api/student/admissionApi";
import {
  APPLICATION_COLUMNS,
  INITIAL_APPLICATION_FILTERS,
  MY_APPLICATIONS_BREADCRUMBS,
} from "@/constants/page/admin/MyApplications";
import { StatusBadge } from "@/components/ui/status-badge";
import useSearchFilter from "@/hooks/useSearchfilter";
import redirectToPayU from "@/lib/payUredirect";
import PaymentApi from "@/lib/api/payment";
import { useRegisterGuide } from '@/components/GuideProvider';
import { STUDENT_APPLICATIONS_GUIDE } from "@/constants/guides/studentPortal";
;

const MyApplications = () => {
useRegisterGuide(STUDENT_APPLICATIONS_GUIDE);

  const { filter, handleFilter } = useSearchFilter({
    ...INITIAL_APPLICATION_FILTERS,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["studentTicket", filter],
    queryFn: () => AdmissionApi.myApplications(filter),
  });
  const paymentMutation = useMutation({
    mutationFn: PaymentApi.dopayment,
    onSuccess: (res) => {
      const paymentData = res.data;

      if (!paymentData) return;

      redirectToPayU(paymentData);
    },
  });
  const handlePayment = (applicationId: any, admissionType: any) => {
    paymentMutation.mutate({
      id: applicationId,
      type: admissionType,
    });
  };

  return (
    <>
      <Head title="My Applications" />

      <TooltipProvider>
        <div className="p-4 sm:p-6 space-y-6">
          <MainPageHeader
            id="student-applications-header"
            breadcrumbs={MY_APPLICATIONS_BREADCRUMBS}
            icon={File}
            title="My Applications"
            subtitle="View and manage all your admission applications."
          />

          <Card>
            <CardHeader className="pb-4"></CardHeader>
            <CardContent className="pt-0">
              {/* Data Table */}
              <DataTable
                columns={APPLICATION_COLUMNS}
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
                      colSpan={APPLICATION_COLUMNS.length}
                      message="No Applications found"
                      description="There are no applications to display."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader columns={APPLICATION_COLUMNS.length} />
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
                          {val?.application_no}
                        </span>
                      </TableCell>
                      {/* Title */}
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">
                          {val?.applied_for == "new"
                            ? "New Admission"
                            : "Re Admission"}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">{val?.session}</span>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">{val?.semester}</span>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">
                          {val?.admission_head}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <StatusBadge status={val?.payment_status} />
                      </TableCell>{" "}
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">
                          <StatusBadge status={val?.process_status} />
                        </span>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">
                          {new Date(val?.submitted_at).toLocaleDateString()}
                        </span>
                      </TableCell>{" "}
                      <TableCell>
                        <div className="flex  items-center gap-2.5">
                          {!val?.can_download && (
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

                          {val?.payment_status == "pending" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex">
                                  <Button
                                    onClick={() =>
                                      handlePayment(val?.id, "admission")
                                    }
                                    disabled={paymentMutation.isPending}
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

export default MyApplications;
