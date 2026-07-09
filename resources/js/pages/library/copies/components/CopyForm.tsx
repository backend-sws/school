import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import Each from "@/components/Each";
import { Button } from "@/components/ui/button";
import {
    LIBRARY_COPY_FORM_INITIAL,
    LIBRARY_COPY_FORM_LAYOUT,
} from "@/constants/page/admin/library";
import {
    LibraryCopyFormSchema,
    type LibraryCopyFormValues,
} from "@/lib/validations/library";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface CopyFormProps {
    initialData?: Partial<LibraryCopyFormValues>;
    onSubmit: (data: LibraryCopyFormValues) => void;
    onCancel: () => void;
    isPending?: boolean;
    submitLabel?: string;
    isEdit?: boolean;
}

export const CopyForm = ({
    initialData,
    onSubmit,
    onCancel,
    isPending,
    submitLabel = "Save",
    isEdit,
}: CopyFormProps) => {
    const { handleSubmit, control, reset } = useForm<LibraryCopyFormValues>({
        resolver: zodResolver(LibraryCopyFormSchema) as any,
        defaultValues: initialData || LIBRARY_COPY_FORM_INITIAL,
        mode: "onChange",
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit) as any} className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <Each
                    of={LIBRARY_COPY_FORM_LAYOUT}
                    render={(formField: any) => (
                        <ControlledFormComponent
                            key={formField.name}
                            control={control as any}
                            {...formField}
                            disabled={formField.name === "library_book_id" && isEdit}
                            className={
                                formField.name === "library_book_id"
                                    ? "md:col-span-2"
                                    : undefined
                            }
                        />
                    )}
                />
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" type="button" onClick={onCancel} disabled={isPending}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : submitLabel}
                </Button>
            </div>
        </form>
    );
};
