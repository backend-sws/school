import React, { useState, useEffect } from "react";
import { ModalDialog } from "../shared/Modal";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import Each from "@/components/Each";
import { FORM_TYPE } from "@/constants/shared/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import lmsApi from "@/lib/api/lmsApi";
import { LmsClassesQueryKeys } from "@/lib/querykey/lmsClasses";
import { LmsRecordingSchema, type LmsRecordingFormValues } from "@/lib/validations/lms";
import {
  LMS_RECORDING_DETAILS_LAYOUT,
  LMS_RECORDING_SOURCE,
  LMS_RECORDING_SOURCE_OPTIONS,
} from "@/constants/page/admin/lmsForms";
import { FileUpload } from "@/components/ui/file-upload";
import { parseYouTubeUrl } from "@/constants/shared/mediaTypes";
import { Upload, Link2, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const RECORDING_SOURCE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  [LMS_RECORDING_SOURCE.UPLOAD]: Upload,
  [LMS_RECORDING_SOURCE.VIDEO_LINK]: Video,
  [LMS_RECORDING_SOURCE.YOUTUBE]: Link2,
};

interface LmsRecordingDialogProps {
  open: boolean;
  onClose: () => void;
  classId: number;
  allocationId?: number;
}

export function LmsRecordingDialog({ open, onClose, classId, allocationId }: LmsRecordingDialogProps) {
  const queryClient = useQueryClient();
  const [sourceType, setSourceType] = useState<typeof LMS_RECORDING_SOURCE[keyof typeof LMS_RECORDING_SOURCE]>(LMS_RECORDING_SOURCE.VIDEO_LINK);
  const [uploadPath, setUploadPath] = useState<string | null>(null);

  const { handleSubmit, control, reset, watch, setValue } = useForm<LmsRecordingFormValues>({
    resolver: zodResolver(LmsRecordingSchema),
    defaultValues: { title: "", video_url: "", file_path: "", description: "" },
    mode: "onChange",
  });

  const watchedVideoUrl = watch("video_url");

  useEffect(() => {
    if (open) {
      reset({ title: "", video_url: "", file_path: "", description: "" });
      setUploadPath(null);
      setSourceType(LMS_RECORDING_SOURCE.VIDEO_LINK);
    }
  }, [open, reset]);

  const getMediaPayload = (): { video_url: string | null; file_path: string | null } => {
    if (sourceType === LMS_RECORDING_SOURCE.UPLOAD && uploadPath) {
      return { file_path: uploadPath, video_url: null };
    }
    if (sourceType === LMS_RECORDING_SOURCE.VIDEO_LINK && watchedVideoUrl?.trim()) {
      return { video_url: watchedVideoUrl.trim(), file_path: null };
    }
    if (sourceType === LMS_RECORDING_SOURCE.YOUTUBE && watchedVideoUrl?.trim()) {
      const id = parseYouTubeUrl(watchedVideoUrl.trim());
      if (id) {
        return { video_url: `https://www.youtube.com/watch?v=${id}`, file_path: null };
      }
    }
    return { video_url: null, file_path: null };
  };

  const canSubmit = () => {
    if (sourceType === LMS_RECORDING_SOURCE.UPLOAD) return !!uploadPath;
    if (sourceType === LMS_RECORDING_SOURCE.VIDEO_LINK) return !!watchedVideoUrl?.trim();
    if (sourceType === LMS_RECORDING_SOURCE.YOUTUBE) return !!parseYouTubeUrl(watchedVideoUrl?.trim() ?? "");
    return false;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LmsRecordingFormValues) => {
      const { video_url, file_path } = getMediaPayload();
      return lmsApi.recordings.store(classId, {
        title: data.title.trim(),
        video_url,
        file_path,
        description: data.description?.trim() || null,
        ...(allocationId != null ? { class_subject_allocation_id: allocationId } : {}),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LmsClassesQueryKeys.recordings(classId) });
      toast.success("Recording added successfully!");
      reset();
      setUploadPath(null);
      onClose();
    },
  });

  const onSubmit = (data: LmsRecordingFormValues) => {
    if (!canSubmit()) return;
    mutate(data);
  };

  return (
    <ModalDialog
      title="Add Recording"
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit)}
      isLoading={isPending}
      submitLabel="Add Recording"
      primaryDisabled={!canSubmit()}
      className="sm:max-w-4xl gap-0 p-0 overflow-hidden"
      headerClassName="p-6 pb-2"
      footerClassName="p-4 border-t bg-muted/5"
    >
      <div className="flex flex-col md:flex-row h-full max-h-[80vh]">
        {/* Left: Recording Details */}
        <div className="w-full md:w-1/2 p-6 space-y-6 overflow-y-auto border-b md:border-b-0 md:border-r">
          <div>
            <h3 className="text-lg font-medium mb-1">Recording Details</h3>
            <p className="text-sm text-muted-foreground">Basic information about this recording.</p>
          </div>

          <div className="grid gap-5">
            <Each
              of={LMS_RECORDING_DETAILS_LAYOUT}
              keyExtractor={(field) => field.name}
              nodatafound={<p className="text-sm text-muted-foreground">No form fields configured.</p>}
              render={(field) => (
                <ControlledFormComponent
                  control={control}
                  name={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  type={field.type}
                  required={field.required}
                  maxLength={field.maxLength}
                  tooltip={field.tooltip}
                />
              )}
            />
          </div>
        </div>

        {/* Right: Add Recording */}
        <div className="w-full md:w-1/2 p-6 space-y-6 bg-muted/10 overflow-y-auto flex flex-col">
          <div>
            <h3 className="text-lg font-medium mb-1">Add Recording</h3>
            <p className="text-sm text-muted-foreground">Upload a video file or add a video link.</p>
          </div>

          <div className="space-y-6">
            {/* Source Type Selector */}
            <div className="flex p-1 bg-muted/50 rounded-lg w-full border">
              <Each
                of={LMS_RECORDING_SOURCE_OPTIONS as unknown as any[]}
                keyExtractor={(opt) => opt.key}
                nodatafound={null}
                render={(opt) => {
                  const isActive = sourceType === opt.value;
                  const Icon = RECORDING_SOURCE_ICONS[opt.value] ?? Upload;
                  return (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setSourceType(opt.value);
                        setUploadPath(null);
                        setValue("video_url", "");
                      }}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all h-auto px-2",
                        isActive ? "bg-white text-primary shadow-sm ring-1 ring-black/5 hover:bg-white" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{opt.text}</span>
                    </Button>
                  );
                }}
              />
            </div>

            {/* Input Area */}
            <div className="min-h-[160px] flex flex-col justify-center">
              {sourceType === LMS_RECORDING_SOURCE.UPLOAD && (
                <FileUpload
                  mode="single"
                  value={uploadPath}
                  onChange={(path) => setUploadPath(path)}
                  accept="video/*"
                  className="h-full w-full min-h-[160px] hover:bg-muted/5 bg-background"
                />
              )}

              {sourceType === LMS_RECORDING_SOURCE.VIDEO_LINK && (
                <div className="flex flex-col gap-4">
                  <div className="border border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center bg-background min-h-[120px]">
                    <Video className="h-10 w-10 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">Paste a direct video URL (MP4, WebM, etc.)</p>
                  </div>
                  <ControlledFormComponent
                    control={control}
                    name="video_url"
                    label="Video URL"
                    type={FORM_TYPE.TEXT}
                    placeholder="e.g. https://example.com/lesson.mp4 or Vimeo direct link"
                    maxLength={500}
                    tooltip="URL to the video file or a supported video hosting link. Max 500 characters."
                  />
                </div>
              )}

              {sourceType === LMS_RECORDING_SOURCE.YOUTUBE && (
                <div className="flex flex-col gap-4">
                  <div className="border border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center bg-background flex-1 min-h-[160px]">
                    {!parseYouTubeUrl(watchedVideoUrl || "") ? (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Link2 className="h-10 w-10 opacity-50" />
                        <p className="text-sm">Paste a YouTube URL below to preview</p>
                      </div>
                    ) : (
                      <div className="aspect-video w-full rounded-lg overflow-hidden border bg-muted shadow-sm">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${parseYouTubeUrl(watchedVideoUrl || "")}`}
                          title="YouTube video preview"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                  <ControlledFormComponent
                    control={control}
                    name="video_url"
                    label="YouTube URL"
                    type={FORM_TYPE.TEXT}
                    placeholder="Paste YouTube URL..."
                    maxLength={500}
                    tooltip="Paste a valid YouTube video link. Preview will appear above."
                  />
                </div>
              )}
            </div>

            {!canSubmit() && (
              <p className="text-xs text-muted-foreground">
                {sourceType === LMS_RECORDING_SOURCE.UPLOAD && "Upload a video file to continue."}
                {sourceType === LMS_RECORDING_SOURCE.VIDEO_LINK && "Enter a video URL to continue."}
                {sourceType === LMS_RECORDING_SOURCE.YOUTUBE && "Paste a valid YouTube URL to continue."}
              </p>
            )}
          </div>
        </div>
      </div>
    </ModalDialog>
  );
}
