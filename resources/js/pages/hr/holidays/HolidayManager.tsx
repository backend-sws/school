import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
    CalendarDays, 
    Calendar as CalendarIcon, 
    List, 
    Plus, 
    Pencil, 
    Trash2, 
    RefreshCcw, 
    Sun, 
    Repeat,
    ChevronLeft,
    ChevronRight,
    Briefcase,
    CalendarCheck2
} from 'lucide-react';
import { PageContainer } from '@/components/shared/page/PageContainer';
import { MainPageHeader } from '@/components/shared/page/MainPageHeader';
import DataTable, { TableEmptyState, TableSkeletonLoader } from '@/components/dataTable';
import Each from '@/components/Each';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

/** Red star for required fields */
const Req = () => <span className="text-destructive ml-0.5">*</span>;

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_SHORT = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const WEEK_DAYS = [
    { label: 'Sun', full: 'Sunday', isOff: true },
    { label: 'Mon', full: 'Monday', isOff: false },
    { label: 'Tue', full: 'Tuesday', isOff: false },
    { label: 'Wed', full: 'Wednesday', isOff: false },
    { label: 'Thu', full: 'Thursday', isOff: false },
    { label: 'Fri', full: 'Friday', isOff: false },
    { label: 'Sat', full: 'Saturday', isOff: false },
];

const EMPTY_FORM = {
    name: '',
    date: '',
    is_recurring: false,
    description: '',
};

type CalendarCell =
    | { type: 'empty'; key: string }
    | {
          type: 'day';
          key: string;
          dayNumber: number;
          dateString: string;
          isSunday: boolean;
          isSaturday: boolean;
          isToday: boolean;
          holidays: any[];
      };

/**
 * Safely parse a "YYYY-MM-DD" string into a Date in local time without UTC offset shifting.
 */
function parseDateSafe(dStr?: string | null): Date | null {
    if (!dStr) return null;
    const clean = typeof dStr === 'string' ? dStr.split('T')[0] : '';
    const parts = clean.split('-').map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date(dStr);
}

