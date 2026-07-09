import { ContentCard } from "./ContentCard";

interface NewsCardProps {
  news: {
    id: number | string;
    title?: string;
    content?: string;
    type?: string | string[];
    target?: string;
    status?: number | string;
    created_at?: string;
    event_date?: string | null;
    event_location?: string | null;
  };
  onEdit: () => void;
  onDelete: () => void;
  formattedDate: string;
}

export function NewsCard({
  news,
  onEdit,
  onDelete,
  formattedDate,
}: NewsCardProps) {
  // Convert type to tags array
  const tags = Array.isArray(news.type) 
    ? news.type 
    : news.type 
      ? [news.type] 
      : undefined;

  return (
    <ContentCard
      content={{
        ...news,
        tags,
      }}
      onEdit={onEdit}
      onDelete={onDelete}
      formattedDate={formattedDate}
      type="news"
    />
  );
}

// Re-export skeleton from ContentCard
export { ContentCardSkeleton as NewsCardSkeleton } from "./ContentCard";
