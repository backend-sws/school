import { Head } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { IdCardVerifyApi } from "@/lib/api/idCardApi";
import { IdCardQueryKeys } from "@/lib/querykey/idCard";
import { ID_CARD_CONTENT } from "@/constants/idCard/formConfig";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle, Shield, Loader2 } from "lucide-react";
import Each from "@/components/Each";
import { ComponentType } from "react";

const { verify: CONTENT } = ID_CARD_CONTENT;

// ─── Status config map (hashmap over if-chains — Rule 19) ────────────────────
const STATUS_CONFIG: Record<string, { icon: ComponentType<{ className?: string }>; color: string }> = {
    generated: { icon: CheckCircle, color: "text-green-600" },
    printed: { icon: CheckCircle, color: "text-green-600" },
    revoked: { icon: XCircle, color: "text-red-600" },
    expired: { icon: AlertTriangle, color: "text-yellow-600" },
};

// ─── Detail row config ─────────────────────────────────────────────────────
const VERIFY_DETAIL_FIELDS = [
    { key: "stream", label: "Stream" },
    { key: "department", label: "Department" },
    { key: "session", label: "Session" },
    { key: "valid_from", label: "Valid From" },
    { key: "valid_until", label: "Valid Until" },
];

const VerifyIdCard = ({ token }: { token: string }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: IdCardQueryKeys.verify(token),
        queryFn: () => IdCardVerifyApi.verify(token),
    });

    const card = data?.data;
    const statusInfo = card ? STATUS_CONFIG[card.status] ?? STATUS_CONFIG.expired : null;
    const StatusIcon = statusInfo?.icon;
    const statusLabel = card ? (CONTENT.statusLabels[card.status] ?? card.status) : "";

    return (
        <>
            <Head title={CONTENT.title} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center pb-2">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Shield className="size-6 text-blue-600" />
                            <CardTitle className="text-lg">{CONTENT.title}</CardTitle>
                        </div>
                        {card?.institution && (
                            <div className="flex flex-col items-center gap-1">
                                {card.institution.logo && (
                                    <img src={card.institution.logo} alt="logo" className="h-12 w-auto" />
                                )}
                                <p className="text-sm font-medium text-muted-foreground">{card.institution.name}</p>
                            </div>
                        )}
                    </CardHeader>

                    <CardContent>
                        {/* Loading */}
                        {isLoading && (
                            <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
                                <Loader2 className="size-8 animate-spin" />
                                <p className="text-sm">Verifying...</p>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="text-center py-8">
                                <XCircle className="size-12 mx-auto text-red-500 mb-2" />
                                <p className="text-red-600 font-medium">{CONTENT.invalidMessage}</p>
                            </div>
                        )}

                        {/* Verified */}
                        {card && (
                            <div className="space-y-4">
                                {/* Status Banner */}
                                <div className="flex items-center justify-center gap-2 py-3 rounded-lg bg-muted/50">
                                    {StatusIcon && <StatusIcon className={`size-5 ${statusInfo?.color}`} />}
                                    <span className={`font-semibold ${statusInfo?.color}`}>{statusLabel}</span>
                                </div>

                                {/* Photo + Identity */}
                                <div className="flex items-center gap-4">
                                    {card.photo_url ? (
                                        <img
                                            src={card.photo_url}
                                            alt="Photo"
                                            className="w-16 h-20 rounded-md object-cover border"
                                        />
                                    ) : (
                                        <div className="w-16 h-20 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                            No Photo
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-lg">{card.name}</p>
                                        <p className="text-sm font-mono text-muted-foreground">{card.reg_no}</p>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <Each
                                        of={VERIFY_DETAIL_FIELDS.filter((f) => !!card[f.key])}
                                        render={(field) => (
                                            <div key={field.key}>
                                                <p className="text-muted-foreground">{field.label}</p>
                                                <p className="font-medium">{card[field.key]}</p>
                                            </div>
                                        )}
                                    />
                                    <div>
                                        <p className="text-muted-foreground">Type</p>
                                        <Badge variant="outline" className="capitalize">{card.card_type}</Badge>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default VerifyIdCard;
