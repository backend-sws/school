import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import Each from "@/components/Each";
import { Button } from "@/components/ui/button";
import {
    LIBRARY_BOOK_FORM_INITIAL,
    LIBRARY_BOOK_FORM_LAYOUT,
} from "@/constants/page/admin/library";
import {
    LibraryBookFormSchema,
    type LibraryBookFormValues,
} from "@/lib/validations/library";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface BookFormProps {
    initialData?: Partial<LibraryBookFormValues>;
    onSubmit: (data: LibraryBookFormValues) => void;
    onCancel: () => void;
    isPending?: boolean;
    submitLabel?: string;
}

export const BookForm = ({
    initialData,
    onSubmit,
    onCancel,
    isPending,
    submitLabel = "Save",
}: BookFormProps) => {
    const { handleSubmit, control, reset } = useForm<LibraryBookFormValues>({
        resolver: zodResolver(LibraryBookFormSchema) as any,
        defaultValues: initialData || LIBRARY_BOOK_FORM_INITIAL,
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
                    of={LIBRARY_BOOK_FORM_LAYOUT}
                    render={(formField: any) => (
                        <ControlledFormComponent
                            key={formField.name}
                            control={control as any}
                            options={formField.options}
                            {...formField}
                            className={
                                formField.name === "title" || formField.name === "description"
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
