import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { EmptyState } from "@/components/shared/StateComponents";
import { Pagination } from "@/components/ui/pagination";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Head } from "@inertiajs/react";
import { Newspaper } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { NewsDialog } from "@/components/admin/newsDialog";
import NewsApi from "@/lib/api/newsApi";
import { NEWS_BREADCRUMBS } from "@/constants/page/admin/website";
import { format } from "date-fns";
import { DashedCard } from "@/components/shared/DashedCard";
import { NewsCard, NewsCardSkeleton } from "@/components/website/NewsCard";
import { useRegisterGuide } from '@/components/GuideProvider';
import { NEWS_GUIDE } from "@/constants/guides/website";
import React from 'react';

export default function News() {
  const queryClient = useQueryClient();
useRegisterGuide(NEWS_GUIDE);
  const newsDisclosure = useDisclosure();
  const { filter, handleFilter } = useSearchFilter({
    page: 1,
    per_page: 12,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["news", filter],
    queryFn: () => NewsApi.getNews(filter),
  });

  const deleteDisclosure = useDisclosure();
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => NewsApi.deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      deleteDisclosure.onClose();
    },
  });

  const handleDelete = (row: { id: number | string; title?: string }) =>
    deleteDisclosure.onOpen(row);
  const confirmDelete = () => deleteMutation.mutate(deleteDisclosure.data?.id);
  const handleEdit = (val: { id: number | string }) =>
    newsDisclosure.onOpen(val);

  const newsItems = data?.data ?? [];
  const currentPage = data?.meta?.current_page ?? 1;
  const lastPage = data?.meta?.last_page ?? 1;
  const totalRecords = data?.meta?.total ?? 0;

  return (
    <>
      <Head title="Manage News" />
      <PageContainer>
        <div className="space-y-6">
          <NewsDialog
            open={newsDisclosure.isOpen}
            onClose={newsDisclosure.onClose}
            data={newsDisclosure.data}
          />

          <ConfirmDialog
            open={deleteDisclosure.isOpen}
            onOpenChange={deleteDisclosure.onClose}
            title="Delete News Entry"
            description={`Are you sure you want to delete "${deleteDisclosure.data?.title}"? This action cannot be undone.`}
            onConfirm={confirmDelete}
            isLoading={deleteMutation.isPending}
            confirmText="Delete"
            variant="danger"
            confirmationKeyword="DELETE"
          />

          <TooltipProvider delayDuration={100}>
            <div className="space-y-6">
              <MainPageHeader
                id="news-header"
                breadcrumbs={NEWS_BREADCRUMBS}
                icon={Newspaper}
                title="Press & News"
                subtitle="Publish notices, events, and important updates for students and visitors"
              />

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <Each
                    of={Array.from({ length: 8 }, (_, i) => i)}
                    render={() => <NewsCardSkeleton />}
                  />
                </div>
              ) : newsItems.length === 0 ? (
                <EmptyState
                  icon={
                    <Newspaper className="size-10 text-muted-foreground/60" />
                  }
                  title="No news entries yet"
                  description="Click the button below to publish your first update."
                  action={{
                    label: "Add New News Entry",
                    onClick: () => newsDisclosure.onOpen(),
                    variant: "default",
                  }}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="news-table">
                    <div id="new-news-btn">
                      <DashedCard
                        label="Add New Entry"
                        description="Create a news article"
                        onClick={() => newsDisclosure.onOpen()}
                      />
                    </div>
                    <Each
                      of={newsItems}
                      render={(val: {
                        id: number | string;
                        title?: string;
                        content?: string;
                        type?: string | string[];
                        target?: string;
                        status?: number | string;
                        created_at?: string;
                        event_date?: string | null;
                        event_location?: string | null;
                      }) => (
                        <NewsCard
                          key={val.id}
                          news={val}
                          formattedDate={
                            val.event_date
                              ? format(new Date(val.event_date), "dd MMM yyyy")
                              : val.created_at
                                ? format(new Date(val.created_at), "dd MMM yyyy")
                                : "-"
                          }
                          onEdit={() => handleEdit(val)}
                          onDelete={() => handleDelete(val)}
                        />
                      )}
                    />
                  </div>

                  {lastPage > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={lastPage}
                      onPageChange={(page) => handleFilter({ page })}
                      pageSize={filter.per_page}
                      totalRecords={totalRecords}
                      showPageSize={false}
                    />
                  )}
                </>
              )}
            </div>
          </TooltipProvider>
        </div>
      </PageContainer>
    </>
  );
}
