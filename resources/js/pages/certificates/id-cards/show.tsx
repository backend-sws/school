import { Head } from "@inertiajs/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { IdCardApi } from "@/lib/api/idCardApi";
import { IdCardQueryKeys } from "@/lib/querykey/idCard";
import { ID_CARD_SHOW_BREADCRUMBS } from "@/constants/page/idCard";
import { CARD_STATUS_VARIANT, ID_CARD_CONTENT } from "@/constants/idCard/formConfig";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import CardPreviewStage from "@/components/certificates/editor/CardPreviewStage";
import { IdCardFront, IdCardBack, type IdCardHolderData } from "@/components/certificates/IdCardPreview";
import {
    getSnapshotDisplayFields,
    getSnapshotFieldValue,
    parseSnapshotData,
} from "@/lib/idCard/snapshotDisplay";
import {
    IdCard as IdCardIcon,
    Download,
    RefreshCcw,
    Ban,
    Loader2,
    ChevronDown,
    Printer,
    FileText,
    Image as ImageIcon,
    CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDisclosure } from "@/hooks/useDisclosure";
import Each from "@/components/Each";
import { toast } from "sonner";
import R2Api from "@/lib/api/r2Api";
import { cn } from "@/lib/utils";
import {
    exportIdCardToPdf,
    exportIdCardSideToPng,
    exportBothSidesToPng,
    printIdCardDirectly,
} from "@/lib/idCard/idCardDownload";

const { show: CONTENT } = ID_CARD_CONTENT;

function formatDate(value?: string | null) {
    if (!value) return "—";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
}

