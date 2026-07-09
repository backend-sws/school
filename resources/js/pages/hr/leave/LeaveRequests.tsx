import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Check, X, ClipboardList, Plus } from 'lucide-react';
import { PageContainer } from '@/components/shared/page/PageContainer';
import { MainPageHeader } from '@/components/shared/page/MainPageHeader';
import { Card, CardContent } from '@/components/ui/card';
import DataTable, { TableEmptyState, TableSkeletonLoader } from '@/components/dataTable';
import Each from '@/components/Each';
import { SearchableSelectField } from '@/components/searchableSelectInput';
import {
    TableCell,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function LeaveRequests() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Add leave modal
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
    const [addForm, setAddForm] = useState({
        user_id: '',
        leave_type_id: '',
        start_date: format(new Date(), 'yyyy-MM-dd'),
        end_date: format(new Date(), 'yyyy-MM-dd'),
        reason: ''
    });

    const fetchRequests = async () => {
        try {
            const res = await axios.get('/api/v1/hr/leave-requests');
            setRequests(res.data.data || []);
        } catch (e) {
            toast.error("Failed to fetch leave requests");
        } finally {
            setLoading(false);
        }
    };

    const fetchDependencies = async () => {
        try {
            const [typesRes, usersRes] = await Promise.all([
                axios.get('/api/v1/hr/leave-types'),
                axios.get('/api/v1/staff?per_page=500') 
            ]);
            setLeaveTypes(typesRes.data.data || []);
            setUsers(usersRes.data.data || []);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchRequests();
        fetchDependencies();
    }, []);

    const updateStatus = async (id: number, status: 'approved' | 'rejected') => {
        try {
            await axios.patch(`/api/v1/hr/leave-requests/${id}/status`, { status });
            toast.success(`Leave request ${status}`);
            fetchRequests();
        } catch (e) {
            toast.error("Failed to update status");
        }
    };

    const handleAddLeave = async () => {
        try {
            await axios.post('/api/v1/hr/leave-requests', addForm);
            toast.success("Leave added successfully");
            setAddDialogOpen(false);
            fetchRequests();
        } catch (e: any) {
            toast.error(e.response?.data?.message || "Failed to add leave");
        }
    };

    return (
        <PageContainer maxWidth="full">
            <Head title="Leave Requests" />
            
            <div className="space-y-6">
                <MainPageHeader 
                    title="Leave Requests" 
                    subtitle="Approve or reject staff leave applications."
                    icon={ClipboardList}
                    breadcrumbs={[{ title: 'HR & Payroll', href: '/hr/payroll' }, { title: 'Leave Requests', href: '/hr/leave/requests' }]}
                />

                <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button onClick={() => setAddDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Leave Record</Button>
                </div>

                <DataTable
                    columns={[
                        { key: "staff_name", label: "Staff Name" },
                        { key: "leave_type", label: "Leave Type" },
                        { key: "duration", label: "Duration" },
                        { key: "reason", label: "Reason" },
                        { key: "status", label: "Status" },
                        { key: "actions", label: "Actions", align: "right" }
                    ]}
                    isPaginated={false}
                    currentPage={1}
                    lastPage={1}
                    totalRecords={requests.length}
                    pageSize={100}
                    handlePageChange={() => {}}
                    handlePageSizeChange={() => {}}
                >
                    <Each
                        of={requests}
                        isLoading={loading}
                        nodatafound={
                            <TableEmptyState
                                colSpan={6}
                                icon={ClipboardList}
                                message="No leave requests found."
                                description="There are no pending leave requests."
                            />
                        }
                        fallback={<TableSkeletonLoader columns={6} />}
                        render={(req: any, idx: number) => (
                            <TableRow key={req.id}>
                                <TableCell className="font-medium">
                                    {req.user?.name}
                                    <div className="text-xs text-muted-foreground">{req.user?.staff_profile?.designation}</div>
                                </TableCell>
                                <TableCell>
                                    {req.leave_type?.name}
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {req.leave_type?.is_paid_leave ? <span className="text-green-600 font-medium">Paid</span> : <span className="text-red-600 font-medium">Unpaid (LWP)</span>}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="whitespace-nowrap">{format(new Date(req.start_date), 'dd MMM yyyy')}</div>
                                    <div className="text-xs text-muted-foreground whitespace-nowrap">to {format(new Date(req.end_date), 'dd MMM yyyy')}</div>
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate" title={req.reason}>
                                    {req.reason || 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold
                                        ${req.status === 'approved' ? 'bg-green-100 text-green-700 border border-green-200' : 
                                            req.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' : 
                                            'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    {req.status === 'pending' && (
                                        <div className="flex justify-end gap-1">
                                            <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50 px-2 h-8" onClick={() => updateStatus(req.id, 'approved')}>
                                                <Check className="h-4 w-4 mr-1" /> Approve
                                            </Button>
                                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 h-8" onClick={() => updateStatus(req.id, 'rejected')}>
                                                <X className="h-4 w-4 mr-1" /> Reject
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    />
                </DataTable>
            
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Leave Record</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Staff ID (User ID)</Label>
                            <SearchableSelectField
                                placeholder="Select Staff Member"
                                options={users.map((u: any) => ({
                                    key: String(u.id),
                                    value: String(u.id),
                                    text: `${u.name} (ID: ${u.id})`
                                }))}
                                value={addForm.user_id ? String(addForm.user_id) : ""}
                                onChange={(val) => setAddForm({...addForm, user_id: val})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Leave Type</Label>
                            <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                value={addForm.leave_type_id}
                                onChange={e => setAddForm({...addForm, leave_type_id: e.target.value})}
                            >
                                <option value="">Select Type</option>
                                {leaveTypes.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Start Date</Label>
                                <Input 
                                    type="date" 
                                    value={addForm.start_date} 
                                    onChange={e => setAddForm({...addForm, start_date: e.target.value})} 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>End Date</Label>
                                <Input 
                                    type="date" 
                                    value={addForm.end_date} 
                                    onChange={e => setAddForm({...addForm, end_date: e.target.value})} 
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Reason</Label>
                            <Textarea 
                                value={addForm.reason} 
                                onChange={e => setAddForm({...addForm, reason: e.target.value})} 
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddLeave}>Submit Leave</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </div>
        </PageContainer>
    );
}
