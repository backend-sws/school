import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import WorkflowApi from "@/lib/api/workflowApi";
import RoleApi from "@/lib/api/roleApi";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Shield, Workflow as WorkflowIcon, Info, HelpCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipWrapper } from "@/components/shared/TooltipWrapper";
import SettingsTip from "@/components/shared/SettingsTip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MultiSelectField } from "@/components/multiSelectionInput";

interface StaffPermissionsTabProps {
    userId: number;
    userName: string;
}

export default function StaffPermissionsTab({ userId, userName }: StaffPermissionsTabProps) {
    const queryClient = useQueryClient();

    // 1. Fetch All Permissions
    const { data: permissionsResponse } = useQuery({
        queryKey: ["permissions"],
        queryFn: () => RoleApi.getPermissions(),
    });

    // 2. Fetch User's Current State
    const { data: userStateResponse, isLoading: isUserLoading } = useQuery({
        queryKey: ["staff-permissions", userId],
        queryFn: () => WorkflowApi.getStaffPermissions(userId),
    });

    // 3. Fetch All Available Workflows
    const { data: allWorkflowsResponse } = useQuery({
        queryKey: ["workflows"],
        queryFn: () => WorkflowApi.getWorkflows(),
    });

    const userPermissions = userStateResponse?.data || {};
    const effectiveKeys = new Set(userPermissions.effective_keys || []);
    const directWorkflowIds = userPermissions.workflow_ids || [];
    const overrides = userPermissions.overrides || {}; // Map of ID -> boolean (granted)

    const workflowOptions = (allWorkflowsResponse?.data || []).map((w: any) => ({
        key: String(w.id),
        text: w.name,
        value: String(w.id),
    }));

    // Mutations
    const workflowMutation = useMutation({
        mutationFn: (workflowIds: number[]) => WorkflowApi.syncStaffWorkflows(userId, workflowIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff-permissions", userId] });
            toast.success("Workflows updated");
        },
    });

    const overrideMutation = useMutation({
        mutationFn: (overrideData: any) => WorkflowApi.syncStaffOverrides(userId, overrideData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff-permissions", userId] });
            toast.success("Overrides updated");
        },
    });

    const handleWorkflowChange = (values: string[]) => {
        workflowMutation.mutate(values.map(Number));
    };

    const handleOverrideToggle = (permId: number, currentState: boolean | undefined) => {
        // currentState: true (Granted), false (Revoked), undefined (Inherited/Default)
        // Switch order: Default -> Grant -> Revoke -> Default
        let nextOverridesArr = Object.entries(overrides).map(([id, granted]) => ({
            id: Number(id),
            granted: Boolean(granted),
        }));

        if (currentState === undefined) {
            // Move to Grant
            nextOverridesArr.push({ id: permId, granted: true });
        } else if (currentState === true) {
            // Move to Revoke
            nextOverridesArr = nextOverridesArr.map(o => o.id === permId ? { ...o, granted: false } : o);
        } else {
            // Move back to Default (Remove from overrides)
            nextOverridesArr = nextOverridesArr.filter(o => o.id !== permId);
        }

        overrideMutation.mutate(nextOverridesArr);
    };

    if (isUserLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-12">

                <SettingsTip
                    title="How permissions work here"
                    description="Permissions are built in three layers. First, the staff member's primary Role defines their base access. Additional Workflows add extra bundles (e.g. Office Registry, Accounts Room) on top. Surgical Overrides then let you force allow or force deny specific permissions for this person only—without changing roles or workflows for anyone else. Overrides apply only in this college context."
                />

                {/* Section A: Workflows */}
                <Card className="border-primary/10 bg-primary/[0.02]">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <WorkflowIcon className="size-5 text-primary" />
                            <CardTitle className="text-lg">Additional Workflows</CardTitle>
                            <TooltipWrapper content="Assign one or more workflow bundles to give this user extra permission sets (e.g. admission, accounts) in addition to their role. Changes apply only for the current college." side="top">
                                <Info className="size-4 text-muted-foreground shrink-0 cursor-help" />
                            </TooltipWrapper>
                        </div>
                        <CardDescription>
                            Assign "Extra Hats" to <strong>{userName}</strong>. These grant bundles of permissions on top of their primary role.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MultiSelectField
                            placeholder="Select Workflows..."
                            options={workflowOptions}
                            value={directWorkflowIds.map(String)}
                            onChange={handleWorkflowChange}
                            disabled={workflowMutation.isPending}
                        />
                    </CardContent>
                </Card>

                {/* Section B: Granular Overrides */}
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                        <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Shield className="size-5 text-primary" />
                                Surgical Overrides
                                <TooltipWrapper content="Override specific permissions for this user only. Forced Allow grants a permission even if their role or workflows would not; Forced Deny revokes it. These apply only in the current college and do not change roles or workflows for anyone else." side="top">
                                    <Info className="size-4 text-muted-foreground shrink-0 cursor-help" />
                                </TooltipWrapper>
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Manually grant or revoke specific permissions, bypassing Roles and Workflows.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest bg-muted/50 px-3 py-1.5 rounded-lg border">
                            <TooltipWrapper content="This permission is determined by the user's role and assigned workflows. No override is set—click the card to force allow or force deny." side="top">
                                <div className="flex items-center gap-1.5 cursor-help"><Badge variant="outline" className="size-2 rounded-full p-0 bg-muted-foreground/30 border-none" /> Inherited</div>
                            </TooltipWrapper>
                            <TooltipWrapper content="This permission is explicitly granted for this user, even if their role or workflows would not normally give it. Overrides any inherited denial." side="top">
                                <div className="flex items-center gap-1.5 cursor-help"><Badge variant="outline" className="size-2 rounded-full p-0 bg-green-500 border-none" /> Forced Allow</div>
                            </TooltipWrapper>
                            <TooltipWrapper content="This permission is explicitly revoked for this user, even if their role or workflows would grant it. Overrides any inherited allowance." side="top">
                                <div className="flex items-center gap-1.5 cursor-help"><Badge variant="outline" className="size-2 rounded-full p-0 bg-red-500 border-none" /> Forced Deny</div>
                            </TooltipWrapper>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {Object.entries(permissionsResponse?.data || {}).map(([module, permissions]: [string, any]) => (
                            <div key={module} className="space-y-3">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 border-b pb-2">
                                    {module.replace(/_/g, " ")}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {permissions.map((p: any) => {
                                        const isOverridden = overrides.hasOwnProperty(p.id);
                                        const overrideState = isOverridden ? overrides[p.id] : undefined;
                                        const hasInherited = effectiveKeys.has(p.key) && !isOverridden;

                                        let statusColor = "border-transparent bg-muted/5";
                                        let badge = null;

                                        if (overrideState === true) {
                                            statusColor = "border-green-500/30 bg-green-500/10";
                                            badge = <Badge className="bg-green-500 text-[9px] h-4 rounded-full">Forced Allow</Badge>;
                                        } else if (overrideState === false) {
                                            statusColor = "border-red-500/30 bg-red-500/10";
                                            badge = <Badge className="bg-red-500 text-[9px] h-4 rounded-full">Forced Deny</Badge>;
                                        } else if (hasInherited) {
                                            statusColor = "border-primary/10 bg-primary/5";
                                            badge = <Badge variant="outline" className="text-primary border-primary/20 text-[9px] h-4 rounded-full">Inherited</Badge>;
                                        }

                                        return (
                                            <div
                                                key={p.id}
                                                onClick={() => handleOverrideToggle(p.id, overrideState)}
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
                                                    {badge}
                                                </div>

                                                <div className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                                                    <HelpCircle className="size-3" />
                                                    Click to {overrideState === true ? "Force Deny" : overrideState === false ? "Restore Default" : "Force Allow"}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
