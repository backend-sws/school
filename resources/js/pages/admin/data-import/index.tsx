import { useState, useCallback, useMemo } from 'react';
import SettingsLayout from "@/layouts/settings/layout";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";


import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Head, Link } from "@inertiajs/react";
import {
    Building2,
    GraduationCap,
    BookOpen,
    Users,
    UserCog,
    IndianRupee,
    Download,
    Upload,
    FileSpreadsheet,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Clock,
    Loader2,
    ArrowUpFromLine,
    History,
    Receipt,
    Database,
    PackageCheck,
    Coins,
    UserCheck,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BulkImportApi, {
    type ImportModule,
    type ImportResult,
} from "@/lib/api/bulkImportApi";
import { DATA_IMPORT_CATEGORIES, getCategoryLabel, getCategoryDescription, getCategoriesForInstitution } from "@/constants/onboarding/dataImportConfig";
import { useInstitution } from "@/hooks/use-institution";
import { toast } from "sonner";
import { BULK_IMPORT_CONTENT } from '@/constants/content/bulkImport';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRegisterGuide } from '@/components/GuideProvider';
import { DATA_IMPORT_GUIDE } from "@/constants/guides/dataImport";
import Each from '@/components/Each';

/* ──────────── Icon Map ──────────── */
const ICON_MAP: Record<string, React.ElementType> = {
    Building2,
    GraduationCap,
    BookOpen,
    Users,
    UserCog,
    IndianRupee,
    Receipt,
    UserCheck,
};

/* ──────────── Breadcrumbs ──────────── */
const BREADCRUMBS = [
    { title: "Settings", href: "/settings/profile" },
    { title: "Data Import", href: "/admin/data-import" },
];

