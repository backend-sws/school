import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { EmptyState } from "@/components/shared/StateComponents";
import { DashedCard } from "@/components/shared/DashedCard";
import { Pagination } from "@/components/ui/pagination";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Head, router } from "@inertiajs/react";
import { Images as ImagesIcon, Plus, Search, Filter } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { FilterBar } from "@/components/filter-bar/filter-bar";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { GalleryDialog } from "@/components/admin/galleryDialog";
import GalleryApi from "@/lib/api/galleryApi";
import { GALLERY_BREADCRUMBS } from "@/constants/page/admin/website";
import { useRegisterGuide } from '@/components/GuideProvider';
import { GALLERIES_GUIDE } from "@/constants/guides/website";
import React from 'react';
import { toast } from "sonner";
import { GalleryCard, GalleryCardSkeleton } from "@/components/website/GalleryCard";

export default function Gallery() {
  const queryClient = useQueryClient();
useRegisterGuide(GALLERIES_GUIDE);
  const galleryDisclosure = useDisclosure();
  const { filter, handleFilter } = useSearchFilter({
    page: 1,
    per_page: 11, // 11 + 1 add card = 12
    search: "",
    search_by: "title",
    status: "all",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["galleries", filter],
    queryFn: () => GalleryApi.getGalleries(filter),
  });

  const deleteDisclosure = useDisclosure();
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => GalleryApi.deleteGallery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      deleteDisclosure.onClose();
      toast.success("Gallery deleted successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Failed to delete gallery";
      toast.error(message);
    },
  });

  const handleDelete = (row: { id: number | string; title?: string }) =>
    deleteDisclosure.onOpen(row);
  const confirmDelete = () => deleteMutation.mutate(deleteDisclosure.data?.id);
  const handleManage = (row: { id: number | string }) =>
    router.visit(`/website/galleries/${row.id}`);
  const handleCreate = () => galleryDisclosure.onOpen();

  const galleries = data?.data ?? [];
  const currentPage = data?.meta?.current_page ?? 1;
  const lastPage = data?.meta?.last_page ?? 1;
  const totalRecords = data?.meta?.total ?? 0;

  return (
    <>
      <Head title="Media Gallery" />
      <PageContainer>
        <div className="space-y-6">
          <GalleryDialog
            open={galleryDisclosure.isOpen}
            onClose={galleryDisclosure.onClose}
          />

          <ConfirmDialog
            open={deleteDisclosure.isOpen}
            onOpenChange={deleteDisclosure.onClose}
            title="Delete Gallery"
            description={`Are you sure you want to delete "${deleteDisclosure.data?.title}"? This action cannot be undone.`}
            onConfirm={confirmDelete}
            isLoading={deleteMutation.isPending}
            confirmText="Delete"
            variant="danger"
          />

          <TooltipProvider delayDuration={100}>
            <div className="space-y-6">
              <MainPageHeader
                id="galleries-header"
                breadcrumbs={GALLERY_BREADCRUMBS}
                icon={ImagesIcon}
                title="Media Gallery"
                subtitle="Organize and manage event photos and campus life images."
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
                <FilterBar values={filter} onChange={handleFilter} className="w-full sm:w-auto">
                  <FilterBar.Renderer config={{
                    filters: [{ name: "status", type: "select", label: "Status", placeholder: "Status", options: [{ value: "all", label: "All Status" }, { value: "published", label: "Published" }, { value: "draft", label: "Draft" }] }],
                    searchGroup: {
                      selectName: "search_by",
                      searchName: "search",
                      options: [
                        { value: "title", label: "Title" },
                      ],
                      placeholder: "Search galleries...",
                    },
                  }} />
                </FilterBar>
              </div>
              <>
                <div id="galleries-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {/* Add New Card (Always Visible) - same aspect as gallery cards */}
                  {galleries.length ? (
                    <div className="aspect-[4/3] w-full min-w-0">
                      <div id="new-gallery-btn">
                        <DashedCard
                          label="Create Gallery"
                          description="Start a new album"
                          onClick={handleCreate}
                          isVisible={true}
                          variant="grid"
                          className="h-full min-h-0"
                        />
                      </div>
                    </div>
                  ) : null}

                  <Each
                    of={galleries}
                    isLoading={isLoading}
                    fallback={
                      <Each
                        of={Array.from({ length: 7 }, (_, i) => i)}
                        render={() => <GalleryCardSkeleton />}
                      />
                    }
                    nodatafound={
                      <div className="col-span-full">
                        <EmptyState
                          icon={<Search className="size-10 text-muted-foreground/60" />}
                          title="No galleries found"
                          description={filter.search ? `No results found for "${filter.search}".` : "Get started by creating a new gallery."}
                          action={filter.search ? {
                            label: "Clear Filters",
                            onClick: () => handleFilter({ search: "", status: "all" }),
                            variant: "outline",
                          } : {
                            label: "Create Gallery",
                            onClick: handleCreate,
                            variant: "default"
                          }}
                        />
                      </div>
                    }
                    render={(val: {
                      id: number | string;
                      title?: string;
                      description?: string;
                      status?: number | string;
                      image_count?: number;
                      first_image_url?: string;
                      images?: { image_url?: string }[];
                    }) => (
                      <div key={val.id} className="aspect-[4/3] w-full min-w-0">
                        <div className="h-full w-full">
                          <GalleryCard
                            gallery={val}
                            onEdit={() => handleManage(val)}
                            onDelete={() => handleDelete(val)}
                          />
                        </div>
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
                  />
                )}
              </>
            </div>
          </TooltipProvider>
        </div>
      </PageContainer>
    </>
  );
}
