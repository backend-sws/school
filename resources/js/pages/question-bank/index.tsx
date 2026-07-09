import DataTable, {
    TableEmptyState,
    TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterBar } from "@/components/filter-bar";
import { getSerialNumber } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import {
    BookOpen,
    Pencil,
    Plus,
    Trash2,
    FolderTree,
    Gamepad2,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import QuestionBankApi from "@/lib/api/questionBankApi";
import { QuestionBankQueryKeys } from "@/lib/querykey/questionBank";
import { PermissionGate } from "@/components/PermissionGate";
import {
    QUESTION_BANK_QUESTIONS_BREADCRUMBS,
    QUESTION_BANK_GUIDELINES,
    QUESTION_BANK_TIP,
    QUESTION_BANK_TABLE_COLUMNS,
    QUESTION_BANK_FILTER_CONFIG,
    DIFFICULTY_BADGE_VARIANT,
    TYPE_LABELS,
    SOURCE_BADGE_VARIANT,
} from "@/constants/page/admin/questionBank";
import { ModalDialog } from "@/components/shared/Modal";
import QuestionForm from "./components/QuestionForm";
import React, { useState } from "react";

const INITIAL_FILTERS = {
    page: 1,
    per_page: 15,
    search: "",
    difficulty: "",
    type: "",
    source: "",
    category_id: "",
};

const QuestionBankIndex = () => {
    const queryClient = useQueryClient();
    const deleteDisclosure = useDisclosure<{ id: number; text: string }>();
    const formDisclosure = useDisclosure<{ id?: number }>();
    const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
    const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);

    const { data, isLoading } = useQuery({
        queryKey: QuestionBankQueryKeys.questions(filter),
        queryFn: () => QuestionBankApi.questions(filter),
    });

    const { data: statsData } = useQuery({
        queryKey: QuestionBankQueryKeys.stats(),
        queryFn: () => QuestionBankApi.stats(),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => QuestionBankApi.destroyQuestion(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QuestionBankQueryKeys.all,
            });
            deleteDisclosure.onClose();
        },
    });

    const saveMutation = useMutation({
        mutationFn: (payload: any) =>
            payload.id
                ? QuestionBankApi.updateQuestion(payload.id, payload.data)
                : QuestionBankApi.storeQuestion(payload.data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QuestionBankQueryKeys.all,
            });
            formDisclosure.onClose();
            setSelectedQuestion(null);
        },
    });

    const handleEdit = (question: any) => {
        setSelectedQuestion(question);
        formDisclosure.onOpen({ id: question.id });
    };

    const handleFilterChange = (updates: Record<string, unknown>) => {
        handleFilter({ ...updates, page: 1 });
    };

    const rows = (data?.data ?? []) as any[];
    const meta = data?.meta as
        | {
              current_page: number;
              last_page: number;
              per_page: number;
              total: number;
          }
        | undefined;
    const stats = statsData?.data as any;

    return (
        <>
            <Head title="Question Bank" />
            <ConfirmDialog
                open={deleteDisclosure.isOpen}
                onOpenChange={deleteDisclosure.onClose}
                title="Delete Question"
                description={`Are you sure you want to delete this question?`}
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
                        ? "Edit Question"
                        : "Add New Question"
                }
                className="sm:max-w-3xl"
            >
                <QuestionForm
                    initialData={selectedQuestion}
                    isPending={saveMutation.isPending}
                    onSubmit={(data) =>
                        saveMutation.mutate({
                            id: formDisclosure.data?.id,
                            data,
                        })
                    }
                    onCancel={formDisclosure.onClose}
                />
            </ModalDialog>

            <TooltipProvider>
                <PageContainer maxWidth="full">
                    <div className="space-y-6">
                        <MainPageHeader
                            id="question-bank-header"
                            breadcrumbs={QUESTION_BANK_QUESTIONS_BREADCRUMBS}
                            icon={BookOpen}
                            title="Question Bank"
                            subtitle="Manage categorized question repositories for your institution."
                            guidance={QUESTION_BANK_GUIDELINES}
                            tip={QUESTION_BANK_TIP}
                        />

                        {/* Stats strip */}
                        {stats && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <Card className="p-4 text-center">
                                    <p className="text-2xl font-bold">{stats.total_questions}</p>
                                    <p className="text-xs text-muted-foreground">Total Questions</p>
                                </Card>
                                <Card className="p-4 text-center">
                                    <p className="text-2xl font-bold">{stats.total_categories}</p>
                                    <p className="text-xs text-muted-foreground">Categories</p>
                                </Card>
                                <Card className="p-4 text-center">
                                    <p className="text-2xl font-bold text-emerald-600">{(stats.total_questions || 0)}</p>
                                    <p className="text-xs text-muted-foreground">Manual</p>
                                </Card>
                            </div>
                        )}

                        {/* Action bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Link href="/question-bank/categories">
                                    <Button variant="outline" size="sm" className="gap-1.5">
                                        <FolderTree className="size-4" />
                                        Categories
                                    </Button>
                                </Link>
                                <Link href="/question-bank/practice">
                                    <Button variant="outline" size="sm" className="gap-1.5">
                                        <Gamepad2 className="size-4" />
                                        Practice
                                    </Button>
                                </Link>
                            </div>
                            <PermissionGate can="create_questions">
                                <Button
                                    id="new-question-btn"
                                    onClick={() => {
                                        setSelectedQuestion(null);
                                        formDisclosure.onOpen({});
                                    }}
                                    className="gap-1.5"
                                >
                                    <Plus className="size-4" />
                                    Add Question
                                </Button>
                            </PermissionGate>
                        </div>

                        {/* Table */}
                        <Card>
                            <CardHeader className="pb-4">
                                <FilterBar
                                    values={filter}
                                    onChange={handleFilterChange}
                                >
                                    <FilterBar.Renderer
                                        config={QUESTION_BANK_FILTER_CONFIG}
                                    />
                                </FilterBar>
                            </CardHeader>
                            <CardContent className="pt-0" id="questions-table">
                                <DataTable
                                    columns={QUESTION_BANK_TABLE_COLUMNS}
                                    currentPage={meta?.current_page ?? 1}
                                    lastPage={meta?.last_page ?? 1}
                                    pageSize={filter.per_page ?? 15}
                                    totalRecords={meta?.total ?? 0}
                                    handlePageChange={(page) =>
                                        handleFilter({ page })
                                    }
                                    handlePageSizeChange={(size) =>
                                        handleFilter({
                                            per_page: size,
                                            page: 1,
                                        })
                                    }
                                >
                                    <Each
                                        isLoading={isLoading}
                                        of={rows}
                                        nodatafound={
                                            <TableEmptyState
                                                colSpan={
                                                    QUESTION_BANK_TABLE_COLUMNS.length
                                                }
                                                message="No questions found"
                                                description="Add questions manually to build your question bank."
                                            />
                                        }
                                        fallback={
                                            <TableSkeletonLoader
                                                columns={
                                                    QUESTION_BANK_TABLE_COLUMNS.length
                                                }
                                            />
                                        }
                                        render={(row: any, index: number) => (
                                            <TableRow
                                                key={row.id}
                                                className="hover:bg-muted/50"
                                            >
                                                <TableCell className="w-12 text-muted-foreground font-mono text-sm">
                                                    {getSerialNumber(
                                                        meta?.current_page ?? 1,
                                                        filter.per_page ?? 15,
                                                        index
                                                    )}
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate font-medium">
                                                    {row.question_text}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-xs font-medium">
                                                        {TYPE_LABELS[
                                                            row.type
                                                        ] ?? row.type}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_BADGE_VARIANT[row.difficulty] ?? ""}`}
                                                    >
                                                        {row.difficulty}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {row.category?.name ?? "—"}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${SOURCE_BADGE_VARIANT[row.source] ?? ""}`}
                                                    >
                                                        Manual
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
                                                                                    text: row.question_text,
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

export default QuestionBankIndex;