/* ──────────── Module Card ──────────── */
const ModuleCard = ({
    mod,
    onUpload,
    onAutoSeed,
    isUploading,
    isSeeding,
    uploadingModule,
    seedingModule,
    institutionType,
}: {
    mod: ImportModule;
    onUpload: (module: string, file: File) => void;
    onAutoSeed: (module: string) => void;
    isUploading: boolean;
    isSeeding: boolean;
    uploadingModule: string | null;
    seedingModule: string | null;
    institutionType: string;
}) => {
    const Icon = ICON_MAP[mod.icon] || FileSpreadsheet;
    const isThisUploading = isUploading && uploadingModule === mod.key;
    const isThisSeeding = isSeeding && seedingModule === mod.key;

    // Scope-type-aware: check dataImportConfig for this module key
    const importConfig = DATA_IMPORT_CATEGORIES.find(c => c.key === mod.key);
    const canAutoSeed = !!(importConfig?.canAutoSeed && (
        importConfig.appliesTo.includes("all") ||
        importConfig.appliesTo.includes(institutionType as any)
    ));

    // Scope-type-aware label and description
    const displayLabel = importConfig ? getCategoryLabel(importConfig, institutionType) : mod.name;
    const displayDescription = importConfig ? getCategoryDescription(importConfig, institutionType) : mod.description;

    const handleDownloadTemplate = async () => {
        try {
            const response = await BulkImportApi.downloadTemplate(mod.key);
            const blob = new Blob([(response as any).data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `import_template_${mod.key}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success(BULK_IMPORT_CONTENT.toast.template_downloaded);
        } catch {
            toast.error(BULK_IMPORT_CONTENT.toast.template_failed);
        }
    };

    const handleFileSelect = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".xlsx,.xls,.csv";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                onUpload(mod.key, file);
            }
        };
        input.click();
    };

    return (
        <Card
            id={mod.key === 'departments' ? 'module-card-departments' : undefined}
            className={`group hover:shadow-md transition-all duration-200 border-border/40 hover:border-primary/20 relative overflow-hidden bg-card/40 backdrop-blur-sm ${mod.key === 'departments' ? 'module-card-departments' : ''}`}
        >
            <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                        <Icon className="size-5" />
                    </div>
                    {mod.depends_on.length > 0 && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-medium bg-muted/50 text-muted-foreground/80 hover:bg-muted">
                                        Dependencies
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">
                                    Requires: {mod.depends_on.join(", ")}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>

                <div className="space-y-1">
                    <h4 className="font-semibold text-sm tracking-tight">{displayLabel}</h4>
                    <p className="text-xs text-muted-foreground leading-normal line-clamp-2 min-h-[2.5rem]">
                        {displayDescription}
                    </p>
                </div>

                <div className="flex gap-2 pt-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-[11px] h-8 bg-muted/30 hover:bg-muted/50"
                        onClick={handleDownloadTemplate}
                    >
                        <Download className="size-3 mr-1.5" />
                        Template
                    </Button>
                    <Button
                        size="sm"
                        className="flex-1 text-[11px] h-8 shadow-sm group-hover:shadow-md transition-shadow"
                        onClick={handleFileSelect}
                        disabled={isThisUploading || isThisSeeding}
                    >
                        {isThisUploading ? (
                            <Loader2 className="size-3 mr-1.5 animate-spin" />
                        ) : (
                            <Upload className="size-3 mr-1.5" />
                        )}
                        {isThisUploading ? "Wait…" : "Upload"}
                    </Button>
                </div>
                {canAutoSeed && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-[11px] h-8 border-dashed border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 transition-all"
                        onClick={() => onAutoSeed(mod.key)}
                        disabled={isThisSeeding || isThisUploading}
                    >
                        {isThisSeeding ? (
                            <Loader2 className="size-3 mr-1.5 animate-spin" />
                        ) : (
                            <Database className="size-3 mr-1.5" />
                        )}
                        {isThisSeeding ? "Seeding…" : "Auto Seed Defaults"}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

/* ──────────── Result Banner ──────────── */
const ImportResultBanner = ({
    result,
    onDismiss,
}: {
    result: ImportResult;
    onDismiss: () => void;
}) => {
    const hasErrors = (result.errors ?? 0) > 0;
    const hasWarnings = (result.skipped ?? 0) > 0;
    const isSuccess = (result.imported ?? 0) > 0 && !hasErrors;

    return (
        <Card className={`overflow-hidden border-none shadow-sm ${hasErrors ? "bg-destructive/5 text-destructive" : hasWarnings ? "bg-amber-500/5 text-amber-700" : "bg-emerald-500/5 text-emerald-700"}`}>
            <div className={`h-1 w-full ${hasErrors ? "bg-destructive/40" : hasWarnings ? "bg-amber-500/40" : "bg-emerald-500/40"}`} />
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        <div className={`p-1.5 rounded-full mt-0.5 shrink-0 ${hasErrors ? "bg-destructive/10" : hasWarnings ? "bg-amber-500/10" : "bg-emerald-500/10"}`}>
                            {hasErrors ? (
                                <XCircle className="size-4" />
                            ) : isSuccess ? (
                                <CheckCircle2 className="size-4" />
                            ) : (
                                <AlertTriangle className="size-4" />
                            )}
                        </div>
                        <div className="space-y-1 flex-1">
                            <p className="font-semibold text-sm">
                                {result.module.replace("_", " ")} Import Completed
                            </p>
                            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs font-medium">
                                <span className="flex items-center gap-1.5 opacity-90">
                                    <CheckCircle2 className="size-3" />
                                    {result.imported} imported
                                </span>
                                {result.skipped > 0 && (
                                    <span className="flex items-center gap-1.5 opacity-90">
                                        <AlertTriangle className="size-3" />
                                        {result.skipped} skipped
                                    </span>
                                )}
                                {result.errors > 0 && (
                                    <span className="flex items-center gap-1.5 opacity-90">
                                        <XCircle className="size-3" />
                                        {result.errors} errors
                                    </span>
                                )}
                            </div>
                            {result.error_details && result.error_details.length > 0 && (
                                <div className="mt-3 p-3 rounded-lg bg-background/50 border border-current/10 max-h-40 overflow-y-auto">
                                    <p className="text-[11px] font-bold mb-1.5 uppercase tracking-wider opacity-60">Error logs</p>
                                    <ul className="text-[11px] space-y-1 opacity-80 list-disc list-inside leading-relaxed">
                                        {result.error_details.slice(0, 10).map((err, i) => (
                                            <li key={i}>{err}</li>
                                        ))}
                                        {result.error_details && result.error_details.length > 10 && (
                                            <li className="list-none text-muted-foreground pt-1">
                                                …and {result.error_details.length - 10} more errors
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onDismiss} className="text-xs shrink-0 hover:bg-current/5">
                        Dismiss
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

/* ──────────── Category Section ──────────── */
const ModuleGrid = ({ title, icon: Icon, modules, onUpload, onAutoSeed, isPending, isSeeding, uploadingModule, seedingModule, institutionType }: {
    title: string;
    icon: React.ElementType;
    modules: ImportModule[];
    onUpload: (module: string, file: File) => void;
    onAutoSeed: (module: string) => void;
    isPending: boolean;
    isSeeding: boolean;
    uploadingModule: string | null;
    seedingModule: string | null;
    institutionType: string;
}) => {
    if (modules.length === 0) return null;
    return (
        <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 px-1">
                <Icon className="size-3.5" />
                {title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <Each
                    of={modules}
                    keyExtractor={(mod) => String(mod.key)}
                    render={(mod) => (
                    <ModuleCard
                        key={mod.key}
                        mod={mod}
                        onUpload={onUpload}
                        onAutoSeed={onAutoSeed}
                        isUploading={isPending}
                        isSeeding={isSeeding}
                        uploadingModule={uploadingModule}
                        seedingModule={seedingModule}
                        institutionType={institutionType}
                    />
                )}
                />
            </div>
        </div>
    );
};

/* ──────────── Status Styles ──────────── */
const statusConfig: Record<string, { icon: React.ElementType; className: string }> = {
    completed: { icon: CheckCircle2, className: "text-emerald-600 bg-emerald-500/10" },
    processing: { icon: Loader2, className: "text-blue-500 bg-blue-500/10 animate-spin" },
    failed: { icon: XCircle, className: "text-destructive bg-destructive/10" },
    pending: { icon: Clock, className: "text-muted-foreground bg-muted/20" },
};

/* ──────────── Main Page ──────────── */
const DataImportPage = () => {
    const queryClient = useQueryClient();
    const [lastResult, setLastResult] = useState<ImportResult | null>(null);
    const [uploadingModule, setUploadingModule] = useState<string | null>(null);
    const [seedingModule, setSeedingModule] = useState<string | null>(null);
const { institution } = useInstitution();
    const institutionType = (institution as any)?.type ?? "school";
    useRegisterGuide(DATA_IMPORT_GUIDE);

    // Fetch available modules
    const { data: modulesData } = useQuery({
        queryKey: ["import-modules"],
        queryFn: () => BulkImportApi.getModules(),
    });

    // Upload mutation
    const uploadMutation = useMutation({
        mutationFn: ({ module, file }: { module: string; file: File }) =>
            BulkImportApi.upload(module, file),
        onMutate: ({ module }) => {
            setUploadingModule(module);
        },
        onSuccess: (response: any) => {
            const result = response.data?.data as ImportResult;
            const message = response.data?.message;

            // Only set lastResult if it's a non-queued status (processed immediately or from history)
            if ((result as any)?.status !== 'queued') {
                setLastResult(result);
            }

            setUploadingModule(null);
            queryClient.invalidateQueries({ queryKey: ["import-history"] });

            // Show appropriate toast based on import status
            if ((result as any)?.status === 'queued') {
                toast.success(BULK_IMPORT_CONTENT.toast.upload_queued);
            } else if (result?.imported > 0) {
                toast.success(BULK_IMPORT_CONTENT.toast.import_completed(result.module, result.imported));
            } else if (message) {
                toast.success(message);
            } else {
                toast.success(BULK_IMPORT_CONTENT.toast.upload_queued);
            }
        },
        onError: (err: any) => {
            setUploadingModule(null);
            const msg = err?.response?.data?.message || "Import failed";
            toast.error(msg);
        },
    });

    // Auto-seed mutation
    const seedMutation = useMutation({
        mutationFn: (moduleKey: string) => BulkImportApi.autoSeed(moduleKey),
        onMutate: (moduleKey) => {
            setSeedingModule(moduleKey);
        },
        onSuccess: (response) => {
            const data = (response as any).data;
            setSeedingModule(null);
            const count = data?.count ?? 0;
            if (count > 0) {
                toast.success(BULK_IMPORT_CONTENT.toast.auto_seed_success(count));
            } else {
                toast.info(BULK_IMPORT_CONTENT.toast.auto_seed_none);
            }
        },
        onError: (err: any) => {
            setSeedingModule(null);
            const msg = err?.response?.data?.message || BULK_IMPORT_CONTENT.toast.auto_seed_failed;
            toast.error(msg);
        },
    });

    const handleUpload = useCallback(
        (module: string, file: File) => {
            uploadMutation.mutate({ module, file });
        },
        [uploadMutation],
    );

    const handleAutoSeed = useCallback(
        (module: string) => {
            seedMutation.mutate(module);
        },
        [seedMutation],
    );

    const modules: ImportModule[] = (modulesData as any)?.data ?? [];

    // Filter by institution type: only show categories applicable to this scope
    const applicableKeys = new Set(getCategoriesForInstitution(institutionType).map(c => c.key));

    const groupedModules = useMemo(() => {
        const backbone = ["departments", "streams", "subjects"];
        const humanRes = ["students", "existing_students", "staff"];
        const finance = ["fee_types", "fee_profiles", "fee_payments"];

        const filtered = modules.filter(m => applicableKeys.has(m.key));

        return {
            backbone: filtered.filter(m => backbone.includes(m.key)),
            humanRes: filtered.filter(m => humanRes.includes(m.key)),
            finance: filtered.filter(m => finance.includes(m.key)),
        };
    }, [modules, institutionType]);

    return (
        <>
            <Head title="Data Import Center" />
            <SettingsLayout>
                <PageContainer maxWidth="full">
                    <div className="space-y-8">
                        {/* HeaderSection */}
                        <div className="space-y-6" id="data-import-header">
                            <div className="flex items-start justify-between">
                                <MainPageHeader
                                    breadcrumbs={BREADCRUMBS}
                                    icon={Upload}
                                    title="Data Import Center"
                                    subtitle="Streamline your institutional onboarding by bulk importing infrastructure, users, and financial settings."
                                    tip="Follow the suggested order: first set up Academics, then import People, and finally configure Finances. Always download the latest template to ensure field compatibility."
                                />
                                <Button variant="outline" size="sm" asChild className="gap-2 text-xs font-semibold shadow-sm" id="view-full-history-btn">
                                <Link href="/admin/analytics/import-logs">
                                    <History className="size-3.5 text-primary" />
                                    View Full History
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Result Alerts */}
                    {lastResult && (
                        <div className="px-1 animate-in fade-in slide-in-from-top-4 duration-300">
                            <ImportResultBanner
                                result={lastResult}
                                onDismiss={() => setLastResult(null)}
                            />
                        </div>
                    )}

                    {/* Categorized Grids */}
                    <div className="space-y-12">
                        <div id="academic-backbone-section">
                            <ModuleGrid
                                title="Academic Backbone"
                                icon={Database}
                                modules={groupedModules.backbone}
                                onUpload={handleUpload}
                                onAutoSeed={handleAutoSeed}
                                isPending={uploadMutation.isPending}
                                isSeeding={seedMutation.isPending}
                                uploadingModule={uploadingModule}
                                seedingModule={seedingModule}
                                institutionType={institutionType}
                            />
                        </div>

                        <ModuleGrid
                            title="People & Profiles"
                            icon={PackageCheck}
                            modules={groupedModules.humanRes}
                            onUpload={handleUpload}
                            onAutoSeed={handleAutoSeed}
                            isPending={uploadMutation.isPending}
                            isSeeding={seedMutation.isPending}
                            uploadingModule={uploadingModule}
                            seedingModule={seedingModule}
                            institutionType={institutionType}
                        />

                        <ModuleGrid
                            title="Finance & Fees"
                            icon={Coins}
                            modules={groupedModules.finance}
                            onUpload={handleUpload}
                            onAutoSeed={handleAutoSeed}
                            isPending={uploadMutation.isPending}
                            isSeeding={seedMutation.isPending}
                            uploadingModule={uploadingModule}
                            seedingModule={seedingModule}
                            institutionType={institutionType}
                        />
                    </div>

                </div>
            </PageContainer>
            </SettingsLayout>
        </>
    );
};

export default DataImportPage;
