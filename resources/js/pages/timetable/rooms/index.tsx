import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useRegisterGuide } from '@/components/GuideProvider';
import { TIMETABLE_ROOMS_GUIDE } from '@/constants/guides/timetable';
import {
    MapPin,
    Plus,
    Search,
    Building,
    Edit2,
    Trash2,
    Users,
    Columns,
    Box
} from 'lucide-react';
import Each from '@/components/Each';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

export default function RoomManagement() {
useRegisterGuide(TIMETABLE_ROOMS_GUIDE);

    const [rooms, setRooms] = useState([
        { id: 1, name: 'Room 101', code: 'R101', building: 'Block A', floor: '1st', capacity: 40, type: 'Classroom' },
        { id: 2, name: 'Physics lab', code: 'PLAB', building: 'Block B', floor: 'Ground', capacity: 30, type: 'Laboratory' },
        { id: 3, name: 'Auditorium', code: 'AUD', building: 'Main Hall', floor: '1st', capacity: 200, type: 'Other' },
    ]);

    return (
        <>
            <Head title="Room Management" />

            <PageContainer maxWidth="7xl" className="space-y-6">
                <MainPageHeader
                    id="rooms-header"
                    icon={MapPin}
                    breadcrumbs={[
                        { title: 'Academic Setup', href: '/timetable' },
                        { title: 'Timetable', href: '/timetable' },
                        { title: 'Rooms', href: '/timetable/rooms' }
                    ]}
                />
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search rooms by name, code or building..." className="pl-10" />
                    </div>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Room
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Each
                        of={[
                            { title: 'Total Capacity', value: '1,240', icon: <Users className="size-5 text-primary" />, theme: 'bg-primary/5' },
                            { title: 'Standard Classrooms', value: '25', icon: <Box className="size-5 text-blue-500" />, theme: 'bg-blue-500/5' },
                            { title: 'Specialized Labs', value: '8', icon: <Columns className="size-5 text-indigo-500" />, theme: 'bg-indigo-500/5' },
                        ]}
                        render={(stat, index) => (
                            <Card variant="metrics" delay={index * 0.05}>
                                <CardHeader className="pb-2">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">{stat.title}</p>
                                    <CardTitle className="text-3xl font-black tracking-tight flex items-center mt-1">
                                        <div className="transition-transform group-hover:scale-110 group-hover:rotate-3 mr-3">
                                            {stat.icon}
                                        </div>
                                        {stat.value}
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        )}
                    />
                </div>

                <Card animated delay={0.15}>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Room Name</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Building / Floor</TableHead>
                                    <TableHead>Capacity</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <Each
                                    of={rooms}
                                    render={(room) => (
                                        <TableRow key={room.id} className="group transition-colors hover:bg-muted/50">
                                            <TableCell className="font-bold text-foreground">{room.name}</TableCell>
                                            <TableCell><Badge variant="secondary" className="font-mono bg-background/80 text-[10px] uppercase tracking-wider">{room.code}</Badge></TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-muted-foreground">{room.building}</span>
                                                    <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                                    <span className="text-sm font-medium">{room.floor} Floor</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-bold">{room.capacity}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn("font-bold uppercase tracking-tighter text-[10px]", room.type === 'Laboratory' ? 'text-blue-500 border-blue-500/20 bg-blue-500/5' : '')}>
                                                    {room.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary">
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-destructive opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
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
