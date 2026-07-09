import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Images, MoreHorizontal, Trash2 } from "lucide-react";
import { CardActionButtons } from "@/components/shared/CardActionButtons";
import R2Api from "@/lib/api/r2Api";
import { cn } from "@/lib/utils";
import { HelperTooltip } from "@/components/ui/helper-tooltip";
import { Button } from "@/components/ui/button";
import React from "react";

interface GalleryCardProps {
  gallery: {
    id: number | string;
    title?: string;
    description?: string;
    status?: number | string;
    image_count?: number;
    first_image_url?: string;
    images?: { image_url?: string }[];
  };
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

export function GalleryCard({
  gallery,
  onEdit,
  onDelete,
  className,
}: GalleryCardProps) {
  const images = gallery.images || [];
  // Ensure we have at least the first image
  const firstImage = gallery.first_image_url || images[0]?.image_url;

  // Get up to 3 images for the collage/stack effect
  const displayImages = images.slice(0, 3).map(img => img.image_url).filter(Boolean);
  // If we only have first_image_url and no images array populated
  if (displayImages.length === 0 && firstImage) {
    displayImages.push(firstImage);
  }

  const imageCount = gallery.image_count ?? gallery.images?.length ?? 0;
  const isPublished =
    gallery.status === 101 ||
    gallery.status === "101" ||
    gallery.status === 1 ||
    gallery.status === "1" ||
    gallery.status === "published";
  const hasCoverImage = !!firstImage;

  return (
    <div className={cn("group relative flex flex-col gap-2 h-full w-full", className)}>
      {/* Stack/Collage Visual */}
      <div className="relative aspect-[4/3] w-full cursor-pointer flex-1 min-h-0" onClick={onEdit}>
        {/* Background Stack Items - Decoration */}
        {displayImages.length > 1 && (
          <div className="absolute top-0 inset-x-4 bottom-[-12px] rounded-xl bg-muted-foreground/10 border border-border/40 transform scale-[0.85] translate-y-3 z-0 transition-transform duration-300 group-hover:translate-y-4 group-hover:rotate-[-2deg]" />
        )}
        {displayImages.length > 2 && (
          <div className="absolute top-0 inset-x-2 bottom-[-6px] rounded-xl bg-muted-foreground/20 border border-border/40 transform scale-[0.92] translate-y-1.5 z-10 transition-transform duration-300 group-hover:translate-y-2 group-hover:rotate-[1deg]" />
        )}

        {/* Main Card */}
        <div className="absolute inset-0 h-full w-full rounded-xl overflow-hidden border bg-background shadow-sm transition-all duration-300 group-hover:shadow-md z-20">
          {firstImage ? (
            <div className="h-full w-full relative overflow-hidden bg-muted">
              <img
                src={R2Api.imageSrc(firstImage)}
                alt={gallery.title || "Gallery"}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
            </div>
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center bg-muted/50 text-muted-foreground relative">
              <Images className="size-12 mb-2 opacity-30" />
              <span className="text-xs font-medium">Empty Gallery</span>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3 z-30 transition-all duration-300 group-hover:translate-y-0 translate-y-[-10px] opacity-0 group-hover:opacity-100">
            <Badge
              variant="default"
              className={cn(
                "backdrop-blur-md shadow-sm border-white/10",
                isPublished ? "bg-green-500/90 hover:bg-green-500 text-white" : "bg-black/50 hover:bg-black/70 text-white"
              )}
            >
              {isPublished ? "Live" : "Draft"}
            </Badge>
          </div>

          {/* Count Badge */}
          {imageCount > 0 && (
            <div className="absolute top-3 left-3 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0">
              <div className="bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                <ImageIcon className="size-3" />
                <span className="font-medium">{imageCount}</span>
              </div>
            </div>
          )}

          {/* Content Overlay - Title & Actions (always visible at bottom) */}
          <div className="absolute bottom-0 inset-x-0 p-4 z-30 flex flex-col justify-end">
            {/* Gradient for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent -z-10 rounded-b-xl pointer-events-none" />

            <div className="flex items-end justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3
                  className="font-semibold text-white text-base leading-tight truncate drop-shadow-md select-none"
                  title={gallery.title}
                >
                  {gallery.title || "Untitled Gallery"}
                </h3>
                {gallery.description && (
                  <p className="text-xs text-zinc-200 line-clamp-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity delay-75 duration-300 drop-shadow-md">
                    {gallery.description}
                  </p>
                )}
              </div>

              <div className={cn(
                "shrink-0 flex gap-1 transition-opacity duration-300",
                hasCoverImage ? "opacity-0 group-hover:opacity-100" : "opacity-100",
              )}>
                <HelperTooltip content="Manage">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                    className="h-8 w-8 flex items-center justify-center rounded-md text-white hover:text-white hover:bg-white/20 transition-colors bg-black/20 backdrop-blur-sm"
                  >
                    <MoreHorizontal className="size-4 drop-shadow-md" />
                  </Button>
                </HelperTooltip>

                <HelperTooltip content="Delete">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="h-8 w-8 flex items-center justify-center rounded-md text-white hover:text-red-400 hover:bg-white/10 transition-colors bg-black/20 backdrop-blur-sm"
                  >
                    <Trash2 className="size-4 drop-shadow-md" />
                  </Button>
                </HelperTooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { MediaCardWithDescriptionSkeleton as GalleryCardSkeleton } from "@/components/ui/skeleton";
