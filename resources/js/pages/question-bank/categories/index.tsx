import DataTable, {
    TableEmptyState,
    TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Head } from "@inertiajs/react";
import { FolderTree, Pencil, Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import QuestionBankApi from "@/lib/api/questionBankApi";
import { QuestionBankQueryKeys } from "@/lib/querykey/questionBank";
import { PermissionGate } from "@/components/PermissionGate";
import {
    QUESTION_BANK_CATEGORIES_BREADCRUMBS,
    QUESTION_BANK_CATEGORIES_GUIDELINES,
    QUESTION_BANK_CATEGORIES_TABLE_COLUMNS,
    CATEGORY_FORM_LAYOUT,
    CATEGORY_FORM_INITIAL,
} from "@/constants/page/admin/questionBank";
import { ModalDialog } from "@/components/shared/Modal";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    questionBankCategorySchema,
    type QuestionBankCategoryFormData,
} from "@/lib/validations/questionBank";
import React, { useEffect } from "react";

const CategoriesIndex = () => {
    const queryClient = useQueryClient();
    const deleteDisclosure = useDisclosure<{ id: number; name: string }>();
    const formDisclosure = useDisclosure<{ id?: number; name?: string }>();

    const { control, handleSubmit, reset } =
        useForm<QuestionBankCategoryFormData>({
            resolver: zodResolver(questionBankCategorySchema),
            mode: "onChange",
            defaultValues: CATEGORY_FORM_INITIAL,
        });

    const { data, isLoading } = useQuery({
        queryKey: QuestionBankQueryKeys.categories(),
        queryFn: () => QuestionBankApi.categories(),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => QuestionBankApi.destroyCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QuestionBankQueryKeys.categories(),
            });
            deleteDisclosure.onClose();
        },
    });

    const saveMutation = useMutation({
        mutationFn: (payload: {
            id?: number;
            data: QuestionBankCategoryFormData;
        }) =>
            payload.id
                ? QuestionBankApi.updateCategory(payload.id, payload.data)
                : QuestionBankApi.storeCategory(payload.data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QuestionBankQueryKeys.categories(),
            });
            formDisclosure.onClose();
            reset(CATEGORY_FORM_INITIAL);
        },
    });

    const handleEdit = (category: any) => {
        reset({
            name: category.name,
            description: category.description ?? "",
        });
        formDisclosure.onOpen({ id: category.id, name: category.name });
    };

    useEffect(() => {
        if (!formDisclosure.isOpen) {
            reset(CATEGORY_FORM_INITIAL);
        }
    }, [formDisclosure.isOpen, reset]);

    const rows = (data?.data ?? []) as any[];

    return (
        <>
            <Head title="Question Categories" />
            <ConfirmDialog
                open={deleteDisclosure.isOpen}
                onOpenChange={deleteDisclosure.onClose}
                title="Delete Category"
                description={`Are you sure you want to delete "${deleteDisclosure.data?.name}"? All questions in this category will also be deleted.`}
                onConfirm={() =>
                    deleteDisclosure.data &&
                    deleteMutation.mutate(deleteDisclosure.data.id)
                }
                isLoading={deleteMutation.isPending}
                confirmText="Delete"
                variant="danger"
                confirmationKeyword="DELETE"
            />

            <ModalDialog
                open={formDisclosure.isOpen}
                onClose={formDisclosure.onClose}
                title={
                    formDisclosure.data?.id
                        ? `Edit Category: ${formDisclosure.data.name}`
                        : "Add New Category"
                }
                description="Organize questions into categories for easy filtering."
                className="sm:max-w-lg"
                handleSubmit={handleSubmit((data) =>
                    saveMutation.mutate({
                        id: formDisclosure.data?.id,
                        data,
                    })
                )}
                submitLabel={
                    saveMutation.isPending
                        ? "Saving..."
                        : formDisclosure.data?.id
                          ? "Update"
                          : "Create"
                }
                isLoading={saveMutation.isPending}
            >
                <div className="space-y-4">
                    <Each
                        of={CATEGORY_FORM_LAYOUT}
                        render={(field: any) => (
                            <ControlledFormComponent
                                key={field.name}
                                control={control}
                                {...field}
                            />
                        )}
                    />
                </div>
            </ModalDialog>

            <TooltipProvider>
                <PageContainer maxWidth="full">
                    <div className="space-y-6">
                        <MainPageHeader
                            id="categories-header"
                            breadcrumbs={
                                QUESTION_BANK_CATEGORIES_BREADCRUMBS
                            }
                            icon={FolderTree}
                            title="Question Categories"
                            subtitle="Organize questions into categories for easy filtering and navigation."
                            guidance={QUESTION_BANK_CATEGORIES_GUIDELINES}
                        />
                        <div className="flex justify-end">
                            <PermissionGate can="create_questions">
                                <Button
                                    id="new-category-btn"
                                    onClick={() =>
                                        formDisclosure.onOpen({})
                                    }
                                    className="gap-1.5"
                                >
                                    <Plus className="size-4" />
                                    Add Category
                                </Button>
                            </PermissionGate>
                        </div>
                        <Card>
                            <CardContent className="pt-6" id="categories-table">
                                <DataTable
                                    columns={
                                        QUESTION_BANK_CATEGORIES_TABLE_COLUMNS
                                    }
                                >
                                    <Each
                                        isLoading={isLoading}
                                        of={rows}
                                        nodatafound={
                                            <TableEmptyState
                                                colSpan={
                                                    QUESTION_BANK_CATEGORIES_TABLE_COLUMNS.length
                                                }
                                                message="No categories found"
                                                description="Create your first category to organize questions."
                                            />
                                        }
                                        fallback={
                                            <TableSkeletonLoader
                                                columns={
                                                    QUESTION_BANK_CATEGORIES_TABLE_COLUMNS.length
                                                }
                                            />
                                        }
                                        render={(
                                            row: any,
                                            index: number
                                        ) => (
                                            <TableRow
                                                key={row.id}
                                                className="hover:bg-muted/50"
                                            >
                                                <TableCell className="w-12 text-muted-foreground font-mono text-sm">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                                                    {row.description ?? "—"}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                        {row.questions_count ??
                                                            0}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="w-28">
                                                    <div className="flex items-center gap-0.5">
                                                        <PermissionGate can="update_questions">
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        size="icon-sm"
                                                                        variant="ghost"
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                row
                                                                            )
                                                                        }
                                                                    >
                                                                        <Pencil className="size-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    Edit
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </PermissionGate>
                                                        <PermissionGate can="delete_questions">
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        size="icon-sm"
                                                                        variant="ghost"
                                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                        onClick={() =>
                                                                            deleteDisclosure.onOpen(
                                                                                {
                                                                                    id: row.id,
                                                                                    name: row.name,
                                                                                }
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="size-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    Delete
                                                                </TooltipContent>
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
                </PageContainer>
            </TooltipProvider>
        </>
    );
};

export default CategoriesIndex;
