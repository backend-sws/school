import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { useRegisterGuide } from '@/components/GuideProvider';
import { INSTITUTES_GUIDE } from "@/constants/guides/misc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type SharedData } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { Building, Building2, ChevronDown, ChevronRight, Pencil, Plus } from "lucide-react";
import { getSerialNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import OrganizationApi, { type Organization } from "@/lib/api/organizationApi";
import { useState } from 'react';
import useSearchFilter from "@/hooks/useSearchfilter";
import { FilterBar } from "@/components/filter-bar";
import { useDisclosure } from "@/hooks/useDisclosure";
import { InstitutionFormModal } from "@/components/my-organisation/InstitutionFormModal";
import {
  INSTITUTION_TABLE_COLUMNS,
  INITIAL_INSTITUTION_FILTERS,
  INSTITUTION_TYPE_FILTER_OPTIONS,
} from "@/constants/page/my-organisation/institutionForm";

const BREADCRUMBS = [
  { title: "My Organisation", href: "/my-organisation" },
  { title: "Organisations", href: "/my-organisation" },
];

interface Institution {
  id: number;
  name: string;
  code?: string | null;
  type?: string;
  city?: string | null;
  state?: string | null;
}

const TYPE_LABELS: Record<string, string> = {
  school: "School",
  college: "College",
  coaching: "Coaching",
  university: "University",
};

function InstitutionRow({
  orgId,
  orgName,
}: {
  orgId: number;
  orgName: string;
}) {
  const { data: res, isLoading } = useQuery({
    queryKey: ["organizations", orgId, "institutions"],
    queryFn: () => OrganizationApi.institutions(orgId),
    enabled: !!orgId,
  });
  const institutions = (res as { data?: Institution[] })?.data ?? [];
  const createHref = `/my-organisation/institutions/create?organization_id=${orgId}`;

  if (isLoading) {
    return (
      <>
        <TableRow className="bg-muted/30">
          <TableCell colSpan={7} className="py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Loading institutions…
              </span>
              <Button size="sm" variant="outline" asChild>
                <Link href={createHref} className="inline-flex items-center gap-1.5">
                  <Building2 className="size-3.5" />
                  Create institution
                </Link>
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </>
    );
  }
  return (
    <>
      <TableRow className="bg-muted/30">
        <TableCell colSpan={7} className="py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {institutions.length === 0
                ? "No institutions in this organisation."
                : `${institutions.length} institution(s)`}
            </span>
            <Button size="sm" variant="outline" asChild>
              <Link href={createHref} className="inline-flex items-center gap-1.5">
                <Building2 className="size-3.5" />
                Create institution
              </Link>
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {institutions.length === 0 ? null : institutions.map((inst) => (
        <TableRow key={inst.id} className="bg-muted/30 hover:bg-muted/40">
          <TableCell className="w-10" />
          <TableCell className="w-16" />
          <TableCell className="pl-8 font-medium text-sm">{inst.name}</TableCell>
          <TableCell className="font-mono text-xs text-muted-foreground">
            {inst.code ?? "—"}
          </TableCell>
          <TableCell className="text-muted-foreground text-sm">{inst.city ?? "—"}</TableCell>
          <TableCell className="text-muted-foreground text-sm">{inst.state ?? "—"}</TableCell>
          <TableCell className="text-muted-foreground text-sm">—</TableCell>
        </TableRow>
      ))}
    </>
  );
}

