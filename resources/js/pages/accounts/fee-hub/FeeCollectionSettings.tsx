import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import SettingsLayout from "@/layouts/settings/layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { feeCollectionApi, type FeeCollectionSettings } from "@/lib/api/feeCollectionApi";
import { useRegisterGuide } from '@/components/GuideProvider';
import { COLLECTION_SETTINGS_GUIDE } from "@/constants/guides/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { Loader2, Save, Settings, Settings2 } from "lucide-react";
import { toast } from "sonner";

const breadcrumbs = [
    { title: "Settings", href: "/settings/profile" },
    { title: "Collection settings", href: "/accounts/fee-hub/collection-settings" },
];

const defaultSettings: FeeCollectionSettings = {
    fee_collection_frequency: "monthly",
    fee_due_day_of_month: 5,
    reminder_days_before_due: 3,
    overdue_reminder_after_days: 7,
    late_fee_enabled: false,
    late_fee_after_days: 10,
    late_fee_type: "fixed",
    late_fee_value: 0,
    reminder_send_email: true,
    receipt_send_email: true,
    charge_fees_from_admission_month: false,
};

export default function FeeCollectionSettingsPage() {
useRegisterGuide(COLLECTION_SETTINGS_GUIDE);
    const queryClient = useQueryClient();
    const [form, setForm] = useState<FeeCollectionSettings>(defaultSettings);

    const { data: res, isLoading } = useQuery({
        queryKey: ["fee-collection-settings"],
        queryFn: () => feeCollectionApi.getCollectionSettings(),
    });

    const settings = (res as { data?: FeeCollectionSettings })?.data ?? res?.data;
    useEffect(() => {
        if (settings && typeof settings === "object") {
            setForm({
                fee_collection_frequency: settings.fee_collection_frequency ?? "monthly",
                fee_due_day_of_month: settings.fee_due_day_of_month ?? 5,
                reminder_days_before_due: settings.reminder_days_before_due ?? 3,
                overdue_reminder_after_days: settings.overdue_reminder_after_days ?? 7,
                late_fee_enabled: !!settings.late_fee_enabled,
                late_fee_after_days: settings.late_fee_after_days ?? 10,
                late_fee_type: settings.late_fee_type ?? "fixed",
                late_fee_value: Number(settings.late_fee_value) ?? 0,
                reminder_send_email: settings.reminder_send_email !== false,
                receipt_send_email: settings.receipt_send_email !== false,
                charge_fees_from_admission_month: !!settings.charge_fees_from_admission_month,
            });
        }
    }, [settings]);

    const updateMutation = useMutation({
        mutationFn: (payload: Partial<FeeCollectionSettings>) =>
            feeCollectionApi.updateCollectionSettings(payload),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["fee-collection-settings"] });
            toast.success(data?.message ?? "Settings saved.");
        },
        onError: () => toast.error("Failed to save settings."),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(form);
    };

    if (isLoading) {
        return (
            <>
                <SettingsLayout>
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
                    </div>
                </SettingsLayout>
            </>
        );
    }

    return (
        <>
            <Head title="Fee collection settings" />
            <SettingsLayout>
                <PageContainer maxWidth="full">
                    <MainPageHeader
                        id="fee-settings-header"
                        breadcrumbs={breadcrumbs}
                        icon={Settings2}

                        title="Collection Settings"
                        subtitle="Configure global parameters for fee processing and receipt generation."
                        tip="These settings apply institution-wide. Changes here affect how dates are calculated for late fees and how automated receipts are generated for students."
                    />

                    <form onSubmit={handleSubmit} className="space-y-8 pb-10">
                        {/* Transaction & Receipting */}
                        <div className="grid grid-cols-1 gap-8">
                            {/* Collection cycle */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 border-b pb-1.5">
                                    Collection cycle
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Choose how often fees are collected and when they are due.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="space-y-2">
                                        <Label>Frequency</Label>
                                        <Select
                                            value={form.fee_collection_frequency}
                                            onValueChange={(v) =>
                                                setForm((f) => ({ ...f, fee_collection_frequency: v }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Due day of month (1–28)</Label>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={28}
                                            value={form.fee_due_day_of_month}
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    fee_due_day_of_month: parseInt(e.target.value, 10) || 5,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Reminders */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 border-b pb-1.5">
                                    Reminders
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    When to send due and overdue reminders (in-app and optional email).
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="space-y-2">
                                        <Label>Days before due to send reminder</Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            max={31}
                                            value={form.reminder_days_before_due}
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    reminder_days_before_due: parseInt(e.target.value, 10) || 0,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Days after due to send overdue reminder</Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            max={90}
                                            value={form.overdue_reminder_after_days}
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    overdue_reminder_after_days: parseInt(e.target.value, 10) || 0,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <p className="font-medium">Send email for reminders</p>
                                        <p className="text-sm text-muted-foreground">
                                            Email guardians/students when sending due or overdue reminders.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={form.reminder_send_email}
                                        onCheckedChange={(v) =>
                                            setForm((f) => ({ ...f, reminder_send_email: v }))
                                        }
                                    />
                                </div>
                            </div>

                            {/* Late fee */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 border-b pb-1.5">
                                    Late fee (optional)
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Automatically apply late fee when payment is after the grace period.
                                </p>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <p className="font-medium">Enable late fee</p>
                                        <p className="text-sm text-muted-foreground">
                                            Apply late fee after the configured days past due.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={form.late_fee_enabled}
                                        onCheckedChange={(v) =>
                                            setForm((f) => ({ ...f, late_fee_enabled: v }))
                                        }
                                    />
                                </div>
                                {form.late_fee_enabled && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                                        <div className="space-y-2">
                                            <Label>Apply late fee after (days)</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={form.late_fee_after_days}
                                                onChange={(e) =>
                                                    setForm((f) => ({
                                                        ...f,
                                                        late_fee_after_days: parseInt(e.target.value, 10) || 0,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Type</Label>
                                            <Select
                                                value={form.late_fee_type}
                                                onValueChange={(v) =>
                                                    setForm((f) => ({ ...f, late_fee_type: v }))
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="fixed">Fixed amount</SelectItem>
                                                    <SelectItem value="percent">Percent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{form.late_fee_type === "percent" ? "Percent" : "Amount"}</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                step={form.late_fee_type === "percent" ? 0.5 : 1}
                                                value={form.late_fee_value}
                                                onChange={(e) =>
                                                    setForm((f) => ({
                                                        ...f,
                                                        late_fee_value: parseFloat(e.target.value) || 0,
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Receipt email */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 border-b pb-1.5">
                                    Receipt
                                </h3>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <p className="font-medium">Send email receipt after payment</p>
                                        <p className="text-sm text-muted-foreground">
                                            Email guardians/students when a fee payment is recorded.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={form.receipt_send_email}
                                        onCheckedChange={(v) =>
                                            setForm((f) => ({ ...f, receipt_send_email: v }))
                                        }
                                    />
                                </div>
                            </div>

                            {/* Mid-Session Admission Dues */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 border-b pb-1.5">
                                    Mid-Session Admission Dues
                                </h3>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <p className="font-medium">Charge fees from admission month only</p>
                                        <p className="text-sm text-muted-foreground">
                                            If enabled, students who take admission in the middle of a session will only be charged monthly/quarterly recurring fees starting from their admission month. Prior months' fees will not be charged.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={form.charge_fees_from_admission_month}
                                        onCheckedChange={(v) =>
                                            setForm((f) => ({ ...f, charge_fees_from_admission_month: v }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button id="save-collection-btn" type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Save className="size-4" />
                                )}
                                <span className="ml-2">Save settings</span>
                            </Button>
                        </div>
                    </form>
                </PageContainer>
            </SettingsLayout>
        </>
    );
}
