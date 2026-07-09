import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Each from "@/components/Each";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import QuestionBankApi from "@/lib/api/questionBankApi";
import { QuestionBankQueryKeys } from "@/lib/querykey/questionBank";
import {
    questionBankQuestionSchema,
    type QuestionBankQuestionFormData,
} from "@/lib/validations/questionBank";
import {
    QUESTION_FORM_LAYOUT,
    QUESTION_FORM_INITIAL,
} from "@/constants/page/admin/questionBank";

interface QuestionFormProps {
    initialData?: any;
    isPending: boolean;
    onSubmit: (data: QuestionBankQuestionFormData) => void;
    onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
    initialData,
    isPending,
    onSubmit,
    onCancel,
}) => {
    const { control, handleSubmit, reset } = useForm({
        resolver: zodResolver(questionBankQuestionSchema) as any,
        mode: "onChange",
        defaultValues: (initialData ?? QUESTION_FORM_INITIAL) as any,
    });

    const { data: categoriesData } = useQuery({
        queryKey: QuestionBankQueryKeys.categories(),
        queryFn: () => QuestionBankApi.categories(),
    });

    const categoryOptions = (categoriesData?.data ?? []).map((c: any) => ({
        value: String(c.id),
        label: c.name,
    }));

    // Inject category options into form layout
    const formFields = QUESTION_FORM_LAYOUT.map((field) => {
        if (field.name === "category_id") {
            return { ...field, options: categoryOptions };
        }
        return field;
    });

    useEffect(() => {
        if (initialData) {
            reset({
                ...QUESTION_FORM_INITIAL,
                ...initialData,
                category_id: initialData.category_id ?? "",
            });
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Each
                    of={formFields}
                    render={(field: any) => (
                        <div
                            key={field.name}
                            className={
                                field.type === "textarea"
                                    ? "sm:col-span-2"
                                    : ""
                            }
                        >
                            <ControlledFormComponent
                                control={control}
                                {...field}
                            />
                        </div>
                    )}
                />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isPending}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending
                        ? "Saving..."
                        : initialData
                          ? "Update Question"
                          : "Create Question"}
                </Button>
            </div>
        </form>
    );
};

export default QuestionForm;
