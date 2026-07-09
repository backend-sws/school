import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useRegisterGuide } from '@/components/GuideProvider';
import { TIMETABLE_TEMPLATES_GUIDE } from '@/constants/guides/timetable';
import {
    Clock,
    Plus,
    Trash2,
    Edit2,
    Calendar,
    GripVertical,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Each from '@/components/Each';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MainPageHeader } from '@/components/shared/page/MainPageHeader';
import { PageContainer } from '@/components/shared/page/PageContainer';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function TimetableTemplates() {
useRegisterGuide(TIMETABLE_TEMPLATES_GUIDE);

    const [templates, setTemplates] = useState([
        { id: 1, name: 'Standard Academic Schedule', type: 'Academic', is_active: true, is_default: true, periods: 8 },
        { id: 2, name: 'Examination Timing', type: 'Exam', is_active: true, is_default: false, periods: 2 },
    ]);

    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

    return (
        <>
            <Head title="Timetable Templates" />

            <PageContainer maxWidth="7xl" className="space-y-6">
                <MainPageHeader
                    id="templates-header"
                    icon={Clock}
                    breadcrumbs={[
                        { title: 'Academic Setup', href: '/timetable' },
                        { title: 'Timetable', href: '/timetable' },
                        { title: 'Templates', href: '/timetable/templates' }
                    ]}
                />
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tight">Active Templates</h2>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Template
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Each
                        of={templates}
                        render={(template, index) => (
                            <Card
                                key={template.id}
                                variant="action"
                                delay={index * 0.05}
                                className={cn(
                                    "cursor-pointer",
                                    template.is_default && "ring-2 ring-primary/20 bg-primary/5"
                                )}
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <CardTitle>{template.name}</CardTitle>
                                            <CardDescription>{template.type} • {template.periods} Slots</CardDescription>
                                        </div>
                                        {template.is_default && (
                                            <Badge variant="default" className="bg-primary text-white">Default</Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <Edit2 className="h-3 w-3 mr-2" />
                                        Edit Structure
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    />
                </div>

                <Card variant="elevated" delay={0.2} className="mt-8">
                    <CardHeader>
                        <CardTitle>Template Periods: Standard Academic Schedule</CardTitle>
                        <CardDescription>Drag and drop to reorder slots. These slots define the grid in the timetable builder.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Period Name</TableHead>
                                    <TableHead>Start Time</TableHead>
                                    <TableHead>End Time</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell><GripVertical className="h-4 w-4 text-muted-foreground" /></TableCell>
                                    <TableCell className="font-medium">Period 1</TableCell>
                                    <TableCell>08:00 AM</TableCell>
                                    <TableCell>08:45 AM</TableCell>
                                    <TableCell><Badge variant="secondary">Class</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><GripVertical className="h-4 w-4 text-muted-foreground" /></TableCell>
                                    <TableCell className="font-medium">Morning Break</TableCell>
                                    <TableCell>10:15 AM</TableCell>
                                    <TableCell>10:30 AM</TableCell>
                                    <TableCell><Badge variant="outline" className="text-orange-500 border-orange-500/20">Break</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <div className="mt-4 flex justify-center">
                            <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Slot
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </PageContainer>
        </>
    );
}
