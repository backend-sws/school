import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import FullPageLayout from "@/layouts/full-page-layout";
import { useQuery } from "@tanstack/react-query";
import StudentApi from "@/lib/api/studentApi";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Users,
    Search,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import Each from "@/components/Each";
import StudentLedgerDetail from "./components/StudentLedgerDetail";

const breadcrumbs = [
    { title: "Treasury & Fees", href: "/accounts/fee-hub" },
    { title: "Student Ledgers", href: "/accounts/fee-hub/students" },
];

export default function StudentLedgers() {
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const studentId = params.get("student");
        if (studentId) {
            setSelectedStudentId(parseInt(studentId, 10));
        }
    }, []);

    const { data: studentsRes, isLoading: searching } = useQuery({
        queryKey: ["student-search", searchTerm],
        queryFn: () => StudentApi.getStudentList({ search: searchTerm }),
        enabled: searchTerm.length > 2,
    });
    const studentsList = studentsRes?.data?.data || [];

    return (
        <>
            <Head title="Student Ledgers - Fee Hub" />

            <PageContainer maxWidth="6xl">

                {selectedStudentId ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <StudentLedgerDetail
                            studentId={selectedStudentId}
                            onBack={() => {
                                const params = new URLSearchParams(window.location.search);
                                if (params.has("student")) {
                                    window.history.back();
                                } else {
                                    setSelectedStudentId(null);
                                }
                            }}
                        />
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Search Focus Area */}
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6">
                            <div className="size-20 bg-primary/10 rounded-[32px] flex items-center justify-center text-primary border border-primary/20">
                                <Search className="size-10" />
                            </div>
                            <div className="space-y-2 max-w-md">
                                <h2 className="text-2xl font-black tracking-tight">Search Student Records</h2>
                                <p className="text-muted-foreground text-sm font-medium">
                                    Enter Name, Roll No, or Registration Number to access the 12-month digital ledger.
                                </p>
                            </div>
                            <div className="w-full max-w-xl relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-6 text-muted-foreground/40" />
                                <Input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="e.g. Rahul Kumar or REG-2024-001..."
                                    className="h-20 pl-16 pr-8 text-xl font-bold rounded-[24px] border-none shadow-sm focus-visible:ring-primary/20 bg-background border"
                                />
                                {searching && (
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                        <div className="size-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Search Results */}
                        {studentsList.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Each
                                    of={studentsList}
                                    keyExtractor={(student: any) => String(student.id)}
                                    render={(student: any) => (
                                        <Card
                                            key={student.id}
                                            onClick={() => setSelectedStudentId(student.id)}
                                            className="group cursor-pointer hover:border-primary/50 transition-all border shadow-sm rounded-2xl overflow-hidden hover:shadow-md"
                                        >
                                            <CardContent className="p-0">
                                                <div className="p-6 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-12 bg-muted rounded-xl flex items-center justify-center font-bold text-lg text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <p className="font-bold tracking-tight">{student.name}</p>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                                                {student.student_profile?.reg_no || student.reg_no || "N/A"} • Roll: {student.roll_no || "N/A"} • {student.lms_class?.name || student.student_profile?.stream?.name || "No Class"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="size-8 rounded-full border flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all -translate-x-2 group-hover:translate-x-0">
                                                        <ChevronRight className="size-4" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                />
                            </div>
                        )}

                        {searchTerm.length > 2 && studentsList.length === 0 && !searching && (
                            <div className="text-center py-12 space-y-3 opacity-40">
                                <Search className="size-12 mx-auto" />
                                <p className="text-sm font-black uppercase tracking-widest">No matching students found</p>
                            </div>
                        )}
                    </div>
                )}
            </PageContainer>
        </>
    );
}

StudentLedgers.layoutProps = () => {
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const studentId = params.get("student");
    if (studentId) {
        return {
            backHref: `/students/manage/${studentId}`,
            backLabel: "Back to Student Profile",
        };
    }
    return {
        backHref: "/accounts/fee-hub",
        backLabel: "Back to Fee Hub",
    };
};
