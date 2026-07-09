import { ContentCard } from "./ContentCard";

interface TickerCardProps {
  ticker: {
    id: number | string;
    content?: string;
    tags?: string[];
    status?: number | string;
    created_at?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  formattedDate: string;
}

export function TickerCard({
  ticker,
  onEdit,
  onDelete,
  formattedDate,
}: TickerCardProps) {
  return (
    <ContentCard
      content={ticker}
      onEdit={onEdit}
      onDelete={onDelete}
      formattedDate={formattedDate}
      type="ticker"
    />
  );
}

// Re-export skeleton from ContentCard
export { ContentCardSkeleton as TickerCardSkeleton } from "./ContentCard";
