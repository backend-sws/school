import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelperTooltip } from "@/components/ui/helper-tooltip";
import { Pencil, Trash2, Calendar, Tag, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ContentCardProps {
  content: {
    id: number | string;
    content?: string;
    title?: string;
    tags?: string[];
    status?: number | string;
    created_at?: string;
    event_date?: string | null;
    event_location?: string | null;
  };
  onEdit: () => void;
  onDelete: () => void;
  formattedDate: string;
  type?: "ticker" | "news";
}

export function ContentCard({
  content,
  onEdit,
  onDelete,
  formattedDate,
  type = "ticker",
}: ContentCardProps) {
  // Status can be: 101 (published), 100 (draft), or string "published"/"draft"
  const isPublished = content.status === 101 || content.status === "published";

  return (
    <div
      className={cn(
        "group relative rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-border transition-all duration-300 cursor-pointer",
        "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        "flex flex-col h-full min-h-[280px]"
      )}
      onClick={onEdit}
    >
      {/* Header Section with Status and Actions */}
      <div className="relative p-4 pb-3 border-b border-border/50 bg-muted/20">
        <div className="flex items-start justify-between gap-2">
          {/* Status Badge with Tooltip */}
          <HelperTooltip 
            content={isPublished ? "This entry is live and visible to public" : "This entry is hidden and only visible to admins"}
          >
            <Badge
              variant={isPublished ? "default" : "secondary"}
              className={cn(
                "text-xs px-3 py-1 font-semibold shadow-sm cursor-help",
                isPublished
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              )}
            >
              {isPublished ? "Published" : "Draft"}
            </Badge>
          </HelperTooltip>

          {/* Action Buttons - Always visible on mobile, hover on desktop */}
          <div className="flex gap-1.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
            <HelperTooltip content="Edit this entry">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </HelperTooltip>

            <HelperTooltip content="Delete this entry">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </HelperTooltip>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-4 space-y-3">
        {/* Title (for news) */}
        {type === "news" && content.title && (
          <h3 className="text-base font-bold text-foreground line-clamp-2 leading-snug">
            {content.title}
          </h3>
        )}

        {/* Message Content */}
        <div
          className={cn(
            "text-sm font-medium text-foreground [&_*]:my-0 [&_*]:text-inherit leading-relaxed flex-grow",
            type === "news" ? "line-clamp-3" : "line-clamp-4"
          )}
          dangerouslySetInnerHTML={{
            __html: content.content || "No message",
          }}
        />

        {/* Tags Section */}
        {content.tags && content.tags.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Tag className="w-3 h-3" />
              <span>Categories</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {content.tags.map((tag, idx) => (
                <HelperTooltip key={idx} content={`Category: ${tag}`}>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs px-2.5 py-0.5 font-medium cursor-help",
                      "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20",
                      "transition-colors duration-200"
                    )}
                  >
                    {tag}
                  </Badge>
                </HelperTooltip>
              ))}
            </div>
          </div>
        )}

        {/* Event date & location (when present) */}
        {type === "news" && (content.event_date || content.event_location) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 border-t border-border/50 text-xs text-muted-foreground">
            {content.event_date && (
              <HelperTooltip content="Event date">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-primary/70" />
                  {format(new Date(content.event_date), "dd MMM yyyy")}
                </span>
              </HelperTooltip>
            )}
            {content.event_location && (
              <HelperTooltip content="Event location">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-primary/70" />
                  {content.event_location}
                </span>
              </HelperTooltip>
            )}
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="px-4 pb-4">
        <HelperTooltip content="Date created">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium px-2.5 py-1.5 rounded-lg bg-muted/50 w-fit cursor-help">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </HelperTooltip>
      </div>
    </div>
  );
}

// Skeleton for loading state
export function ContentCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-card border border-border/50 flex flex-col h-full animate-pulse">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-border/50 bg-muted/20">
        <div className="flex items-start justify-between gap-2">
          <div className="h-6 w-20 bg-muted-foreground/20 rounded-full" />
          <div className="flex gap-1.5">
            <div className="h-8 w-8 bg-muted-foreground/20 rounded-lg" />
            <div className="h-8 w-8 bg-muted-foreground/20 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-muted-foreground/20 rounded w-full" />
          <div className="h-4 bg-muted-foreground/20 rounded w-5/6" />
          <div className="h-4 bg-muted-foreground/20 rounded w-4/6" />
        </div>
        
        <div className="space-y-2">
          <div className="h-3 bg-muted-foreground/20 rounded w-20" />
          <div className="flex gap-1.5">
            <div className="h-6 w-16 bg-muted-foreground/20 rounded-full" />
            <div className="h-6 w-20 bg-muted-foreground/20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 pt-0">
        <div className="h-7 w-28 bg-muted-foreground/20 rounded-lg" />
      </div>
    </div>
  );
}
