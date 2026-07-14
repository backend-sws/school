import React, { useState, useMemo } from "react";
import { Head } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { Megaphone, Search, Bell, Calendar, Eye, Loader2 } from "lucide-react";
import api from "@/lib/api/api";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Each from "@/components/Each";

const breadcrumbs = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Notices", href: "/student-portal/notices" },
];

export default function StudentNoticesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  // Fetch notices from the student-portal notices API
  const { data: response, isLoading } = useQuery({
    queryKey: ["student-notices-list"],
    queryFn: async () => {
      const res = await api.get("/student/notices");
      return res.data?.data ?? res.data ?? [];
    },
  });

  const noticesList = useMemo(() => {
    return Array.isArray(response) ? response : [];
  }, [response]);

  // Filter notices by search term
  const filteredNotices = useMemo(() => {
    if (!searchTerm.trim()) return noticesList;
    return noticesList.filter((notice: any) =>
      notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [noticesList, searchTerm]);

  return (
    <>
      <Head title="Notice Board" />
      <PageContainer maxWidth="full">
        <div className="space-y-6">
          {/* Header */}
          <MainPageHeader
            id="student-notices-header"
            breadcrumbs={breadcrumbs}
            icon={Megaphone}
            title="Notice Board"
            subtitle="Stay updated with the latest announcements, academic schedules, and official circulars."
          />

          {/* Search bar */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 w-full rounded-xl bg-card border-border/65 focus-visible:ring-primary"
            />
          </div>

          {/* Notices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {isLoading ? (
              // Loader / Skeleton UI
              Array.from({ length: 6 }).map((_, idx) => (
                <Card key={idx} className="border border-border/50 bg-card/60 backdrop-blur-sm animate-pulse">
                  <CardHeader className="space-y-2.5 pb-3">
                    <div className="h-4 bg-muted rounded-full w-24" />
                    <div className="h-5 bg-muted rounded-full w-3/4" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-3 bg-muted rounded-full w-full" />
                    <div className="h-3 bg-muted rounded-full w-5/6" />
                  </CardContent>
                </Card>
              ))
            ) : filteredNotices.length > 0 ? (
              <Each
                of={filteredNotices}
                keyExtractor={(item: any) => item.id.toString()}
                render={(item: any) => (
                  <Card
                    onClick={() => setSelectedNotice(item)}
                    className="border border-border bg-card hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-primary/25 transition-all duration-300 cursor-pointer flex flex-col group relative overflow-hidden"
                  >
                    {/* Glass hover shine */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-primary/5 to-transparent transition-opacity duration-300" />
                    
                    <CardHeader className="pb-3 space-y-1.5 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-primary flex items-center gap-1.5 bg-primary/5 px-2.5 py-1 rounded-full">
                          <Calendar size={12} />
                          {item.published_at}
                        </span>
                        {item.is_new && (
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                            New
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2 pt-1.5">
                        {item.title}
                      </h3>
                    </CardHeader>

                    <CardContent className="flex-1 pb-5 relative z-10 flex flex-col justify-between">
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                        {item.description || "No description provided."}
                      </p>
                      <div className="flex justify-end pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary-foreground hover:bg-primary gap-1.5 rounded-lg text-xs"
                        >
                          <Eye size={13} />
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              />
            ) : (
              // Empty State
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                <div className="p-4 rounded-full bg-muted mb-4">
                  <Bell className="size-8 text-muted-foreground/60" />
                </div>
                <h4 className="text-base font-bold text-foreground mb-1">
                  No notices found
                </h4>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {searchTerm.trim()
                    ? "Try adjusting your search terms or filter keywords."
                    : "There are currently no active notices posted on the board."}
                </p>
              </div>
            )}
          </div>
        </div>
      </PageContainer>

      {/* Notice Detail Dialog */}
      <Dialog open={!!selectedNotice} onOpenChange={(open) => !open && setSelectedNotice(null)}>
        {selectedNotice && (
          <DialogContent className="max-w-2xl bg-card rounded-2xl border-border/80 shadow-2xl p-6 sm:p-8 overflow-hidden relative">
            {/* Mesh Background */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(circle_at_top_right,var(--primary),transparent_70%)]" />
            
            <DialogHeader className="space-y-3 pb-4 border-b border-border/50 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Calendar size={12} />
                  {selectedNotice.published_at}
                </span>
                {selectedNotice.is_new && (
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    New
                  </span>
                )}
              </div>
              <DialogTitle className="text-lg sm:text-xl font-bold text-foreground leading-tight tracking-tight">
                {selectedNotice.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Details for notice: {selectedNotice.title}
              </DialogDescription>
            </DialogHeader>

            {/* Content Body */}
            <div className="mt-5 max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin relative z-10">
              <div className="text-sm sm:text-base text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {selectedNotice.description || "No description provided."}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-border/50 flex justify-end relative z-10">
              <Button
                variant="outline"
                className="rounded-xl px-5 hover:bg-muted font-semibold text-sm"
                onClick={() => setSelectedNotice(null)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
