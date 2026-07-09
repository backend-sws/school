import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { Head } from "@inertiajs/react";
import { Users, Pencil, Eye, Plus, UserPlus } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { getSerialNumber } from "@/lib/utils";
import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import { CandidateDialog } from "@/components/admin/candidateDialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import StudentApi from "@/lib/api/studentApi";
import Each from "@/components/Each";
;
import { useRegisterGuide } from '@/components/GuideProvider';
import { CANDIDATES_GUIDE } from "@/constants/guides/candidates";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import { FilterBar } from "@/components/filter-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useFilterRegistry } from "@/hooks/useFilterRegistry";
import {
  CANDIDATE_BREADCRUMBS,
  CANDIDATE_COLUMNS,
  CANDIDATE_SEARCH_TYPES,
  CANDIDATE_VERIFIED_OPTIONS,
  INITIAL_CANDIDATE_FILTERS,
  CANDIDATE_FILTER_MAPPING,
  CANDIDATE_TOOLTIPS,
  CANDIDATE_GUIDELINES,
  CANDIDATE_TIP,
} from "@/constants/page/admin/candidate";
import { CandidateQueryKeys } from "@/lib/querykey/candidate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Candidate = () => {
  const queryClient = useQueryClient();
useRegisterGuide(CANDIDATES_GUIDE);

  const { filter, buildParams, handleFilter } = useSearchFilter({
    ...INITIAL_CANDIDATE_FILTERS,
  });

  const filterConfig = useFilterRegistry("candidate_management");

  const candidateDisclosure = useDisclosure<any>();
  const toggleStatusDisclosure = useDisclosure<any>();

  const toggleStatusMutation = useMutation({
    mutationFn: (id: number | string) =>
      StudentApi.updateCandidateStatus(id, { status: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CandidateQueryKeys.all });
      toggleStatusDisclosure.onClose();
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: CandidateQueryKeys.list(filter),
    queryFn: () =>
      StudentApi.getCandidates(buildParams(CANDIDATE_FILTER_MAPPING)),
  });

  const handleOpen = (id?: any, viewMode = false) =>
    candidateDisclosure.onOpen(id ? { id, viewMode } : null);

  const handleEdit = (id: any) => handleOpen(id, false);
  const handleView = (id: any) => handleOpen(id, true);

  const handleToggleStatus = (row: any) => {
    toggleStatusDisclosure.onOpen(row);
  };

  const confirmToggleStatus = () => {
    toggleStatusMutation.mutate(toggleStatusDisclosure.data?.id);
  };

  const handleFilterChange = (updates: Record<string, any>) => {
    handleFilter({ ...updates, page: 1 });
  };

  return (
    <>
      <Head title="Candidate Management" />

      <CandidateDialog
        open={candidateDisclosure.isOpen}
        onClose={candidateDisclosure.onClose}
        candidate={candidateDisclosure.data}
      />

      <ConfirmDialog
        open={toggleStatusDisclosure.isOpen}
        onOpenChange={toggleStatusDisclosure.onClose}
        title={
          toggleStatusDisclosure.data?.status === 0
            ? "Activate Account"
            : "Deactivate Account"
        }
        description={`Are you sure you want to ${toggleStatusDisclosure.data?.status === 0 ? "activate" : "deactivate"
          } the account for "${toggleStatusDisclosure.data?.name}"?`}
        onConfirm={confirmToggleStatus}
        isLoading={toggleStatusMutation.isPending}
        variant={toggleStatusDisclosure.data?.status === 0 ? "info" : "warning"}
        confirmText={
          toggleStatusDisclosure.data?.status === 0 ? "Activate" : "Deactivate"
        }
      />

      <TooltipProvider>
        <PageContainer maxWidth="full">
          <div className="space-y-6">
            <MainPageHeader
              id="candidates-header"
              breadcrumbs={CANDIDATE_BREADCRUMBS}
              icon={UserPlus}
              title="Candidate Management"
              subtitle="Review and process student applications and registrations."
              guidance={CANDIDATE_GUIDELINES}
              tip={CANDIDATE_TIP}
            >
              <Button onClick={() => window.location.href = '/admission/applications/new'}>
                <Plus className="size-4 mr-2" />
                Add Student
              </Button>
            </MainPageHeader>

          <Card id="candidates-table">
            <CardHeader className="pb-4" id="candidates-filter-bar">
              <FilterBar values={filter} onChange={handleFilterChange}>
                <FilterBar.Renderer config={filterConfig} />
              </FilterBar>
            </CardHeader>

            <CardContent className="pt-0">
              <DataTable
                columns={CANDIDATE_COLUMNS}
                currentPage={data?.meta?.current_page || 1}
                lastPage={data?.meta?.last_page || 1}
                pageSize={filter.perPage}
                totalRecords={data?.meta?.total}
                handlePageChange={(page) => handleFilter({ page })}
                handlePageSizeChange={(size) =>
                  handleFilter({ perPage: size, page: 1 })
                }
              >
                <Each
                  of={data?.data}
                  isLoading={isLoading}
                  nodatafound={
                    <TableEmptyState
                      colSpan={CANDIDATE_COLUMNS.length}
                      message="No candidates found"
                      description="There are no candidates to display."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader columns={CANDIDATE_COLUMNS.length} />
                  }
                  render={(val, index) => (
                    <TableRow key={val.id} className="hover:bg-muted/50">
                      <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                        {getSerialNumber(
                          data?.meta?.current_page || 1,
                          filter.perPage || 10,
                          index,
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{val.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {val.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {val.mobile}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={
                            val.email_verified ? "verified" : "unverified"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={val.status ? "active" : "inactive"}
                        />
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-0.5">
                          <TooltipWrapper content="View Details">
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => handleView(val.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Eye className="size-4" />
                            </Button>
                          </TooltipWrapper>

                          <TooltipWrapper content="Edit Candidate">
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => handleEdit(val.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Pencil className="size-4" />
                            </Button>
                          </TooltipWrapper>

                          <TooltipWrapper
                            content={
                              val?.status === 0
                                ? "Activate Account"
                                : "Deactivate Account"
                            }
                          >
                            <div className="px-2">
                              <Switch
                                checked={val?.status === 1}
                                onCheckedChange={() => handleToggleStatus(val)}
                                disabled={toggleStatusMutation.isPending}
                              />
                            </div>
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
      </PageContainer>
    </TooltipProvider>
    </>
  );
};

export default Candidate;
