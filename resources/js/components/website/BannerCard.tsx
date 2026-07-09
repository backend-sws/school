import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelperTooltip } from "@/components/ui/helper-tooltip";
import { Image as ImageIcon, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import R2Api from "@/lib/api/r2Api";

interface BannerCardProps {
  banner: {
    id: number | string;
    title?: string;
    description?: string;
    image_url?: string;
    button_url?: string;
    button_caption?: string;
    status?: number | string;
    sort_order?: number;
  };
  orderLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

export function BannerCard({
  banner,
  orderLabel,
  onEdit,
  onDelete,
  className,
}: BannerCardProps) {
  // Status can be: 101 (published), 100 (draft), or string "published"/"draft"
  const isPublished = banner.status === 101 || banner.status === "published";

  return (
    <div
      className={cn(
        "group relative aspect-video rounded-xl overflow-hidden bg-muted border shadow-sm hover:shadow-lg transition-all cursor-pointer w-full",
        className,
      )}
      onClick={onEdit}
    >
      {/* Image Layer */}
      <div className="absolute inset-0 w-full h-full">
        {banner.image_url ? (
          <img
            src={R2Api.imageSrc(banner.image_url)}
            alt={banner.title || "Banner Slide"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted">
            <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
            <span className="text-xs">No Image</span>
          </div>
        )}
      </div>

      {/* Status Badge - Top Left (always visible) */}
      <div className="absolute top-2 left-2 z-10">
        <HelperTooltip
          content={
            isPublished
              ? "This banner is live and visible to public"
              : "This banner is hidden and only visible to admins"
          }
        >
          <Badge
            variant={isPublished ? "default" : "secondary"}
            className={cn(
              "shadow-md text-xs px-2.5 py-1 font-semibold cursor-help",
              isPublished
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-white",
            )}
          >
            {isPublished ? "Published" : "Draft"}
          </Badge>
        </HelperTooltip>
      </div>

      {/* Order Badge - Top Right (1-based display for carousel) */}
      <div className="absolute top-2 right-2 z-10">
        <HelperTooltip content="Display order in carousel (first = 1)">
          <Badge
            variant="secondary"
            className="shadow-md text-xs px-2.5 py-1 font-semibold bg-black/60 text-white border-0 cursor-help"
          >
            #{(banner.sort_order ?? 0) + 1}
          </Badge>
        </HelperTooltip>
      </div>

      {/* Action Buttons - Top Right (visible on hover, below badges) */}
      <div className="absolute top-12 right-2 flex gap-1.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 z-10">
        <HelperTooltip content="Edit this banner">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-lg shadow-md bg-white/95 hover:bg-white dark:bg-gray-800/95 dark:hover:bg-gray-800"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </HelperTooltip>

        <HelperTooltip content="Delete this banner">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-lg shadow-md bg-white/95 hover:bg-white hover:text-destructive dark:bg-gray-800/95 dark:hover:bg-gray-800"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </HelperTooltip>
      </div>

      {/* Title Overlay - Bottom (visible on hover) */}
      <div className="absolute inset-x-0 bottom-0 p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
        <p
          className="text-white text-sm font-medium truncate drop-shadow-lg"
          title={banner.title}
        >
          {banner.title || "Untitled"}
        </p>
        {banner.description && (
          <p
            className="text-white/70 text-xs truncate mt-0.5"
            title={banner.description}
          >
            {banner.description}
          </p>
        )}
      </div>
    </div>
  );
}

// Skeleton for loading state
export function BannerCardSkeleton() {
  return (
    <div className="aspect-video rounded-xl overflow-hidden bg-muted border shadow-sm animate-pulse">
      <div className="w-full h-full bg-muted-foreground/10" />
    </div>
  );
}
