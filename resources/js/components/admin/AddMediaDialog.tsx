import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ModalDialog } from "../shared/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import GalleryApi from "@/lib/api/galleryApi";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MEDIA_TYPE_OPTIONS,
  MEDIA_TYPE,
  parseYouTubeUrl,
  type MediaType,
} from "@/constants/shared/mediaTypes";
import { Image as ImageIcon, Video, Link2 } from "lucide-react";

interface AddMediaDialogProps {
  open: boolean;
  onClose: () => void;
  galleryId: string;
  onAdded: (type: MediaType, urlOrPath: string) => void;
}

export function AddMediaDialog({
  open,
  onClose,
  galleryId,
  onAdded,
}: AddMediaDialogProps) {
  const queryClient = useQueryClient();
  const [mediaType, setMediaType] = useState<MediaType>(MEDIA_TYPE.IMAGE);
  const [uploadPath, setUploadPath] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [caption, setCaption] = useState("");

  const addMutation = useMutation({
    mutationFn: async (payload: { media_type: string; image_url: string; caption?: string }) => {
      return GalleryApi.addGalleryImage(galleryId, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["gallery-images", galleryId] });
      resetForm();
      onClose();
      onAdded(variables.media_type as MediaType, variables.image_url);
      toast.success("Media added successfully");
    },
  });

  const resetForm = () => {
    setUploadPath(null);
    setYoutubeUrl("");
    setCaption("");
  };

  const handleSubmit = () => {
    let imageUrl = "";
    if (mediaType === MEDIA_TYPE.YOUTUBE) {
      const parsed = parseYouTubeUrl(youtubeUrl);
      if (!parsed) {
        addMutation.reset();
        return;
      }
      imageUrl = `https://www.youtube.com/watch?v=${parsed}`;
    } else {
      imageUrl = uploadPath || "";
    }
    if (!imageUrl) return;

    addMutation.mutate({
      media_type: mediaType,
      image_url: imageUrl,
      caption: caption || undefined,
    });
  };

  const canSubmit =
    mediaType === MEDIA_TYPE.YOUTUBE
      ? !!parseYouTubeUrl(youtubeUrl)
      : !!uploadPath;

  return (
    <ModalDialog
      title="Add Media"
      open={open}
      onClose={() => {
        resetForm();
        onClose();
      }}
      onPrimaryClick={handleSubmit}
      primaryDisabled={!canSubmit || addMutation.isPending}
      submitLabel={addMutation.isPending ? "Adding..." : "Add"}
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-4">Upload photos or add video links.</p>

          <div className="flex p-1 bg-muted rounded-lg w-full border">
            {MEDIA_TYPE_OPTIONS.map((opt) => {
              const isActive = mediaType === opt.value;
              return (
                <Button
                  key={opt.key}
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setMediaType(opt.value);
                    setUploadPath(null);
                    setYoutubeUrl("");
                  }}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all h-auto",
                    isActive ? "bg-white text-primary shadow-sm ring-1 ring-black/5 hover:bg-white" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {opt.value === MEDIA_TYPE.IMAGE && <ImageIcon className="h-4 w-4" />}
                  {opt.value === MEDIA_TYPE.VIDEO && <Video className="h-4 w-4" />}
                  {opt.value === MEDIA_TYPE.YOUTUBE && <Link2 className="h-4 w-4" />}
                  <span>{opt.text}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="min-h-[250px] flex flex-col justify-center">
          {mediaType === MEDIA_TYPE.IMAGE && (
            <FileUpload
              value={uploadPath}
              onChange={setUploadPath}
              accept="image/*"
              compact={false}
              className="h-full min-h-[250px] w-full hover:bg-muted/5 bg-card"
            />
          )}

          {mediaType === MEDIA_TYPE.VIDEO && (
            <FileUpload
              value={uploadPath}
              onChange={setUploadPath}
              accept="video/*"
              compact={false}
              className="h-full min-h-[250px] w-full hover:bg-muted/5 bg-card"
            />
          )}

          {mediaType === MEDIA_TYPE.YOUTUBE && (
            <div className="flex flex-col gap-4 h-full min-h-[250px]">
              <div className="border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center bg-muted/5 flex-1">
                {!parseYouTubeUrl(youtubeUrl) ? (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground opacity-50">
                    <Link2 className="h-10 w-10" />
                    <p>Paste a YouTube URL below to preview</p>
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-lg overflow-hidden border bg-muted shadow-sm">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${parseYouTubeUrl(youtubeUrl)}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>

              <div>
                <Label className="mb-2 block">YouTube URL</Label>
                <Input
                  placeholder="Paste link: https://youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        <Input
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full bg-muted/5"
        />
      </div>
    </ModalDialog>
  );
}