export default function HolidayManager() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const [year, setYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [holidays, setHolidays] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Dialog states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [submitting, setSubmitting] = useState(false);

    // Delete confirmation
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const fetchHolidays = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/hr/holidays', { params: { year } });
            setHolidays(res.data.data || []);
        } catch {
            toast.error('Failed to fetch holidays');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHolidays();
    }, [year]);

    // Map holidays by "YYYY-MM-DD" (pure string matching, zero timezone shift)
    const holidaysByDate = useMemo(() => {
        const map: Record<string, any[]> = {};
        holidays.forEach(h => {
            if (!h.date) return;
            const dStr = typeof h.date === 'string' ? h.date.split('T')[0] : '';
            if (!dStr) return;
            if (!map[dStr]) map[dStr] = [];
            map[dStr].push(h);
        });
        return map;
    }, [holidays]);

    // Count holidays per month for the month selector pills
    const holidayCountByMonth = useMemo(() => {
        const counts = new Array(12).fill(0);
        holidays.forEach(h => {
            if (!h.date) return;
            const dStr = typeof h.date === 'string' ? h.date.split('T')[0] : '';
            const parts = dStr.split('-').map(Number);
            if (parts.length === 3) {
                const m = parts[1] - 1; // 0 to 11
                if (m >= 0 && m <= 11) {
                    counts[m]++;
                }
            }
        });
        return counts;
    }, [holidays]);

    // Active Month Statistics for Payroll preview
    const monthStats = useMemo(() => {
        const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();
        let sundaysCount = 0;
        let holidayDatesInMonth: string[] = [];

        for (let d = 1; d <= daysInMonth; d++) {
            const dt = new Date(year, selectedMonth, d);
            const dStr = `${year}-${String(selectedMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            if (dt.getDay() === 0) {
                sundaysCount++;
            }
            if (holidaysByDate[dStr] && holidaysByDate[dStr].length > 0) {
                holidayDatesInMonth.push(dStr);
            }
        }

        // Exclude holidays falling on Sunday to prevent double deduction
        const nonSundayHolidays = holidayDatesInMonth.filter(dStr => {
            const dt = parseDateSafe(dStr);
            return dt ? dt.getDay() !== 0 : true;
        }).length;

        const workingDays = Math.max(0, daysInMonth - sundaysCount - nonSundayHolidays);

        return {
            totalDays: daysInMonth,
            sundays: sundaysCount,
            holidays: holidayDatesInMonth.length,
            workingDays,
        };
    }, [year, selectedMonth, holidaysByDate]);

    // Calendar Grid cells generator
    const calendarDays = useMemo(() => {
        const firstDayOfMonth = new Date(year, selectedMonth, 1);
        const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();
        const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat

        const days: CalendarCell[] = [];
        // Empty placeholder cells before 1st day
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push({ type: 'empty', key: `empty-${i}` });
        }

        // Real day cells
        for (let d = 1; d <= daysInMonth; d++) {
            const dStr = `${year}-${String(selectedMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dt = new Date(year, selectedMonth, d);
            const isSunday = dt.getDay() === 0;
            const isSaturday = dt.getDay() === 6;
            const isCurrentToday = 
                today.getFullYear() === year && 
                today.getMonth() === selectedMonth && 
                today.getDate() === d;
            const dayHolidays = holidaysByDate[dStr] || [];

            days.push({
                type: 'day',
                key: `day-${d}`,
                dayNumber: d,
                dateString: dStr,
                isSunday,
                isSaturday,
                isToday: isCurrentToday,
                holidays: dayHolidays,
            });
        }

        return days;
    }, [year, selectedMonth, holidaysByDate, today]);

    const openAddForDate = (dateStr?: string) => {
        setEditingId(null);
        const targetDate = dateStr || `${year}-${String(selectedMonth + 1).padStart(2, '0')}-01`;
        setForm({ ...EMPTY_FORM, date: targetDate });
        setDialogOpen(true);
    };

    const openEdit = (h: any) => {
        setEditingId(h.id);
        const cleanDate = typeof h.date === 'string' ? h.date.split('T')[0] : '';
        setForm({
            name: h.name,
            date: cleanDate,
            is_recurring: Boolean(h.is_recurring),
            description: h.description || '',
        });
        setDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) { toast.error('Holiday name is required'); return; }
        if (!form.date) { toast.error('Date is required'); return; }

        setSubmitting(true);
        try {
            if (editingId) {
                await axios.put(`/api/v1/hr/holidays/${editingId}`, form);
                toast.success('Holiday updated successfully');
            } else {
                await axios.post('/api/v1/hr/holidays', form);
                toast.success('Holiday added successfully');
            }
            setDialogOpen(false);
            fetchHolidays();
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Failed to save holiday');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await axios.delete(`/api/v1/hr/holidays/${deleteId}`);
            toast.success('Holiday deleted successfully');
            setDeleteId(null);
            fetchHolidays();
        } catch {
            toast.error('Failed to delete holiday');
        }
    };

    const prevMonth = () => {
        if (selectedMonth === 0) {
            setSelectedMonth(11);
            setYear(y => y - 1);
        } else {
            setSelectedMonth(m => m - 1);
        }
    };

    const nextMonth = () => {
        if (selectedMonth === 11) {
            setSelectedMonth(0);
            setYear(y => y + 1);
        } else {
            setSelectedMonth(m => m + 1);
        }
    };

    const jumpToToday = () => {
        setYear(currentYear);
        setSelectedMonth(currentMonth);
    };

    return (
        <PageContainer maxWidth="full">
            <Head title="Holiday Manager" />
            <div className="space-y-6">
                <MainPageHeader
                    title="Holiday Manager"
                    subtitle="Manage official institution holidays. Sundays and marked holidays are automatically excluded from payroll working days."
                    icon={CalendarDays}
                    breadcrumbs={[
                        { title: 'HR & Payroll', href: '/hr/payroll' },
                        { title: 'Holiday Manager', href: '/hr/holidays' },
                    ]}
                />

                {/* Top Control Bar: Year, View Switcher & Add Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3 rounded-xl border shadow-sm">
                    {/* Year & Refresh */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 border rounded-lg overflow-hidden bg-background">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="px-3 rounded-none h-9 hover:bg-muted"
                                onClick={() => setYear(y => y - 1)}
                                title="Previous Year"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="px-3 text-sm font-bold min-w-[64px] text-center">{year}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="px-3 rounded-none h-9 hover:bg-muted"
                                onClick={() => setYear(y => y + 1)}
                                title="Next Year"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={fetchHolidays} 
                            disabled={loading}
                            className="h-9 px-2.5 gap-1 text-muted-foreground"
                            title="Refresh data"
                        >
                            <RefreshCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline text-xs">Sync</span>
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={jumpToToday}
                            className="h-9 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10"
                        >
                            Current Month
                        </Button>
                    </div>

                    {/* View Switcher + Add Button */}
                    <div className="flex items-center gap-2.5">
                        {/* Segmented View Mode Toggle */}
                        <div className="flex items-center rounded-lg border bg-muted/60 p-1 text-muted-foreground">
                            <button
                                type="button"
                                onClick={() => setViewMode('calendar')}
                                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                                    viewMode === 'calendar'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'hover:text-foreground'
                                }`}
                            >
                                <CalendarIcon className="h-3.5 w-3.5" />
                                <span>Calendar View</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                                    viewMode === 'list'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'hover:text-foreground'
                                }`}
                            >
                                <List className="h-3.5 w-3.5" />
                                <span>Table View</span>
                            </button>
                        </div>

                        <Button onClick={() => openAddForDate()} className="gap-1.5 shadow-sm">
                            <Plus className="h-4 w-4" /> Add Holiday
                        </Button>
                    </div>
                </div>

                {/* Payroll Rules Note */}
                <div className="flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50/70 dark:bg-blue-950/20 dark:border-blue-900/40 p-3.5 text-sm text-blue-800 dark:text-blue-300">
                    <Sun className="h-4 w-4 mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
                    <div className="leading-relaxed">
                        <span>
                            <strong>Sundays</strong> are automatically designated as weekly off. Marked holidays are <strong>additionally excluded</strong> from payroll working days (preventing double-deduction if a holiday falls on Sunday).
                        </span>
                        <span className="block text-xs mt-0.5 opacity-90 text-blue-700 dark:text-blue-400">
                            <strong>Recurring holidays</strong> repeat every year automatically on the same day. Saturdays are regular working days unless added as a holiday.
                        </span>
                    </div>
                </div>

                {/* ════════════════════════════════════════════════════════════════════════════════ */}
                {/* CALENDAR VIEW */}
                {/* ════════════════════════════════════════════════════════════════════════════════ */}
                {viewMode === 'calendar' && (
                    <div className="space-y-4">
                        {/* 12 Months Pill Selector */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                            {MONTH_SHORT.map((mShort, idx) => {
                                const count = holidayCountByMonth[idx];
                                const isSelected = selectedMonth === idx;
                                return (
                                    <button
                                        key={mShort}
                                        type="button"
                                        onClick={() => setSelectedMonth(idx)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                                            isSelected
                                                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                                        }`}
                                    >
                                        <span>{mShort}</span>
                                        {count > 0 && (
                                            <span
                                                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                                    isSelected
                                                        ? 'bg-white/25 text-white'
                                                        : 'bg-primary/10 text-primary'
                                                }`}
                                            >
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Month Header & Payroll Stats Strip */}
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-4 rounded-xl border shadow-sm">
                            {/* Month Navigation */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={prevMonth}
                                        title="Previous Month"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={nextMonth}
                                        title="Next Month"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold tracking-tight">
                                        {MONTH_NAMES[selectedMonth]} {year}
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Click any date to quickly add a holiday
                                    </p>
                                </div>
                            </div>

                            {/* Monthly Payroll Working Days Breakdown */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 border text-muted-foreground">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    <span>Total Days: <strong className="text-foreground">{monthStats.totalDays}</strong></span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-300">
                                    <Sun className="h-3.5 w-3.5" />
                                    <span>Sundays (Off): <strong>{monthStats.sundays}</strong></span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 dark:bg-purple-950/30 dark:border-purple-900/50 dark:text-purple-300">
                                    <CalendarCheck2 className="h-3.5 w-3.5" />
                                    <span>Holidays: <strong>{monthStats.holidays}</strong></span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-300 font-semibold">
                                    <Briefcase className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                    <span>Working Days: <strong>{monthStats.workingDays}</strong></span>
                                </div>
                            </div>
                        </div>

                        {/* Calendar 7-Day Grid */}
                        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                            {/* Day Header Row */}
                            <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-xs font-semibold text-muted-foreground">
                                {WEEK_DAYS.map((wd) => (
                                    <div
                                        key={wd.label}
                                        className={`py-2.5 border-r last:border-r-0 ${
                                            wd.isOff ? 'bg-rose-50/70 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 font-bold' : ''
                                        }`}
                                    >
                                        <span className="hidden sm:inline">{wd.full}</span>
                                        <span className="sm:hidden">{wd.label}</span>
                                        {wd.isOff && (
                                            <span className="hidden md:inline ml-1 text-[10px] font-normal opacity-80">(Off)</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Date Cells Grid */}
                            <div className="grid grid-cols-7 auto-rows-fr bg-muted/10">
                                {calendarDays.map((cell) => {
                                    if (cell.type === 'empty') {
                                        return (
                                            <div
                                                key={cell.key}
                                                className="min-h-[105px] sm:min-h-[125px] border-r border-b last:border-r-0 bg-muted/20"
                                            />
                                        );
                                    }

                                    const { dayNumber, dateString, isSunday, isToday, holidays: dayHolidays = [] } = cell;
                                    const hasHolidays = dayHolidays.length > 0;

                                    return (
                                        <div
                                            key={cell.key}
                                            onClick={() => !hasHolidays && openAddForDate(dateString)}
                                            className={`group relative min-h-[105px] sm:min-h-[125px] p-2 border-r border-b transition-colors cursor-pointer flex flex-col justify-between ${
                                                isSunday
                                                    ? 'bg-rose-50/30 dark:bg-rose-950/10 hover:bg-rose-50/60'
                                                    : 'hover:bg-muted/40'
                                            } ${isToday ? 'ring-2 ring-inset ring-primary/60' : ''}`}
                                        >
                                            {/* Cell Header: Date Number + Badges */}
                                            <div className="flex items-center justify-between gap-1">
                                                <div className="flex items-center gap-1.5">
                                                    <span
                                                        className={`flex items-center justify-center text-xs font-bold rounded-full w-6 h-6 ${
                                                            isToday
                                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                                : isSunday
                                                                ? 'text-rose-600 dark:text-rose-400'
                                                                : 'text-foreground'
                                                        }`}
                                                    >
                                                        {dayNumber}
                                                    </span>
                                                    {isToday && (
                                                        <span className="text-[10px] font-medium text-primary hidden sm:inline">
                                                            Today
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Sunday Off indicator or Quick Add Plus */}
                                                <div className="flex items-center gap-1">
                                                    {isSunday && (
                                                        <span className="text-[9px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-100/70 dark:bg-rose-900/30 px-1.5 py-0.5 rounded">
                                                            Off
                                                        </span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openAddForDate(dateString);
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-background shadow-xs text-muted-foreground hover:text-foreground"
                                                        title={`Add holiday on ${dateString}`}
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Holidays List in this day cell */}
                                            <div className="mt-1.5 space-y-1 overflow-y-auto max-h-[85px]">
                                                {dayHolidays?.map((h: any) => (
                                                    <div
                                                        key={h.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openEdit(h);
                                                        }}
                                                        className="group/item relative rounded-md p-1.5 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60 text-purple-900 dark:text-purple-200 hover:shadow-sm transition-all text-left"
                                                        title={`${h.name} ${h.is_recurring ? '(Recurring)' : ''} ${h.description ? `— ${h.description}` : ''}`}
                                                    >
                                                        <div className="flex items-center justify-between gap-1">
                                                            <div className="flex items-center gap-1 min-w-0">
                                                                {h.is_recurring && (
                                                                    <Repeat className="h-3 w-3 shrink-0 text-purple-600 dark:text-purple-400" />
                                                                )}
                                                                <span className="text-xs font-semibold truncate leading-tight">
                                                                    {h.name}
                                                                </span>
                                                            </div>
                                                            
                                                            {/* Quick action buttons on holiday chip */}
                                                            <div className="opacity-0 group-hover/item:opacity-100 flex items-center gap-0.5 shrink-0">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openEdit(h);
                                                                    }}
                                                                    className="p-0.5 rounded hover:bg-purple-200/60 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-300"
                                                                    title="Edit"
                                                                >
                                                                    <Pencil className="h-3 w-3" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setDeleteId(h.id);
                                                                    }}
                                                                    className="p-0.5 rounded hover:bg-rose-200/60 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {h.description && (
                                                            <p className="text-[10px] text-purple-700/80 dark:text-purple-300/80 truncate mt-0.5">
                                                                {h.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Hint at the bottom */}
                                            <div className="text-[9px] text-muted-foreground/60 invisible group-hover:visible pt-1">
                                                {!hasHolidays ? '+ Click to add' : ''}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* ════════════════════════════════════════════════════════════════════════════════ */}
                {/* LIST / TABLE VIEW */}
                {/* ════════════════════════════════════════════════════════════════════════════════ */}
                {viewMode === 'list' && (
                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden p-1">
                        <DataTable
                            columns={[
                                { key: 'name', label: 'Holiday Name' },
                                { key: 'date', label: 'Date' },
                                { key: 'day', label: 'Day' },
                                { key: 'recurring', label: 'Type' },
                                { key: 'description', label: 'Notes' },
                                { key: 'actions', label: 'Actions', align: 'right' },
                            ]}
                            isPaginated={false}
                            currentPage={1}
                            lastPage={1}
                            totalRecords={holidays.length}
                            pageSize={100}
                            handlePageChange={() => {}}
                            handlePageSizeChange={() => {}}
                        >
                            <Each
                                of={holidays}
                                isLoading={loading}
                                nodatafound={
                                    <TableEmptyState
                                        colSpan={6}
                                        icon={CalendarDays}
                                        message={`No holidays defined for ${year}`}
                                        description="Click 'Add Holiday' to define official holidays for this year."
                                    />
                                }
                                fallback={<TableSkeletonLoader columns={6} />}
                                render={(h: any) => {
                                    const date = parseDateSafe(h.date);
                                    const isSunday = date ? date.getDay() === 0 : false;
                                    return (
                                        <TableRow key={h.id}>
                                            <TableCell className="font-semibold text-foreground">
                                                {h.name}
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                {date ? format(date, 'dd MMM yyyy') : '—'}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                <div className="flex items-center gap-1.5">
                                                    <span>{date ? format(date, 'EEEE') : '—'}</span>
                                                    {isSunday && (
                                                        <span className="text-[10px] font-semibold text-rose-600 bg-rose-100 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">
                                                            Sunday
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {h.is_recurring ? (
                                                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 gap-1">
                                                        <Repeat className="h-3 w-3" /> Recurring
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-xs">
                                                        One-time
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground max-w-[220px] truncate" title={h.description}>
                                                {h.description || '—'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => openEdit(h)}
                                                        title="Edit Holiday"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => setDeleteId(h.id)}
                                                        title="Delete Holiday"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                }}
                            />
                        </DataTable>
                    </div>
                )}
            </div>

            {/* Add / Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Holiday' : 'Add Holiday'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="holiday-name">Holiday Name <Req /></Label>
                            <Input
                                id="holiday-name"
                                placeholder="e.g. Diwali, Independence Day, Eid"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="holiday-date">Date <Req /></Label>
                            <Input
                                id="holiday-date"
                                type="date"
                                value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch
                                id="holiday-recurring"
                                checked={form.is_recurring}
                                onCheckedChange={v => setForm({ ...form, is_recurring: v })}
                            />
                            <Label htmlFor="holiday-recurring" className="cursor-pointer">
                                Recurring (same day every year)
                            </Label>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="holiday-desc">Notes <span className="text-xs text-muted-foreground">(optional)</span></Label>
                            <Input
                                id="holiday-desc"
                                placeholder="Brief description..."
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting ? 'Saving...' : editingId ? 'Update' : 'Add Holiday'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteId}
                onOpenChange={(v) => { if (!v) setDeleteId(null); }}
                title="Delete Holiday?"
                description="This holiday will be removed. Future payroll runs will no longer exclude this date."
                onConfirm={handleDelete}
                confirmText="Delete"
                variant="danger"
            />
        </PageContainer>
    );
}