/** When logged in with an institution that belongs to an org: show only that org's institutions. */
function OrgInstitutionsView({
  orgId,
  orgName,
}: {
  orgId: number;
  orgName: string;
}) {
useRegisterGuide(INSTITUTES_GUIDE);
  const formModal = useDisclosure<Institution | null>();
  const { filter, handleFilter } = useSearchFilter({
    ...INITIAL_INSTITUTION_FILTERS,
  });

  const params = {
    page: filter.page ?? 1,
    per_page: filter.per_page ?? 15,
    search: filter.search || undefined,
    type: filter.type && filter.type !== "all" ? filter.type : undefined,
  };

  const { data: res, isLoading } = useQuery({
    queryKey: ["organizations", orgId, "institutions", params],
    queryFn: () => OrganizationApi.institutions(orgId, params),
    enabled: !!orgId,
  });

  const institutions = (res as { data?: Institution[] })?.data ?? [];
  const meta = (res as { meta?: { current_page: number; last_page: number; per_page: number; total: number } })?.meta;

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const handleEdit = (row: Institution) => formModal.onOpen(row);

  return (
    <>
      <Head title={`My Organisation – ${orgName}`} />

      <InstitutionFormModal
        open={formModal.isOpen}
        onClose={formModal.onClose}
        organizationId={orgId}
        data={formModal.data ?? undefined}
      />

      <div className="space-y-6">
        <MainPageHeader
          id="institutes-header"
          breadcrumbs={BREADCRUMBS}
          icon={Building2}
          title="Institutions"
          subtitle={`Institutions inside ${orgName}.`}
          guidance="Add or edit institutions that belong to your organisation."
        />

        <div className="flex justify-end">
          <Button id="new-institute-btn" onClick={() => formModal.onOpen(null)} className="inline-flex items-center gap-2">
            <Plus className="size-4" />
            Add institution
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-3">
              <div>
                <h2 className="text-lg font-semibold">Institutions in this organisation</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  All institutions under {orgName}. Filter and paginate below.
                </p>
              </div>
              <FilterBar values={filter} onChange={handleFilterChange}>
                <FilterBar.Renderer config={{ search: { name: "search", placeholder: "Search by name, code, city, state..." }, filters: [{ name: "type", type: "select", label: "Type", placeholder: "Type", options: INSTITUTION_TYPE_FILTER_OPTIONS }] }} />
              </FilterBar>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <TooltipProvider>
              <DataTable
                columns={INSTITUTION_TABLE_COLUMNS}
                currentPage={meta?.current_page ?? 1}
                lastPage={meta?.last_page ?? 1}
                pageSize={filter.per_page ?? 15}
                totalRecords={meta?.total ?? 0}
                handlePageChange={(page) => handleFilter({ page })}
                handlePageSizeChange={(size) => handleFilter({ per_page: size, page: 1 })}
              >
                <Each
                  isLoading={isLoading}
                  of={institutions}
                  nodatafound={
                    <TableEmptyState
                      colSpan={INSTITUTION_TABLE_COLUMNS.length}
                      message="No institutions found"
                      description="Add an institution or adjust filters."
                    />
                  }
                  fallback={<TableSkeletonLoader columns={INSTITUTION_TABLE_COLUMNS.length} />}
                  render={(val: Institution, index: number) => (
                    <TableRow key={val.id} className="hover:bg-muted/50">
                      <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                        {getSerialNumber(
                          meta?.current_page ?? 1,
                          filter.per_page ?? 15,
                          index,
                        )}
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <span className="truncate block">{val.name}</span>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {val.code ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm capitalize">
                        {val.type ? (TYPE_LABELS[val.type] ?? val.type) : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{val.city ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{val.state ?? "—"}</TableCell>
                      <TableCell className="w-1/6">
                        <div className="flex items-center gap-0.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => handleEdit(val)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Pencil className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                />
              </DataTable>
            </TooltipProvider>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function MyOrganisationIndex() {
  const { auth } = usePage<SharedData>().props;
  const orgId = auth?.current_organization_id ?? null;
  const orgName = auth?.current_organization_name ?? null;
  useRegisterGuide(INSTITUTES_GUIDE);

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => OrganizationApi.index({ per_page: 20 }),
    enabled: orgId == null,
  });

  const list = (res as { data?: Organization[] })?.data ?? [];
  const meta = (res as { meta?: { current_page: number; last_page: number; per_page: number; total: number } })?.meta;

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (orgId != null && orgName) {
    return <OrgInstitutionsView orgId={orgId} orgName={orgName} />;
  }

  return (
    <>
      <Head title="My Organisation – Organisations" />

      <div className="space-y-6">
        <MainPageHeader
          id="institutes-header"
          breadcrumbs={BREADCRUMBS}
          icon={Building}
          title="Organisations"
          subtitle="Manage organisations. Each organisation can have multiple institutions (schools, colleges, universities)."
          guidance="Expand a row to see institutions under that organisation."
        />

        <div className="flex justify-end">
          <Button id="new-institute-btn" asChild>
            <Link href="/my-organisation/create" className="inline-flex items-center gap-2">
              <Plus className="size-4" />
              Create Organisation
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold">All organisations</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Click a row to expand and view institutions under that organisation.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-10" />
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Institutions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <Each
                    isLoading={isLoading}
                    of={list}
                    nodatafound={
                      <TableEmptyState
                        colSpan={7}
                        message="No organisations yet"
                        description="Create an organisation to get started."
                      />
                    }
                    fallback={<TableSkeletonLoader columns={7} />}
                    render={(row: Organization, index: number) => (
                      <>
                        <TableRow
                          key={row.id}
                          className="hover:bg-muted/50 cursor-pointer"
                          onClick={() => toggleExpand(row.id)}
                        >
                          <TableCell className="w-10 py-2">
                            {expandedId === row.id ? (
                              <ChevronDown className="size-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="size-4 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                            {getSerialNumber(meta?.current_page ?? 1, meta?.per_page ?? 20, index)}
                          </TableCell>
                          <TableCell className="font-medium">{row.name}</TableCell>
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            {row.code ?? "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{row.city ?? "—"}</TableCell>
                          <TableCell className="text-muted-foreground">{row.state ?? "—"}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {row.institutions_count != null ? row.institutions_count : "0"}
                          </TableCell>
                        </TableRow>
                        {expandedId === row.id && (
                          <InstitutionRow orgId={row.id} orgName={row.name} />
                        )}
                      </>
                    )}
                  />
                </TableBody>
              </Table>
            </div>
            {meta && meta.last_page > 1 && (
              <div className="mt-3 text-sm text-muted-foreground">
                Page {meta.current_page} of {meta.last_page} ({meta.total} total)
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
