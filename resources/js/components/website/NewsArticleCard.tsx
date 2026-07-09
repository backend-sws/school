import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { stripHtml } from "@/lib/utils";
import { CardActionButtons } from "@/components/shared/CardActionButtons";

function formatType(type: string | string[] | undefined): string {
  if (!type) return "Notice";
  if (Array.isArray(type)) {
    return type.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(", ") || "Notice";
  }
  return typeof type === "string" ? type.charAt(0).toUpperCase() + type.slice(1) : "Notice";
}

function formatTarget(target: string | undefined): string {
  if (!target) return "All";
  const map: Record<string, string> = {
    student: "For Students",
    others: "For Others",
    all: "All",
  };
  return map[target] || target;
}

interface NewsArticleCardProps {
  news: {
    id: number | string;
    title?: string;
    content?: string;
    type?: string | string[];
    target?: string;
    status?: number | string;
    created_at?: string;
  };
  formattedDate: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function NewsArticleCard({
  news,
  formattedDate,
  onEdit,
  onDelete,
}: NewsArticleCardProps) {
  const excerpt = stripHtml(news.content || "", 120);
  const excerptDisplay = excerpt + (excerpt.length >= 120 ? "…" : "");
  const typeLabel = formatType(news.type);
  const targetLabel = formatTarget(news.target);

  return (
    <Card className="group border rounded-lg hover:bg-muted/30 transition-colors">
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
            <h3 className="font-medium text-foreground" title={news.title}>
              {news.title || "Untitled"}
            </h3>
            <Badge
              variant={news.status === 1 || news.status === "published" ? "default" : "secondary"}
              className="shrink-0 capitalize text-[10px]"
            >
              {news.status === 1 || news.status === "published" ? "Live" : "Draft"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {typeLabel} · {targetLabel} · {formattedDate}
          </p>
          {excerptDisplay && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {excerptDisplay}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <CardActionButtons
            editLabel="Edit News"
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </CardContent>
    </Card>
  );
}

import { ArticleCardSkeleton } from "@/components/ui/skeleton";

export function NewsArticleCardSkeleton() {
  return <ArticleCardSkeleton contentLines={3} />;
}
