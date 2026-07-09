import DataTable, {
    TableEmptyState,
    TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDisclosure } from "@/hooks/useDisclosure";
import SettingsLayout from "@/layouts/settings/layout";
import { Head, Link } from "@inertiajs/react";
import { Pencil, Trash2, Plus, Shield } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RoleApi from "@/lib/api/roleApi";
import { getSerialNumber } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ROLE_BREADCRUMBS, ROLE_COLUMNS, INITIAL_ROLE_FILTERS } from "@/constants/page/admin/role";
import useSearchFilter from "@/hooks/useSearchfilter";
import { PermissionSyncSheet } from "@/components/admin/PermissionSyncSheet";
import { PermissionGate } from "@/components/PermissionGate";
import React from "react";
import { toast } from "sonner";
;
import { useRegisterGuide } from '@/components/GuideProvider';
import { ROLES_GUIDE } from "@/constants/guides/roles";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import { TooltipProvider } from "@/components/ui/tooltip";

interface Role {
    id: number;
    name: string;
    key: string;
    level: number;
    description: string | null;
    is_system: boolean;
}

const SecurityRoles = () => {
    const queryClient = useQueryClient();
    useRegisterGuide(ROLES_GUIDE);

    const { filter, handleFilter } = useSearchFilter(INITIAL_ROLE_FILTERS);

    const permissionDisclosure = useDisclosure();
    const deleteDisclosure = useDisclosure();

    const { data, isLoading } = useQuery({
        queryKey: ["roles", "custom", filter],
        queryFn: () => RoleApi.getCustomRoles({ page: filter.page, per_page: filter.per_page }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number | string) => RoleApi.deleteRole(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles", "custom"] });
            deleteDisclosure.onClose();
            toast.success("Role deleted");
        },
    });

    const handleManagePermissions = (row: Role) => permissionDisclosure.onOpen(row);

    const customColumns = [
        ...ROLE_COLUMNS.slice(0, -1).filter((c) => c.key !== "level"),
        { key: "action", label: "Actions" },
    ];

    const confirmDelete = () => {
        deleteMutation.mutate(deleteDisclosure.data?.id);
    };

    const renderRoleRow = (val: Role, index: number) => (
        <TableRow key={val?.id} className="hover:bg-muted/50">
            <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                {getSerialNumber(
                    data?.meta?.current_page || 1,
                    filter.per_page || 10,
                    index,
                )}
            </TableCell>

            <TableCell className="font-medium max-w-[200px]">
                <span className="truncate block">{val.name}</span>
            </TableCell>

            <TableCell className="text-muted-foreground font-mono text-xs max-w-[180px]">
                <span className="truncate block">{val.key}</span>
            </TableCell>

            <TableCell className="text-muted-foreground max-w-[300px]">
                <span className="truncate block text-xs leading-relaxed">
                    {val.description || <span className="text-muted-foreground/50 italic">No description</span>}
                </span>
            </TableCell>

            <TableCell className="w-1/6">
                <div className="flex items-center gap-0.5">
                    <PermissionGate can="update_roles">
                        <TooltipWrapper content="Edit Role">
                            <Button size="icon-sm" variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                                <Link href={`/admin/roles/${val.id}/edit`}>
                                    <Pencil className="size-4" />
                                </Link>
                            </Button>
                        </TooltipWrapper>
                    </PermissionGate>
                    <PermissionGate can="delete_roles">
                        <TooltipWrapper content="Delete Role">
                            <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => deleteDisclosure.onOpen(val)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </TooltipWrapper>
                    </PermissionGate>
                </div>
            </TableCell>
        </TableRow>
    );

    return (
        <>
            <Head title="Security Roles" />

            <PermissionSyncSheet
                open={permissionDisclosure.isOpen}
                onClose={permissionDisclosure.onClose}
                role={permissionDisclosure.data}
            />

            <ConfirmDialog
                open={deleteDisclosure.isOpen}
                onOpenChange={deleteDisclosure.onClose}
                title="Delete Role"
                description={`Are you sure you want to delete the role "${deleteDisclosure.data?.name}"? This action cannot be undone.`}
                onConfirm={confirmDelete}
                isLoading={deleteMutation.isPending}
                confirmText="Delete"
                variant="danger"
                confirmationKeyword="DELETE"
            />

            <SettingsLayout>
                <PageContainer maxWidth="full">
                    <TooltipProvider>
                        <div className="space-y-8">
                            <MainPageHeader
                                id="roles-header"
                                breadcrumbs={ROLE_BREADCRUMBS}
                                icon={Shield}
                                title="Security Roles"
                                subtitle="Manage user access levels and granular permissions."
                                guidance={ROLES_GUIDE}
                                tip="Roles define what staff can see and do. Use custom roles to map your internal hierarchy directly to platform permissions, ensuring data security and focused functional workflows for every department."
                            />
                            <div className="flex justify-end">
                                <PermissionGate can="create_roles">
                                    <Button asChild>
                                        <Link href="/admin/roles/create" className="inline-flex items-center gap-2" id="create-role-btn">
                                            <Plus className="size-4" />
                                            Create Custom Role
                                        </Link>
                                    </Button>
                                </PermissionGate>
                            </div>

                        <Card id="roles-table">
                            <CardContent className="pt-6">
                                <DataTable
                                    columns={customColumns}
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
                                        of={data?.data ?? []}
                                        nodatafound={
                                            <TableEmptyState
                                                colSpan={customColumns.length}
                                                message="No custom roles created yet"
                                                description="Create your first institution-specific role using the button above."
                                            />
                                        }
                                        fallback={
                                            <TableSkeletonLoader columns={customColumns.length} />
                                        }
                                        render={renderRoleRow}
                                    />
                                </DataTable>
                            </CardContent>
                        </Card>
                        </div>
                    </TooltipProvider>
                </PageContainer>
            </SettingsLayout>

        </>
    );
};

export default SecurityRoles;
