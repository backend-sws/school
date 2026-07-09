import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useRegisterGuide } from '@/components/GuideProvider';
import { TIMETABLE_SUBSTITUTIONS_GUIDE } from '@/constants/guides/timetable';
import {
    UserCheck,
    Calendar,
    Search,
    Clock,
    UserMinus,
    History,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Each from '@/components/Each';
import { MainPageHeader } from '@/components/shared/page/MainPageHeader';
import { PageContainer } from '@/components/shared/page/PageContainer';
import { cn } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SubstitutionManagement() {
useRegisterGuide(TIMETABLE_SUBSTITUTIONS_GUIDE);

    const [substitutions, setSubstitutions] = useState([
        {
            id: 1,
            original_teacher: 'Dr. Sarah Wilson',
            substitute_teacher: 'Prof. James Bond',
            date: '2026-03-05',
            period: 'Period 3',
            status: 'Pending',
            reason: 'Medical Leave'
        },
        {
            id: 2,
            original_teacher: 'Mr. Robert Fox',
            substitute_teacher: 'Ms. Emily Blunt',
            date: '2026-03-04',
            period: 'Period 1',
            status: 'Approved',
            reason: 'External duty'
        },
    ]);

    return (
        <>
            <Head title="Teacher Substitutions" />

            <PageContainer maxWidth="7xl" className="space-y-6">
                <MainPageHeader
                    id="substitutions-header"
                    icon={UserCheck}
                    breadcrumbs={[
                        { title: 'Academic Setup', href: '/timetable' },
                        { title: 'Timetable', href: '/timetable' },
                        { title: 'Substitutions', href: '/timetable/substitutions' }
                    ]}
                />
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <Button variant="outline" className="h-9">
                            <Calendar className="h-4 w-4 mr-2" />
                            Today
                        </Button>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search teachers..." className="pl-10 h-9" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Each
                        of={[
                            { title: 'Missing Teachers Today', value: '4', subText: 'Requiring immediate coverage', border: 'border-l-orange-500' },
                            { title: 'Coverage Secured', value: '12 / 16', subText: '75% of slots covered', border: 'border-l-green-500' },
                            { title: 'Pending Approvals', value: '3', subText: 'Awaiting HOD approval', border: 'border-l-primary' },
                        ]}
                        render={(stat, index) => (
                            <Card variant="elevated" delay={index * 0.05} className={cn("border-l-4", stat.border)}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground mt-1">{stat.subText}</p>
                                </CardContent>
                            </Card>
                        )}
                    />
                </div>

                <Card animated delay={0.15}>
                    <CardHeader>
                        <CardTitle>Substitution Log</CardTitle>
                        <CardDescription>History of teacher replacements and coverage assignments.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Teacher on Leave</TableHead>
                                    <TableHead>Replacement</TableHead>
                                    <TableHead>Time / Slot</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <Each
                                    of={substitutions}
                                    keyExtractor={(sub) => String(sub.id)}
                                    render={(sub) => (
                                    <TableRow key={sub.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>{sub.original_teacher[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="text-sm">
                                                    <div className="font-semibold">{sub.original_teacher}</div>
                                                    <div className="text-muted-foreground text-xs">{sub.reason}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 border border-primary/20">
                                                    <AvatarFallback className="bg-primary/5 text-primary">{sub.substitute_teacher[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="text-sm font-medium">{sub.substitute_teacher}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div>{sub.date}</div>
                                                <div className="text-muted-foreground text-xs flex items-center">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {sub.period}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={sub.status === 'Approved' ? 'default' : 'secondary'} className={sub.status === 'Pending' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' : ''}>
                                                {sub.status === 'Approved' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                                                {sub.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">Details</Button>
                                        </TableCell>
                                    </TableRow>
                                )}
                                />
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </PageContainer>
        </>
    );
}
