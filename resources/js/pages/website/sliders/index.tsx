import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { EmptyState } from "@/components/shared/StateComponents";
import { DashedCard } from "@/components/shared/DashedCard";
import { Pagination } from "@/components/ui/pagination";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Head } from "@inertiajs/react";
import { Image as ImageIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SliderDialog } from "@/components/admin/sliderDialog";
import SliderApi from "@/lib/api/sliderApi";
import { SLIDER_BREADCRUMBS } from "@/constants/page/admin/slider";
import { useRegisterGuide } from '@/components/GuideProvider';
import { SLIDERS_GUIDE } from "@/constants/guides/website";
import React from 'react';
import { toast } from "sonner";
import {
  BannerCard,
  BannerCardSkeleton,
} from "@/components/website/BannerCard";

export default function Sliders() {
  const queryClient = useQueryClient();
useRegisterGuide(SLIDERS_GUIDE);
  const sliderDisclosure = useDisclosure();
  const { filter, handleFilter } = useSearchFilter({
    page: 1,
    per_page: 12,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["sliders", filter],
    queryFn: () => SliderApi.getSliders(filter),
  });

  const deleteDisclosure = useDisclosure();
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => SliderApi.deleteSlider(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sliders"] });
      deleteDisclosure.onClose();
      toast.success("Banner slide deleted successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Failed to delete banner slide";
      toast.error(message);
    },
  });

  const handleDelete = (row: { id: number | string; title?: string }) =>
    deleteDisclosure.onOpen(row);
  const confirmDelete = () => deleteMutation.mutate(deleteDisclosure.data?.id);
  const handleEdit = (val: { id: number | string }) =>
    sliderDisclosure.onOpen(val);

  const sliders = data?.data ?? [];
  const currentPage = data?.meta?.current_page ?? 1;
  const lastPage = data?.meta?.last_page ?? 1;
  const totalRecords = data?.meta?.total ?? 0;

  return (
    <>
      <Head title="Sliders" />
      <div className="flex flex-col gap-4 sm:gap-6">
        <SliderDialog
          open={sliderDisclosure.isOpen}
          onClose={sliderDisclosure.onClose}
          data={sliderDisclosure.data}
        />

        <ConfirmDialog
          open={deleteDisclosure.isOpen}
          onOpenChange={deleteDisclosure.onClose}
          title="Delete Slider"
          description={`Are you sure you want to delete "${deleteDisclosure.data?.title}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          isLoading={deleteMutation.isPending}
          confirmText="Delete"
          variant="danger"
          confirmationKeyword="DELETE"
        />

        <TooltipProvider>
          <div className="space-y-8">
            <MainPageHeader
              id="sliders-header"
              breadcrumbs={SLIDER_BREADCRUMBS}
              icon={ImageIcon}
              title="Visual Banners"
              subtitle="Manage homepage carousel images, promotional banners, and hero section visuals"
            />

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <Each
                  of={Array.from({ length: 8 }, (_, i) => i)}
                  render={() => <BannerCardSkeleton />}
                />
              </div>
            ) : sliders.length === 0 ? (
              <EmptyState
                icon={
                  <ImageIcon className="size-10 text-muted-foreground/60" />
                }
                title="No banners yet"
                description="Create your first homepage slider to showcase your institution."
                action={{
                  label: "Add New Slide",
                  onClick: () => sliderDisclosure.onOpen(),
                  variant: "default",
                }}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="sliders-grid">
                  <div className="aspect-video w-full min-w-0">
                    <div id="add-slider-btn">
                      <DashedCard
                        label="Add New Slide"
                        description="Create a new banner"
                        onClick={() => sliderDisclosure.onOpen()}
                        variant="grid"
                        className="h-full min-h-0"
                      />
                    </div>
                  </div>
                  <Each
                    of={sliders}
                    render={(val: {
                      id: number | string;
                      title?: string;
                      description?: string;
                      image_url?: string;
                      button_url?: string;
                      button_caption?: string;
                      status?: number | string;
                      sort_order?: number;
                    }) => (
                      <div key={val.id} className="aspect-video w-full min-w-0">
                        <BannerCard
                          banner={val}
                          orderLabel={`Order ${val.sort_order ?? 0}`}
                          onEdit={() => handleEdit(val)}
                          onDelete={() => handleDelete(val)}
                          className="h-full w-full"
                        />
                      </div>
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
    </>
  );
}
