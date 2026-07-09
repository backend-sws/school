import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'sonner';
import { format, parse } from 'date-fns';
import { CalendarDays, Save, CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageContainer } from '@/components/shared/page/PageContainer';
import { MainPageHeader } from '@/components/shared/page/MainPageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import DataTable, { TableEmptyState, TableSkeletonLoader } from '@/components/dataTable';
import Each from '@/components/Each';
import {
    TableCell,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DatePicker } from '@/components/ui/date-picker';

export default function StaffAttendance() {
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [attendance, setAttendance] = useState<any[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/v1/hr/staff-attendance?date=${date}`);
            setAttendance(res.data.data || []);
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

    const handleStatusChange = (index: number, status: string) => {
        const newAtt = [...attendance];
        newAtt[index].status = status;
        // Reset leave type if not on leave
        if (status !== 'on_leave') {
            newAtt[index].leave_type_id = null;
        }
        setAttendance(newAtt);
    };

    const handleLeaveTypeChange = (index: number, leaveTypeId: string) => {
        const newAtt = [...attendance];
        newAtt[index].leave_type_id = leaveTypeId;
        setAttendance(newAtt);
    };

    const handleRemarksChange = (index: number, remarks: string) => {
        const newAtt = [...attendance];
        newAtt[index].remarks = remarks;
        setAttendance(newAtt);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post('/api/v1/hr/staff-attendance', {
                date,
                attendances: attendance
            });
            toast.success("Attendance saved successfully");
        } catch (e) {
            toast.error("Failed to save attendance");
        } finally {
            setSaving(false);
        }
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

                    <TabsContent value="daily" className="space-y-4">
                        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
                            <div className="flex items-center gap-4">
                                <Label className="text-sm font-medium text-slate-500 whitespace-nowrap">Date:</Label>
                                <div className="w-[180px]">
                                    <DatePicker 
                                        date={date ? parse(date, 'yyyy-MM-dd', new Date()) : undefined} 
                                        setDate={(d) => setDate(d ? format(d, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'))} 
                                    />
                                </div>
                            </div>
                            <Button 
                                onClick={handleSave} 
                                disabled={saving || loading || attendance.length === 0}
                                size="sm"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                        </div>

                        {loading ? (
                            <TableSkeletonLoader columns={4} rows={5} />
                        ) : (
                            <DataTable
                                columns={[
                                    { label: "STAFF NAME", key: "name" },
                                    { label: "STATUS", key: "status" },
                                    { label: "LEAVE TYPE (IF APPLICABLE)", key: "leave_type" },
                                    { label: "REMARKS", key: "remarks" },
                                ]}
                            >
                                {attendance.length === 0 ? (
                                    <TableEmptyState
                                        colSpan={4}
                                        icon={CalendarDays}
                                        message="No records found"
                                    />
                                ) : (
                                    <Each
                                        of={attendance}
                                        render={(att, index) => (
                                            <TableRow key={att.user_id}>
                                                <TableCell className="font-medium">
                                                    <div>{att.name}</div>
                                                    <div className="text-xs text-slate-500 font-normal">{att.designation}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <select
                                                        className="w-[160px] h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                                                        value={att.status}
                                                        onChange={(e) => {
                                                            const newAtt = [...attendance];
                                                            newAtt[index].status = e.target.value;
                                                            // if not on_leave, clear leave_type_id
                                                            if (e.target.value !== 'on_leave') {
                                                                newAtt[index].leave_type_id = null;
                                                            }
                                                            setAttendance(newAtt);
                                                        }}
                                                    >
                                                        <option value="present">Present</option>
                                                        <option value="absent">Absent</option>
                                                        <option value="half_day">Half Day</option>
                                                        <option value="on_leave">On Leave</option>
                                                    </select>
                                                </TableCell>
                                                <TableCell>
                                                    {att.status === 'on_leave' ? (
                                                        <select
                                                            className="w-[220px] h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                                                            value={att.leave_type_id || ''}
                                                            onChange={(e) => {
                                                                const newAtt = [...attendance];
                                                                newAtt[index].leave_type_id = e.target.value ? parseInt(e.target.value) : null;
                                                                setAttendance(newAtt);
                                                            }}
                                                        >
                                                            <option value="">Select Leave Type</option>
                                                            {leaveTypes.map(type => (
                                                                <option key={type.id} value={type.id}>
                                                                    {type.name} ({type.is_paid_leave ? 'Paid' : 'Unpaid'})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <span className="text-sm text-slate-400 italic">Not applicable</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        placeholder="Optional remarks"
                                                        value={att.remarks || ''}
                                                        onChange={(e) => {
                                                            const newAtt = [...attendance];
                                                            newAtt[index].remarks = e.target.value;
                                                            setAttendance(newAtt);
                                                        }}
                                                        className="h-9 w-[250px]"
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
                        <StaffAttendanceLedger />
                    </TabsContent>
                </Tabs>
            </div>
        </PageContainer>
    );
}

// ----------------------------------------------------------------------
// StaffAttendanceLedger Component
// ----------------------------------------------------------------------
function StaffAttendanceLedger() {
    const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
    const [ledger, setLedger] = useState<{ month: string, days_in_month: number, matrix: any[] } | null>(null);
    const [loading, setLoading] = useState(false);

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

    const getStatusBadge = (status: string | null) => {
        if (!status) return <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-medium text-slate-300">-</div>;
        
        switch (status) {
            case 'present': return <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold" title="Present">P</div>;
            case 'absent': return <div className="w-6 h-6 rounded bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold" title="Absent">A</div>;
            case 'half_day': return <div className="w-6 h-6 rounded bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold" title="Half Day">H</div>;
            case 'on_leave': return <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold" title="On Leave">L</div>;
            default: return <div className="w-6 h-6 rounded flex items-center justify-center text-xs text-slate-300">-</div>;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center gap-4">
                    <Label className="text-sm font-medium text-slate-500 whitespace-nowrap">Select Month:</Label>
                    <MonthPicker month={month} onChange={setMonth} />
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200"></div> Present</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div> Absent</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber-100 border border-amber-200"></div> Half Day</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div> Leave</div>
                </div>
            </div>

            {loading ? (
                <TableSkeletonLoader columns={35} rows={5} />
            ) : ledger && ledger.matrix.length > 0 ? (
                <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 font-medium tracking-wider sticky left-0 z-10 bg-slate-50 shadow-[1px_0_0_0_#e2e8f0]">Staff Name</th>
                                    {Array.from({ length: ledger.days_in_month }).map((_, i) => (
                                        <th key={i} className="px-1 py-3 font-medium tracking-wider text-center min-w-[36px]">{i + 1}</th>
                                    ))}
                                    <th className="px-3 py-3 font-medium tracking-wider text-center border-l bg-emerald-50 text-emerald-700">P</th>
                                    <th className="px-3 py-3 font-medium tracking-wider text-center bg-red-50 text-red-700">A</th>
                                    <th className="px-3 py-3 font-medium tracking-wider text-center bg-amber-50 text-amber-700">H</th>
                                    <th className="px-3 py-3 font-medium tracking-wider text-center bg-blue-50 text-blue-700">L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ledger.matrix.map((row, idx) => (
                                    <tr key={row.user_id} className="border-b last:border-0 hover:bg-slate-50/50">
                                        <td className="px-4 py-3 sticky left-0 z-10 bg-white shadow-[1px_0_0_0_#e2e8f0] group-hover:bg-slate-50">
                                            <div className="font-medium text-slate-900 whitespace-nowrap">{row.name}</div>
                                            <div className="text-[11px] text-slate-500 truncate max-w-[120px]">{row.designation}</div>
                                        </td>
                                        {Array.from({ length: ledger.days_in_month }).map((_, i) => {
                                            const dayStr = `${month}-${String(i + 1).padStart(2, '0')}`;
                                            const dayData = row.days[dayStr];
                                            return (
                                                <td key={i} className="px-1 py-2 text-center">
                                                    <div className="flex justify-center">
                                                        {getStatusBadge(dayData?.status)}
                                                    </div>
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
                <div className="p-12 text-center bg-white border rounded-lg shadow-sm">
                    <CalendarDays className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-1">No data available</h3>
                    <p className="text-slate-500">There are no staff profiles or attendance records for this month.</p>
                </div>
            )}
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
                <Button variant="outline" className="w-[180px] justify-start text-left font-normal bg-white h-9 shadow-sm">
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                    {format(date, 'MMMM yyyy')}
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
