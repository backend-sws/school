
import { useMemo, useEffect } from "react";
import { toast } from "sonner";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import {
  NOTICE_CONDITIONAL_FORM_LAYOUT,
  NOTICE_CONDITIONAL_FORM_LAYOUT_SELECTIVE,
  NOTICE_DIALOG_FORM_LAYOUT,
  NOTICE_FORM_INITIAL_DATA,
} from "@/constants/page/admin/notice";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCollegeStreams } from "@/hooks/useCollegeStreams";
import { useCollegeSessions } from "@/hooks/useCollegeSessions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NoticeApi from "@/lib/api/noticeApi";
import { NoticeQueryKeys } from "@/lib/querykey/notice";
import { noticeFormSchema, NoticeFormData } from "@/lib/validations/notice";

interface NoticeDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  notice?: any | null;
}

export function NoticeDialog({ open, onClose, notice }: NoticeDialogProps) {
  const {
    handleSubmit,
    control,
    watch,
    reset,
  } = useForm<NoticeFormData>({
    resolver: zodResolver(noticeFormSchema) as any,
    defaultValues: NOTICE_FORM_INITIAL_DATA,
    mode: "onChange", // Enable real-time validation
  });

  const isViewMode = !!notice?.viewMode;
  const isEditMode = !!notice?.id;
  const noticeId = notice?.id;

  // Fetch notice details if in edit mode (to get full details like combos)
  const { data: noticeDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: NoticeQueryKeys.detail(noticeId as string),
    queryFn: () => NoticeApi.getNoticeById(noticeId as string),
    enabled: !!(open && noticeId),
  });

  // Sync form values when noticeDetail is fetched OR when notice prop changes (for immediate partial fill)
  useEffect(() => {
    if (isEditMode) {
      // Use noticeDetail if available, otherwise fallback to initial notice data from prop
      const fullData = noticeDetail?.data;
      const noticeData = fullData?.notice || notice;
      const combosData = fullData?.combos || notice?.combos || [];

      reset({
        title: noticeData?.title || "",
        description: noticeData?.description || "",
        target_type: noticeData?.target_type || "all",
        is_published: noticeData?.is_published ?? true,
        scheduled_at: noticeData?.scheduled_at || "",
        combos: combosData?.map((c: any) => ({
          stream_id: c.stream_id,
          session_id: c.session_id,
          id: `${c.stream_id}_${c.session_id}`,
        })) || [],
      });
    } else {
      reset(NOTICE_FORM_INITIAL_DATA);
    }
  }, [noticeDetail, notice, reset, isEditMode]);

  const isPublishLater = watch("is_published") === false;
  const istargetTypeSelective = watch("target_type") == "selective";

  const { data: streamsResponse, isLoading: streamLoading } = useCollegeStreams({
    params: { all: true },
  });
  const { data: sessionResponse, isLoading: sessionLoading } =
    useCollegeSessions({ params: { all: true } });
  const streams = streamsResponse?.data || [];
  const sessions = sessionResponse?.data || [];

  // Memoize combo options for stream-session combinations (stores objects directly)
  const comboOptions = useMemo(
    () =>
      streams.flatMap((stream: any) =>
        sessions.map((session: any) => ({
          key: `${stream.id}_${session.id}`,
          value: {
            stream_id: stream.id,
            session_id: session.id,
            id: `${stream.id}_${session.id}`,
          },
          text: `${stream.name} - ${session.name}`,
        }))
      ),
    [streams, sessions]
  );

  // Centralized options map: maps optionsKey to dynamic options
  const optionsMap = useMemo(
    () => ({
      streams: comboOptions,
    }),
    [comboOptions]
  );

  // Build form layout based on conditional states
  const formLayout = useMemo(() => {
    // Split the main layout to insert conditional fields in between
    const titleAndDesc = (NOTICE_DIALOG_FORM_LAYOUT as any[]).slice(0, 2);
    const targetType = (NOTICE_DIALOG_FORM_LAYOUT as any[]).slice(2, 3);
    const publishOptions = (NOTICE_DIALOG_FORM_LAYOUT as any[]).slice(3, 4);

    let layout: any[] = [...titleAndDesc, ...targetType];

    if (istargetTypeSelective) {
      layout = [...layout, ...NOTICE_CONDITIONAL_FORM_LAYOUT_SELECTIVE];
    }

    layout = [...layout, ...publishOptions];

    if (isPublishLater) {
      layout = [...layout, ...NOTICE_CONDITIONAL_FORM_LAYOUT];
    }

    return layout;
  }, [isPublishLater, istargetTypeSelective]);

  const queryClient = useQueryClient();

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (submitData: any) =>
      isEditMode
        ? NoticeApi.updateNotice(noticeId as string, submitData)
        : NoticeApi.createNotice(submitData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NoticeQueryKeys.all,
      });
      reset();
      onClose(false);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to save notice.";
      const validationErrors = err?.response?.data?.errors;
      if (validationErrors && typeof validationErrors === "object") {
        const firstMsg = Object.values(validationErrors).flat()[0];
        toast.error(firstMsg as string ?? msg);
      } else {
        toast.error(msg);
      }
    },
  });

  const onSubmit: SubmitHandler<NoticeFormData> = (data) => {
    const sanitizedData: Record<string, unknown> = {
      title: data.title,
      description: data.description || null,
      target_type: data.target_type,
      is_published: data.is_published,
    };

    if (data.target_type === "selective" && data.combos?.length) {
      sanitizedData.combos = data.combos.map((c) => ({
        stream_id: c.stream_id,
        session_id: c.session_id,
      }));
    }

    if (data.scheduled_at) {
      sanitizedData.scheduled_at = data.scheduled_at;
    }

    if (data.expired_at) {
      sanitizedData.expired_at = data.expired_at;
    }

    handleMutation(sanitizedData);
  };

  return (
    <ModalDialog
      title={isViewMode ? "View Notice" : isEditMode ? "Edit Notice" : "Add Notice"}
      open={open}
      onClose={onClose}
      handleSubmit={isViewMode ? undefined : (handleSubmit(onSubmit) as any)}
      isLoading={isSaving || isLoadingDetail}
    >
      <div className={`grid gap-4 ${istargetTypeSelective ? "pb-36" : ""}`}>
        <Each
          of={formLayout}
          render={(form: any) => (
            <ControlledFormComponent
              control={control as any}
              options={
                form.optionsKey ? (optionsMap as any)[form.optionsKey] : form.options
              }
              {...form}
              disabled={isViewMode || form.disabled}
            />
          )}
        />
      </div>
    </ModalDialog>
  );
}
