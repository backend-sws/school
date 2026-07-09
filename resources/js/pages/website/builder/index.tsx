import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Paintbrush,
    GripVertical,
    Eye,
    EyeOff,
    Check,
    ExternalLink,
    Palette,
    LayoutDashboard,
    Lightbulb,
    Settings,
    Save,
} from "lucide-react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { BUILDER_BREADCRUMBS } from "@/constants/page/admin/websiteBuilder";
import WebsiteBuilderApi from "@/lib/api/websiteBuilderApi";
import { WebsiteBuilderQueryKeys } from "@/lib/querykey/websiteBuilder";
import { LANDING_SECTIONS, type SectionMeta } from "@/constants/landing/sections";
import { useLayoutContext } from "@/lib/layout-resolver";
import Each from "@/components/Each";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { STATIC_THEMES } from "@/constants/website/themes";
import type { SharedData } from "@/types";

// ─── Types ─────────────────────────────────────────────────────
interface ThemeData {
    id: number;
    slug: string;
    name: string;
    category: string;
    description: string | null;
    preview_colors: string[] | null;
    preview_image: string | null;
    is_active: boolean;
}

interface SectionOrderItem {
    section_id: string;
    sort_order: number;
    is_visible: boolean;
    custom_props: Record<string, any> | null;
}

// ─── Category Labels ───────────────────────────────────────────
const CATEGORY_LABELS: Record<string, { label: string; description: string }> = {
    core: { label: "Core Themes", description: "Curated palettes for different institution vibes" },
    brand: { label: "Brand Palettes", description: "Bold identity colors for brand differentiation" },
    festival: { label: "Festival & Occasions", description: "Seasonal themes for cultural celebrations" },
};

const CATEGORY_ORDER = ["core", "brand", "festival"];

