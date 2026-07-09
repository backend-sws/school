import React from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RoleApi from "@/lib/api/roleApi";
import WorkflowApi from "@/lib/api/workflowApi";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Shield, Workflow as WorkflowIcon } from "lucide-react";

interface PermissionSyncSheetProps {
    open: boolean;
    onClose: () => void;
    role?: any;
    workflow?: any;
    type?: "role" | "workflow";
}

export function PermissionSyncSheet({ open, onClose, role, workflow, type = "role" }: PermissionSyncSheetProps) {
    const queryClient = useQueryClient();
    const [selectedPermissions, setSelectedPermissions] = React.useState<number[]>([]);

    const target = type === "role" ? role : workflow;

    const { data: permissionsGrouped, isLoading } = useQuery({
        queryKey: ["permissions"],
        queryFn: () => RoleApi.getPermissions(),
        enabled: open,
    });

    React.useEffect(() => {
        if (target?.permissions) {
            setSelectedPermissions(target.permissions.map((p: any) => p.id));
        } else {
            setSelectedPermissions([]);
        }
    }, [target, open]);

    const mutation = useMutation({
        mutationFn: (permissionIds: number[]) =>
            type === "role"
                ? RoleApi.syncPermissions(role.id, permissionIds)
                : WorkflowApi.syncPermissions(workflow.id, permissionIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [type === "role" ? "roles" : "workflows"] });
            toast.success("Permissions updated");
            onClose();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleToggle = (id: number) => {
        setSelectedPermissions((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const handleSelectAllInModule = (module: string, permissionIds: number[]) => {
        const allSelected = permissionIds.every(id => selectedPermissions.includes(id));
        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(id => !permissionIds.includes(id)));
        } else {
            setSelectedPermissions(prev => [...new Set([...prev, ...permissionIds])]);
        }
    };

    if (!target) return null;

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-[540px] flex flex-col h-full text-foreground bg-background">
                <SheetHeader className="pb-6">
                    <SheetTitle className="flex items-center gap-2">
                        {type === "role" ? <Shield className="size-5 text-primary" /> : <WorkflowIcon className="size-5 text-primary" />}
                        Manage Permissions
                    </SheetTitle>
                    <SheetDescription>
                        Assign granular permissions to the <strong>{target.name}</strong> {type}.
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="flex-1 pr-1 -mr-1">
                    {isLoading ? (
                        <div className="flex h-32 items-center justify-center">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="space-y-8 pb-8">
                            {Object.entries(permissionsGrouped?.data || {}).map(([module, permissions]: [string, any]) => (
                                <div key={module} className="space-y-4">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">
                                            {module.replace(/_/g, " ")}
                                        </h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 text-[10px] uppercase font-bold text-primary hover:bg-primary/5"
                                            onClick={() => handleSelectAllInModule(module, permissions.map((p: any) => p.id))}
                                        >
                                            Toggle All
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2.5">
                                        {permissions.map((permission: any) => (
                                            <div
                                                key={permission.id}
                                                className="flex flex-row items-center space-x-3 space-y-0 rounded-xl border bg-muted/5 p-3 hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group"
                                                onClick={() => handleToggle(permission.id)}
                                            >
                                                <Checkbox
                                                    id={`perm-${permission.id}`}
                                                    checked={selectedPermissions.includes(permission.id)}
                                                    onCheckedChange={() => handleToggle(permission.id)}
                                                    className="rounded-[4px]"
                                                />
                                                <div className="grid gap-1 leading-none">
                                                    <Label
                                                        htmlFor={`perm-${permission.id}`}
                                                        className="text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors"
                                                    >
                                                        {permission.name}
                                                    </Label>
                                                    <p className="text-[10px] text-muted-foreground/60 font-mono tracking-tight">
                                                        {permission.key}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <SheetFooter className="pt-6 border-t mt-auto gap-2">
                    <Button variant="outline" onClick={onClose} className="rounded-xl">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => mutation.mutate(selectedPermissions)}
                        disabled={mutation.isPending}
                        className="rounded-xl shadow-lg shadow-primary/20 px-8"
                    >
                        {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                        Save Changes
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
