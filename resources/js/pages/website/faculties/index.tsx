import DataTable, {
    TableEmptyState,
    TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Head } from "@inertiajs/react";
import {
    Users,
    Pencil,
    Plus,
    Trash2,
    Mail,
    Phone,
    EyeOff,
} from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { getSerialNumber } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FacultyDialog } from "@/components/admin/facultyDialog";
import FacultyApi from "@/lib/api/facultyApi";
import {
    FACULTY_BREADCRUMBS,
    FACULTY_COLUMNS,
} from "@/constants/page/admin/website";
import { Badge } from "@/components/ui/badge";

export default function Faculties() {
    const queryClient = useQueryClient();
    const facultyDisclosure = useDisclosure();
    const { filter, handleFilter } = useSearchFilter({
        page: 1,
        per_page: 10,
    });

    const { data, isLoading } = useQuery({
        queryKey: ["faculties", filter],
        queryFn: () => FacultyApi.getFaculties(filter),
    });

    const deleteDisclosure = useDisclosure();
    const deleteMutation = useMutation({
        mutationFn: (id: number | string) => FacultyApi.deleteFaculty(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["faculties"] });
            deleteDisclosure.onClose();
        },
    });

    const handleDelete = (row: any) => deleteDisclosure.onOpen(row);
    const confirmDelete = () => deleteMutation.mutate(deleteDisclosure.data?.id);
    const handleEdit = (row: any) => facultyDisclosure.onOpen(row);

    return (
        <>
            <Head title="Manage Faculties" />
            <FacultyDialog
                open={facultyDisclosure.isOpen}
                onClose={facultyDisclosure.onClose}
                data={facultyDisclosure.data}
            />

            <ConfirmDialog
                open={deleteDisclosure.isOpen}
                onOpenChange={deleteDisclosure.onClose}
                title="Delete Faculty Entry"
                description={`Are you sure you want to delete "${deleteDisclosure.data?.name}"? This action cannot be undone.`}
                onConfirm={confirmDelete}
                isLoading={deleteMutation.isPending}
                confirmText="Delete"
                variant="danger"
                confirmationKeyword="DELETE"
            />

            <TooltipProvider>
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <MainPageHeader
                            breadcrumbs={FACULTY_BREADCRUMBS}
                            icon={Users}
                            title="Faculties"
                            description="Manage faculty profiles, contact details, and departmental assignments"
                        />
                        <Button
                            onClick={() => facultyDisclosure.onOpen()}
                            className="w-full sm:w-auto"
                        >
                            <Plus className="size-4" />
                            <span>Add New Faculty</span>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <DataTable
                                columns={FACULTY_COLUMNS}
                                currentPage={data?.meta?.current_page || 1}
                                lastPage={data?.meta?.last_page || 1}
                                pageSize={filter.per_page}
                                totalRecords={data?.meta?.total}
                                handlePageChange={(page) => handleFilter({ page })}
                            >
                                <Each
                                    isLoading={isLoading}
                                    of={data?.data}
                                    nodatafound={
                                        <TableEmptyState
                                            colSpan={FACULTY_COLUMNS.length}
                                            message="No faculties found"
                                            description="Click the button above to add faculty members to the directory."
                                        />
                                    }
                                    fallback={
                                        <TableSkeletonLoader columns={FACULTY_COLUMNS.length} />
                                    }
                                    render={(val, index) => (
                                        <TableRow key={val?.id} className="hover:bg-muted/50">
                                            <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                                                {getSerialNumber(
                                                    data?.meta?.current_page || 1,
                                                    filter.per_page || 10,
                                                    index,
                                                )}
                                            </TableCell>

                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span>{val?.name}</span>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        {val?.email && (
                                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                                <Mail className="size-2.5" />
                                                                <span>{val.email}</span>
                                                                {val.hide_email === 1 && <EyeOff className="size-2.5 text-destructive/60" />}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="outline">
                                                    {val?.department?.name || "N/A"}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-muted-foreground italic">
                                                {val?.designation}
                                            </TableCell>

                                            <TableCell>
                                                {val?.phone ? (
                                                    <div className="flex items-center gap-1.5 text-sm">
                                                        <Phone className="size-3 text-muted-foreground" />
                                                        <span>{val.phone}</span>
                                                        {val.hide_phone === 1 && <EyeOff className="size-2.5 text-destructive/60" />}
                                                    </div>
                                                ) : "-"}
                                            </TableCell>

                                            <TableCell className="w-24">
                                                <div className="flex items-center gap-1">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="icon-sm"
                                                                variant="ghost"
                                                                onClick={() => handleEdit(val)}
                                                                className="text-muted-foreground hover:text-foreground"
                                                            >
                                                                <Pencil className="size-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Edit Profile</TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="icon-sm"
                                                                variant="ghost"
                                                                onClick={() => handleDelete(val)}
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Delete</TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                />
                            </DataTable>
                        </CardContent>
                    </Card>
                </div>
            </TooltipProvider>
        </>
    );
}
