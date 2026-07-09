import { useState } from 'react';
import { SAMPLE_NOTICES } from '@/constants';
import { Bell, ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { SectionCard } from './section-card';
import { Button } from '@/components/ui/button';

export function NoticeBoard() {
    const [activeNoticeTab, setActiveNoticeTab] = useState('notices');

    return (
        <SectionCard
            title="Notice Board"
            subtitle="Official notifications"
            icon={<Bell className="h-6 w-6" />}
            iconBgClass="bg-primary/10 text-primary"
            footerLabel="View All Notices"
            footerHref="#"
        >
            <div className="flex flex-col h-full">
                {/* Standardized Tabs */}
                <div className="px-3 pt-2 pb-1 sm:px-4 sm:pt-3 shrink-0">
                    <div className="flex p-0.5 sm:p-1 bg-muted rounded-lg sm:rounded-xl border border-border">
                        {['Notices', 'Exams', 'Tenders'].map((tab) => (
                            <Button
                                key={tab}
                                type="button"
                                variant="ghost"
                                className={cn(
                                    "flex-1 py-1 sm:py-1.5 text-[8px] sm:text-[10px] font-bold rounded-md sm:rounded-lg transition-colors uppercase tracking-widest h-auto",
                                    activeNoticeTab === tab.toLowerCase()
                                        ? "bg-card text-primary shadow-sm hover:bg-card"
                                        : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                                )}
                                onClick={() => setActiveNoticeTab(tab.toLowerCase())}
                            >
                                {tab}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Content List */}
                <div className="flex-1 overflow-y-auto px-3 py-2 sm:px-4 sm:py-3 md:px-5 space-y-1.5 sm:space-y-2 scrollbar-hide">
                    {SAMPLE_NOTICES.map((notice, idx) => (
                        <a
                            key={idx}
                            href="#"
                            className={cn(
                                "flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 md:p-3.5 rounded-lg sm:rounded-xl border transition-colors group",
                                notice.isNew
                                    ? "border-primary/30 bg-primary/5"
                                    : "border-border/60 hover:border-primary/20 hover:bg-muted/50"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-lg flex flex-col items-center justify-center text-white shrink-0",
                                notice.isNew ? "bg-primary" : "bg-muted-foreground/60"
                            )}>
                                <span className="text-[8px] font-bold uppercase tracking-tighter opacity-80 leading-none mb-0.5">{notice.date.split(' ')[1]?.replace(',', '')}</span>
                                <span className="text-lg font-bold leading-none">{notice.date.split(' ')[0]}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                                        {notice.title}
                                    </h4>
                                    {notice.isNew && (
                                        <span className="shrink-0 px-2 py-0.5 rounded-sm bg-primary text-[8px] font-bold text-primary-foreground uppercase tracking-widest">
                                            New
                                        </span>
                                    )}
                                </div>
                                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                                    Official Update
                                </p>
                            </div>

                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors transition-transform group-hover:translate-x-1" />
                        </a>
                    ))}
                </div>
            </div>
        </SectionCard>
    );
}
