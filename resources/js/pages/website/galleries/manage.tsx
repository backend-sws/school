import { useState } from "react";
import { toast } from "sonner";
import { Head, Link } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Images, Image as ImageIcon, Video, Link2, Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GalleryApi from "@/lib/api/galleryApi";
import { useDisclosure } from "@/hooks/useDisclosure";
import { AddMediaDialog } from "@/components/admin/AddMediaDialog";
import { DashedCard } from "@/components/shared/DashedCard";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/shared/StateComponents";
import R2Api from "@/lib/api/r2Api";
import { parseYouTubeUrl, MEDIA_TYPE, type MediaType } from "@/constants/shared/mediaTypes";
import { UniversalMediaCard } from "@/components/website/UniversalMediaCard";
import Each from "@/components/Each";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldOption } from "@/components/shared/ControlledFormComponent";
import {
  GALLERY_DIALOG_FORM_LAYOUT,
  GALLERY_FORM_INITIAL_DATA,
} from "@/constants/page/admin/website";

interface ManageProps {
  id: string;
}

const gallerySchema = z.object({
  title: z.string().min(1, "Gallery title is required"),
  description: z.string().optional(),
  status: z.enum(["draft", "published"]).default("published"),
});

export default function GalleryManage({ id }: ManageProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const addMediaDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const { data: galleryData } = useQuery({
    queryKey: ["gallery", id],
    queryFn: () => GalleryApi.getGalleryById(id),
  });

  const { data: imagesData, isLoading } = useQuery({
    queryKey: ["gallery-images", id],
    queryFn: () => GalleryApi.getGalleryImages(id),
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: number) => GalleryApi.deleteGalleryImage(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-images", id] });
      deleteDisclosure.onClose();
      toast.success("Image deleted successfully from gallery");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Failed to delete image";
      toast.error(message);
    },
  });

  const gallery = galleryData?.data;
  const media = imagesData?.data ?? [];

  const { handleSubmit, control, watch } = useForm({
    resolver: zodResolver(gallerySchema),
    defaultValues: GALLERY_FORM_INITIAL_DATA,
    values: gallery
      ? {
        title: gallery.title,
        description: gallery.description || "",
        status: gallery.status === "published" || gallery.status === 101 ? "published" : "draft",
      }
      : undefined,
  });

  const updateGalleryMutation = useMutation({
    mutationFn: (data: { title: string; description?: string; status: string }) =>
      GalleryApi.updateGallery(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery", id] });
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      setIsEditing(false);
      toast.success("Gallery updated successfully");
    },
  });

  const onSaveGallery = (data: { title: string; description?: string; status: string }) => {
    updateGalleryMutation.mutate(data);
  };

  const handleAddMedia = (type: MediaType, urlOrPath: string) => {
    addMediaDisclosure.onClose();
    queryClient.invalidateQueries({ queryKey: ["gallery-images", id] });
  };

  const handleDelete = (item: { id: number }) => deleteDisclosure.onOpen(item);
  const confirmDelete = () => deleteImageMutation.mutate(deleteDisclosure.data?.id);

  const breadcrumbs = [
    { title: "Media Gallery", href: "/website/galleries" },
    { title: gallery?.title || "Manage", href: "#" },
  ];

  return (
    <>
      <Head title={gallery?.title ? `Manage: ${gallery.title}` : "Manage Gallery"} />
      <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-4 md:p-6">
        <div className="space-y-6">
          <MainPageHeader
            breadcrumbs={breadcrumbs}
            icon={Images}
            title={gallery?.title || "Manage Gallery"}
            subtitle="Add or remove images and videos, and update gallery details."
            guidance="Upload high-quality images or add YouTube links. Reorder or delete media as needed. Changes save automatically."
          />
          <div className="flex justify-end">
            <Link href="/website/galleries">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Galleries
              </Button>
            </Link>
          </div>

          {gallery && (
            <form className="space-y-6 max-w-3xl">
              <ControlledFormComponent
                control={control}
                name="title"
                type="text"
                label="Gallery Title"
                placeholder="Enter gallery title"
                required
                onBlur={handleSubmit(onSaveGallery)}
              />

              <ControlledFormComponent
                control={control}
                name="description"
                type="textarea"
                label="Description"
                placeholder="Add a description..."
                onBlur={handleSubmit(onSaveGallery)}
              />

              <ControlledFormComponent
                control={control}
                name="status"
                type="select"
                label="Status"
                options={[
                  { key: "published", text: "Published", value: "published" },
                  { key: "draft", text: "Draft", value: "draft" },
                ]}
                onValueChange={() => {
                  // Small timeout to allow RHF to update internal state
                  setTimeout(() => handleSubmit(onSaveGallery)(), 0);
                }}
              />
            </form>
          )}

          <div>
            <div className="mb-4">
              <h2 className="text-lg font-medium">Media Items</h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-video rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : media.length === 0 ? (
              <EmptyState
                icon={<ImageIcon className="h-8 w-8 text-muted-foreground/50" />}
                title="No media items yet"
                description="Upload images or videos to showcase in this gallery. They will appear here once added."
                action={{
                  label: "Add Media",
                  onClick: () => addMediaDisclosure.onOpen(),
                  variant: "default",
                }}
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <DashedCard
                  label="Add Media"
                  onClick={() => addMediaDisclosure.onOpen()}
                  className="aspect-video h-auto"
                />
                <Each
                  of={media}
                  render={(item: { id: number; media_type?: string; image_url?: string; caption?: string }) => (
                    <UniversalMediaCard
                      key={item.id}
                      media={{
                        id: item.id,
                        media_type: item.media_type || "image",
                        image_url: item.image_url || "",
                        caption: item.caption,
                      }}
                      onDelete={() => handleDelete(item as any)}
                    />
                  )}
                />
              </div>
            )}
          </div>
        </div>

        <AddMediaDialog
          open={addMediaDisclosure.isOpen}
          onClose={() => addMediaDisclosure.onClose()}
          galleryId={id}
          onAdded={handleAddMedia}
        />

        <ConfirmDialog
          open={deleteDisclosure.isOpen}
          onOpenChange={deleteDisclosure.onClose}
          title="Delete Media"
          description="Remove this item from the gallery?"
          onConfirm={confirmDelete}
          isLoading={deleteImageMutation.isPending}
          confirmText="Delete"
          variant="danger"
        />
      </div>
    </>
  );
}
