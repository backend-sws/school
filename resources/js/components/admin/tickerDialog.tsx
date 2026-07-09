import React, { useEffect } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import {
    TICKER_DIALOG_FORM_LAYOUT,
    TICKER_FORM_INITIAL_DATA,
} from "@/constants/page/admin/website";
import TickerApi from "@/lib/api/tickerApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const tickerSchema = z.object({
    content: z.string().min(1, "Ticker message is required"),
    tags: z.array(z.string().max(20, "Tag cannot exceed 20 characters")).max(3, "Maximum 3 tags allowed").optional(),
    status: z.enum(["draft", "published"]).default("draft"),
});

interface TickerDialogProps {
    open: boolean;
    onClose: (open: boolean) => void;
    data?: any | null;
}

export function TickerDialog({ open, onClose, data }: TickerDialogProps) {
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(tickerSchema),
        defaultValues: TICKER_FORM_INITIAL_DATA,
        mode: "onChange",
    });

    const isEditMode = !!data?.id;
    const dataId = data?.id;

    const { data: tickerDetail, isLoading: isLoadingDetail } = useQuery({
        queryKey: ["tickers", dataId],
        queryFn: () => TickerApi.getTickerById(dataId),
        enabled: open && isEditMode,
    });

    useEffect(() => {
        if (isEditMode && tickerDetail) {
            const fullData = tickerDetail?.data;
            // Backend returns int (101=published, 100=draft), convert to string for form
            const statusValue = fullData.status === 101 || fullData.status === "published" 
                ? "published" 
                : "draft";
            reset({
                content: fullData.content,
                tags: fullData.tags || [],
                status: statusValue,
            });
        } else {
            reset(TICKER_FORM_INITIAL_DATA);
        }
    }, [isEditMode, tickerDetail, reset]);

    const { mutate: handleMutation, isPending: isSaving } = useMutation({
        mutationFn: (submitData: any) => {
            return isEditMode
                ? TickerApi.updateTicker(dataId, submitData)
                : TickerApi.createTicker(submitData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tickers"],
            });
            reset();
            onClose(false);
        },
    });

    const onSubmit = (data: any) => {
        handleMutation(data);
    };

    return (
        <ModalDialog
            title={isEditMode ? "Edit Ticker Entry" : "Add Ticker Entry"}
            open={open}
            onClose={onClose}
            handleSubmit={handleSubmit(onSubmit)}
            isLoading={isSaving || isLoadingDetail}
        >
            <div className="grid gap-4">
                <Each
                    of={TICKER_DIALOG_FORM_LAYOUT}
                    render={(form: any) => (
                        <ControlledFormComponent
                            control={control}
                            options={form.options}
                            {...form}
                        />
                    )}
                />
            </div>
        </ModalDialog>
    );
}
