import React, { useMemo } from "react";
import { Search, Users, CheckSquare, Square } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import Each from "@/components/Each";
import { cn } from "@/lib/utils";
import { ID_CARD_CONTENT } from "@/constants/idCard/formConfig";

const EDITOR = ID_CARD_CONTENT.editor;
import type { IdCardStudentData } from "@/components/certificates/IdCardPreview";

export interface StudentEntry {
    id: number | string;
    name: string;
    reg_no?: string;
    roll_no?: string;
    stream_name?: string;
    photo_url?: string;
    [key: string]: any;
}

interface StudentSidebarProps {
    students: StudentEntry[];
    isLoading: boolean;
    search: string;
    onSearchChange: (value: string) => void;
    selectedIds: Set<string>;
    onToggle: (id: string) => void;
    onToggleAll: () => void;
    focusedId: string | null;
    onFocus: (student: StudentEntry) => void;
    overrides: Map<string, Partial<IdCardStudentData>>;
    templateFieldCount: number;
}

const getInitials = (name: string) =>
    (name || "?")
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

/**
 * Readiness: ratio of filled override fields vs template field count.
 * Returns "ready" | "partial" | "empty"
 */
const getReadiness = (
    overrides: Partial<IdCardStudentData> | undefined,
    templateFieldCount: number,
): "ready" | "partial" | "empty" => {
    if (!overrides || templateFieldCount === 0) return "empty";
    const filled = Object.values(overrides).filter((v) => v && String(v).trim()).length;
    if (filled >= templateFieldCount) return "ready";
    if (filled > 0) return "partial";
    return "empty";
};

const READINESS_STYLE = {
    ready: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    partial: "bg-amber-500/10 text-amber-600 border-amber-200",
    empty: "bg-zinc-100 text-zinc-400 border-zinc-200",
};

const StudentSidebar: React.FC<StudentSidebarProps> = ({
    students,
    isLoading,
    search,
    onSearchChange,
    selectedIds,
    onToggle,
    onToggleAll,
    focusedId,
    onFocus,
    overrides,
    templateFieldCount,
}) => {
    const allSelected = students.length > 0 && students.every((s) => selectedIds.has(String(s.id)));
    const selectedCount = students.filter((s) => selectedIds.has(String(s.id))).length;

    return (
        <div className="h-full flex flex-col border-r border-border bg-card">
            {/* Header */}
            <div className="p-3 border-b border-border space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="size-4 text-muted-foreground" />
                        <span className="text-sm font-semibold">{EDITOR.detailsTitle}</span>
                        {!isLoading && (
                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                                {selectedCount}/{students.length}
                            </Badge>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onToggleAll}
                        className="text-xs text-primary hover:underline font-medium cursor-pointer"
                    >
                        {allSelected ? EDITOR.sidebarDeselectAll : EDITOR.sidebarSelectAll}
                    </button>
                </div>
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                        placeholder={EDITOR.sidebarSearch}
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-8 h-8 text-xs"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
                {isLoading ? (
                    <div className="space-y-1.5 p-1">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full rounded-lg" />
                        ))}
                    </div>
                ) : students.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Users className="size-7 text-muted-foreground/20 mb-2" />
                        <p className="text-xs text-muted-foreground">No records found</p>
                    </div>
                ) : (
                    <Each
                        of={students}
                        keyExtractor={(s) => String(s.id)}
                        render={(student) => {
                            const sid = String(student.id);
                            const isChecked = selectedIds.has(sid);
                            const isFocused = focusedId === sid;
                            const readiness = getReadiness(overrides.get(sid), templateFieldCount);

                            return (
                                <div
                                    className={cn(
                                        "flex items-center gap-2 p-2 rounded-lg transition-all duration-150 cursor-pointer group",
                                        isFocused
                                            ? "bg-primary/10 ring-1 ring-primary/30 shadow-md border-l-[3px] border-l-primary"
                                            : "hover:bg-accent/40 border-l-[3px] border-l-transparent",
                                    )}
                                    onClick={() => onFocus(student)}
                                >
                                    <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={() => onToggle(sid)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="shrink-0"
                                    />

                                    {/* Avatar */}
                                    <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                        {student.photo_url ? (
                                            <img
                                                src={student.photo_url}
                                                alt={student.name}
                                                className="size-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-[10px] font-bold text-muted-foreground">
                                                {getInitials(student.name)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-semibold text-foreground truncate leading-tight">
                                            {student.name}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground truncate">
                                            {student.reg_no || student.roll_no || "—"}
                                        </div>
                                    </div>

                                    {/* Readiness dot */}
                                    <div
                                        className={cn(
                                            "size-2 rounded-full shrink-0",
                                            readiness === "ready" && "bg-emerald-500",
                                            readiness === "partial" && "bg-amber-500",
                                            readiness === "empty" && "bg-zinc-300",
                                        )}
                                        title={readiness === "ready" ? EDITOR.sidebarReadyReady : readiness === "partial" ? EDITOR.sidebarReadyPartial : EDITOR.sidebarReadyEmpty}
                                    />
                                </div>
                            );
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default StudentSidebar;
