import React from 'react';
import FullPageLayout from '@/layouts/full-page-layout';
import { Head, Link } from '@inertiajs/react';
import { PageContainer } from '@/components/shared/page/PageContainer';
import { MainPageHeader } from '@/components/shared/page/MainPageHeader';
import { TODAY_TIMELINE } from "@/constants/timetable";
import Each from "@/components/Each";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User, BookOpen, GraduationCap, ArrowLeft, Calendar } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function TimetableDaily() {
    return (
        <>
            <Head title="Today's Detailed Schedule" />

            <PageContainer maxWidth="4xl" className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <MainPageHeader
                        id="timetable-daily-header"
                        icon={GraduationCap}
                        title="TODAY'S SCHEDULE"
                        subtitle="Comprehensive timeline of all periods and activities"
                    />
                </div>

                <div className="relative pt-2 pl-4 sm:pl-8">
                    {/* Vertical Line */}
                    <div className="absolute left-[21px] sm:left-[37px] top-4 bottom-6 w-0.5 bg-border/60" />

                    <div className="space-y-8 pb-12">
                        <Each
                            of={TODAY_TIMELINE}
                            render={(item) => (
                                <div className="relative flex gap-4 sm:gap-8 group">
                                    {/* Timeline Dot */}
                                    <div className={cn(
                                        "z-10 flex items-center justify-center size-4 sm:size-6 rounded-full border-2 bg-background transition-all group-hover:scale-110 shadow-sm",
                                        item.status === 'Current'
                                            ? "border-primary ring-4 ring-primary/10 scale-110"
                                            : item.status === 'Completed'
                                                ? "border-muted-foreground/30 bg-muted"
                                                : "border-border"
                                    )}>
                                        {item.status === 'Current' && <div className="size-1.5 sm:size-2 rounded-full bg-primary animate-pulse" />}
                                    </div>

                                    <div className={cn(
                                        "flex-1",
                                        item.status === 'Completed' && "opacity-60"
                                    )}>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge
                                                    variant={item.status === 'Current' ? 'default' : 'secondary'}
                                                    className="font-bold uppercase tracking-tighter text-[10px] rounded-md"
                                                >
                                                    {item.name}
                                                </Badge>
                                                <div className="flex items-center text-xs font-mono font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                                                    <Clock className="size-3 mr-1" />
                                                    {item.time}
                                                </div>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "w-fit text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border-primary/20 bg-primary/5 text-primary",
                                                    item.type === 'Break' && "border-amber-200 bg-amber-50 text-amber-700",
                                                    item.type === 'Practical' && "border-indigo-200 bg-indigo-50 text-indigo-700"
                                                )}
                                            >
                                                {item.type}
                                            </Badge>
                                        </div>

                                        <div className={cn(
                                            "rounded-2xl border p-5 transition-all group-hover:shadow-xl group-hover:shadow-primary/5 group-hover:border-primary/20 bg-card",
                                            item.status === 'Current' && "border-primary/30 ring-1 ring-primary/10 bg-gradient-to-br from-primary/[0.02] to-transparent shadow-lg shadow-primary/5"
                                        )}>
                                            <div className="flex items-start justify-between gap-4 mb-4">
                                                <h4 className="text-xl font-black tracking-tight flex items-center gap-3">
                                                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                        <BookOpen className="size-5" />
                                                    </div>
                                                    {item.subject}
                                                </h4>
                                                {item.status === 'Current' && (
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase animate-pulse">
                                                        <Activity className="size-3" />
                                                        In Progress
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium p-3 rounded-xl bg-muted/30 group-hover:bg-muted/50 transition-colors">
                                                    <div className="size-10 rounded-xl bg-background shadow-sm border flex items-center justify-center text-primary/60 group-hover:text-primary transition-colors">
                                                        <User className="size-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black tracking-widest opacity-50 leading-none mb-1">Instructor</p>
                                                        <p className="text-foreground font-bold">{item.teacher}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium p-3 rounded-xl bg-muted/30 group-hover:bg-muted/50 transition-colors">
                                                    <div className="size-10 rounded-xl bg-background shadow-sm border flex items-center justify-center text-primary/60 group-hover:text-primary transition-colors">
                                                        <MapPin className="size-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black tracking-widest opacity-50 leading-none mb-1">Room / Lab</p>
                                                        <p className="text-foreground font-bold">{item.room}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </div>
            </PageContainer>
        </>
    );
}

TimetableDaily.layoutProps = {
    backHref: "/timetable",
    backLabel: "Back to Timetable",
};

// Simple Activity icon for the "In Progress" badge
function Activity(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );
}
