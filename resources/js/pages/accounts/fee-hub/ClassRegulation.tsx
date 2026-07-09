import React, { useState, useMemo, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import FullPageLayout from "@/layouts/full-page-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import lmsApi from "@/lib/api/lmsApi";
import feeTypesApi from "@/lib/api/feeTypesApi";
import feeProfilesApi, { type FeeProfile } from "@/lib/api/feeProfilesApi";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    IndianRupee,
    Plus,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Calendar,
    Settings2,
    LayoutGrid,
} from "lucide-react";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import isEqual from "lodash/isEqual";
import { Badge } from "@/components/ui/badge";
import Each from '@/components/Each';
import { SettingsFooter } from "@/components/shared/SettingsFooter";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

type FeeStructureRow = {
    id?: number;
    fee_type_id: number;
    amount: string;
    feeType?: { name: string };
};

interface ClassRegulationProps {
    id: number;
}

export default function ClassRegulation({ id }: ClassRegulationProps) {
    const queryClient = useQueryClient();
    const [formFrequency, setFormFrequency] = useState<string>("monthly");
    const [formItems, setFormItems] = useState<FeeStructureRow[]>([]);
    const [initialState, setInitialState] = useState<{ frequency: string; items: FeeStructureRow[] }>({
        frequency: "monthly",
        items: []
    });
    const [isSaving, setIsSaving] = useState(false);
    const [activeFeeSlot, setActiveFeeSlot] = useState<string | null>(null);

    const { data: feeTypesRes } = useQuery({
        queryKey: ["fee-types"],
        queryFn: () => feeTypesApi.index(),
    });
    const feeTypes = Array.isArray(feeTypesRes?.data) ? feeTypesRes.data : (Array.isArray(feeTypesRes) ? feeTypesRes : []);

    const { data: profilesRes } = useQuery({
        queryKey: ["fee-regulation-profiles"],
        queryFn: () => feeProfilesApi.index(),
    });
    const profiles = Array.isArray(profilesRes?.data) ? profilesRes.data : (Array.isArray(profilesRes) ? profilesRes : []);

    const { data: classFeesRes } = useQuery({
        queryKey: ["class-fees", id],
        queryFn: () => lmsApi.classes.feeStructures(id),
        enabled: !!id,
    });

    const { data: classDetailRes } = useQuery({
        queryKey: ["class-detail", id],
        queryFn: () => lmsApi.classes.show(id),
        enabled: !!id,
    });

    const selectedClassName = classDetailRes?.data?.stream?.name || classDetailRes?.data?.name || "Class Regulations";

    const breadcrumbs = [
        { title: "Treasury & Fees", href: "/accounts/fee-hub" },
        { title: "Fee Regulations", href: "/accounts/fee-hub/regulations" },
        { title: selectedClassName, href: "#" },
    ];

    // Mutations
    const syncMutation = useMutation({
        mutationFn: (data: { structures: { fee_type_id: number; amount: number }[]; fee_slot?: string | null }) =>
            lmsApi.classes.syncFeeStructures(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["class-fees", id] });
        },
    });

    const updateClassMutation = useMutation({
        mutationFn: (data: { fee_collection_frequency: string }) =>
            lmsApi.classes.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["class-detail", id] });
            queryClient.invalidateQueries({ queryKey: ["lms-classes"] });
        },
    });

    // Effects to sync form state when data loads
    useEffect(() => {
        if (classFeesRes?.data && classDetailRes?.data) {
            const items = classFeesRes.data.map((r: any) => ({
                id: r.id,
                fee_type_id: r.fee_type_id,
                amount: String(r.amount),
                feeType: r.fee_type
            }));
            // Sort items so comparison is consistent
            const freq = classDetailRes.data.fee_collection_frequency || "monthly";

            setFormItems(items);
            setFormFrequency(freq);
            setInitialState({ frequency: freq, items: JSON.parse(JSON.stringify(items)) });
        }
    }, [classFeesRes, classDetailRes]);

    const isDirty = useMemo(() => {
        return formFrequency !== initialState.frequency || !isEqual(formItems, initialState.items);
    }, [formFrequency, formItems, initialState]);

    const duplicateTypeIds = useMemo(() => {
        const counts = new Map<number, number>();
        formItems.forEach(item => {
            if (item.fee_type_id > 0) {
                counts.set(item.fee_type_id, (counts.get(item.fee_type_id) || 0) + 1);
            }
        });
        return Array.from(counts.entries())
            .filter(([_, count]) => count > 1)
            .map(([id]) => id);
    }, [formItems]);

    const handleApplyProfile = (profileId: string) => {
        const profile = profiles.find((p: FeeProfile) => String(p.id) === profileId);
        if (profile && profile.items) {
            const newItems = profile.items.map((it: any) => ({
                fee_type_id: it.fee_type_id,
                amount: String(it.amount),
            }));
            // Derive fee_slot from the profile's category or gender
            const slot = profile.category || profile.gender || null;
            setActiveFeeSlot(slot);
            setFormItems(newItems);
            toast.info(`Applied "${profile.name}" template${slot ? ` (slot: ${slot})` : ''}. Review and save changes.`);
        }
    };

    const addItemRow = () => {
        setFormItems((prev: FeeStructureRow[]) => [{ fee_type_id: 0, amount: "" }, ...prev]);
    };

    const removeItemRow = (index: number) => {
        setFormItems((prev: FeeStructureRow[]) => prev.filter((_, i) => i !== index));
    };

    const updateItemRow = (index: number, field: keyof FeeStructureRow, value: any) => {
        setFormItems((prev: FeeStructureRow[]) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const handleReset = () => {
        setFormItems(initialState.items);
        setFormFrequency(initialState.frequency);
        toast.success("Changes discarded.");
    };

    const handleSave = async () => {
        if (duplicateTypeIds.length > 0) {
            toast.error("Please remove duplicate fee types before saving.");
            return;
        }

        setIsSaving(true);
        try {
            const validItems = formItems.filter(it => it.fee_type_id > 0 && it.amount !== "");
            await Promise.all([
                syncMutation.mutateAsync({
                    structures: validItems.map(it => ({
                        fee_type_id: it.fee_type_id,
                        amount: Number(it.amount)
                    })),
                    fee_slot: activeFeeSlot,
                }),
                updateClassMutation.mutateAsync({
                    fee_collection_frequency: formFrequency
                })
            ]);

            queryClient.invalidateQueries({ queryKey: ["class-fees", id] });
            queryClient.invalidateQueries({ queryKey: ["class-detail", id] });

            toast.success("Regulations saved successfully.");
        } catch (error) {
            toast.error("Failed to save some changes.");
        } finally {
            setIsSaving(false);
        }
    };

    const totalAmount = formItems.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);

    return (
        <>
            <Head title={`${selectedClassName} - Fee Regulations`} />

            <TooltipProvider>
                <PageContainer maxWidth="full">
                    <div className="pb-24 space-y-6 max-w-7xl mx-auto">
                        {/* Immersive Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-1 duration-500">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                                        {selectedClassName.substring(0, 2).toUpperCase()}
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{selectedClassName}</h1>
                                </div>
                                <p className="text-muted-foreground text-sm max-w-2xl">
                                    Configure specific fee regulations for this academic stream. Frequency and particulars set here will override institution defaults.
                                </p>
                            </div>

                            <div className="flex items-center gap-4 bg-card border rounded-xl p-3 shadow-sm h-fit">
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Total Amount</p>
                                    <p className="text-2xl font-bold text-primary">₹{totalAmount.toLocaleString()}</p>
                                </div>
                                <Separator orientation="vertical" className="h-8" />
                                <div className="text-center">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Items</p>
                                    <p className="text-xl font-semibold">{formItems.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {/* Left: Configuration Panel */}
                            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
                                <Card className="shadow-sm rounded-xl overflow-hidden">
                                    <CardHeader className="bg-muted/30 border-b py-4">
                                        <h3 className="text-base font-bold flex items-center gap-2">
                                            <Settings2 className="size-5 text-primary" />
                                            General Settings
                                        </h3>
                                    </CardHeader>
                                    <CardContent className="p-5 space-y-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Collection Frequency</Label>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <HelpCircle className="size-3.5 text-muted-foreground hover:text-primary transition-colors" />
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right" className="max-w-[250px] text-xs">
                                                        <p>Determines how often students are billed (e.g., once a month or every 3 months).</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setFormFrequency("monthly")}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 gap-1.5 h-auto font-normal",
                                                        formFrequency === "monthly"
                                                            ? "border-primary bg-primary/5 text-primary hover:bg-primary/5 hover:border-primary"
                                                            : "border-input hover:border-primary/50 text-muted-foreground hover:bg-muted/50"
                                                    )}
                                                >
                                                    <LayoutGrid className="size-4" />
                                                    <span className="text-xs font-semibold">Monthly</span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setFormFrequency("quarterly")}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 gap-1.5 h-auto font-normal",
                                                        formFrequency === "quarterly"
                                                            ? "border-primary bg-primary/5 text-primary hover:bg-primary/5 hover:border-primary"
                                                            : "border-input hover:border-primary/50 text-muted-foreground hover:bg-muted/50"
                                                    )}
                                                >
                                                    <Calendar className="size-4" />
                                                    <span className="text-xs font-semibold">Quarterly</span>
                                                </Button>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground italic">
                                                Determines how often invoices are generated.
                                            </p>
                                        </div>

                                        <Separator className="opacity-50" />

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Quick Templates</Label>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <HelpCircle className="size-3.5 text-muted-foreground hover:text-primary transition-colors" />
                                                        </TooltipTrigger>
                                                        <TooltipContent side="right" className="max-w-[250px] text-xs">
                                                            <p>Apply a predefined fee structure profile. You can still modify the particulars after applying the profile.</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                                <Badge variant="outline" className="text-[10px] font-bold bg-muted/50">OPTIONAL</Badge>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[11px] text-muted-foreground">Apply a profile to populate rows:</p>
                                                <Select onValueChange={handleApplyProfile}>
                                                    <SelectTrigger className="h-10 rounded-lg text-sm border hover:border-primary/30 transition-all">
                                                        <SelectValue placeholder="Choose a profile..." />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-lg shadow-md">
                                                        <Each
                                                            of={profiles}
                                                            keyExtractor={(p: FeeProfile) => String(p.id)}
                                                            render={(p: FeeProfile) => (
                                                            <SelectItem key={p.id} value={String(p.id)} className="text-sm">
                                                                {p.name}
                                                            </SelectItem>
                                                        )}
                                                        />
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-primary/5 border-primary/10 rounded-xl overflow-hidden">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="size-5 text-primary shrink-0 mt-0.5" />
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-sm">Regulatory Override</h4>
                                                <p className="text-xs leading-relaxed text-muted-foreground">
                                                    Values set here override department defaults for all students in <strong>{selectedClassName}</strong>.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right: Fee Particulars Section */}
                            <div className="lg:col-span-8 space-y-6">
                                <Card className="shadow-sm rounded-xl overflow-hidden min-h-[500px] flex flex-col">
                                    <CardHeader className="bg-card px-6 py-4 border-b flex flex-row items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-bold flex items-center gap-2">
                                                    <IndianRupee className="size-5 text-primary" />
                                                    Fee Particulars
                                                </h3>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <HelpCircle className="size-4 text-muted-foreground hover:text-primary transition-colors" />
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right" className="max-w-[250px] text-xs">
                                                        <p>Add specific fee types (like Tuition, Library) and their amounts. These will be included in the ledger for each billing cycle.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Defined fee types for this class</p>
                                        </div>
                                        <Button size="sm" onClick={addItemRow} className="rounded-lg h-9 px-4 gap-2 transition-all">
                                            <Plus className="size-4" /> Add Row
                                        </Button>
                                    </CardHeader>

                                    <CardContent className="p-0 flex-1 flex flex-col">
                                        {/* Grid Header */}
                                        <div className="grid grid-cols-[1fr_200px_80px] gap-6 px-8 py-3 bg-muted/20 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b">
                                            <span>Fee Particular</span>
                                            <span className="text-right pr-4">Amount (₹)</span>
                                            <span className="text-center">Action</span>
                                        </div>

                                        <div className="flex-1 overflow-y-auto max-h-[600px] px-2 py-4 space-y-2">
                                            <AnimatePresence mode="popLayout" initial={false}>
                                                {formItems.length === 0 ? (
                                                    <motion.div
                                                        key="empty"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="py-16 text-center space-y-4"
                                                    >
                                                        <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                                                            <IndianRupee className="size-8 text-muted-foreground/30" />
                                                        </div>
                                                        <div className="space-y-1 px-4">
                                                            <h3 className="text-lg font-bold">No items defined</h3>
                                                            <p className="text-xs text-muted-foreground">Start by adding a fee type or applying a profile template.</p>
                                                        </div>
                                                        <Button variant="outline" size="sm" onClick={addItemRow} className="rounded-lg">
                                                            Get Started
                                                        </Button>
                                                    </motion.div>
                                                ) : (
                                                    formItems.map((item, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            layout
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.98 }}
                                                            transition={{ duration: 0.15 }}
                                                            className={cn(
                                                                "grid grid-cols-[1fr_200px_80px] gap-4 px-4 py-2 items-center rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all",
                                                                duplicateTypeIds.includes(item.fee_type_id) && "bg-destructive/5 border-destructive/20 hover:border-destructive/30"
                                                            )}
                                                        >
                                                            <div className="space-y-1">
                                                                <Select
                                                                    value={item.fee_type_id > 0 ? String(item.fee_type_id) : ""}
                                                                    onValueChange={(v) => updateItemRow(idx, "fee_type_id", parseInt(v, 10))}
                                                                >
                                                                    <SelectTrigger className={cn(
                                                                        "h-10 rounded-lg text-sm transition-all border",
                                                                        duplicateTypeIds.includes(item.fee_type_id) ? "border-destructive/50" : "hover:border-primary/30"
                                                                    )}>
                                                                        <SelectValue placeholder="Select fee type..." />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="rounded-lg shadow-md border">
                                                                        <Each
                                                                            of={feeTypes}
                                                                            keyExtractor={(ft: any) => String(ft.id)}
                                                                            render={(ft: any) => (
                                                                            <SelectItem key={ft.id} value={String(ft.id)} className="text-sm">
                                                                                {ft.name}
                                                                            </SelectItem>
                                                                        )}
                                                                        />
                                                                    </SelectContent>
                                                                </Select>
                                                                {duplicateTypeIds.includes(item.fee_type_id) && (
                                                                    <p className="text-[10px] font-bold text-destructive flex items-center gap-1 pl-1">
                                                                        <AlertCircle className="size-3" /> Duplicate fee type detected
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="relative group">
                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold pointer-events-none group-focus-within:text-primary transition-colors">₹</span>
                                                                <Input
                                                                    type="number"
                                                                    value={item.amount}
                                                                    onChange={(e) => updateItemRow(idx, "amount", e.target.value)}
                                                                    placeholder="0.00"
                                                                    className="h-10 pl-8 border rounded-lg text-right text-sm font-semibold transition-all hover:border-primary/30 focus-visible:ring-primary/20 focus-visible:border-primary"
                                                                />
                                                            </div>
                                                            <div className="flex justify-center">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => removeItemRow(idx)}
                                                                    className="size-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                                >
                                                                    <Trash2 className="size-4" />
                                                                </Button>
                                                            </div>
                                                        </motion.div>
                                                    ))
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Sticky Save/Reset Footer */}
                        <SettingsFooter
                            isDirty={isDirty}
                            isPending={isSaving}
                            onDiscard={handleReset}
                            onSubmit={handleSave}
                            submitLabel="Save"
                            successMessage="Regulations saved successfully"
                        />
                    </div>
                </PageContainer>
            </TooltipProvider>
        </>
    );
}

ClassRegulation.layoutProps = {
    backHref: "/accounts/fee-hub/regulations",
    backLabel: "Back to Class List",
};