// ─── Theme Swatch Component ───────────────────────────────────
function ThemeSwatch({ colors }: { colors: string[] | null }) {
    const swatches = colors ?? ["#6366f1", "#8b5cf6", "#c4b5fd"];
    return (
        <div className="h-20 relative overflow-hidden rounded-t-lg"
             style={{
                 background: `linear-gradient(135deg, ${swatches[0]} 0%, ${swatches[1] ?? swatches[0]} 50%, ${swatches[2] ?? swatches[0]} 100%)`,
             }}
        >
            {/* Mini preview elements */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-80">
                <div className="h-2.5 w-10 rounded-full bg-white/40" />
                <div className="h-2.5 w-6 rounded-full bg-white/25" />
                <div className="h-2.5 w-4 rounded-full bg-white/15" />
            </div>
        </div>
    );
}

// ─── Builder Page ──────────────────────────────────────────────
export default function WebsiteBuilderPage() {
    const queryClient = useQueryClient();
    const { institutionType } = useLayoutContext();
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [pendingSections, setPendingSections] = useState<Array<SectionMeta & { sort_order: number; is_visible: boolean }> | null>(null);
    const { institution } = usePage<{ props: SharedData }>().props as unknown as SharedData;

    // Track active theme locally for optimistic UI
    const [activeSlug, setActiveSlug] = useState<string>(
        () => institution?.brand_theme ?? document.documentElement.getAttribute("data-theme") ?? "royal"
    );

    // ── Fetch Themes ──────────────────────────────────────
    const { data: themesData, isLoading: themesLoading } = useQuery({
        queryKey: WebsiteBuilderQueryKeys.themes(),
        queryFn: () => WebsiteBuilderApi.themes().then((r) => r.data),
    });

    // ── Fetch Section Order ──────────────────────────────
    const { data: sectionsData, isLoading: sectionsLoading } = useQuery({
        queryKey: WebsiteBuilderQueryKeys.sections("home"),
        queryFn: () => WebsiteBuilderApi.sections("home").then((r) => r.data),
    });

    // ── Activate Theme Mutation ──────────────────────────
    const activateThemeMutation = useMutation({
        mutationFn: (slug: string) => WebsiteBuilderApi.activateTheme(slug),
        onMutate: (slug) => {
            // Instant DOM update — apply theme immediately for real-time preview
            document.documentElement.setAttribute("data-theme", slug);
            setActiveSlug(slug);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WebsiteBuilderQueryKeys.themes() });
            // Soft-reload Inertia shared props so ThemeRoot stays in sync
            router.reload({ only: ["institution"] });
            toast.success("Theme applied successfully!");
        },
        onError: (err: any, _slug, _ctx) => {
            // Revert DOM to previous theme on failure
            const prev = institution?.brand_theme ?? "royal";
            document.documentElement.setAttribute("data-theme", prev);
            setActiveSlug(prev);
            queryClient.invalidateQueries({ queryKey: WebsiteBuilderQueryKeys.themes() });
            const validationErrors = err?.response?.data?.errors;
            const apiMessage = err?.response?.data?.message;
            let toastMessage = "Failed to activate theme.";
            if (validationErrors && typeof validationErrors === "object") {
                const firstMsg = Object.values(validationErrors).flat()[0];
                if (firstMsg) toastMessage = String(firstMsg);
            } else if (apiMessage) {
                toastMessage = apiMessage;
            }
            toast.error(toastMessage);
        },
    });

    // ── Toggle Section Mutation ──────────────────────────
    const toggleMutation = useMutation({
        mutationFn: ({ sectionId, isVisible }: { sectionId: string; isVisible: boolean }) =>
            WebsiteBuilderApi.toggleSection("home", sectionId, isVisible),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WebsiteBuilderQueryKeys.sections("home") });
        },
    });

    // ── Reorder Mutation ────────────────────────────────
    const reorderMutation = useMutation({
        mutationFn: (sections: Array<{ section_id: string; sort_order: number; is_visible: boolean }>) =>
            WebsiteBuilderApi.reorderSections("home", sections),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WebsiteBuilderQueryKeys.sections("home") });
            toast.success("Section order saved.");
        },
    });

    // ── Merge DB order with hardcoded defaults ──────────
    const defaultSections = LANDING_SECTIONS[institutionType as keyof typeof LANDING_SECTIONS] ?? LANDING_SECTIONS.college;
    const dbSections: SectionOrderItem[] = sectionsData?.sections ?? [];

    const mergedSections = useMemo(() => {
        if (dbSections.length === 0) {
            return defaultSections.map((s, i) => ({
                ...s,
                sort_order: i,
                is_visible: true,
            }));
        }

        const seen = new Set<string>();
        const result: (SectionMeta & { sort_order: number; is_visible: boolean })[] = [];

        for (const dbItem of dbSections) {
            const meta = defaultSections.find((s) => s.id === dbItem.section_id);
            if (meta) {
                result.push({ ...meta, sort_order: dbItem.sort_order, is_visible: dbItem.is_visible });
                seen.add(dbItem.section_id);
            }
        }

        for (const s of defaultSections) {
            if (!seen.has(s.id)) {
                result.push({ ...s, sort_order: result.length, is_visible: true });
            }
        }

        return result.sort((a, b) => a.sort_order - b.sort_order);
    }, [dbSections, defaultSections]);

    const displaySections = pendingSections ?? mergedSections;

    // ── Group themes by category ────────────────────────
    // Use API themes if available, otherwise fall back to static definitions
    const apiThemes: ThemeData[] = themesData?.themes ?? [];
    const themes: ThemeData[] = useMemo(() => {
        if (apiThemes.length > 0) return apiThemes;
        // Fallback: build ThemeData[] from static constants
        return STATIC_THEMES.map((t, i) => ({
            id: i + 1,
            slug: t.slug,
            name: t.name,
            category: t.category,
            description: t.description,
            preview_colors: t.preview_colors,
            preview_image: null,
            is_active: t.slug === activeSlug,
        }));
    }, [apiThemes, activeSlug]);

    const groupedThemes = useMemo(() => {
        const groups: Record<string, ThemeData[]> = {};
        for (const t of themes) {
            // Use local activeSlug for is_active (optimistic UI)
            const enriched = { ...t, is_active: t.slug === activeSlug };
            const cat = enriched.category || "core";
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(enriched);
        }
        return groups;
    }, [themes, activeSlug]);

    // ── Drag Handlers ───────────────────────────────────
    const handleDragStart = useCallback((index: number) => {
        setDraggedIndex(index);
        setPendingSections([...mergedSections]);
    }, [mergedSections]);

    const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        setPendingSections((prev) => {
            const base = prev ?? mergedSections;
            const updated = [...base];
            const [dragged] = updated.splice(draggedIndex, 1);
            updated.splice(index, 0, dragged);
            return updated;
        });
        setDraggedIndex(index);
    }, [draggedIndex, mergedSections]);

    const handleDragEnd = useCallback(() => {
        if (pendingSections) {
            const changed = pendingSections.some((section, index) => section.id !== mergedSections[index]?.id);
            if (changed) {
                reorderMutation.mutate(
                    pendingSections.map((section, index) => ({
                        section_id: section.id,
                        sort_order: index,
                        is_visible: section.is_visible,
                    })),
                );
            }
        }
        setDraggedIndex(null);
        setPendingSections(null);
    }, [pendingSections, mergedSections, reorderMutation]);

    // ── Toggle Handler ──────────────────────────────────
    const handleToggle = useCallback(
        (sectionId: string, currentlyVisible: boolean) => {
            toggleMutation.mutate({ sectionId, isVisible: !currentlyVisible });
        },
        [toggleMutation]
    );

    return (
        <>
            <Head title="Website Builder" />

            <div className="flex flex-col gap-4 sm:gap-6">
                {/* ── Header ─────────────────────────────────────── */}
                <MainPageHeader
                    breadcrumbs={BUILDER_BREADCRUMBS}
                    icon={Paintbrush}
                    title="Website Builder"
                    subtitle="Customize your institution's public website theme and page layout."
                >
                    <Button variant="outline" size="sm" asChild>
                        <a href="/" target="_blank" rel="noopener noreferrer" className="gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Preview Website
                        </a>
                    </Button>
                </MainPageHeader>

                <div className="space-y-8">
                    {/* ── Theme Picker ────────────────────────────────── */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Palette className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">Choose Theme</h2>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6">
                            Select a visual palette for your public website. Themes are powered by{" "}
                            <code className="text-xs bg-muted px-1 py-0.5 rounded">brand-palettes.css</code>{" "}
                            and apply in both light & dark modes.
                        </p>

                        {themesLoading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                <Each
                                    of={[1, 2, 3, 4, 5]}
                                    keyExtractor={(i) => String(i)}
                                    render={() => (
                                        <div className="h-40 rounded-xl bg-muted animate-pulse" />
                                    )}
                                />
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <Each
                                    of={CATEGORY_ORDER.filter((c) => groupedThemes[c]?.length)}
                                    keyExtractor={(c) => c}
                                    render={(category) => {
                                        const catInfo = CATEGORY_LABELS[category] ?? { label: category, description: "" };
                                        return (
                                            <div>
                                                <div className="mb-3">
                                                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                                                        {catInfo.label}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {catInfo.description}
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                                    <Each
                                                        of={groupedThemes[category]}
                                                        keyExtractor={(t) => t.slug}
                                                        render={(theme) => (
                                                            <Card
                                                                className={`relative overflow-hidden cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary/50 hover:shadow-lg ${
                                                                    theme.is_active ? "ring-2 ring-primary shadow-md" : ""
                                                                }`}
                                                                onClick={() => {
                                                                    if (!theme.is_active) {
                                                                        activateThemeMutation.mutate(theme.slug);
                                                                    }
                                                                }}
                                                            >
                                                                <ThemeSwatch colors={theme.preview_colors} />
                                                                {theme.is_active && (
                                                                    <div className="absolute top-1.5 right-1.5">
                                                                        <Badge variant="default" className="gap-1 text-[10px] px-1.5 py-0.5">
                                                                            <Check className="h-3 w-3" />
                                                                            Active
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                <CardHeader className="p-2.5 pb-0.5">
                                                                    <CardTitle className="text-xs font-semibold">{theme.name}</CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="p-2.5 pt-0">
                                                                    <CardDescription className="text-[10px] leading-relaxed line-clamp-2">
                                                                        {theme.description ?? `${theme.name} palette`}
                                                                    </CardDescription>
                                                                </CardContent>
                                                            </Card>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                            </div>
                        )}
                    </section>

                    {/* ── Section Manager ─────────────────────────────── */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <LayoutDashboard className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">Homepage Sections</h2>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Drag to reorder and toggle to show/hide sections on your landing page.
                        </p>

                        {sectionsLoading ? (
                            <div className="space-y-2">
                                <Each
                                    of={[1, 2, 3, 4, 5]}
                                    keyExtractor={(i) => String(i)}
                                    render={() => (
                                        <div className="h-14 rounded-lg bg-muted animate-pulse" />
                                    )}
                                />
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                <Each
                                    of={displaySections}
                                    keyExtractor={(s) => s.id}
                                    render={(section, index) => (
                                        <div
                                            key={section.id}
                                            draggable
                                            onDragStart={() => handleDragStart(index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDragEnd={handleDragEnd}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg border bg-card transition-all duration-150 ${
                                                draggedIndex === index
                                                    ? "opacity-50 scale-95 border-primary"
                                                    : "hover:bg-accent/50"
                                            } ${!section.is_visible ? "opacity-60" : ""}`}
                                        >
                                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0" />

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium truncate">{section.label}</span>
                                                    <Badge variant="outline" className="text-xs shrink-0">
                                                        {section.layout}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                {section.is_visible ? (
                                                    <Eye className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                )}
                                                <Switch
                                                    checked={section.is_visible}
                                                    onCheckedChange={() => handleToggle(section.id, section.is_visible)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        )}
                    </section>

                    {/* ── Website Config Editor ─────────────────────── */}
                    <NavConfigEditor />

                    {/* ── Tips Card ───────────────────────────────────── */}
                    <Card className="border-dashed border-primary/30 bg-primary/5">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p className="font-medium text-foreground">Pro Tips</p>
                                    <ul className="list-disc ml-4 space-y-0.5">
                                        <li>Themes use <strong>brand-palettes.css</strong> — both light & dark mode covered</li>
                                        <li>Keep your hero section at the top for maximum impact</li>
                                        <li>Show 5-7 sections for a clean, focused homepage</li>
                                        <li>Hidden sections keep their data — toggle back anytime</li>
                                        <li>Preview your website to see changes live</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

// ─── Nav Config Editor (extracted sub-component) ───────────────
function NavConfigEditor() {
    const queryClient = useQueryClient();

    const { data: navData, isLoading: navLoading } = useQuery({
        queryKey: WebsiteBuilderQueryKeys.navConfig(),
        queryFn: () => WebsiteBuilderApi.getNavConfig().then((r) => r.data),
    });

    const [form, setForm] = useState({
        footer_description: "",
        top_bar_tag: "",
        privacy_policy_url: "",
        terms_of_service_url: "",
        sitemap_url: "",
    });

    // Sync form with fetched data
    useEffect(() => {
        if (navData?.config) {
            setForm((prev) => ({
                ...prev,
                footer_description: navData.config.footer_description ?? "",
                top_bar_tag: navData.config.top_bar_tag ?? "",
                privacy_policy_url: navData.config.privacy_policy_url ?? "",
                terms_of_service_url: navData.config.terms_of_service_url ?? "",
                sitemap_url: navData.config.sitemap_url ?? "",
            }));
        }
    }, [navData]);

    const saveMutation = useMutation({
        mutationFn: (data: Record<string, any>) => WebsiteBuilderApi.saveNavConfig(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WebsiteBuilderQueryKeys.navConfig() });
            toast.success("Website config saved.");
        },
        onError: () => toast.error("Failed to save config."),
    });

    const handleChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        saveMutation.mutate(form);
    };

    if (navLoading) {
        return (
            <section>
                <div className="h-8 w-48 bg-muted animate-pulse rounded mb-4" />
                <div className="space-y-3">
                    <div className="h-10 bg-muted animate-pulse rounded" />
                    <div className="h-10 bg-muted animate-pulse rounded" />
                    <div className="h-10 bg-muted animate-pulse rounded" />
                </div>
            </section>
        );
    }

    return (
        <section>
            <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Website Config</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
                Customize your footer description, legal page links, and top bar tag.
                Leave empty to use defaults.
            </p>

            <Card>
                <CardContent className="p-4 sm:p-6 space-y-5">
                    {/* Footer Description */}
                    <div className="space-y-2">
                        <Label htmlFor="footer_description">Footer Description</Label>
                        <Textarea
                            id="footer_description"
                            value={form.footer_description}
                            onChange={(e) => handleChange("footer_description", e.target.value)}
                            placeholder="A premier institution committed to academic excellence..."
                            rows={3}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            Shown below institution name in the footer. Leave empty for auto-generated text.
                        </p>
                    </div>

                    {/* Top Bar Tag */}
                    <div className="space-y-2">
                        <Label htmlFor="top_bar_tag">Top Bar Tag</Label>
                        <Input
                            id="top_bar_tag"
                            value={form.top_bar_tag}
                            onChange={(e) => handleChange("top_bar_tag", e.target.value)}
                            placeholder="e.g. CBSE Affiliated | Govt. of Bihar"
                        />
                        <p className="text-xs text-muted-foreground">
                            Badge shown in the top bar left corner. Leave empty for type default.
                        </p>
                    </div>

                    {/* Legal Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="privacy_policy_url">Privacy Policy URL</Label>
                            <Input
                                id="privacy_policy_url"
                                value={form.privacy_policy_url}
                                onChange={(e) => handleChange("privacy_policy_url", e.target.value)}
                                placeholder="/privacy or https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="terms_of_service_url">Terms of Service URL</Label>
                            <Input
                                id="terms_of_service_url"
                                value={form.terms_of_service_url}
                                onChange={(e) => handleChange("terms_of_service_url", e.target.value)}
                                placeholder="/terms or https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sitemap_url">Sitemap URL</Label>
                            <Input
                                id="sitemap_url"
                                value={form.sitemap_url}
                                onChange={(e) => handleChange("sitemap_url", e.target.value)}
                                placeholder="/sitemap.xml"
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-2">
                        <Button
                            onClick={handleSave}
                            disabled={saveMutation.isPending}
                            className="gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {saveMutation.isPending ? "Saving..." : "Save Config"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
