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
import {
    Pencil,
    Trash2,
    Key,
    Plus,
    Workflow as WorkflowIcon,
} from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import WorkflowApi from "@/lib/api/workflowApi";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { WORKFLOW_BREADCRUMBS, WORKFLOW_COLUMNS } from "@/constants/page/admin/workflow";
import { PermissionSyncSheet } from "@/components/admin/PermissionSyncSheet";
import { PermissionGate } from "@/components/PermissionGate";
import React from "react";
import { toast } from "sonner";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import { TooltipProvider } from "@/components/ui/tooltip";

interface Workflow {
    id: number;
    name: string;
    key: string;
    description: string | null;
    permissions_count?: number;
}

const SecurityWorkflows = () => {
    const queryClient = useQueryClient();

    const permissionDisclosure = useDisclosure();
    const deleteDisclosure = useDisclosure();

    const { data, isLoading } = useQuery({
        queryKey: ["workflows"],
        queryFn: () => WorkflowApi.getWorkflows(),
    });

    const workflows = (data?.data as Workflow[]) || [];

    const deleteMutation = useMutation({
        mutationFn: (id: number | string) => WorkflowApi.deleteWorkflow(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workflows"] });
            deleteDisclosure.onClose();
            toast.success("Workflow deleted");
        },
    });

    const handleManagePermissions = (row: Workflow) => permissionDisclosure.onOpen(row);

    const confirmDelete = () => {
        deleteMutation.mutate(deleteDisclosure.data?.id);
    };

    const renderWorkflowRow = (val: Workflow, index: number) => (
        <TableRow key={val?.id} className="hover:bg-muted/50 transition-colors group">
            <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                {index + 1}
            </TableCell>

            <TableCell className="py-4">
                <Link href={`/admin/workflows/${val.id}/edit`} className="flex flex-col gap-0.5 outline-none font-medium text-foreground group-hover:text-primary transition-colors underline-offset-4 decoration-primary/30 decoration-1 group-hover:underline">
                    {val.name}
                </Link>
            </TableCell>

            <TableCell className="text-muted-foreground">
                <span className="truncate max-w-[300px] block text-xs leading-relaxed">
                    {val.description || <span className="text-muted-foreground/30 italic">No description</span>}
                </span>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs">
                    <Key className="size-3" />
                    {val.permissions_count || 0} Permissions
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-0.5">
                    <TooltipWrapper content="Sync Permissions">
                        <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => handleManagePermissions(val)}
                            className="text-primary hover:bg-primary/10 transition-colors"
                        >
                            <Key className="size-4" />
                        </Button>
                    </TooltipWrapper>

                    <PermissionGate can="update_workflows">
                        <TooltipWrapper content="Edit Workflow">
                            <Button
                                size="icon-sm"
                                variant="ghost"
                                asChild
                                className="text-muted-foreground hover:bg-muted transition-colors"
                            >
                                <Link href={`/admin/workflows/${val.id}/edit`}>
                                    <Pencil className="size-4" />
                                </Link>
                            </Button>
                        </TooltipWrapper>
                    </PermissionGate>

                    <PermissionGate can="delete_workflows">
                        <TooltipWrapper content="Delete Workflow">
                            <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => deleteDisclosure.onOpen(val)}
                                className="text-destructive hover:bg-destructive/10 transition-colors"
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
            <Head title="Security Workflows" />

            <PermissionSyncSheet
                open={permissionDisclosure.isOpen}
                onClose={permissionDisclosure.onClose}
                workflow={permissionDisclosure.data}
                type="workflow"
            />

            <ConfirmDialog
                open={deleteDisclosure.isOpen}
                onOpenChange={deleteDisclosure.onClose}
                title="Delete Workflow"
                description={`Are you sure you want to delete the workflow "${deleteDisclosure.data?.name}"? This action cannot be undone.`}
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
                            <div className="flex items-center justify-between">
                                <MainPageHeader
                                    breadcrumbs={WORKFLOW_BREADCRUMBS}
                                    icon={WorkflowIcon}
                                    title="Security Workflows"
                                    subtitle="Bundle multiple permissions into reusable task sets."
                                    tip="Workflows allow you to create 'functional bundles' (like 'NSS Management' or 'Admission Desk') that can be attached to any user regardless of their primary role."
                                />
                                <PermissionGate can="create_workflows">
                                <Button asChild className="rounded-xl shadow-lg shadow-primary/20">
                                    <Link href="/admin/workflows/create" className="inline-flex items-center gap-2">
                                        <Plus className="size-4" />
                                        Create Workflow
                                    </Link>
                                </Button>
                            </PermissionGate>
                        </div>

                        {/* Workflows Table Section */}
                        <Card className="border-primary/10 shadow-sm">
                            <CardContent className="pt-6">
                                <DataTable
                                    columns={WORKFLOW_COLUMNS}
                                    totalRecords={workflows.length}
                                >
                                    <Each
                                        isLoading={isLoading}
                                        of={workflows}
                                        nodatafound={
                                            <TableEmptyState
                                                colSpan={WORKFLOW_COLUMNS.length}
                                                message="No workflows created yet"
                                                description="Bundling permissions into workflows simplifies staff management."
                                            />
                                        }
                                        fallback={
                                            <TableSkeletonLoader columns={WORKFLOW_COLUMNS.length} />
                                        }
                                        render={renderWorkflowRow}
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

export default SecurityWorkflows;
