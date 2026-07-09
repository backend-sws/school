import React, { useMemo, useState } from "react";
import FullPageLayout from "@/layouts/full-page-layout";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Info, CheckCircle2, Copy, Check } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdmissionApi from "@/lib/api/admissionApi";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TotalSummaryCard } from "@/components/admission/TotalSummaryCard";
import { FormFieldsFromConfig } from "@/components/admission/FormFieldsFromConfig";
import { paymentDeskFormSchema, type PaymentDeskFormValues } from "@/lib/validations/admission/payment";
import { PAY_DESK_CONCESSION_FIELDS, PAY_DESK_PAYMENT_FIELDS } from "@/constants/admission/application";
import { APPLICATION_PAY_BREADCRUMBS } from "@/constants/page/admin/applicationShow";
import { computePaymentDeskTotals, computeIsFullyPaid } from "@/lib/utils";

interface Props {
    id: string | number;
}

export default function ApplicationPay({ id }: Props) {
    const { control, handleSubmit, watch, formState: { errors } } = useForm<PaymentDeskFormValues>({
        resolver: zodResolver(paymentDeskFormSchema) as any,
        defaultValues: {
            cash_amount: "" as unknown as number,
            online_amount: "" as unknown as number,
            online_transaction_id: "",
            concession_amount: "" as unknown as number,
            concession_reason: "",
            notes: "",
        }
    });

    const cashAmount = watch("cash_amount");
    const onlineAmount = watch("online_amount");
    const concessionAmount = watch("concession_amount");

    const [copiedId, setCopiedId] = useState(false);

    const visiblePaymentFields = useMemo(() => {
        const allowed = ["cash_amount", "online_amount", "online_transaction_id"];
        return PAY_DESK_PAYMENT_FIELDS.filter((f) => allowed.includes(f.name));
    }, []);

    const { data: response, isLoading } = useQuery({
        queryKey: ["application", id],
        queryFn: () => AdmissionApi.show(id),
    });

    const application = response?.data;

    const desk = computePaymentDeskTotals(
        application,
        { cash: Number(cashAmount) || 0, online: Number(onlineAmount) || 0 },
        Number(concessionAmount) || 0
    );

    const recordPaymentMutation = useMutation({
        mutationFn: (data: any) => AdmissionApi.recordPayment(id, data),
        onSuccess: () => {
            toast.success("Payment recorded successfully!");
            router.visit(`/admission/applications/${id}`);
        },
        onError: () => {
            toast.error("Failed to record payment.");
        }
    });

    const onSubmit = (data: PaymentDeskFormValues) => {
        const cash = Number(data.cash_amount) || 0;
        const online = Number(data.online_amount) || 0;
        recordPaymentMutation.mutate({
            cash_amount: cash || undefined,
            online_amount: online || undefined,
            online_transaction_id: data.online_transaction_id?.trim() || undefined,
            concession_amount: (data.concession_amount && Number(data.concession_amount) > 0) ? Number(data.concession_amount) : undefined,
            concession_reason: (data.concession_amount && Number(data.concession_amount) > 0 && data.concession_reason?.trim()) ? data.concession_reason.trim() : undefined,
            notes: data.notes?.trim() || undefined,
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground font-medium">Loading payment portal...</p>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
                <div className="size-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Info className="size-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold">Application Not Found</h2>
                <Button asChild variant="outline">
                    <a href="/admission/applications">Return to List</a>
                </Button>
            </div>
        );
    }

    if (computeIsFullyPaid(application)) {
        return (
            <div className="max-w-3xl mx-auto py-12 px-4 text-center">
                <div className="size-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="size-12 text-green-500" />
                </div>
                <h1 className="text-4xl font-extrabold mb-4">Already Paid</h1>
                <p className="text-xl text-muted-foreground mb-10">This application has already been processed and the payment is successful.</p>
                <Button className="rounded-xl" asChild>
                    <a href={`/admission/applications/${id}`}>Review Application Details</a>
                </Button>
            </div>
        );
    }

    const handleCopyId = () => {
        if (application?.application_id) {
            navigator.clipboard.writeText(String(application.application_id));
            setCopiedId(true);
            toast.success("Application ID copied to clipboard");
            setTimeout(() => setCopiedId(false), 2000);
        }
    };

    return (
        <>
            <Head title={`Pay Fees – ${(application.applicant_name ?? "").trim().replace(/^[,.\s]+|[,.\s]+$/g, "") || "Application"}`} />

            <div className="max-w-4xl mx-auto py-6 md:py-10 px-4">
                <div className="space-y-6">
                    {/* Page title – full width */}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Payment Desk</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Collect payment and apply concessions.</p>
                    </div>

                    {/* Applicant summary – full width section, same style as Concession / Fee Collection */}
                    <section className="rounded-xl bg-muted/20 border border-border/60 overflow-hidden">
                        <div className="p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Applicant</p>
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Application ID</p>
                                <span className="font-mono text-sm font-medium text-foreground">{application.application_id ?? "—"}</span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopyId}
                                    className="size-8 rounded-md"
                                    title="Copy ID"
                                >
                                    {copiedId ? <Check className="size-4 text-green-600" /> : <Copy className="size-4 text-muted-foreground" />}
                                </Button>
                            </div>
                            <div className="mb-4">
                                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Name</p>
                                <p className="text-base font-bold text-foreground mt-0.5">{(application.applicant_name ?? "").trim().replace(/^[,.\s]+|[,.\s]+$/g, "") || "—"}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 pt-2 border-t border-border/60">
                                <DetailRow label="Father's name" value={application.father_name} />
                                <DetailRow label="Mother's name" value={application.mother_name} />
                                <DetailRow label="Date of birth" value={application.dob ? new Date(application.dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : undefined} />
                                <DetailRow label="Gender / Category" value={[application.gender, application.category].filter(Boolean).join(" / ") || undefined} />
                                <DetailRow label="Mobile" value={application.mobile} />
                                <DetailRow label="Email" value={application.email} />
                                <DetailRow
                                    label="Program / Stream"
                                    value={[application.main_stream_name, application.branch_stream_name].filter(Boolean).join(" → ") || undefined}
                                />
                            </div>
                        </div>
                    </section>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Due amount banner */}
                        {desk.alreadyPaid > 0 && (
                            <div className="rounded-xl border-2 border-amber-400/50 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">Outstanding Due</p>
                                    <p className="text-2xl font-black text-amber-700 dark:text-amber-300 tabular-nums">₹{desk.dueAmount.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Already Paid</p>
                                    <p className="text-lg font-bold text-green-600 tabular-nums">₹{desk.alreadyPaid.toLocaleString()}</p>
                                </div>
                            </div>
                        )}

                        {/* 1. Fee breakup + Grand Total */}
                        <TotalSummaryCard
                            feeTotal={desk.admissionFee}
                            inventoryTotal={0}
                            transportTotal={desk.transportAmount}
                            hostelTotal={desk.hostelAmount}
                            discountTotal={desk.concession}
                            cashAmount={desk.existingCash}
                            onlineAmount={desk.existingOnline}
                            dueAmount={desk.dueAmount}
                        />

                        {/* 2. Concession – adjust total if needed */}
                        <section className="flex flex-col gap-4 p-4 rounded-xl bg-muted/20 border border-border/60">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                Concession / Discount
                            </label>
                            <FormFieldsFromConfig<PaymentDeskFormValues>
                                control={control}
                                columns="2"
                                fields={PAY_DESK_CONCESSION_FIELDS as any}
                            />
                        </section>

                        {/* 3. Fee collection – config-based with tooltips and section headers */}
                        <section className="flex flex-col gap-4 p-4 rounded-xl bg-muted/20 border border-border/60">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Fee Collection / Payment Details
                                </label>
                                <p className="text-sm font-semibold tabular-nums text-foreground">
                                    Amount to collect: <span className="text-blue-700 dark:text-blue-400">₹{desk.dueAmount.toLocaleString()}</span>
                                </p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <FormFieldsFromConfig<PaymentDeskFormValues>
                                    control={control}
                                    columns="2"
                                    fields={visiblePaymentFields}
                                    renderSectionHeader={(section) => (
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground pt-2 first:pt-0 border-t border-border/40 first:border-t-0 mt-2 first:mt-0">
                                            {section === "amounts" ? "Payment amounts" : "Payment details"}
                                        </p>
                                    )}
                                />

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 border-t border-border/40">
                                    <div className="lg:col-span-12 flex flex-wrap items-center justify-end gap-x-8 gap-y-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase text-muted-foreground block tracking-wider">Net Received</span>
                                            <span className="text-2xl font-black text-green-600 tabular-nums">₹{desk.totalCollected.toLocaleString()}</span>
                                        </div>
                                        <div className="hidden sm:block h-10 w-px bg-border/60" />
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase text-muted-foreground block tracking-wider">Remaining Balance</span>
                                            <span className={`text-2xl font-black tabular-nums ${desk.remaining > 0 ? "text-destructive" : "text-foreground/40"}`}>
                                                ₹{desk.remaining.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {desk.totalCollected > 0 && (
                            <div className={`rounded-lg border px-4 py-3 text-sm font-medium ${desk.remaining === 0 ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300" : desk.remaining > 0 ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300" : "border-destructive/30 bg-destructive/10 text-destructive"}`}>
                                {desk.remaining === 0 ? "✓ Fully covered" : desk.remaining > 0 ? `₹${desk.remaining.toLocaleString()} remaining` : `₹${Math.abs(desk.remaining).toLocaleString()} over-collected`}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full font-semibold rounded-xl"
                            disabled={recordPaymentMutation.isPending || (desk.totalCollected <= 0 && desk.dueAmount > 0)}
                        >
                            {recordPaymentMutation.isPending ? "Recording..." : "Confirm & Record Payment"}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

ApplicationPay.layoutProps = (props: any) => ({
    backHref: `/admission/applications/${props.id}`,
    backLabel: "Back to Application",
});

function DetailRow({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="flex flex-col gap-0.5">
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground break-words">{value ?? "—"}</p>
        </div>
    );
}
