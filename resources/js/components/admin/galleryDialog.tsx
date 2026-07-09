import { useState, useEffect } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GALLERY_DIALOG_FORM_LAYOUT,
  GALLERY_FORM_INITIAL_DATA,
} from "@/constants/page/admin/website";
import GalleryApi from "@/lib/api/galleryApi";
import R2Api from "@/lib/api/r2Api";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MEDIA_TYPE_OPTIONS,
  MEDIA_TYPE,
  parseYouTubeUrl,
  type MediaType,
} from "@/constants/shared/mediaTypes";
import { Image as ImageIcon, Video, Link2, Plus, Trash2, X } from "lucide-react";
import type { FieldOption } from "../shared/ControlledFormComponent";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FORM_TYPE } from "@/constants/shared/form";

const gallerySchema = z.object({
  title: z.string().min(1, "Gallery title is required"),
  description: z.string().optional(),
  status: z.enum(["draft", "published"]).default("published"),
  youtubeUrl: z.string().optional(),
  caption: z.string().optional(),
});

interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  caption?: string;
}

interface GalleryDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  onSuccess?: (galleryId: string) => void;
}

export function GalleryDialog({ open, onClose, onSuccess }: GalleryDialogProps) {
  const { handleSubmit, control, reset, watch, setValue, getValues } = useForm({
    resolver: zodResolver(gallerySchema),
    defaultValues: { ...GALLERY_FORM_INITIAL_DATA, youtubeUrl: "", caption: "" },
  });

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [mediaType, setMediaType] = useState<MediaType>(MEDIA_TYPE.IMAGE);
  const [uploadPath, setUploadPath] = useState<string | null>(null);

  const watchedYoutubeUrl = watch("youtubeUrl");
  const WatchedCaption = watch("caption");

  useEffect(() => {
    if (open) {
      reset({ ...GALLERY_FORM_INITIAL_DATA, youtubeUrl: "", caption: "" });
      setMediaItems([]);
      setUploadPath(null);
    }
  }, [open, reset]);

  const resetMediaInputs = () => {
    setUploadPath(null);
    setValue("youtubeUrl", "");
    setValue("caption", "");
  };

  const addMediaToList = (urlOverride?: string) => {
    let url = urlOverride ?? "";
    const values = getValues();

    if (!url) {
      if (mediaType === MEDIA_TYPE.YOUTUBE) {
        const parsed = parseYouTubeUrl(values.youtubeUrl || "");
        if (!parsed) return;
        url = `https://www.youtube.com/watch?v=${parsed}`;
      } else {
        url = uploadPath || "";
      }
    }
    if (!url) return;

    setMediaItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: mediaType, url, caption: values.caption || undefined },
    ]);
    resetMediaInputs();
  };

  const removeMediaItem = (id: string) => {
    setMediaItems((prev) => prev.filter((m) => m.id !== id));
  };

  const canAddMedia =
    mediaType === MEDIA_TYPE.YOUTUBE ? !!parseYouTubeUrl(watchedYoutubeUrl || "") : !!uploadPath;

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      // Exclude temporary fields
      const { youtubeUrl, caption, ...payload } = data;
      const res = await GalleryApi.createGallery(payload);
      return res;
    },
    onSuccess: async (res) => {
      const galleryId = res?.data?.id;
      if (!galleryId) {
        queryClient.invalidateQueries({ queryKey: ["galleries"] });
        onClose(false);
        return;
      }
      try {
        for (let i = 0; i < mediaItems.length; i++) {
          const item = mediaItems[i];
          await GalleryApi.addGalleryImage(galleryId, {
            media_type: item.type,
            image_url: item.url,
            caption: item.caption,
            sort_order: i,
          });
        }
        queryClient.invalidateQueries({ queryKey: ["galleries"] });
        queryClient.invalidateQueries({ queryKey: ["gallery-images"] });

        onClose(false);
        if (onSuccess) onSuccess(String(galleryId));
        else router.visit(`/website/galleries/${galleryId}`);
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Gallery was created but some images failed to upload.";
        toast.error(message);
        router.visit(`/website/galleries/${galleryId}`);
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create gallery.";
      toast.error(message);
    },
  });

  const onSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  const handleClose = () => {
    setMediaItems([]);
    resetMediaInputs();
    onClose(false);
  };

  return (
    <ModalDialog
      title="Create New Gallery"
      open={open}
      onClose={handleClose}
      handleSubmit={handleSubmit(onSubmit)}
      isLoading={createMutation.isPending}
      submitLabel={createMutation.isPending ? "Creating..." : "Create Gallery"}
      className="sm:max-w-4xl gap-0 p-0 overflow-hidden"
      headerClassName="p-6 pb-2"
      footerClassName="p-4 border-t bg-muted/5"
    >
      <div className="flex flex-col md:flex-row h-full max-h-[80vh]">
        {/* Left: Settings */}
        <div className="w-full md:w-1/2 p-6 space-y-6 overflow-y-auto border-b md:border-b-0 md:border-r">
          <div>
            <h3 className="text-lg font-medium mb-1">Gallery Details</h3>
            <p className="text-sm text-muted-foreground">Basic information about this album.</p>
          </div>

          <div className="grid gap-5">
            <Each
              of={GALLERY_DIALOG_FORM_LAYOUT}
              render={(item: any) => (
                <ControlledFormComponent
                  key={item.name}
                  control={control}
                  name={item.name}
                  label={item.label}
                  placeholder={item.placeholder}
                  type={item.type}
                  required={item.required}
                  options={item.options}
                  className={item.className}
                  {...item}
                />
              )}
            />
          </div>
        </div>

        {/* Right: Media */}
        <div className="w-full md:w-1/2 p-6 space-y-6 bg-muted/10 overflow-y-auto flex flex-col">
          <div>
            <h3 className="text-lg font-medium mb-1">Add Media</h3>
            <p className="text-sm text-muted-foreground">Upload photos or add video links.</p>
          </div>

          <div className="space-y-6">
            {/* Media Type Selector */}
            <div className="flex p-1 bg-muted/50 rounded-lg w-full border">
              {MEDIA_TYPE_OPTIONS.map((opt) => {
                const isActive = mediaType === opt.value;
                return (
                  <Button
                    key={opt.key}
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setMediaType(opt.value);
                      resetMediaInputs();
                    }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all h-auto",
                      isActive ? "bg-white text-primary shadow-sm ring-1 ring-black/5 hover:bg-white" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {opt.value === MEDIA_TYPE.IMAGE && <ImageIcon className="h-4 w-4" />}
                    {opt.value === MEDIA_TYPE.VIDEO && <Video className="h-4 w-4" />}
                    {opt.value === MEDIA_TYPE.YOUTUBE && <Link2 className="h-4 w-4" />}
                    <span className="hidden sm:inline">{opt.text}</span>
                  </Button>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="min-h-[160px] flex flex-col justify-center">
              {mediaType === MEDIA_TYPE.IMAGE && (
                <FileUpload
                  mode="multiple"
                  value={[]}
                  onChange={(paths) => {
                    const captionVal = getValues("caption");
                    const newItems = paths.map(url => ({
                      id: crypto.randomUUID(),
                      type: MEDIA_TYPE.IMAGE,
                      url,
                      caption: captionVal || undefined
                    }));
                    setMediaItems(prev => [...prev, ...newItems]);
                    setValue("caption", "");
                  }}
                  accept="image/*"
                  className="h-full w-full hover:bg-muted/5 bg-background"
                />
              )}

              {mediaType === MEDIA_TYPE.VIDEO && (
                <FileUpload
                  mode="multiple"
                  value={[]}
                  onChange={(paths) => {
                    const captionVal = getValues("caption");
                    const newItems = paths.map(url => ({
                      id: crypto.randomUUID(),
                      type: MEDIA_TYPE.VIDEO,
                      url,
                      caption: captionVal || undefined
                    }));
                    setMediaItems(prev => [...prev, ...newItems]);
                    setValue("caption", "");
                  }}
                  accept="video/*"
                  className="h-full w-full hover:bg-muted/5 bg-background"
                />
              )}

              {mediaType === MEDIA_TYPE.YOUTUBE && (
                <div className="flex flex-col gap-4">
                  <div className="border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center bg-background flex-1 min-h-[160px]">
                    {!parseYouTubeUrl(watchedYoutubeUrl || "") ? (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground opacity-50">
                        <Link2 className="h-10 w-10" />
                        <p>Paste a YouTube URL below to preview</p>
                      </div>
                    ) : (
                      <div className="aspect-video w-full rounded-lg overflow-hidden border bg-muted shadow-sm">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${parseYouTubeUrl(watchedYoutubeUrl || "")}`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>

                  <div className="w-full">
                    <ControlledFormComponent
                      control={control}
                      name="youtubeUrl"
                      label="YouTube URL"
                      type={FORM_TYPE.TEXT}
                      placeholder="Paste YouTube URL..."
                      tooltip="Paste a valid YouTube video link here."
                      helperText="Preview will appear above automatically. Press Enter to add."
                      onBlur={() => addMediaToList()}
                      onKeyDown={(e: any) => e.key === "Enter" && (e.preventDefault(), addMediaToList())}
                    />
                  </div>
                </div>
              )}
            </div>

            <ControlledFormComponent
              control={control}
              name="caption"
              label="Caption"
              type={FORM_TYPE.TEXT}
              placeholder="Caption for next item(s) (optional)"
              tooltip="Optionally add a caption for the media item(s)."
              helperText="This caption will be applied to the next item you add."
            />


            {/* Preview List */}
            {mediaItems.length > 0 && (
              <>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                  <span>{mediaItems.length} items ready</span>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => setMediaItems([])}
                    className="h-auto p-0 text-destructive hover:underline"
                  >
                    Clear all
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-1">
                  {mediaItems.map((item, idx) => (
                    <div key={item.id} className="group relative aspect-square rounded-md overflow-hidden border bg-background">
                      <div className="absolute top-1 left-1 z-10 bg-black/50 text-white text-[10px] px-1.5 rounded-full">
                        {idx + 1}
                      </div>
                      {item.type === MEDIA_TYPE.YOUTUBE ? (
                        parseYouTubeUrl(item.url) ? (
                          <img
                            src={`https://img.youtube.com/vi/${parseYouTubeUrl(item.url)}/mqdefault.jpg`}
                            alt=""
                            className="w-full h-full object-cover opacity-80"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <Link2 className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )
                      ) : item.type === MEDIA_TYPE.VIDEO ? (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Video className="h-6 w-6 text-muted-foreground" />
                        </div>
                      ) : (
                        <img
                          src={R2Api.imageSrc(item.url)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMediaItem(item.id)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md h-full w-full"
                      >
                        <Trash2 className="h-5 w-5 text-white" />
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ModalDialog>
  );
}
