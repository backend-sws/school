import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import SettingsLayout from "@/layouts/settings/layout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Workflow as WorkflowIcon } from "lucide-react";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import Each from "@/components/Each";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import WorkflowApi from "@/lib/api/workflowApi";
import { WORKFLOW_BREADCRUMBS, WORKFLOW_FORM_LAYOUT } from "@/constants/page/admin/workflow";
import { PageContainer } from "@/components/shared/page/PageContainer";


interface PageProps { id?: number }

interface WorkflowFormValues {
    name: string;
    description: string;
}

export default function WorkflowCreate() {
    const queryClient = useQueryClient();
    const { id: workflowId } = usePage().props as unknown as PageProps;
    const isEditMode = !!workflowId;

    const { data: workflowResponse, isLoading: isWorkflowLoading } = useQuery({
        queryKey: ["workflow", workflowId],
        queryFn: () => WorkflowApi.getWorkflowById(workflowId!),
        enabled: isEditMode,
    });

    const workflowData = workflowResponse?.data ?? workflowResponse;

    const { control, handleSubmit, formState: { errors }, reset } = useForm<WorkflowFormValues>({
        mode: "onChange",
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (isEditMode && workflowData) {
            reset({
                name: workflowData.name || "",
                description: workflowData.description || "",
            });
        }
    }, [isEditMode, workflowData, reset]);

    const mutation = useMutation({
        mutationFn: async (data: WorkflowFormValues) => {
            if (isEditMode) {
                return WorkflowApi.updateWorkflow(workflowId!, data);
            }
            return WorkflowApi.storeWorkflow(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workflows"] });
            if (isEditMode) queryClient.invalidateQueries({ queryKey: ["workflow", workflowId] });
            toast.success(isEditMode ? "Workflow updated successfully" : "Workflow created successfully");
            router.visit("/admin/workflows");
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Something went wrong");
        },
    });

    const onSubmit = (data: WorkflowFormValues) => {
        mutation.mutate(data);
    };

    const breadcrumbs = isEditMode
        ? [...WORKFLOW_BREADCRUMBS, { title: "Edit Workflow", href: `/admin/workflows/${workflowId}/edit` }]
        : [...WORKFLOW_BREADCRUMBS, { title: "Create Workflow", href: "/admin/workflows/create" }];

    return (
        <>
            <Head title={isEditMode ? "Edit Workflow" : "Create Workflow"} />

            <SettingsLayout>
                <PageContainer maxWidth="full">
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                                <Link href="/admin/workflows" className="inline-flex items-center gap-2">
                                    <ArrowLeft className="size-4" aria-hidden />
                                    Back
                                </Link>
                            </Button>
                            <MainPageHeader
                                breadcrumbs={breadcrumbs}
                                icon={WorkflowIcon}
                                title={isEditMode ? "Edit Security Workflow" : "Create Security Workflow"}
                                subtitle={isEditMode ? `Updating details for ${workflowData?.name || 'workflow'}` : "Bundle multiple permissions into a reusable task set."}
                                tip="Workflows allow you to create 'functional bundles' (like 'NSS Management') that can be attached to any user."
                            />
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border bg-card/50 shadow-sm">
                                <Each
                                    of={WORKFLOW_FORM_LAYOUT}
                                    render={(field: any) => (
                                        <ControlledFormComponent
                                            key={field.name}
                                            control={control}
                                            {...field}
                                            error={(errors as any)[field.name]?.message}
                                        />
                                    )}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4 border-t">
                                <Button type="button" variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                                    <Link href="/admin/workflows">Cancel</Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={mutation.isPending || (isEditMode && isWorkflowLoading)}
                                    className="min-w-[140px] shadow-lg shadow-primary/20 rounded-xl h-11"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {mutation.isPending ? "Saving..." : isEditMode ? "Update Workflow" : "Create Workflow"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </PageContainer>
            </SettingsLayout>

        </>
    );
}
