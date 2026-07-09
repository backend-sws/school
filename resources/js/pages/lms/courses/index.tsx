import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FilterBar } from "@/components/filter-bar";
import { getSerialNumber } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import lmsApi from "@/lib/api/lmsApi";
import DepartmentApi from "@/lib/api/departmentApi";
import { DepartmentQueryKeys } from "@/lib/querykey/department";
import { LmsCourseDialog, type LmsCourseDialogData } from "@/components/admin/lmsCourseDialog";
import { PermissionGate } from "@/components/PermissionGate";
import {
  LMS_COURSES_BREADCRUMBS,
  LMS_COURSES_GUIDELINES,
} from "@/constants/page/admin/lms";

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "title", label: "Title" },
  { key: "slug", label: "Slug" },
  { key: "scope", label: "Scope" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

const INITIAL_FILTERS = { page: 1, per_page: 15, search: "", status: "__all__" };

const STATUS_OPTIONS = [
  { value: "__all__", label: "All" },
  { value: "0", label: "Draft" },
  { value: "1", label: "Active" },
  { value: "2", label: "Archived" },
];

type CourseRow = {
  id: number;
  title: string;
  slug?: string;
  scope_type?: string;
  scope_id?: number | null;
  status?: number;
  stream?: { id: number; name: string; code?: string } | null;
  subject?: { id: number; name: string; code?: string } | null;
  session?: { id: number; name: string; start_year?: number; end_year?: number } | null;
};

const LmsCoursesIndex = () => {
  const queryClient = useQueryClient();
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const dialogDisclosure = useDisclosure<LmsCourseDialogData>();
  const deleteDisclosure = useDisclosure<{ id: number; title: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["lms-courses", filter],
    queryFn: () =>
      lmsApi.courses.index({
        ...filter,
        status: filter.status === "__all__" ? undefined : filter.status,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => lmsApi.courses.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lms-courses"] });
      deleteDisclosure.onClose();
    },
  });

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const rows = (data?.data ?? []) as CourseRow[];
  const meta = data?.meta as { current_page?: number; last_page?: number; total?: number } | undefined;

  const scopeLabel = (row: CourseRow) => {
    if (row.scope_type === "global") return "Global";
    if (row.scope_type === "stream" && row.stream) return row.stream.name;
    if (row.scope_type === "session" && row.session) return row.session.name ?? `${row.session.start_year}-${row.session.end_year}`;
    return row.scope_type ?? "—";
  };

  const statusLabel = (status?: number) => (status === 0 ? "Draft" : status === 2 ? "Archived" : "Active");

  return (
    <>
      <Head title="LMS Courses" />
      <LmsCourseDialog
        open={dialogDisclosure.isOpen}
        onClose={() => dialogDisclosure.onClose()}
        data={dialogDisclosure.data ?? undefined}
      />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Course"
        description={`Are you sure you want to delete "${deleteDisclosure.data?.title}"? Sections, lessons, and enrollment data will be removed.`}
        onConfirm={() => deleteDisclosure.data && deleteMutation.mutate(deleteDisclosure.data.id)}
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            breadcrumbs={LMS_COURSES_BREADCRUMBS}
            icon={BookOpen}
            title="COURSES"
            subtitle="Learning courses (scope-aware)"
            guidance={LMS_COURSES_GUIDELINES}
          />
          <div className="flex justify-end">
            <PermissionGate can="create_lms_courses">
              <Button onClick={() => dialogDisclosure.onOpen(null)}>
                <Plus className="size-4" />
                <span>Add Course</span>
              </Button>
            </PermissionGate>
          </div>
          <Card>
            <CardHeader className="pb-4">
              <FilterBar values={filter} onChange={handleFilterChange}>
                <FilterBar.Renderer config={{ search: { name: "search", placeholder: "e.g. Mathematics, intro-math" }, filters: [{ name: "department_id", type: "async_select", label: "Department", asyncConfig: { queryFn: (params) => DepartmentApi.getDepartment(params), queryKey: DepartmentQueryKeys.all, labelKey: "name", valueKey: "id" } }, { name: "status", type: "select", label: "Status", placeholder: "e.g. Active", options: STATUS_OPTIONS }] }} />
              </FilterBar>
            </CardHeader>
            <CardContent className="pt-0">
              <DataTable
                columns={COLUMNS}
                currentPage={meta?.current_page ?? 1}
                lastPage={meta?.last_page ?? 1}
                pageSize={filter.per_page ?? 15}
                totalRecords={meta?.total ?? 0}
                handlePageChange={(page) => handleFilter({ page })}
                handlePageSizeChange={(size) => handleFilter({ per_page: size, page: 1 })}
              >
                <Each
                  of={rows}
                  isLoading={isLoading}
                  nodatafound={
                    <TableEmptyState
                      colSpan={COLUMNS.length}
                      message="No courses found"
                      description="Add a course to get started."
                    />
                  }
                  fallback={<TableSkeletonLoader columns={COLUMNS.length} />}
                  keyExtractor={(row: CourseRow) => row.id}
                  render={(row: CourseRow, index) => (
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                        {getSerialNumber(meta?.current_page ?? 1, filter.per_page ?? 15, index)}
                      </TableCell>
                      <TableCell className="font-medium">{row.title}</TableCell>
                      <TableCell className="text-muted-foreground">{row.slug ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{scopeLabel(row)}</TableCell>
                      <TableCell className="text-muted-foreground">{statusLabel(row.status)}</TableCell>
                      <TableCell className="w-1/6">
                        <div className="flex items-center gap-0.5">
                          <PermissionGate can="update_lms_courses">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => dialogDisclosure.onOpen(row)}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                          </PermissionGate>
                          <PermissionGate can="delete_lms_courses">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => deleteDisclosure.onOpen({ id: row.id, title: row.title })}
                                  disabled={deleteMutation.isPending}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                          </PermissionGate>
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

export default LmsCoursesIndex;
