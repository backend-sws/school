import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { EmptyState } from "@/components/shared/StateComponents";
import { DashedCard } from "@/components/shared/DashedCard";
import { Pagination } from "@/components/ui/pagination";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Head } from "@inertiajs/react";
import { Megaphone } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TickerDialog } from "@/components/admin/tickerDialog";
import TickerApi from "@/lib/api/tickerApi";
import { TICKER_BREADCRUMBS } from "@/constants/page/admin/website";
import { TickerCard, TickerCardSkeleton } from "@/components/website/TickerCard";
import { format } from "date-fns";
import { useRegisterGuide } from '@/components/GuideProvider';
import { TICKERS_GUIDE } from "@/constants/guides/website";
import React from 'react';

export default function Tickers() {
  const queryClient = useQueryClient();
useRegisterGuide(TICKERS_GUIDE);
  const tickerDisclosure = useDisclosure();
  const { filter, handleFilter } = useSearchFilter({
    page: 1,
    per_page: 12,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["tickers", filter],
    queryFn: () => TickerApi.getTickers(filter),
  });

  const deleteDisclosure = useDisclosure();
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => TickerApi.deleteTicker(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickers"] });
      deleteDisclosure.onClose();
    },
  });

  const handleDelete = (row: { id: number | string }) =>
    deleteDisclosure.onOpen(row);
  const confirmDelete = () => deleteMutation.mutate(deleteDisclosure.data?.id);
  const handleEdit = (val: { id: number | string }) =>
    tickerDisclosure.onOpen(val);

  const tickers = data?.data ?? [];
  const currentPage = data?.meta?.current_page ?? 1;
  const lastPage = data?.meta?.last_page ?? 1;
  const totalRecords = data?.meta?.total ?? 0;

  return (
    <>
      <Head title="Home Ticker" />
      <PageContainer>
        <div className="space-y-6">
          <TickerDialog
            open={tickerDisclosure.isOpen}
            onClose={tickerDisclosure.onClose}
            data={tickerDisclosure.data}
          />

          <ConfirmDialog
            open={deleteDisclosure.isOpen}
            onOpenChange={deleteDisclosure.onClose}
            title="Delete Ticker Entry"
            description="Are you sure you want to delete this ticker message? This action cannot be undone."
            onConfirm={confirmDelete}
            isLoading={deleteMutation.isPending}
            confirmText="Delete"
            variant="danger"
            confirmationKeyword="DELETE"
          />

          <TooltipProvider delayDuration={100}>
            <div className="space-y-6">
              <MainPageHeader
                id="tickers-header"
                breadcrumbs={TICKER_BREADCRUMBS}
                icon={Megaphone}
                title="Live Tickers"
                subtitle="Manage scrolling announcements and emergency alerts displayed on the homepage ticker"
              />

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <Each
                    of={Array.from({ length: 8 }, (_, i) => i)}
                    render={() => <TickerCardSkeleton />}
                  />
                </div>
              ) : tickers.length === 0 ? (
                <EmptyState
                  icon={
                    <Megaphone className="size-10 text-muted-foreground/60" />
                  }
                  title="No ticker entries yet"
                  description="Create your first announcement to show on the website ticker."
                  action={{
                    label: "Add New Entry",
                    onClick: () => tickerDisclosure.onOpen(),
                    variant: "default",
                  }}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="tickers-list">
                    <DashedCard
                      label="Add New Entry"
                      description="Create a new ticker message"
                      onClick={() => tickerDisclosure.onOpen()}
                    />
                    <Each
                      of={tickers}
                      render={(val: {
                        id: number | string;
                        content?: string;
                        tags?: string[];
                        status?: number | string;
                        created_at?: string;
                      }) => (
                        <TickerCard
                          key={val.id}
                          ticker={val}
                          formattedDate={
                            val.created_at
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
