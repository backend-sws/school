import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useRegisterGuide } from '@/components/GuideProvider';
import { TIMETABLE_OVERVIEW_GUIDE } from '@/constants/guides/timetable';
import { RECENT_TIMETABLES, TODAY_TIMELINE } from '@/constants/timetable';
import {
    Calendar,
    Plus,
    LayoutGrid,
    ArrowRight,
    Clock,
    MapPin,
    UserCheck,
    History,
    AlertTriangle,
    CheckCircle2,
    Activity,
    ShieldAlert,
    ChevronRight,
    Search
} from 'lucide-react';
import Each from '@/components/Each';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MainPageHeader } from '@/components/shared/page/MainPageHeader';
import { PageContainer } from '@/components/shared/page/PageContainer';
import { cn } from '@/lib/utils';
import { useDisclosure } from '@/hooks/useDisclosure';
import { CreateTimetableModal } from './components/CreateTimetableModal';
import { useQuery } from '@tanstack/react-query';
import TimetableApi from '@/lib/api/timetableApi';
import { Loader2 } from 'lucide-react';

export default function TimetableIndex() {
const createTimetableDisclosure = useDisclosure();

    const { data: timetables, isLoading } = useQuery({
        queryKey: ['timetables'],
        queryFn: () => TimetableApi.getTimetables().then(res => res.data),
    });

    console.log('Timetables from API:', timetables);
    useRegisterGuide(TIMETABLE_OVERVIEW_GUIDE);

    return (
        <>
            <Head title="Timetable Overview" />

            <CreateTimetableModal
                open={createTimetableDisclosure.isOpen}
                onOpenChange={(open) => !open && createTimetableDisclosure.onClose()}
            />

            <PageContainer maxWidth="7xl" className="space-y-8">
                <MainPageHeader
                    id="timetable-overview-header"
                    icon={Calendar}
                    breadcrumbs={[
                        { title: 'Academic Setup', href: '/timetable' },
                        { title: 'Timetable', href: '/timetable' }
                    ]}
                />

                {/* Flat Smart Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Each
                        of={[
                            { title: 'Coverage', value: '92%', icon: <Activity className="size-4 text-primary" />, trend: '+5% Improvement', trendColor: 'text-success bg-success/10 border-success/20', iconTrend: <CheckCircle2 className="size-3 mr-1" /> },
                            { title: 'Conflicts', value: '3', icon: <AlertTriangle className="size-4 text-orange-500" />, subText: 'Double bookings detected', valueColor: 'text-orange-600' },
                            { title: 'Rooms Free', value: '12 / 45', icon: <MapPin className="size-4 text-indigo-500" />, subText: 'Currently available' },
                            { title: 'Substitutions', value: '4', icon: <ShieldAlert className="size-4 text-rose-500" />, trend: 'Action Required', trendColor: 'text-rose-600 bg-rose-500/10 border-rose-500/20' },
                        ]}
                        render={(stat, index) => (
                            <Card variant="metrics" delay={index * 0.05} className="group">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">{stat.title}</CardTitle>
                                    <div className="transition-transform group-hover:scale-110 group-hover:rotate-3">
                                        {stat.icon}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className={cn("text-3xl font-black tracking-tight", stat.valueColor || "text-foreground")}>{stat.value}</div>
                                    {stat.trend && (
                                        <div className={cn("flex items-center mt-2 text-[10px] font-bold rounded-md px-2 py-0.5 w-fit border", stat.trendColor)}>
                                            {stat.iconTrend}
                                            {stat.trend}
                                        </div>
                                    )}
                                    {stat.subText && (
                                        <p className="text-xs text-muted-foreground/80 font-medium mt-1">{stat.subText}</p>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    />
                </div>

                {/* Management Quick Access */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold tracking-tight flex items-center">
                            <LayoutGrid className="h-5 w-5 mr-2 text-primary" />
                            Management & Configuration
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Each
                            of={[
                                { title: 'Templates', subText: 'Slots & Breaks', icon: <Clock className="h-5 w-5" />, href: '/timetable/templates', color: 'bg-primary/10 text-primary group-hover:bg-primary', hoverColor: 'group-hover:text-primary', borderColor: 'border-primary/5' },
                                { title: 'Rooms', subText: 'Space Allocation', icon: <MapPin className="h-5 w-5" />, href: '/timetable/rooms', color: 'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500', hoverColor: 'group-hover:text-blue-500', borderColor: 'border-blue-500/5' },
                                { title: 'Substitutions', subText: 'Daily Coverage', icon: <UserCheck className="h-5 w-5" />, href: '/timetable/substitutions', color: 'bg-rose-500/10 text-rose-500 group-hover:bg-rose-500', hoverColor: 'group-hover:text-rose-500', borderColor: 'border-rose-500/5' },
                            ]}
                            render={(link, index) => (
                                <Link href={link.href} className="block group">
                                    <Card variant="action" delay={0.2 + (index * 0.05)} className="p-4 flex items-center gap-4">
                                        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center border group-hover:text-primary-foreground transition-colors", link.color, link.borderColor)}>
                                            {link.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className={cn("font-bold text-base transition-colors", link.hoverColor)}>{link.title}</div>
                                            <div className="text-[10px] text-muted-foreground leading-tight uppercase font-black tracking-widest">{link.subText}</div>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-40" />
                                    </Card>
                                </Link>
                            )}
                        />
                    </div>
                </div>

                {/* Today's Timeline Preview */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold tracking-tight flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-primary" />
                            Today's Schedule Progress
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs font-bold text-primary hover:bg-primary/5"
                            asChild
                        >
                            <Link href="/timetable/daily">
                                Full Daily View
                                <ChevronRight className="h-3 w-3 ml-1" />
                            </Link>
                        </Button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        <Each
                            of={TODAY_TIMELINE}
                            render={(item) => (
                                <div
                                    className={`min-w-[180px] p-4 rounded-2xl border transition-all ${item.status === 'Current'
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105 border-primary'
                                        : item.status === 'Completed'
                                            ? 'bg-muted/30 border-muted opacity-60'
                                            : 'bg-card border-border hover:border-primary/50'
                                        }`}
                                >
                                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">{item.time}</div>
                                    <div className="font-bold">{item.name}</div>
                                    <div className={`text-[10px] mt-2 font-black uppercase inline-block px-2 py-0.5 rounded-full ${item.status === 'Current' ? 'bg-white/20' : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {item.status}
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight">Active Schedules</h2>
                            <p className="text-sm text-muted-foreground">Currently active and draft timetables across all streams</p>
                        </div>
                        <Button
                            className="w-full sm:w-auto rounded-xl"
                            onClick={createTimetableDisclosure.onOpen}
                        >
                            <Plus className="size-4 mr-2" />
                            Create New
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isLoading ? (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center space-y-4">
                                <Loader2 className="size-8 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground animate-pulse">Loading schedules...</p>
                            </div>
                        ) : timetables && timetables.length > 0 ? (
                            <Each
                                of={timetables}
                                render={(tt) => (
                                    <Card variant="action" delay={0.35 + (tt.id * 0.05)} className="group rounded-2xl overflow-hidden">
                                        <div className="flex flex-col">
                                            <div className="p-6 flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <Badge variant={tt.status === 'published' ? 'default' : 'secondary'} className="rounded-md border-none font-bold uppercase tracking-tighter text-[10px]">
                                                        {tt.status}
                                                    </Badge>
                                                    <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                                                        {tt.template?.name || 'Academic'}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-black text-foreground leading-tight mb-4">
                                                    {tt.session?.name} - {tt.template?.name}
                                                </h3>
                                                <div className="flex flex-wrap gap-4 font-mono">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        {tt.template?.period_slots_count || 0} periods
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                                        <LayoutGrid className="h-3.5 w-3.5" />
                                                        {tt.entries_count || 0} Assignments
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6 border-t flex items-center justify-center bg-muted/5">
                                                <Link href={`/timetable/${tt.id}/builder`} className="w-full">
                                                    <Button size="default" className="w-full rounded-xl font-bold gap-2">
                                                        Open Builder
                                                        <ArrowRight className="size-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            />
                        ) : (
                            <div className="col-span-full py-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center space-y-4 bg-muted/5">
                                <div className="size-16 rounded-full bg-muted/20 flex items-center justify-center">
                                    <Calendar className="size-8 text-muted-foreground/40" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">No Active Schedules</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs">You haven't initialized any timetables yet. Click "Create New" to get started.</p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={createTimetableDisclosure.onOpen}
                                    className="rounded-xl"
                                >
                                    Initialize First Schedule
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </PageContainer>
        </>
    );
}
