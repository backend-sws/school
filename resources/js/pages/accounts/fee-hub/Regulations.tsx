import React from 'react';
import { Head, router } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import StreamApi from "@/lib/api/streamApi";
import lmsApi from "@/lib/api/lmsApi";
import { Card, CardContent } from "@/components/ui/card";
import {
    ClipboardList,
    Search,
    ChevronRight,
    Loader2,
} from "lucide-react";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import Each from "@/components/Each";
import { TableSkeletonLoader } from "@/components/dataTable";
import { cn } from "@/lib/utils";
import { FilterBar } from "@/components/filter-bar";
import { useFilterRegistry } from "@/hooks/useFilterRegistry";
import useSearchFilter from "@/hooks/useSearchfilter";
import { useRegisterGuide } from '@/components/GuideProvider';
import { FEE_REGULATIONS_GUIDE } from "@/constants/guides/fees";

const breadcrumbs = [
    { title: "Treasury & Fees", href: "/accounts/fee-hub" },
    { title: "Fee Regulations", href: "/accounts/fee-hub/regulations" },
];

const GUIDANCE = [
    "Select a class to manage its specific fee structured and collection frequency.",
    "Regulations defined here will override Stream or Institution level defaults in the Student Ledger.",
    "Use 'Apply Profile' to quickly populate standard fee sets from a template.",
];

export default function Regulations() {
    const [navigatingStreamId, setNavigatingStreamId] = React.useState<number | null>(null);
    useRegisterGuide(FEE_REGULATIONS_GUIDE);

    const { filter, handleFilter } = useSearchFilter({
        search: "",
        search_by: "name",
    });

    const filterConfig = useFilterRegistry("fee_regulations");

    // Fetch streams (academic classes: Class I, Class II, etc.)
    const { data: streamsRes, isLoading: streamsLoading } = useQuery({
        queryKey: ["streams-for-regulations", filter.search, filter.search_by],
        queryFn: () => StreamApi.getStreams({ search: filter.search, search_by: filter.search_by, per_page: 100 }),
    });
    const streamsList = Array.isArray(streamsRes?.data) ? streamsRes.data : [];

    // Navigate: find-or-create an LMS class for the stream, then go to its regulation page
    const handleStreamClick = async (stream: any) => {
        setNavigatingStreamId(stream.id);
        try {
            const res: any = await lmsApi.classes.findOrCreateForStream(stream.id);
            const classId = res?.data?.id;
            if (classId) {
                router.get(`/accounts/fee-hub/regulations/${classId}`);
            } else {
                toast.error("Could not resolve class for this stream.");
            }
        } catch {
            toast.error("Failed to load class regulations.");
        } finally {
            setNavigatingStreamId(null);
        }
    };

    return (
        <>
            <Head title="Fee Regulations - Treasury & Fees" />

            <TooltipProvider>
                <PageContainer maxWidth="full">
                    <div className="space-y-6">
                        <MainPageHeader
                            id="fee-regulations-header"
                            breadcrumbs={breadcrumbs}
                            icon={ClipboardList}
                            title="Fee Regulations"
                            subtitle="Configure class-specific fee structures and collection frequencies."
                            guidance={GUIDANCE}
                        />

                        <div className="space-y-6 animate-in fade-in duration-500">
                            <div id="class-search-bar">
                                <FilterBar
                                    values={filter}
                                    onChange={handleFilter}
                                    showFilterButton={false}
                                >
                                    <FilterBar.Renderer config={filterConfig} />
                                </FilterBar>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" id="class-grid-container">
                                <Each
                                    of={streamsList}
                                    isLoading={streamsLoading}
                                    fallback={<TableSkeletonLoader columns={4} />}
                                    nodatafound={
                                        <div className="col-span-full py-20 text-center border-2 border-dashed rounded-2xl bg-muted/20">
                                            <Search className="size-10 text-muted-foreground/30 mx-auto mb-3" />
                                            <h3 className="text-lg font-bold">No classes found</h3>
                                            <p className="text-sm text-muted-foreground">Try adjusting your search criteria.</p>
                                        </div>
                                    }
                                    render={(stream: any) => {
                                        const isNavigating = navigatingStreamId === stream.id;
                                        return (
                                            <Card
                                                key={stream.id}
                                                className={cn(
                                                    "group cursor-pointer hover:border-primary hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden border bg-card/50 backdrop-blur-sm",
                                                    isNavigating && "border-primary/50 opacity-70 pointer-events-none"
                                                )}
                                                onClick={() => handleStreamClick(stream)}
                                            >
                                                <CardContent className="p-6">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl font-black group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                                            {stream.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        {isNavigating ? (
                                                            <Loader2 className="size-5 text-primary animate-spin" />
                                                        ) : (
                                                            <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                        )}
                                                    </div>

                                                    <div className="space-y-1">
                                                        <h4 className="font-extrabold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                                                            {stream.name}
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2 pt-2">
                                                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-background/50">
                                                                {stream.department?.name || stream.main_stream?.name || "General"}
                                                            </Badge>
                                                            {stream.code && (
                                                                <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                                                                    {stream.code}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </PageContainer>
            </TooltipProvider>
        </>
    );
}
