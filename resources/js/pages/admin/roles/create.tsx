import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import SettingsLayout from "@/layouts/settings/layout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, Loader2, Save, Shield, Workflow as WorkflowIcon, HelpCircle } from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import Each from "@/components/Each";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import RoleApi from "@/lib/api/roleApi";
import WorkflowApi from "@/lib/api/workflowApi";
import { FORM_TYPE } from "@/constants/shared/form";
import { ROLE_BREADCRUMBS, ROLE_FORM_LAYOUT } from "@/constants/page/admin/role";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import { MultiSelectField } from "@/components/multiSelectionInput";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageContainer } from "@/components/shared/page/PageContainer";


interface PageProps {
    id?: number;
}

interface RoleFormValues {
    name: string;
    description: string;
    workflow_ids: string[];
    permission_ids: number[];
}

export default function RoleCreate() {
    const queryClient = useQueryClient();
    const pageProps = usePage().props as unknown as PageProps;
    const roleId = pageProps?.id;
    const isEditMode = !!roleId;

    const { data: roleResponse } = useQuery({
        queryKey: ["role", roleId],
        queryFn: () => RoleApi.getRoleById(roleId!),
        enabled: isEditMode && !!roleId,
    });

    const { data: workflowsResponse } = useQuery({
        queryKey: ["workflows"],
        queryFn: () => WorkflowApi.getWorkflows(),
    });

    const { data: permissionsResponse } = useQuery({
        queryKey: ["permissions"],
        queryFn: () => RoleApi.getPermissions(),
    });

    const roleData = roleResponse?.data ?? roleResponse;
    const workflows = (workflowsResponse?.data ?? workflowsResponse) ?? [];
    const workflowOptions = Array.isArray(workflows)
        ? workflows.map((w: { id: number; name: string }) => ({
              key: String(w.id),
              text: w.name,
              value: String(w.id),
          }))
        : [];

    const { control, handleSubmit, formState: { errors }, reset, setValue, watch, getValues } = useForm<RoleFormValues>({
        mode: "onChange",
        defaultValues: {
            name: "",
            description: "",
            workflow_ids: [],
            permission_ids: [],
        },
    });

    const workflowIds = watch("workflow_ids");
    const permissionIds = watch("permission_ids");
    const previousWorkflowIdsRef = useRef<string[]>([]);

    // When workflows are selected, add their permissions to Direct permissions; when deselected, remove them.
    useEffect(() => {
        if (!Array.isArray(workflows) || workflows.length === 0) return;
        const prev = previousWorkflowIdsRef.current;
        const current = Array.isArray(workflowIds) ? workflowIds : [];
        previousWorkflowIdsRef.current = current;

        const getPermissionIdsForWorkflowIds = (ids: string[]) => {
            const numIds = ids.map(Number).filter(Boolean);
            return numIds.flatMap((wid) => {
                const w = (workflows as { id: number; permissions?: { id: number }[] }[]).find((x) => x.id === wid);
                return Array.isArray(w?.permissions) ? w.permissions.map((p) => p.id) : [];
            });
        };
        const toAdd = getPermissionIdsForWorkflowIds(current.filter((id) => !prev.includes(id)));
        const toRemove = getPermissionIdsForWorkflowIds(prev.filter((id) => !current.includes(id)));
        if (toAdd.length === 0 && toRemove.length === 0) return;

        const currentPermIds = getValues("permission_ids") ?? [];
        const next = new Set(currentPermIds);
        toAdd.forEach((id) => next.add(id));
        toRemove.forEach((id) => next.delete(id));
        setValue("permission_ids", [...next], { shouldDirty: true });
    }, [workflowIds, workflows, setValue, getValues]);

    useEffect(() => {
        if (isEditMode && roleData) {
            const r = roleData as Record<string, unknown>;
            const wfIds = Array.isArray(r.workflows) ? (r.workflows as { id: number }[]).map((w) => String(w.id)) : [];
            const permIds = Array.isArray(r.permissions) ? (r.permissions as { id: number }[]).map((p) => p.id) : [];
            reset({
                name: (r.name as string) ?? "",
                description: (r.description as string) ?? "",
                workflow_ids: wfIds,
                permission_ids: permIds,
            });
            previousWorkflowIdsRef.current = wfIds;
        }
    }, [isEditMode, roleData, reset]);

    const createMutation = useMutation({
        mutationFn: async (data: RoleFormValues) => {
            const payload = { name: data.name, description: data.description };
            const res = await RoleApi.storeRole(payload);
            const created = res?.data ?? res;
            const id = (created as { id?: number })?.id;
            if (!id) throw new Error("Role created but no id returned");
            const workflowIds = data.workflow_ids.map(Number).filter(Boolean);
            if (workflowIds.length > 0) {
                await RoleApi.syncRoleWorkflows(id, workflowIds);
            }
            if (Array.isArray(data.permission_ids) && data.permission_ids.length > 0) {
                await RoleApi.syncPermissions(id, data.permission_ids);
            }
            return { id };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles", "custom"] });
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            toast.success("Role created successfully");
            router.visit("/admin/roles");
        },
        onError: (err: unknown) => {
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(message || "Something went wrong");
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (data: RoleFormValues) => {
            await RoleApi.updateRole(roleId!, { name: data.name, description: data.description });
            const workflowIds = data.workflow_ids.map(Number).filter(Boolean);
            await RoleApi.syncRoleWorkflows(roleId!, workflowIds);
            await RoleApi.syncPermissions(roleId!, data.permission_ids ?? []);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles", "custom"] });
            queryClient.invalidateQueries({ queryKey: ["role", roleId] });
            toast.success("Role updated successfully");
            router.visit("/admin/roles");
        },
        onError: (err: unknown) => {
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(message || "Something went wrong");
        },
    });

    const onSubmit = (data: RoleFormValues) => {
        const hasWorkflows = Array.isArray(data.workflow_ids) && data.workflow_ids.length > 0;
        const hasPermissions = Array.isArray(data.permission_ids) && data.permission_ids.length > 0;
        if (!hasWorkflows && !hasPermissions) {
            toast.error("Select at least one workflow or one direct permission.");
            return;
        }
        if (isEditMode) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    const handlePermissionToggle = (id: number) => {
        setValue(
            "permission_ids",
            permissionIds.includes(id) ? permissionIds.filter((p) => p !== id) : [...permissionIds, id],
            { shouldDirty: true }
        );
    };

    const handleSelectAllInModule = (permissions: { id: number }[]) => {
        const ids = permissions.map((p) => p.id);
        const allSelected = ids.every((id) => permissionIds.includes(id));
        if (allSelected) {
            setValue("permission_ids", permissionIds.filter((id) => !ids.includes(id)), { shouldDirty: true });
        } else {
            setValue("permission_ids", [...new Set([...permissionIds, ...ids])], { shouldDirty: true });
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;
    const breadcrumbs = isEditMode
        ? [...ROLE_BREADCRUMBS, { title: "Edit Role", href: `/admin/roles/${roleId}/edit` }]
        : [...ROLE_BREADCRUMBS, { title: "Create Role", href: "/admin/roles/create" }];

    return (
        <>
            <Head title={isEditMode ? "Edit Role" : "Create Role"} />

            <SettingsLayout>
                <PageContainer maxWidth="full">
                    <TooltipProvider>
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                                    <Link href="/admin/roles" className="inline-flex items-center gap-2">
                                        <ArrowLeft className="size-4" aria-hidden />
                                        Back
                                    </Link>
                                </Button>
                                <MainPageHeader
                                    breadcrumbs={breadcrumbs}
                                    icon={Shield}
                                    title={isEditMode ? "Edit Security Role" : "Create Security Role"}
                                    subtitle={
                                        isEditMode
                                            ? `Update details and access for ${(roleData as { name?: string })?.name || "this role"}.`
                                            : "Define a new custom role and assign workflows and permissions."
                                    }
                                    tip="Roles specify global permissions. Name and description identify this role. You must assign at least one workflow or one direct permission so the role has access—select workflows and/or grant permissions below."
                                />
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                {/* Form content remains same */}

                            {/* Basic details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Shield className="size-5 text-primary" />
                                        Basic details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
                                        <Each
                                            of={ROLE_FORM_LAYOUT}
                                            render={(field: Record<string, unknown>) => (
                                                <ControlledFormComponent
                                                    key={String(field.name)}
                                                    control={control}
                                                    {...(field as any)}
                                                    error={(errors as Record<string, { message?: string }>)[String(field.name)]?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Workflows */}
                            <Card className="border-primary/10 bg-primary/[0.02]">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <WorkflowIcon className="size-5 text-primary" />
                                        <CardTitle className="text-lg">Workflows</CardTitle>
                                        <TooltipWrapper
                                            content="Assign one or more workflow bundles to this role. Each workflow adds a set of permissions. Staff assigned this role will get all permissions from these workflows."
                                            side="top"
                                        >
                                            <Info className="size-4 text-muted-foreground shrink-0 cursor-help" />
                                        </TooltipWrapper>
                                    </div>
                                    <CardDescription>
                                        Assign workflow bundles to this role. These grant permission sets (e.g. admission, accounts, academic setup) to anyone with this role. Select at least one workflow or grant direct permissions below.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Controller
                                        control={control}
                                        name="workflow_ids"
                                        render={({ field }) => (
                                            <MultiSelectField
                                                placeholder="Select Workflows..."
                                                options={workflowOptions}
                                                value={Array.isArray(field.value) ? field.value : []}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Direct permissions */}
                            <div className="space-y-4">
                                <div className="space-y-3 px-1">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Shield className="size-5 text-primary shrink-0" />
                                            Direct permissions
                                            <TooltipWrapper
                                                content="Grant specific permissions to this role in addition to those from workflows. Click a card to toggle that permission for the role."
                                                side="top"
                                            >
                                                <Info className="size-4 text-muted-foreground shrink-0 cursor-help" />
                                            </TooltipWrapper>
                                        </h3>
                                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest bg-muted/50 px-3 py-1.5 rounded-lg border shrink-0">
                                            <span className="flex items-center gap-1.5">
                                                <span className="size-2 rounded-full bg-muted-foreground/30" />
                                                Not granted
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="size-2 rounded-full bg-green-500" />
                                                Granted
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground max-w-3xl">
                                        Grant specific permissions for this role, in addition to those from the workflows above. At least one workflow or one permission is required to create the role.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    {Object.entries(permissionsResponse?.data || {}).map(([module, permissions]: [string, unknown]) => {
                                        const perms = (permissions as { id: number; name: string; key: string }[]) || [];
                                        return (
                                            <div key={module} className="space-y-3">
                                                <div className="flex items-center justify-between border-b pb-2">
                                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                                                        {module.replace(/_/g, " ")}
                                                    </h4>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 text-[10px] uppercase font-bold text-primary hover:bg-primary/5"
                                                        onClick={() => handleSelectAllInModule(perms)}
                                                    >
                                                        Toggle all
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {perms.map((p) => {
                                                        const isGranted = permissionIds.includes(p.id);
                                                        const statusColor = isGranted
                                                            ? "border-green-500/30 bg-green-500/10"
                                                            : "border-transparent bg-muted/5";
                                                        return (
                                                            <div
                                                                key={p.id}
                                                                onClick={() => handlePermissionToggle(p.id)}
                                                                className={`
                                                                    flex flex-col gap-2 p-3 rounded-xl border transition-all cursor-pointer group
                                                                    ${statusColor} hover:border-primary/40
                                                                `}
                                                            >
                                                                <div className="flex items-start justify-between">
                                                                    <div className="grid gap-0.5">
                                                                        <span className="text-sm font-medium group-hover:text-primary transition-colors">{p.name}</span>
                                                                        <code className="text-[9px] text-muted-foreground/50 font-mono tracking-tight">{p.key}</code>
                                                                    </div>
                                                                    {isGranted && (
                                                                        <Badge className="bg-green-500 text-[9px] h-4 rounded-full">Granted</Badge>
                                                                    )}
                                                                </div>
                                                                <div className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                                                                    <HelpCircle className="size-3" />
                                                                    Click to {isGranted ? "revoke" : "grant"}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4 border-t sticky bottom-0 bg-background/80 backdrop-blur-sm z-10 pb-4">
                                <Button type="button" variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                                    <Link href="/admin/roles">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={isPending} className="min-w-[140px] shadow-lg shadow-primary/20">
                                    {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                                    <Save className="mr-2 size-4" />
                                    {isPending ? "Saving..." : isEditMode ? "Update Role" : "Create Role"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </TooltipProvider>
                </PageContainer>
            </SettingsLayout>

        </>
    );
}
