import React, { useEffect } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import {
    NEWS_DIALOG_FORM_LAYOUT,
    NEWS_FORM_INITIAL_DATA,
} from "@/constants/page/admin/website";
import { FORM_TYPE } from "@/constants/shared/form";
import NewsApi from "@/lib/api/newsApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const newsSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    type: z.string().min(1, "Select a category"),
    target: z.string().default("all"),
    event_date: z.string().optional(),
    event_location: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    status: z.enum(["draft", "published"]).default("draft"),
});

interface NewsDialogProps {
    open: boolean;
    onClose: (open: boolean) => void;
    data?: any | null;
}

export function NewsDialog({ open, onClose, data }: NewsDialogProps) {
    const {
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(newsSchema),
        defaultValues: NEWS_FORM_INITIAL_DATA,
        mode: "onChange",
    });

    const isEditMode = !!data?.id;
    const dataId = data?.id;

    const { data: newsDetail, isLoading: isLoadingDetail } = useQuery({
        queryKey: ["news", dataId],
        queryFn: () => NewsApi.getNewsById(dataId),
        enabled: open && isEditMode,
    });

    useEffect(() => {
        if (isEditMode && newsDetail) {
            const fullData = newsDetail?.data;
            // Backend returns int (101=published, 100=draft), convert to string for form
            const statusValue = fullData.status === 101 || fullData.status === "published" 
                ? "published" 
                : "draft";
            
            // Backend returns news_types as array; form uses single select
            const typeArr = fullData.type ?? fullData.news_types ?? [];
            const typeSingle = Array.isArray(typeArr) && typeArr.length > 0 ? typeArr[0] : typeof typeArr === "string" ? typeArr : "notice";

            const eventDateRaw = fullData.event_date;
            const eventDate = eventDateRaw
                ? (typeof eventDateRaw === "string" && eventDateRaw.length >= 10 ? eventDateRaw.slice(0, 10) : eventDateRaw)
                : "";

            reset({
                title: fullData.title,
                content: fullData.content,
                type: typeSingle,
                target: fullData.target ?? fullData.news_for ?? "all",
                event_date: eventDate,
                event_location: fullData.event_location ?? "",
                tags: Array.isArray(fullData.tags) ? fullData.tags : [],
                status: statusValue,
            });
        } else {
            reset(NEWS_FORM_INITIAL_DATA);
        }
    }, [isEditMode, newsDetail, reset]);

    const { mutate: handleMutation, isPending: isSaving } = useMutation({
        mutationFn: (submitData: any) => {
            // Form uses single category; API expects type/news_types as array
            const typeSingle = submitData.type ?? "notice";
            const isEvent = String(typeSingle).toLowerCase() === "event";
            const payload = {
                title: submitData.title,
                content: submitData.content,
                type: [typeSingle],
                target: submitData.target,
                event_date: isEvent && submitData.event_date ? submitData.event_date : null,
                event_location: isEvent && submitData.event_location ? submitData.event_location : null,
                tags: Array.isArray(submitData.tags) ? submitData.tags : [],
                status: submitData.status,
            };
            return isEditMode
                ? NewsApi.updateNews(dataId, payload)
                : NewsApi.createNews(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["news"],
            });
            reset();
            onClose(false);
        },
    });

    const onSubmit = (data: any) => {
        handleMutation(data);
    };

    const typeValue = watch("type");
    const isEventType = String(typeValue || "").toLowerCase() === "event";

    return (
        <ModalDialog
            title={isEditMode ? "Edit News" : "Add News"}
            open={open}
            onClose={onClose}
            handleSubmit={handleSubmit(onSubmit)}
            isLoading={isSaving || isLoadingDetail}
        >
            <div className="grid gap-4">
                <Each
                    of={NEWS_DIALOG_FORM_LAYOUT}
                    render={(form: any) => (
                        <ControlledFormComponent
                            control={control}
                            options={form.options}
                            {...form}
                        />
                    )}
                />
                {isEventType && (
                    <>
                        <ControlledFormComponent
                            control={control}
                            name="event_date"
                            label="Event Date"
                            type={FORM_TYPE.DATE}
                            placeholder="Select event date"
                            tooltip="Date when the event will take place (for events only)"
                        />
                        <ControlledFormComponent
                            control={control}
                            name="event_location"
                            label="Event Location"
                            type={FORM_TYPE.TEXT}
                            placeholder="e.g. Main Auditorium, Seminar Hall"
                            tooltip="Venue or location for the event (for events only)"
                        />
                    </>
                )}
            </div>
        </ModalDialog>
    );
}
