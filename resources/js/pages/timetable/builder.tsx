import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import FullPageLayout from '@/layouts/full-page-layout';
import { PageContainer } from '@/components/shared/page/PageContainer';
import {
    Calendar,
    Save,
    RotateCcw,
    Eye,
    Download,
    Plus,
    Maximize2,
    Settings2,
    Info,
    CheckCircle2,
    Loader2,
    User,
    MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MainPageHeader } from '@/components/shared/page/MainPageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import TimetableApi from '@/lib/api/timetableApi';
import { TimetableEntryModal } from './components/TimetableEntryModal';
import { useDisclosure } from '@/hooks/useDisclosure';
import { cn } from '@/lib/utils';
import Each from '@/components/Each';

export default function TimetableBuilder({ id }: { id: string }) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const { isOpen, onOpen, onClose } = useDisclosure();
    const onOpenChange = (open: boolean) => !open && onClose();
    const [selectedSlot, setSelectedSlot] = useState<{ slotId: string | number, day: number, entry?: any } | null>(null);

    const { data: timetable, isLoading } = useQuery({
        queryKey: ['timetable', String(id)],
        queryFn: () => TimetableApi.getTimetableById(id).then(res => res.data),
    });

    console.log('Timetable Builder Loading ID:', id);
    console.log('Fetched Timetable Data:', timetable);

    const handleCellClick = (slotId: string | number, dayIndex: number, entry?: any) => {
        setSelectedSlot({ slotId, day: dayIndex + 1, entry });
        onOpen();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    const template = timetable?.template;
    const slots = template?.period_slots || [];
    const entries = timetable?.entries || [];

    // Helper to find entry for a slot and day
    const getEntry = (slotId: string | number, day: number) => {
        return entries.find((e: any) => String(e.period_slot_id) === String(slotId) && e.day_of_week === day);
    };

    return (
        <>
            <Head title="Timetable Builder" />

            <PageContainer maxWidth="full" className="space-y-8">
                <MainPageHeader
                    title="Timetable Builder"
                    subtitle="Interactive drag-and-drop interface for structural scheduling"
                    icon={Maximize2}
                    id="timetable-builder-header"
                >
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                        <Button variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                        </Button>
                        <Button>
                            <Save className="h-4 w-4 mr-2" />
                            Save Draft
                        </Button>
                    </div>
                </MainPageHeader>

                <div className="space-y-6">
                    <Card variant="action" className="p-0">
                        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Academic Session</span>
                                    <span>{timetable?.session?.name || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col border-l pl-6">
                                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Stream</span>
                                    <span>{timetable?.template?.name || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col border-l pl-6">
                                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Target Group</span>
                                    <span>{timetable?.scheduleable_type?.split('\\').pop()} - {timetable?.scheduleable_id}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-white">{entries.length} Periods Defined</Badge>
                                <Badge variant="outline" className="bg-white">{new Set(entries.map((e: any) => e.teacher_id)).size} Teachers Assigned</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timetable Grid Container */}
                    <Card variant="elevated" className="overflow-hidden border-none shadow-xl ring-1 ring-black/5">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="bg-muted/50 p-4 border text-xs font-bold uppercase tracking-widest text-muted-foreground w-32">Time / Day</th>
                                        {days.map(day => (
                                            <th key={day} className="bg-muted/30 p-4 border text-sm font-bold text-center">
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <Each
                                        of={slots}
                                        keyExtractor={(slot: any) => String(slot.id)}
                                        render={(slot: any) => (
                                        <tr key={slot.id} className="group">
                                            <td className="bg-muted/20 p-4 border text-xs font-bold text-center align-middle whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-primary font-black">{slot.name}</span>
                                                    <span className="text-[10px] opacity-50">{slot.start_time} - {slot.end_time}</span>
                                                </div>
                                            </td>
                                            {days.map((day, idx) => {
                                                const entry = getEntry(slot.id, idx + 1);
                                                return (
                                                    <td
                                                        key={`${day}-${slot.id}`}
                                                        className="p-2 border h-32 group-hover:bg-muted/5 transition-colors relative"
                                                        onClick={() => handleCellClick(slot.id, idx, entry)}
                                                    >
                                                        {entry ? (
                                                            <div className="h-full w-full rounded-xl border border-primary/20 bg-primary/5 p-3 flex flex-col justify-between hover:bg-primary/10 transition-all cursor-pointer group/entry relative overflow-hidden">
                                                                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                                                <div className="space-y-1">
                                                                    <p className="text-xs font-black leading-tight line-clamp-2 uppercase tracking-tight">
                                                                        {entry.activity?.name || 'Class'}
                                                                    </p>
                                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                                                                        <User className="size-3" />
                                                                        {entry.teacher?.name || 'Staff'}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between mt-2">
                                                                    <div className="flex items-center gap-1 text-[9px] font-black text-primary/60 uppercase tracking-widest">
                                                                        <MapPin className="size-2.5" />
                                                                        {entry.room?.name || 'Lab'}
                                                                    </div>
                                                                    <Badge variant="secondary" className="text-[8px] h-4 px-1.5 font-bold uppercase tracking-tighter">
                                                                        Theory
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="h-full w-full rounded-lg border-2 border-dashed border-muted-foreground/10 flex items-center justify-center group-hover:border-primary/20 cursor-pointer hover:bg-primary/5 transition-all text-muted-foreground/30">
                                                                <Plus className="h-6 w-6" />
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    )}
                                    />
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1"><Info className="h-3 w-3" /> Auto-save enabled</span>
                            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-500" /> Conflict checking active</span>
                        </div>
                        <span>Last edited 2 minutes ago</span>
                    </div>
                </div>
            </PageContainer>

            <TimetableEntryModal
                open={isOpen}
                onOpenChange={onOpenChange}
                timetableId={id}
                slotId={selectedSlot?.slotId || null}
                dayOfWeek={selectedSlot?.day || null}
                initialData={selectedSlot?.entry}
            />
        </>
    );
}

TimetableBuilder.layoutProps = (props: any) => ({
    backHref: "/timetable",
    backLabel: "Back to Timetable",
});
