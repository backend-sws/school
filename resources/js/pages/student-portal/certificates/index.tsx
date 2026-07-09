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
import { File, Megaphone } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { getSerialNumber } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { StatusBadge } from "@/components/ui/status-badge";
import StudentCertificateApi from "@/lib/api/certificateApi";
import { CertificateApplyDialog } from "@/components/admin/certificateApplyDialog";
import {
  CERTIFICATE_COLUMNS,
  INITIAL_CERTIFICATE_FILTERS,
} from "@/constants/page/admin/certificate";
import useSearchFilter from "@/hooks/useSearchfilter";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "All Certificates",
    href: "",
  },
];

const Certificate = () => {
  const queryClient = useQueryClient();
  //   const { filter, handleFilter } = useSearchFilter({
  //     ...INITIAL_CERTIFICATE_FILTERS,
  //   });

  const { data, isLoading } = useQuery({
    queryKey: ["certificate"],
    queryFn: () => StudentCertificateApi.getCertificateList(),
  });
  const myCertificateDisclosure = useDisclosure();
  const handleEdit = (row: any) => myCertificateDisclosure.onOpen(row);

  return (
    <>
      <Head title="All Certificate" />
      <CertificateApplyDialog
        open={myCertificateDisclosure.isOpen}
        onClose={myCertificateDisclosure.onClose}
        data={myCertificateDisclosure.data}
      />
      <TooltipProvider>
        <div className="p-4 sm:p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Heading
              title="All Certificates"
              description="Apply for certifications."
              icon={<Megaphone className="size-5" />}
            />
          </div>

          <Card>
            <CardHeader className="pb-4"></CardHeader>
            <CardContent className="pt-0">
              {/* Data Table */}
              <DataTable
                columns={CERTIFICATE_COLUMNS}
                currentPage={data?.meta?.current_page || 1}
                lastPage={data?.meta?.last_page || 1}
                // pageSize={filter.per_page}
                totalRecords={data?.meta?.total}
                // handlePageChange={(page) => handleFilter({ page })}
                // handlePageSizeChange={(size) =>
                //   handleFilter({ per_page: size, page: 1 })
                // }
              >
                <Each
                  isLoading={isLoading}
                  of={data?.data}
                  nodatafound={
                    <TableEmptyState
                      colSpan={CERTIFICATE_COLUMNS.length}
                      message="No Certificate found"
                      description="There are no certificate to display."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader columns={CERTIFICATE_COLUMNS.length} />
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
                        <span className="truncate block">{val?.title}</span>
                      </TableCell>
                      {/* Title */}
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">
                          {val?.description}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">
                          {val?.fee_amount}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex  items-center gap-2.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex">
                                <Button
                                  onClick={() => handleEdit(val)}
                                  size="icon-sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
                                >
                                  <File className="size-4" />
                                </Button>
                              </span>
                            </TooltipTrigger>{" "}
                            <TooltipContent>Apply</TooltipContent>
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

export default Certificate;
