import React from "react";
import { Bell, Loader2 } from "lucide-react";
import Each from "@/components/Each";
import { STUDENT_DASHBOARD_LABELS } from "@/constants/page/studentDashboard";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/api";
import { index as noticesIndex } from "@/actions/App/Http/Controllers/Api/V1/StudentDashboard/StudentNoticeController";

export const NoticeBoardCard = ({ className }: { className?: string }) => {
  const { data: noticesResponse, isLoading } = useQuery({
    queryKey: ["student-notices"],
    queryFn: () => api.get(noticesIndex.url()),
  });

  const notices = noticesResponse?.data ?? [];

  return (
    <div className={`rounded-2xl border border-border bg-card overflow-hidden flex flex-col ${className ?? ""}`}>
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border bg-muted/30 shrink-0">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <Bell size={15} className="text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          {STUDENT_DASHBOARD_LABELS.noticeBoardCardTitle}
        </h3>
      </div>

      <div className="divide-y divide-border/50 overflow-auto flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : notices.length > 0 ? (
          <Each
            of={notices}
            keyExtractor={(item: any) => item.id.toString()}
            render={(item: any) => (
              <div className="px-5 py-3.5 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-[11px] font-semibold text-primary">
                    {item.published_at}
                  </p>
                  {item.is_new && (
                    <span className="bg-primary/10 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  {item.title}
                </p>
                {item.description && (
                   <p className="text-xs text-muted-foreground line-clamp-2">
                     {item.description}
                   </p>
                )}
              </div>
            )}
          />
        ) : (
          <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
            No important notices.
          </div>
        )}
      </div>
    </div>
  );
};