const ShowCard = ({ id }: { id: number }) => {
    const queryClient = useQueryClient();
    const revokeDisclosure = useDisclosure();
    const [exportingType, setExportingType] = useState<string | null>(null);
    const frontExportRef = useRef<HTMLDivElement>(null);
    const backExportRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: IdCardQueryKeys.cards.detail(id),
        queryFn: () => IdCardApi.show(id),
    });

    const card = data?.data;
    const snapshot = useMemo(
        () => parseSnapshotData(card?.display_snapshot ?? card?.snapshot_data),
        [card?.display_snapshot, card?.snapshot_data],
    );
    const template = card?.template;

    const frontFields = useMemo(
        () => template?.front_layout ?? ["institution_name", "institution_logo", "photo", "name", "reg_no"],
        [template],
    );

    const backFields = useMemo(
        () => template?.back_layout ?? ["mobile", "qr_code"],
        [template],
    );

    const detailFields = useMemo(
        () => getSnapshotDisplayFields(card?.card_type, frontFields, backFields),
        [card?.card_type, frontFields, backFields],
    );

    const breadcrumbs = useMemo(
        () => [
            ...ID_CARD_SHOW_BREADCRUMBS.slice(0, -1),
            {
                title: snapshot?.name ? String(snapshot.name) : "Card Details",
                href: `#`,
            },
        ],
        [snapshot?.name],
    );

    const templatePreviewData = useMemo(() => {
        if (!template) return null;
        return {
            name: template.name,
            card_type: template.card_type,
            background_color: template.background_color,
            color_scheme: template.color_scheme,
        };
    }, [template]);

    const holderData = useMemo<IdCardHolderData | null>(() => {
        if (!snapshot || Object.keys(snapshot).length === 0) return null;
        return {
            ...(snapshot as IdCardHolderData),
            photo_url: card?.photo_url || String(snapshot.photo_url ?? ""),
            session: String(snapshot.session ?? card?.session?.name ?? ""),
            valid_until: String(
                snapshot.valid_until ?? (card?.valid_until ? formatDate(card.valid_until) : ""),
            ),
        };
    }, [snapshot, card?.photo_url, card?.session?.name, card?.valid_until]);

    const regenerateMutation = useMutation({
        mutationFn: () => IdCardApi.regenerate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: IdCardQueryKeys.cards.detail(id) });
            toast.success("Card regenerated");
        },
    });

    const revokeMutation = useMutation({
        mutationFn: () => IdCardApi.revoke(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: IdCardQueryKeys.cards.detail(id) });
            revokeDisclosure.onClose();
            toast.success("Card revoked");
        },
    });

    const handleFrontendDownload = async (
        format: "cr80-pdf" | "a4-pdf" | "png-front" | "png-back" | "png-both" | "print" = "cr80-pdf"
    ) => {
        if (!frontExportRef.current || !backExportRef.current) {
            toast.error("Card elements are not ready for export. Please wait a moment.");
            return;
        }

        const regNo = String(snapshot?.reg_no || id);
        const filename = `id-card-${regNo}`;
        const studentTitle = String(snapshot?.name || "Student ID Card");

        setExportingType(format);
        const toastId = toast.loading("Generating pixel-perfect ID card...");

        try {
            if (format === "cr80-pdf") {
                await exportIdCardToPdf(frontExportRef.current, backExportRef.current, {
                    filename,
                    format: "cr80",
                });
                toast.success("Standard ID Card PDF downloaded (Pixel-Perfect)!", { id: toastId });
            } else if (format === "a4-pdf") {
                await exportIdCardToPdf(frontExportRef.current, backExportRef.current, {
                    filename,
                    format: "a4",
                    title: `${card?.template?.name || "ID CARD"}`,
                    subtitle: `${studentTitle} (${regNo})`,
                });
                toast.success("A4 Sheet PDF downloaded!", { id: toastId });
            } else if (format === "png-front") {
                await exportIdCardSideToPng(frontExportRef.current, filename, "front");
                toast.success("Front card image downloaded!", { id: toastId });
            } else if (format === "png-back") {
                await exportIdCardSideToPng(backExportRef.current, filename, "back");
                toast.success("Back card image downloaded!", { id: toastId });
            } else if (format === "png-both") {
                await exportBothSidesToPng(frontExportRef.current, backExportRef.current, filename);
                toast.success("Both sides image downloaded!", { id: toastId });
            } else if (format === "print") {
                await printIdCardDirectly(
                    frontExportRef.current,
                    backExportRef.current,
                    `${studentTitle} - ID Card`
                );
                toast.success("Print dialog opened!", { id: toastId });
            }
        } catch (err) {
            console.error("Failed to export pixel-perfect ID card:", err);
            toast.error("Frontend generation failed. Downloading fallback PDF...", { id: toastId });
            // Fallback to backend download
            try {
                const res = await IdCardApi.download(id);
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;
                link.download = `id-card-${snapshot?.reg_no ?? id}.pdf`;
                link.click();
                window.URL.revokeObjectURL(url);
            } catch {
                toast.error("Download failed completely.");
            }
        } finally {
            setExportingType(null);
        }
    };

    const actionButtons = (
        <>
            <DropdownMenu>
                <div className="inline-flex rounded-lg shadow-sm">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleFrontendDownload("cr80-pdf")}
                        disabled={!!exportingType}
                        className="rounded-r-none pr-3 font-semibold cursor-pointer"
                    >
                        {exportingType === "cr80-pdf" ? (
                            <Loader2 className="size-4 animate-spin mr-1.5" />
                        ) : (
                            <Download className="size-4 mr-1.5" />
                        )}
                        <span>{CONTENT.downloadBtn}</span>
                    </Button>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="default"
                            size="sm"
                            className="rounded-l-none border-l border-primary-foreground/20 px-2 cursor-pointer"
                            disabled={!!exportingType}
                        >
                            <ChevronDown className="size-3.5" />
                        </Button>
                    </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent align="end" className="w-64 p-1.5">
                    <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">
                        Pixel-Perfect PDF
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => handleFrontendDownload("cr80-pdf")}
                        className="cursor-pointer py-2 rounded-md"
                    >
                        <CreditCard className="size-4 mr-2.5 text-primary shrink-0" />
                        <div className="flex flex-col">
                            <span className="font-semibold text-xs">Standard ID Card (CR80)</span>
                            <span className="text-[10px] text-muted-foreground">54×86mm plastic card ready</span>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleFrontendDownload("a4-pdf")}
                        className="cursor-pointer py-2 rounded-md"
                    >
                        <FileText className="size-4 mr-2.5 text-indigo-500 shrink-0" />
                        <div className="flex flex-col">
                            <span className="font-semibold text-xs">A4 Sheet with Cut Marks</span>
                            <span className="text-[10px] text-muted-foreground">Side-by-side for lamination</span>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">
                        High-Res Images (300 DPI)
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => handleFrontendDownload("png-both")}
                        className="cursor-pointer text-xs py-1.5 rounded-md font-medium"
                    >
                        <ImageIcon className="size-4 mr-2.5 text-emerald-500 shrink-0" />
                        Both Sides Image (PNG)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleFrontendDownload("png-front")}
                        className="cursor-pointer text-xs py-1.5 rounded-md font-medium"
                    >
                        <ImageIcon className="size-4 mr-2.5 text-blue-500 shrink-0" />
                        Front Side Image (PNG)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleFrontendDownload("png-back")}
                        className="cursor-pointer text-xs py-1.5 rounded-md font-medium"
                    >
                        <ImageIcon className="size-4 mr-2.5 text-cyan-500 shrink-0" />
                        Back Side Image (PNG)
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                        onClick={() => handleFrontendDownload("print")}
                        className="cursor-pointer text-xs py-1.5 rounded-md font-medium"
                    >
                        <Printer className="size-4 mr-2.5 text-amber-500 shrink-0" />
                        Print ID Card Directly
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button
                variant="outline"
                size="sm"
                onClick={() => regenerateMutation.mutate()}
                disabled={regenerateMutation.isPending}
            >
                {regenerateMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    <RefreshCcw className="size-4" />
                )}
                <span>{CONTENT.regenerateBtn}</span>
            </Button>
            {card?.status !== "revoked" && (
                <Button variant="destructive" size="sm" onClick={() => revokeDisclosure.onOpen()}>
                    <Ban className="size-4" />
                    <span>{CONTENT.revokeBtn}</span>
                </Button>
            )}
        </>
    );

    if (isLoading) {
        return (
            <>
                <Head title={CONTENT.title} />
                <div className="w-full space-y-6">
                    <Skeleton className="h-20 w-full" />
                    <div className="grid gap-6 xl:grid-cols-2">
                        <Skeleton className="h-[480px]" />
                        <div className="space-y-6">
                            <Skeleton className="h-64" />
                            <Skeleton className="h-64" />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (isError || !card) {
        return (
            <>
                <Head title={CONTENT.title} />
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        ID card not found or you don&apos;t have access.
                    </CardContent>
                </Card>
            </>
        );
    }

    const holderName = getSnapshotFieldValue("name", snapshot, card) || CONTENT.title;

    return (
        <>
            <Head title={`${holderName} – ID Card`} />
            <ConfirmDialog
                open={revokeDisclosure.isOpen}
                onOpenChange={revokeDisclosure.onClose}
                title="Revoke ID Card"
                description={`Are you sure you want to revoke the card for "${holderName}"? This cannot be undone.`}
                onConfirm={() => revokeMutation.mutate()}
                isLoading={revokeMutation.isPending}
                confirmText="Revoke"
                variant="danger"
                confirmationKeyword="REVOKE"
            />

            <div className="w-full space-y-6">
                <MainPageHeader
                    id="show-card-header"
                    breadcrumbs={breadcrumbs}
                    icon={IdCardIcon}
                    title={holderName}
                    subtitle={CONTENT.subtitle}
                >
                    <div className="flex flex-wrap items-center justify-end gap-2">
                        {actionButtons}
                    </div>
                </MainPageHeader>

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card className="overflow-hidden flex flex-col min-h-[480px]">
                        <CardHeader className="pb-3 border-b border-border/50">
                            <CardTitle className="text-base">Card Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 min-h-[420px] bg-muted/10">
                            <CardPreviewStage
                                templateData={templatePreviewData}
                                frontFields={frontFields}
                                backFields={backFields}
                                studentData={holderData}
                                studentName={String(snapshot.name ?? "")}
                                verificationUrl={card?.verification_url}
                            />
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Card Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="shrink-0">
                                        <div className="relative w-24 h-32 rounded-lg overflow-hidden bg-muted flex items-center justify-center text-muted-foreground text-xs border shadow-sm">
                                            <span>No Photo</span>
                                            {card?.photo_url && (
                                                <img
                                                    src={R2Api.imageSrc(card.photo_url)}
                                                    alt="Card holder photo"
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="min-w-0 space-y-1">
                                        <p className="font-semibold text-lg truncate">
                                            {getSnapshotFieldValue("name", snapshot, card) || "—"}
                                        </p>
                                        <p className="text-sm font-mono text-primary font-bold">
                                            {getSnapshotFieldValue("reg_no", snapshot, card) || "—"}
                                        </p>
                                        {template?.name && (
                                            <p className="text-xs text-muted-foreground">Template: {template.name}</p>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                                    <div className="flex justify-between gap-3 sm:flex-col sm:justify-start">
                                        <span className="text-muted-foreground">Status</span>
                                        <Badge variant={CARD_STATUS_VARIANT[card?.status] ?? "outline"} className="capitalize w-fit">
                                            {card?.status ?? "—"}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between gap-3 sm:flex-col sm:justify-start">
                                        <span className="text-muted-foreground">Type</span>
                                        <Badge variant="outline" className="capitalize w-fit">{card?.card_type ?? "—"}</Badge>
                                    </div>
                                    <div className="flex justify-between gap-3 sm:flex-col sm:justify-start">
                                        <span className="text-muted-foreground">Session</span>
                                        <span className="font-medium">{card?.session?.name ?? "—"}</span>
                                    </div>
                                    <div className="flex justify-between gap-3 sm:flex-col sm:justify-start">
                                        <span className="text-muted-foreground">Valid From</span>
                                        <span className="font-medium">{formatDate(card?.valid_from)}</span>
                                    </div>
                                    <div className="flex justify-between gap-3 sm:flex-col sm:justify-start sm:col-span-2">
                                        <span className="text-muted-foreground">Valid Until</span>
                                        <span className="font-medium">{formatDate(card?.valid_until)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Snapshot Data</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Each
                                        of={detailFields}
                                        render={(field) => {
                                            const Icon = field.icon;
                                            const value = getSnapshotFieldValue(field.key, snapshot, card);
                                            return (
                                                <div
                                                    key={field.key}
                                                    className={cn(
                                                        "flex items-start gap-3 p-3 rounded-lg border",
                                                        value ? "bg-muted/5" : "bg-muted/20 opacity-70",
                                                    )}
                                                >
                                                    <Icon className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                                    <div className="min-w-0">
                                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{field.label}</p>
                                                        <p className="text-sm font-medium break-words">{value || "—"}</p>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Hidden Off-Screen Container for 100% Pixel-Perfect Export */}
            {templatePreviewData && (
                <div
                    aria-hidden="true"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: "-9999px",
                        opacity: 0,
                        pointerEvents: "none",
                        zIndex: -9999,
                    }}
                >
                    <IdCardFront
                        ref={frontExportRef}
                        data={templatePreviewData}
                        selectedFields={frontFields}
                        studentData={holderData}
                        verificationUrl={card?.verification_url}
                        noShadow
                    />
                    <IdCardBack
                        ref={backExportRef}
                        data={templatePreviewData}
                        selectedFields={backFields}
                        studentData={holderData}
                        verificationUrl={card?.verification_url}
                        noShadow
                    />
                </div>
            )}
        </>
    );
};

ShowCard.layoutProps = {
    backHref: "/certificates/id-cards",
    backLabel: ID_CARD_CONTENT.editor.backBtn,
};

export default ShowCard;
