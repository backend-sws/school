import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'sonner';
import { format, parse, addDays, subDays, isToday } from 'date-fns';
import { 
    CalendarDays, 
    Save, 
    CalendarIcon, 
    ChevronLeft, 
    ChevronRight,
    Download,
    Upload,
    FileSpreadsheet,
    CheckCircle2,
    AlertCircle,
    RefreshCcw,
    Sparkles,
    Users,
    UserCheck,
    UserX,
    Clock,
    Plane,
    Search,
    CheckCheck,
    Check,
    X,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/shared/page/PageContainer';
import { MainPageHeader } from '@/components/shared/page/MainPageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTable, { TableEmptyState, TableSkeletonLoader } from '@/components/dataTable';
import Each from '@/components/Each';
import {
    TableCell,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DatePicker } from '@/components/ui/date-picker';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';

export default function StaffAttendance() {
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [attendance, setAttendance] = useState<any[]>([]);
    const [dateMeta, setDateMeta] = useState<{ is_sunday?: boolean; is_holiday?: boolean; holiday?: any } | null>(null);
    const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent' | 'half_day' | 'on_leave'>('all');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/v1/hr/staff-attendance?date=${date}`);
            const data = res.data.data;
            if (data?.records) {
                setAttendance(data.records || []);
                setDateMeta(data.meta || null);
            } else if (Array.isArray(data)) {
                setAttendance(data);
                setDateMeta(null);
            } else {
                setAttendance([]);
                setDateMeta(null);
            }
            setHasUnsavedChanges(false);
        } catch (e) {
            toast.error("Failed to fetch attendance");
        } finally {
            setLoading(false);
        }
    };

    const fetchLeaveTypes = async () => {
        try {
            const res = await axios.get('/api/v1/hr/leave-types');
            setLeaveTypes(res.data.data || []);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchLeaveTypes();
    }, []);

    useEffect(() => {
        fetchAttendance();
    }, [date]);

    const totalCount = attendance.length;
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const absentCount = attendance.filter(a => a.status === 'absent').length;
    const halfDayCount = attendance.filter(a => a.status === 'half_day').length;
    const leaveCount = attendance.filter(a => a.status === 'on_leave').length;
    const attendanceRate = totalCount > 0 
        ? Math.round(((presentCount + (halfDayCount * 0.5)) / totalCount) * 100) 
        : 0;

    const filteredAttendance = useMemo(() => {
        return attendance.filter(att => {
            const query = searchQuery.trim().toLowerCase();
            const matchesSearch = !query || 
                (att.name && att.name.toLowerCase().includes(query)) ||
                (att.employee_id && att.employee_id.toLowerCase().includes(query)) ||
                (att.designation && att.designation.toLowerCase().includes(query));
            
            if (!matchesSearch) return false;
            if (filterStatus === 'all') return true;
            return att.status === filterStatus;
        });
    }, [attendance, searchQuery, filterStatus]);

    const updateRowStatus = (userId: number, newStatus: string) => {
        setAttendance(prev => prev.map(item => {
            if (item.user_id === userId) {
                return {
                    ...item,
                    status: newStatus,
                    leave_type_id: newStatus === 'on_leave' ? (item.leave_type_id || (leaveTypes[0]?.id ?? null)) : null
                };
            }
            return item;
        }));
        setHasUnsavedChanges(true);
    };

    const updateRowLeaveType = (userId: number, leaveTypeId: number | null) => {
        setAttendance(prev => prev.map(item => {
            if (item.user_id === userId) {
                return { ...item, leave_type_id: leaveTypeId };
            }
            return item;
        }));
        setHasUnsavedChanges(true);
    };

    const updateRowRemarks = (userId: number, remarks: string) => {
        setAttendance(prev => prev.map(item => {
            if (item.user_id === userId) {
                return { ...item, remarks };
            }
            return item;
        }));
        setHasUnsavedChanges(true);
    };

    const handleMarkAllPresent = () => {
        setAttendance(prev => prev.map(item => ({
            ...item,
            status: 'present',
            leave_type_id: null
        })));
        setHasUnsavedChanges(true);
        toast.success("Marked all staff as Present. Click 'Save Attendance' to save.");
    };

    const handleMarkAllAbsent = () => {
        setAttendance(prev => prev.map(item => ({
            ...item,
            status: 'absent',
            leave_type_id: null
        })));
        setHasUnsavedChanges(true);
        toast.info("Marked all staff as Absent. Click 'Save Attendance' to save.");
    };

    const handlePrevDay = () => {
        const current = parse(date, 'yyyy-MM-dd', new Date());
        setDate(format(subDays(current, 1), 'yyyy-MM-dd'));
    };

    const handleNextDay = () => {
        const current = parse(date, 'yyyy-MM-dd', new Date());
        setDate(format(addDays(current, 1), 'yyyy-MM-dd'));
    };

    const handleToday = () => {
        setDate(format(new Date(), 'yyyy-MM-dd'));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post('/api/v1/hr/staff-attendance', {
                date,
                attendances: attendance
            });
            setHasUnsavedChanges(false);
            toast.success("Attendance saved successfully");
        } catch (e) {
            toast.error("Failed to save attendance");
        } finally {
            setSaving(false);
        }
    };

    const getInitials = (name?: string) => {
        if (!name) return 'ST';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const getAvatarGradient = (name?: string) => {
        const gradients = [
            'from-indigo-500 to-purple-600',
            'from-blue-500 to-cyan-600',
            'from-emerald-500 to-teal-600',
            'from-violet-500 to-fuchsia-600',
            'from-amber-500 to-orange-600',
            'from-rose-500 to-pink-600',
        ];
        if (!name) return gradients[0];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return gradients[Math.abs(hash) % gradients.length];
    };

    return (
        <PageContainer maxWidth="full">
            <Head title="Staff Attendance" />
            
            <div className="space-y-6">
                <MainPageHeader 
                    title="Staff Attendance" 
                    subtitle="Mark daily attendance to automate payroll deductions."
                    icon={CalendarDays}
                    breadcrumbs={[{ title: 'HR & Payroll', href: '/hr/payroll' }, { title: 'Staff Attendance', href: '/hr/attendance' }]}
                />

                <Tabs defaultValue="daily" className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="daily">Daily Marking</TabsTrigger>
                        <TabsTrigger value="ledger">Monthly Ledger</TabsTrigger>
                    </TabsList>

                    <TabsContent value="daily" className="space-y-5">
                        {dateMeta?.is_holiday && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-xl text-purple-900 dark:text-purple-200 text-sm font-medium shadow-xs">
                                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                                    <Sparkles className="w-4 h-4 shrink-0" />
                                </div>
                                <div className="flex-1">
                                    <span className="font-semibold text-purple-950 dark:text-purple-100">Official Institution Holiday:</span> {dateMeta.holiday?.name}
                                    {dateMeta.holiday?.description ? ` — ${dateMeta.holiday.description}` : ''}
                                    <span className="block text-xs text-purple-700/80 dark:text-purple-300/80 mt-0.5">Any attendance recorded today will be counted as special holiday duty.</span>
                                </div>
                            </div>
                        )}
                        {dateMeta?.is_sunday && !dateMeta?.is_holiday && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-amber-900 dark:text-amber-200 text-sm font-medium shadow-xs">
                                <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                                    <CalendarDays className="w-4 h-4 shrink-0" />
                                </div>
                                <div className="flex-1">
                                    <span className="font-semibold text-amber-950 dark:text-amber-100">Weekly Off (Sunday):</span> Today is a scheduled institutional off day.
                                    <span className="block text-xs text-amber-700/80 dark:text-amber-300/80 mt-0.5">You can record attendance for on-duty weekend, emergency, or support staff.</span>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-xs flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Staff</p>
                                    <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{totalCount}</p>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Configured profiles</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                                    <Users className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/50 rounded-xl p-4 shadow-xs flex items-center justify-between relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500" />
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Present</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-2xl font-black tracking-tight text-emerald-700 dark:text-emerald-300">{presentCount}</p>
                                        {totalCount > 0 && (
                                            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                                                {attendanceRate}%
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">On duty today</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                    <UserCheck className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/50 rounded-xl p-4 shadow-xs flex items-center justify-between relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-rose-500" />
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Absent</p>
                                    <p className="text-2xl font-black tracking-tight text-rose-700 dark:text-rose-300">{absentCount}</p>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Unexcused</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                                    <UserX className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/50 rounded-xl p-4 shadow-xs flex items-center justify-between relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500" />
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Half Day</p>
                                    <p className="text-2xl font-black tracking-tight text-amber-700 dark:text-amber-300">{halfDayCount}</p>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">0.5 shift credit</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                    <Clock className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 border border-blue-200/80 dark:border-blue-900/50 rounded-xl p-4 shadow-xs flex items-center justify-between relative overflow-hidden col-span-2 sm:col-span-1">
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500" />
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">On Leave</p>
                                    <p className="text-2xl font-black tracking-tight text-blue-700 dark:text-blue-300">{leaveCount}</p>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Approved leaves</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                    <Plane className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-800/60">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-md"
                                        onClick={handlePrevDay}
                                        title="Previous Day"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            "h-8 px-2.5 text-xs font-semibold rounded-md transition-colors",
                                            isToday(parse(date, 'yyyy-MM-dd', new Date()))
                                                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                                                : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                                        )}
                                        onClick={handleToday}
                                    >
                                        Today
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-md"
                                        onClick={handleNextDay}
                                        title="Next Day"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="w-[180px] sm:w-[200px]">
                                    <DatePicker 
                                        date={date ? parse(date, 'yyyy-MM-dd', new Date()) : undefined} 
                                        setDate={(d) => setDate(d ? format(d, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'))} 
                                    />
                                </div>

                                <Badge variant="outline" className="hidden sm:inline-flex text-xs font-medium py-1 px-2.5 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                                    {format(parse(date, 'yyyy-MM-dd', new Date()), 'EEEE')}
                                </Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs font-medium text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 hover:text-emerald-800"
                                    onClick={handleMarkAllPresent}
                                    disabled={loading || attendance.length === 0}
                                >
                                    <CheckCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                                    Mark All Present
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs font-medium text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/80 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/60 hover:text-rose-800"
                                    onClick={handleMarkAllAbsent}
                                    disabled={loading || attendance.length === 0}
                                >
                                    <UserX className="w-3.5 h-3.5 mr-1.5 text-rose-600 dark:text-rose-400" />
                                    Mark All Absent
                                </Button>

                                <Button 
                                    onClick={handleSave} 
                                    disabled={saving || loading || attendance.length === 0}
                                    size="sm"
                                    className={cn(
                                        "shadow-xs transition-all text-xs font-semibold px-4",
                                        hasUnsavedChanges ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 shadow-md" : ""
                                    )}
                                >
                                    <Save className="w-4 h-4 mr-1.5" />
                                    {saving ? "Saving..." : hasUnsavedChanges ? "Save Changes *" : "Save Attendance"}
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                            <div className="relative w-full sm:w-72">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <Input
                                    placeholder="Search staff name or role..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-8 h-9 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-0.5"
                                        title="Clear search"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                                {[
                                    { key: 'all', label: 'All', count: totalCount },
                                    { key: 'present', label: 'Present', count: presentCount },
                                    { key: 'absent', label: 'Absent', count: absentCount },
                                    { key: 'half_day', label: 'Half Day', count: halfDayCount },
                                    { key: 'on_leave', label: 'Leave', count: leaveCount },
                                ].map(f => (
                                    <button
                                        key={f.key}
                                        type="button"
                                        onClick={() => setFilterStatus(f.key as any)}
                                        className={cn(
                                            "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 border",
                                            filterStatus === f.key
                                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs"
                                                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <span>{f.label}</span>
                                        <span className={cn(
                                            "text-[10px] font-bold px-1.5 py-0.2 rounded-full",
                                            filterStatus === f.key
                                                ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                        )}>
                                            {f.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <TableSkeletonLoader columns={4} rows={5} />
                        ) : (
                            <DataTable
                                columns={[
                                    { label: "STAFF MEMBER", key: "name" },
                                    { label: "ATTENDANCE STATUS", key: "status" },
                                    { label: "LEAVE TYPE", key: "leave_type" },
                                    { label: "REMARKS", key: "remarks" },
                                ]}
                            >
                                {filteredAttendance.length === 0 ? (
                                    <TableEmptyState
                                        colSpan={4}
                                        icon={CalendarDays}
                                        message={searchQuery || filterStatus !== 'all' ? "No staff members match your filter criteria" : "No records found"}
                                    />
                                ) : (
                                    <Each
                                        of={filteredAttendance}
                                        render={(att) => (
                                            <TableRow 
                                                key={att.user_id}
                                                className={cn(
                                                    "transition-colors",
                                                    att.status === 'present' && "hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20",
                                                    att.status === 'absent' && "hover:bg-rose-50/30 dark:hover:bg-rose-950/20",
                                                    att.status === 'half_day' && "hover:bg-amber-50/30 dark:hover:bg-amber-950/20",
                                                    att.status === 'on_leave' && "hover:bg-blue-50/30 dark:hover:bg-blue-950/20"
                                                )}
                                            >
                                                <TableCell className="font-medium min-w-[220px]">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-9 h-9 rounded-full bg-gradient-to-br text-white flex items-center justify-center font-bold text-xs uppercase tracking-wider shrink-0 shadow-xs ring-2 ring-white dark:ring-slate-800",
                                                            getAvatarGradient(att.name)
                                                        )}>
                                                            {getInitials(att.name)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                                                                {att.name}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                {att.employee_id && (
                                                                    <span className="font-mono text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                                                                        {att.employee_id}
                                                                    </span>
                                                                )}
                                                                <Badge variant="outline" className="text-[11px] px-1.5 py-0 font-normal bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 truncate max-w-[120px]">
                                                                    {att.designation || 'Staff'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="min-w-[340px]">
                                                    <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateRowStatus(att.user_id, 'present')}
                                                            className={cn(
                                                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                                                                att.status === 'present'
                                                                    ? "bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-500"
                                                                    : "text-slate-600 dark:text-slate-300 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                                            )}
                                                        >
                                                            <Check className="w-3.5 h-3.5 shrink-0" />
                                                            <span>Present</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => updateRowStatus(att.user_id, 'absent')}
                                                            className={cn(
                                                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                                                                att.status === 'absent'
                                                                    ? "bg-rose-600 text-white shadow-xs ring-1 ring-rose-500"
                                                                    : "text-slate-600 dark:text-slate-300 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                                            )}
                                                        >
                                                            <X className="w-3.5 h-3.5 shrink-0" />
                                                            <span>Absent</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => updateRowStatus(att.user_id, 'half_day')}
                                                            className={cn(
                                                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                                                                att.status === 'half_day'
                                                                    ? "bg-amber-500 text-white shadow-xs ring-1 ring-amber-400"
                                                                    : "text-slate-600 dark:text-slate-300 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                                                            )}
                                                        >
                                                            <Clock className="w-3.5 h-3.5 shrink-0" />
                                                            <span>Half Day</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => updateRowStatus(att.user_id, 'on_leave')}
                                                            className={cn(
                                                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                                                                att.status === 'on_leave'
                                                                    ? "bg-blue-600 text-white shadow-xs ring-1 ring-blue-500"
                                                                    : "text-slate-600 dark:text-slate-300 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                                                            )}
                                                        >
                                                            <Plane className="w-3.5 h-3.5 shrink-0" />
                                                            <span>Leave</span>
                                                        </button>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="min-w-[240px]">
                                                    {att.status === 'on_leave' ? (
                                                        <div className="flex items-center gap-2">
                                                            <select
                                                                className="w-[180px] h-9 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/40 px-3 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                                                value={att.leave_type_id || ''}
                                                                onChange={(e) => updateRowLeaveType(att.user_id, e.target.value ? parseInt(e.target.value) : null)}
                                                            >
                                                                <option value="">Select Leave Type</option>
                                                                {leaveTypes.map(type => (
                                                                    <option key={type.id} value={type.id}>
                                                                        {type.name} ({type.is_paid_leave ? 'Paid' : 'Unpaid'})
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {att.leave_type_id && (
                                                                <Badge 
                                                                    variant="outline" 
                                                                    className={cn(
                                                                        "text-[10px] px-1.5 py-0.5 shrink-0 font-semibold",
                                                                        leaveTypes.find(t => t.id === att.leave_type_id)?.is_paid_leave
                                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                                                                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                                                                    )}
                                                                >
                                                                    {leaveTypes.find(t => t.id === att.leave_type_id)?.is_paid_leave ? "Paid" : "Unpaid"}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 inline-block" />
                                                            <span>Not applicable</span>
                                                        </div>
                                                    )}
                                                </TableCell>

                                                <TableCell className="min-w-[220px]">
                                                    <Input
                                                        placeholder="Add note or remarks..."
                                                        value={att.remarks || ''}
                                                        onChange={(e) => updateRowRemarks(att.user_id, e.target.value)}
                                                        className="h-9 w-full max-w-[260px] text-xs bg-slate-50/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    />
                                )}
                            </DataTable>
                        )}
                    </TabsContent>

                    <TabsContent value="ledger" className="space-y-4">
                        <StaffAttendanceLedger leaveTypes={leaveTypes} onAttendanceChanged={fetchAttendance} />
                    </TabsContent>
                </Tabs>
            </div>
        </PageContainer>
    );
}

function StaffAttendanceLedger({ leaveTypes, onAttendanceChanged }: { leaveTypes: any[]; onAttendanceChanged: () => void }) {
    const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
    const [ledger, setLedger] = useState<{ 
        month: string; 
        days_in_month: number; 
        days_meta?: Record<string, { day: number; is_sunday: boolean; holiday: any | null }>;
        matrix: any[]; 
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [openCellKey, setOpenCellKey] = useState<string | null>(null);

    // Import Modal states
    const [importOpen, setImportOpen] = useState(false);
    const [downloadingTemplate, setDownloadingTemplate] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState<{ message: string; errors?: string[] } | null>(null);

    const fetchLedger = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/v1/hr/staff-attendance/ledger?month=${month}`);
            setLedger(res.data.data);
        } catch (e) {
            toast.error("Failed to load attendance ledger");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLedger();
    }, [month]);

    // Handle single-cell attendance click mark
    const handleCellMark = async (userId: number, dateStr: string, status: string, leaveTypeId: number | null) => {
        setOpenCellKey(null);
        if (!ledger) return;

        const previousLedger = JSON.parse(JSON.stringify(ledger));

        // Optimistically update local matrix
        const updatedMatrix = ledger.matrix.map(row => {
            if (row.user_id !== userId) return row;

            const oldStatus = row.days[dateStr]?.status;
            const updatedSummary = { ...row.summary };

            // Decrement old status count
            if (oldStatus && updatedSummary[oldStatus] !== undefined) {
                updatedSummary[oldStatus] = Math.max(0, updatedSummary[oldStatus] - 1);
            }

            // Increment new status count if not clear
            if (status !== 'clear' && updatedSummary[status] !== undefined) {
                updatedSummary[status] = (updatedSummary[status] || 0) + 1;
            }

            return {
                ...row,
                summary: updatedSummary,
                days: {
                    ...row.days,
                    [dateStr]: status === 'clear' ? null : {
                        status,
                        leave_type_id: leaveTypeId,
                    }
                }
            };
        });

        setLedger({
            ...ledger,
            matrix: updatedMatrix,
        });

        try {
            const res = await axios.post('/api/v1/hr/staff-attendance/mark-cell', {
                user_id: userId,
                date: dateStr,
                status: status === 'clear' ? null : status,
                leave_type_id: leaveTypeId,
            });

            // Update row summary with exact server numbers if returned
            if (res.data?.data?.summary) {
                setLedger(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        matrix: prev.matrix.map(r => {
                            if (r.user_id === userId) {
                                return { ...r, summary: res.data.data.summary };
                            }
                            return r;
                        })
                    };
                });
            }

            const statusLabel = status === 'clear' ? 'cleared' : status.replace('_', ' ');
            toast.success(`Attendance ${statusLabel} for ${dateStr}`);
            onAttendanceChanged();
        } catch (e) {
            toast.error("Failed to update cell attendance");
            setLedger(previousLedger);
        }
    };

    // Excel Export
    const handleExport = async () => {
        setExporting(true);
        try {
            const response = await axios.get(`/api/v1/hr/staff-attendance/export?month=${month}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `staff_attendance_${month}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Attendance ledger exported successfully");
        } catch (e) {
            toast.error("Failed to export attendance ledger");
        } finally {
            setExporting(false);
        }
    };

    // Download Sample Template (Calendar View)
    const handleDownloadTemplate = async () => {
        setDownloadingTemplate(true);
        try {
            const response = await axios.get(`/api/v1/hr/staff-attendance/template?month=${month}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `staff_attendance_template_${month}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Calendar attendance template downloaded");
        } catch (e) {
            toast.error("Failed to download template");
        } finally {
            setDownloadingTemplate(false);
        }
    };

    // Import Submit
    const handleImportSubmit = async () => {
        if (!selectedFile) {
            toast.error("Please select a file to import");
            return;
        }

        setImporting(true);
        setImportResult(null);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('month', month);

        try {
            const res = await axios.post('/api/v1/hr/staff-attendance/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const data = res.data?.data;
            setImportResult({
                message: res.data?.message || `Import completed: ${data?.imported_count || 0} records updated.`,
                errors: data?.errors || [],
            });

            toast.success(res.data?.message || "Attendance imported successfully");
            fetchLedger();
            onAttendanceChanged();
        } catch (e: any) {
            const errMsg = e.response?.data?.message || "Failed to import attendance file";
            toast.error(errMsg);
            setImportResult({
                message: errMsg,
                errors: e.response?.data?.errors ? Object.values(e.response.data.errors).flat() as string[] : undefined,
            });
        } finally {
            setImporting(false);
        }
    };

    const getStatusBadge = (status: string | null) => {
        if (!status) return null;
        
        switch (status) {
            case 'present': return <div className="w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shadow-2xs" title="Present">P</div>;
            case 'absent': return <div className="w-6 h-6 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 flex items-center justify-center text-xs font-bold shadow-2xs" title="Absent">A</div>;
            case 'half_day': return <div className="w-6 h-6 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold shadow-2xs" title="Half Day">H</div>;
            case 'on_leave': return <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold shadow-2xs" title="On Leave">L</div>;
            default: return null;
        }
    };

    const renderCellContent = (status: string | null | undefined, isHoliday: boolean, isSunday: boolean, holidayName?: string) => {
        if (status) {
            return getStatusBadge(status);
        }
        if (isHoliday) {
            return (
                <div 
                    className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center text-[10px] font-bold border border-purple-300 dark:border-purple-800 shadow-2xs" 
                    title={`Holiday: ${holidayName || 'Official Holiday'}`}
                >
                    H
                </div>
            );
        }
        if (isSunday) {
            return (
                <div 
                    className="w-6 h-6 rounded bg-rose-50/70 dark:bg-rose-950/30 text-rose-500 dark:text-rose-400 flex items-center justify-center text-[10px] font-medium" 
                    title="Sunday (Weekly Off)"
                >
                    Off
                </div>
            );
        }
        return <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-medium text-slate-300 hover:text-slate-500">-</div>;
    };

    return (
        <div className="space-y-4">
            {/* Control Bar: MonthPicker, Export/Import, & Legends */}
            <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-xl shadow-xs border gap-3">
                <div className="flex items-center gap-3">
                    <Label className="text-sm font-medium text-slate-500 whitespace-nowrap">Select Month:</Label>
                    <MonthPicker month={month} onChange={setMonth} />

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        disabled={exporting || loading || !ledger}
                        className="h-9 gap-1.5 text-xs"
                        title="Export Monthly Attendance Ledger to Excel"
                    >
                        <Download className={`w-3.5 h-3.5 ${exporting ? 'animate-bounce' : ''}`} />
                        <span>Export Excel</span>
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setImportOpen(true);
                            setImportResult(null);
                            setSelectedFile(null);
                        }}
                        className="h-9 gap-1.5 text-xs"
                        title="Bulk Import Attendance from Excel/CSV"
                    >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Import</span>
                    </Button>
                </div>

                {/* Legends */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200"></div> Present</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div> Absent</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber-100 border border-amber-200"></div> Half Day</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div> Leave</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-purple-100 border border-purple-300"></div> Holiday</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-rose-50 border border-rose-200"></div> Sunday (Off)</div>
                </div>
            </div>

            {loading ? (
                <TableSkeletonLoader columns={35} rows={5} />
            ) : ledger && ledger.matrix.length > 0 ? (
                <div className="rounded-xl border shadow-xs bg-white overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 font-medium tracking-wider sticky left-0 z-10 bg-slate-50 shadow-[1px_0_0_0_#e2e8f0]">
                                        Staff Name
                                    </th>
                                    {Array.from({ length: ledger.days_in_month }).map((_, i) => {
                                        const d = i + 1;
                                        const dateStr = `${month}-${String(d).padStart(2, '0')}`;
                                        const meta = ledger.days_meta?.[dateStr];
                                        const isHoliday = Boolean(meta?.holiday);
                                        const isSunday = Boolean(meta?.is_sunday);

                                        return (
                                            <th 
                                                key={i} 
                                                className={`px-1 py-2 font-semibold tracking-wider text-center min-w-[36px] transition-colors ${
                                                    isHoliday 
                                                        ? 'bg-purple-100/70 text-purple-900 border-b-2 border-b-purple-500' 
                                                        : isSunday 
                                                        ? 'bg-rose-50 text-rose-700 font-bold' 
                                                        : ''
                                                }`}
                                                title={isHoliday ? `Holiday: ${meta?.holiday?.name}` : isSunday ? 'Sunday (Weekly Off)' : undefined}
                                            >
                                                <div className="text-[11px] leading-tight">{d}</div>
                                                {isHoliday ? (
                                                    <span className="text-[8px] font-bold text-purple-700 uppercase block tracking-tighter">Hol</span>
                                                ) : isSunday ? (
                                                    <span className="text-[8px] font-normal text-rose-600 block tracking-tighter">Sun</span>
                                                ) : null}
                                            </th>
                                        );
                                    })}
                                    <th className="px-3 py-3 font-medium tracking-wider text-center border-l bg-emerald-50 text-emerald-700">P</th>
                                    <th className="px-3 py-3 font-medium tracking-wider text-center bg-red-50 text-red-700">A</th>
                                    <th className="px-3 py-3 font-medium tracking-wider text-center bg-amber-50 text-amber-700">H</th>
                                    <th className="px-3 py-3 font-medium tracking-wider text-center bg-blue-50 text-blue-700">L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ledger.matrix.map((row) => (
                                    <tr key={row.user_id} className="border-b last:border-0 hover:bg-slate-50/50">
                                        <td className="px-4 py-2.5 sticky left-0 z-10 bg-white shadow-[1px_0_0_0_#e2e8f0]">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-medium text-slate-900 whitespace-nowrap">{row.name}</span>
                                                {row.employee_id && (
                                                    <span className="font-mono text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                                                        {row.employee_id}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[11px] text-slate-500 truncate max-w-[150px]">{row.designation}</div>
                                        </td>
                                        {Array.from({ length: ledger.days_in_month }).map((_, i) => {
                                            const d = i + 1;
                                            const dateStr = `${month}-${String(d).padStart(2, '0')}`;
                                            const dayData = row.days[dateStr];
                                            const meta = ledger.days_meta?.[dateStr];
                                            const isHoliday = Boolean(meta?.holiday);
                                            const isSunday = Boolean(meta?.is_sunday);
                                            const cellKey = `${row.user_id}-${dateStr}`;

                                            return (
                                                <td 
                                                    key={i} 
                                                    className={`px-0.5 py-1 text-center ${
                                                        isHoliday ? 'bg-purple-50/20' : isSunday ? 'bg-rose-50/20' : ''
                                                    }`}
                                                >
                                                    <Popover
                                                        open={openCellKey === cellKey}
                                                        onOpenChange={(isOpen) => {
                                                            setOpenCellKey(isOpen ? cellKey : null);
                                                        }}
                                                    >
                                                        <PopoverTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className="w-7 h-7 mx-auto rounded-md flex items-center justify-center hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                                                                title={`Click to mark attendance for ${row.name} on ${dateStr}`}
                                                            >
                                                                {renderCellContent(dayData?.status, isHoliday, isSunday, meta?.holiday?.name)}
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-64 p-3 shadow-xl z-50 rounded-xl" align="center" side="top">
                                                            <div className="border-b pb-2 mb-2.5">
                                                                <div className="font-semibold text-xs text-foreground truncate">{row.name}</div>
                                                                <div className="text-[11px] text-muted-foreground flex items-center justify-between mt-0.5">
                                                                    <span>{format(parse(dateStr, 'yyyy-MM-dd', new Date()), 'EEE, dd MMM yyyy')}</span>
                                                                    {isHoliday && (
                                                                        <span className="text-[9px] font-semibold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                                                                            Holiday
                                                                        </span>
                                                                    )}
                                                                    {isSunday && !isHoliday && (
                                                                        <span className="text-[9px] font-semibold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                                                                            Sunday
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {meta?.holiday?.name && (
                                                                    <div className="text-[10px] text-purple-700 font-medium mt-1 truncate bg-purple-50 p-1 rounded">
                                                                        🎉 {meta.holiday.name}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-1.5 mb-2">
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant={dayData?.status === 'present' ? 'default' : 'outline'}
                                                                    className={`h-8 text-xs font-semibold justify-start ${dayData?.status === 'present' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'hover:bg-emerald-50 text-emerald-700 border-emerald-200'}`}
                                                                    onClick={() => handleCellMark(row.user_id, dateStr, 'present', null)}
                                                                >
                                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 shrink-0"></span>
                                                                    Present (P)
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant={dayData?.status === 'absent' ? 'default' : 'outline'}
                                                                    className={`h-8 text-xs font-semibold justify-start ${dayData?.status === 'absent' ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'hover:bg-rose-50 text-rose-700 border-rose-200'}`}
                                                                    onClick={() => handleCellMark(row.user_id, dateStr, 'absent', null)}
                                                                >
                                                                    <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5 shrink-0"></span>
                                                                    Absent (A)
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant={dayData?.status === 'half_day' ? 'default' : 'outline'}
                                                                    className={`h-8 text-xs font-semibold justify-start ${dayData?.status === 'half_day' ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'hover:bg-amber-50 text-amber-700 border-amber-200'}`}
                                                                    onClick={() => handleCellMark(row.user_id, dateStr, 'half_day', null)}
                                                                >
                                                                    <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5 shrink-0"></span>
                                                                    Half Day (H)
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant={dayData?.status === 'on_leave' ? 'default' : 'outline'}
                                                                    className={`h-8 text-xs font-semibold justify-start ${dayData?.status === 'on_leave' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-blue-50 text-blue-700 border-blue-200'}`}
                                                                    onClick={() => handleCellMark(row.user_id, dateStr, 'on_leave', leaveTypes[0]?.id || null)}
                                                                >
                                                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5 shrink-0"></span>
                                                                    Leave (L)
                                                                </Button>
                                                            </div>

                                                            {dayData?.status === 'on_leave' && leaveTypes.length > 0 && (
                                                                <div className="mb-2">
                                                                    <Label className="text-[10px] text-muted-foreground mb-1 block">Select Leave Type:</Label>
                                                                    <select
                                                                        className="w-full h-7 rounded border border-input bg-background px-2 text-xs"
                                                                        value={dayData.leave_type_id || ''}
                                                                        onChange={(e) => {
                                                                            const ltId = e.target.value ? parseInt(e.target.value) : null;
                                                                            handleCellMark(row.user_id, dateStr, 'on_leave', ltId);
                                                                        }}
                                                                    >
                                                                        {leaveTypes.map(lt => (
                                                                            <option key={lt.id} value={lt.id}>{lt.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            )}

                                                            {dayData?.status && (
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="w-full h-7 text-xs text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
                                                                    onClick={() => handleCellMark(row.user_id, dateStr, 'clear', null)}
                                                                >
                                                                    Clear Attendance (-)
                                                                </Button>
                                                            )}
                                                        </PopoverContent>
                                                    </Popover>
                                                </td>
                                            );
                                        })}
                                        <td className="px-3 py-2 text-center border-l font-bold text-emerald-600 bg-emerald-50/30">{row.summary.present}</td>
                                        <td className="px-3 py-2 text-center font-bold text-red-600 bg-red-50/30">{row.summary.absent}</td>
                                        <td className="px-3 py-2 text-center font-bold text-amber-600 bg-amber-50/30">{row.summary.half_day}</td>
                                        <td className="px-3 py-2 text-center font-bold text-blue-600 bg-blue-50/30">{row.summary.on_leave}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="p-12 text-center bg-white border rounded-xl shadow-xs">
                    <CalendarDays className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-1">No data available</h3>
                    <p className="text-slate-500">There are no staff profiles or attendance records for this month.</p>
                </div>
            )}

            {/* Bulk Import Dialog */}
            <Dialog open={importOpen} onOpenChange={setImportOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5 text-primary" />
                            Import Staff Attendance
                        </DialogTitle>
                        <DialogDescription>
                            Upload a monthly calendar Excel (.xlsx) file to bulk mark or update staff attendance records for {format(parse(month, 'yyyy-MM', new Date()), 'MMMM yyyy')}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {/* Step 1: Download Template */}
                        <div className="p-3 bg-muted/40 rounded-xl border flex items-center justify-between gap-3">
                            <div>
                                <div className="text-xs font-semibold text-foreground">Need the monthly template?</div>
                                <div className="text-[11px] text-muted-foreground">Download calendar grid template for {format(parse(month, 'yyyy-MM', new Date()), 'MMMM yyyy')} with all active staff.</div>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleDownloadTemplate}
                                disabled={downloadingTemplate}
                                className="shrink-0 h-8 gap-1.5 text-xs font-medium"
                            >
                                <Download className="w-3.5 h-3.5" />
                                Download Template
                            </Button>
                        </div>

                        {/* Step 2: File Selector */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium">Select Excel / CSV File</Label>
                            <Input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    setSelectedFile(file);
                                    setImportResult(null);
                                }}
                                className="cursor-pointer text-xs file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                            />
                            <p className="text-[11px] text-muted-foreground">Supported formats: .xlsx, .xls, .csv (Max 10MB)</p>
                        </div>

                        {/* Import Result Notification */}
                        {importResult && (
                            <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${importResult.errors?.length ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 text-amber-900' : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-900'}`}>
                                <div className="font-semibold flex items-center gap-1.5">
                                    {importResult.errors?.length ? <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                                    {importResult.message}
                                </div>
                                {importResult.errors && importResult.errors.length > 0 && (
                                    <div className="mt-2 space-y-1 pl-4 list-disc max-h-32 overflow-y-auto">
                                        {importResult.errors.map((err: string, i: number) => (
                                            <div key={i} className="text-[11px] text-rose-600 dark:text-rose-400 font-normal">{err}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setImportOpen(false);
                                setSelectedFile(null);
                                setImportResult(null);
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleImportSubmit}
                            disabled={!selectedFile || importing}
                            className="gap-1.5"
                        >
                            {importing && <RefreshCcw className="w-3.5 h-3.5 animate-spin" />}
                            {importing ? 'Processing...' : 'Upload & Import'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ----------------------------------------------------------------------
// MonthPicker Component
// ----------------------------------------------------------------------
function MonthPicker({ month, onChange }: { month: string, onChange: (val: string) => void }) {
    const date = parse(month, 'yyyy-MM', new Date());
    const [currentYear, setCurrentYear] = useState(date.getFullYear());
    
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[190px] sm:w-[210px] justify-start text-left font-normal bg-white h-9 shadow-2xs overflow-hidden">
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-slate-500" />
                    <span className="truncate flex-1 min-w-0">{format(date, 'MMMM yyyy')}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-3" align="start">
                <div className="flex items-center justify-between mb-4">
                    <Button variant="outline" size="icon" onClick={() => setCurrentYear(y => y - 1)} className="h-7 w-7"><ChevronLeft className="h-4 w-4"/></Button>
                    <div className="font-semibold text-sm">{currentYear}</div>
                    <Button variant="outline" size="icon" onClick={() => setCurrentYear(y => y + 1)} className="h-7 w-7"><ChevronRight className="h-4 w-4"/></Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {months.map((m, i) => {
                        const isSelected = currentYear === date.getFullYear() && i === date.getMonth();
                        return (
                            <Button 
                                key={m} 
                                variant={isSelected ? "default" : "outline"}
                                className={`h-8 ${isSelected ? "bg-primary text-primary-foreground" : "text-slate-700"}`}
                                onClick={() => {
                                    const newDateStr = `${currentYear}-${String(i+1).padStart(2, '0')}`;
                                    onChange(newDateStr);
                                }}
                            >
                                {m}
                            </Button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}
