import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, usePage, router } from "@inertiajs/react";
import { useLayoutContext } from "@/lib/layout-resolver";
import { useInstitution } from "@/hooks/use-institution";
import AppLogoIcon from "@/components/app-logo-icon";
import { ThemeSettings } from "@/components/theme-settings";
import { login, dashboard, logout } from "@/routes";
import { type SharedData } from "@/types";
import { MobileNav } from "@/components/landing/welcome/MobileNav";
import { IconLink } from "@/components/ui/icon-link";
import {
    ChevronDown,
    Menu,
    X,
    ExternalLink,
    UserCog,
    Users,
    GraduationCap,
    Phone,
    Mail,
    LayoutDashboard,
    LogOut,
    Loader2,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

const STUDENT_ROLES = ["student", "candidate"];

/**
 * Public Header — shared across all public/website pages.
 *
 * Renders:
 * 1. Top utility bar (contact + utility links)
 * 2. Important links bar (desktop only)
 * 3. Main header (logo + login CTA)
 * 4. Navigation bar (institution-type-aware menu items)
 *
 * Navigation items come from `useLayoutContext().navItems` which
 * resolves per institution type (school/college/coaching/university).
 */
export function PublicHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { auth } = usePage<SharedData>().props;
    const { name, locationLine, contact } = useInstitution();
    const { navItems, ctaLabel, topBarTag, utilityLinks, importantLinks } = useLayoutContext();
    const isLoggedIn = Boolean(auth?.user);

    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [feedbackForm, setFeedbackForm] = useState({
        name: "",
        mobile: "",
        email: "",
        subject: "",
        message: "",
    });
    const [feedbackErrors, setFeedbackErrors] = useState<Record<string, string>>({});
    const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

    const [grievanceOpen, setGrievanceOpen] = useState(false);
    const [grievanceForm, setGrievanceForm] = useState({
        name: "",
        mobile: "",
        email: "",
        category: "",
        subject: "",
        description: "",
    });
    const [grievanceErrors, setGrievanceErrors] = useState<Record<string, string>>({});
    const [grievanceSubmitting, setGrievanceSubmitting] = useState(false);

    const handleFeedbackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFeedbackErrors({});
        setFeedbackSubmitting(true);
        try {
            await axios.post("/api/v1/public/feedback", {
                ...feedbackForm,
                rating: 5,
            });
            toast.success("Feedback submitted successfully! Thank you.");
            setFeedbackForm({ name: "", mobile: "", email: "", subject: "", message: "" });
            setFeedbackOpen(false);
        } catch (error: any) {
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors || {};
                const formattedErrors: Record<string, string> = {};
                Object.keys(validationErrors).forEach((key) => {
                    formattedErrors[key] = validationErrors[key][0];
                });
                setFeedbackErrors(formattedErrors);
                // Also show first error in toast
                const firstErrorKey = Object.keys(formattedErrors)[0];
                if (firstErrorKey) {
                    toast.error(formattedErrors[firstErrorKey]);
                }
            } else {
                const msg = error.response?.data?.message || "Failed to submit feedback.";
                toast.error(msg);
            }
        } finally {
            setFeedbackSubmitting(false);
        }
    };

    const handleGrievanceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setGrievanceErrors({});
        setGrievanceSubmitting(true);
        try {
            await axios.post("/api/v1/public/grievances", grievanceForm);
            toast.success("Grievance ticket created successfully! We will address it promptly.");
            setGrievanceForm({ name: "", mobile: "", email: "", category: "", subject: "", description: "" });
            setGrievanceOpen(false);
        } catch (error: any) {
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors || {};
                const formattedErrors: Record<string, string> = {};
                Object.keys(validationErrors).forEach((key) => {
                    formattedErrors[key] = validationErrors[key][0];
                });
                setGrievanceErrors(formattedErrors);
                // Also show first error in toast
                const firstErrorKey = Object.keys(formattedErrors)[0];
                if (firstErrorKey) {
                    toast.error(formattedErrors[firstErrorKey]);
                }
            } else {
                const msg = error.response?.data?.message || "Failed to submit grievance.";
                toast.error(msg);
            }
        } finally {
            setGrievanceSubmitting(false);
        }
    };

    const dashboardHref =
        auth?.role && STUDENT_ROLES.includes(auth.role)
            ? "/student-portal/dashboard"
            : dashboard();
    const contactLinks = [
        {
            icon: Phone,
            value: contact.phone || "",
            href: `tel:${(contact.phone || "").replace(/\s/g, "")}`,
            label: "Phone",
        },
        {
            icon: Mail,
            value: contact.email || "",
            href: `mailto:${contact.email || ""}`,
            label: "Email",
        },
    ];

    return (
        <>
            {/* Top Bar */}
            <div className="relative z-20 bg-primary text-primary-foreground text-xs py-1.5 sm:py-2">
                <div className="mx-auto max-w-[1440px] px-3 sm:px-4 md:px-8 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-6 font-medium min-w-0">
                        {topBarTag && (
                            <span className="bg-white/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[9px] font-bold tracking-[0.1em] uppercase shrink-0">
                                {topBarTag}
                            </span>
                        )}
                        {topBarTag && <span className="opacity-20 hidden sm:inline">|</span>}
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            {contactLinks.map((link) => (
                                <IconLink key={link.label} href={link.href} icon={link.icon}>
                                    {link.value}
                                </IconLink>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 font-medium shrink-0">
                        {utilityLinks.map((link) => {
                            const isFeedback = link.label === "Feedback";
                            const isGrievance = link.label === "Grievance";
                            return (
                                <IconLink
                                    key={link.label}
                                    href={isFeedback || isGrievance ? "#" : link.href}
                                    icon={link.icon}
                                    onClick={
                                        isFeedback
                                            ? (e) => {
                                                  e.preventDefault();
                                                  setFeedbackOpen(true);
                                              }
                                            : isGrievance
                                            ? (e) => {
                                                  e.preventDefault();
                                                  setGrievanceOpen(true);
                                              }
                                            : undefined
                                    }
                                >
                                    <span className="hidden sm:inline">{link.label}</span>
                                </IconLink>
                            );
                        })}
                        <span className="opacity-30 hidden sm:inline">|</span>
                        <ThemeSettings />
                    </div>
                </div>
            </div>

            {/* Important Links Bar — hidden when config is empty */}
            {importantLinks.length > 0 && (
                <div className="relative z-20 bg-white dark:bg-card border-b border-border py-2 hidden md:block">
                    <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                    Important Links
                                </span>
                            </div>
                            <div className="flex items-center gap-5 overflow-x-auto scrollbar-hide">
                                {importantLinks.map((link, idx) => (
                                    <div key={link.title} className="flex items-center gap-5">
                                        <a
                                            href={link.url}
                                            target={link.url.startsWith('/') ? undefined : '_blank'}
                                            rel={link.url.startsWith('/') ? undefined : 'noopener noreferrer'}
                                            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-primary whitespace-nowrap transition-colors uppercase tracking-wider"
                                        >
                                            {link.title}
                                            {!link.url.startsWith('/') && (
                                                <ExternalLink className="h-2.5 w-2.5 opacity-40 group-hover:opacity-100" />
                                            )}
                                        </a>
                                        {idx < importantLinks.length - 1 && (
                                            <span className="h-3 w-[1px] bg-border" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Header */}
            <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto max-w-[1440px] px-3 sm:px-4 md:px-8 h-18 sm:h-22 flex items-center justify-between gap-3 sm:gap-6 min-w-0">
                    <Link
                        href="/"
                        className="flex items-center gap-2 sm:gap-4 group min-w-0 shrink"
                    >
                        <div className="p-1 sm:p-1.5 rounded-lg border border-border bg-white dark:bg-card shrink-0">
                            <AppLogoIcon
                                alt={`${name} Logo`}
                                className="h-9 w-9 sm:h-12 sm:w-12 object-contain"
                            />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <h1 className="text-base sm:text-lg md:text-xl font-bold text-foreground leading-tight tracking-tight truncate">
                                {name}
                            </h1>
                            <span className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5 uppercase truncate">
                                {locationLine}
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Login/Account */}
                    <div className="hidden xl:flex items-center gap-4 shrink-0">
                        <div className="relative group">
                            {isLoggedIn ? (
                                <>
                                    <Button
                                        type="button"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-primary/90 hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background h-auto"
                                    >
                                        {auth.user.name}
                                        <ChevronDown className="h-4 w-4 opacity-90 transition-transform duration-200 group-hover:rotate-180" />
                                    </Button>
                                    <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 scale-95 group-hover:scale-100 origin-top-right">
                                        <div className="bg-card rounded-xl border border-border shadow-xl shadow-black/5 min-w-[220px] overflow-hidden">
                                            <div className="px-3 py-2 border-b border-border bg-muted/30">
                                                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Account
                                                </p>
                                            </div>
                                            <div className="p-1.5">
                                                <Link
                                                    href={dashboardHref}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-muted/80 transition-colors focus:outline-none focus:bg-muted/80"
                                                >
                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                        <LayoutDashboard className="h-4 w-4" />
                                                    </span>
                                                    <div className="min-w-0">
                                                        <span className="block text-sm font-semibold text-foreground">
                                                            Dashboard
                                                        </span>
                                                        <span className="block text-xs text-muted-foreground">
                                                            Go to your dashboard
                                                        </span>
                                                    </div>
                                                </Link>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => router.post(logout.url())}
                                                    className="flex w-full items-center justify-start gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-muted/80 transition-colors focus:outline-none focus:bg-muted/80 text-foreground h-auto"
                                                >
                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                                                        <LogOut className="h-4 w-4" />
                                                    </span>
                                                    <div className="min-w-0 text-left">
                                                        <span className="block text-sm font-semibold text-foreground">
                                                            Logout
                                                        </span>
                                                        <span className="block text-xs text-muted-foreground">
                                                            Sign out of your account
                                                        </span>
                                                    </div>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Button
                                        asChild
                                        className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold shadow-sm hover:bg-primary/90 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background h-auto"
                                    >
                                        <Link href={login()}>
                                            Sign In
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex items-center gap-2 sm:gap-3 xl:hidden shrink-0">
                        <ThemeSettings />
                        <Button
                            type="button"
                            variant="ghost"
                            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={mobileMenuOpen}
                            className="p-2.5 rounded-lg hover:bg-muted active:bg-muted transition-colors border border-border touch-manipulation h-auto"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Navigation Bar — uses institution-type-aware navItems */}
            <div className="hidden xl:block border-b border-border/40 bg-card/70 backdrop-blur-lg sticky top-[72px] sm:top-[88px] z-[45]">
                <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                    <nav className="flex items-center justify-center gap-4">
                        {navItems.map((item) => (
                            <div key={item.title} className="relative group">
                                {item.children ? (
                                    <>
                                        <Button variant="ghost" className="flex items-center gap-1 px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary rounded-none h-auto">
                                            {item.title}
                                            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                                        </Button>
                                        <div className="absolute top-full left-0 pt-1 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                            <div className="bg-card rounded-md border border-border shadow-lg p-1.5 flex flex-col">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.title}
                                                        href={child.href}
                                                        className="block px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground hover:text-primary hover:bg-muted rounded transition-colors"
                                                    >
                                                        {child.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="flex items-center px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary"
                                    >
                                        {item.title}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            <MobileNav isOpen={mobileMenuOpen} />

            {/* Feedback Modal */}
            <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
                <DialogContent className="sm:max-w-[550px] p-6 gap-6 rounded-2xl border border-border">
                    <DialogHeader className="space-y-1.5 text-left">
                        <DialogTitle className="text-xl font-bold text-foreground">Share your Feedback</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            We value your suggestions and feedback to improve our services.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="fb-name" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    Full Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="fb-name"
                                    placeholder="John Doe"
                                    value={feedbackForm.name}
                                    onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                                    required
                                    className="h-10 rounded-lg bg-background"
                                />
                                {feedbackErrors.name && (
                                    <p className="text-xs text-destructive mt-1">{feedbackErrors.name}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="fb-mobile" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    Mobile Number <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="fb-mobile"
                                    placeholder="9876543210"
                                    value={feedbackForm.mobile}
                                    onChange={(e) => setFeedbackForm({ ...feedbackForm, mobile: e.target.value })}
                                    required
                                    className="h-10 rounded-lg bg-background"
                                />
                                {feedbackErrors.mobile && (
                                    <p className="text-xs text-destructive mt-1">{feedbackErrors.mobile}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="fb-email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Email Address <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="fb-email"
                                type="email"
                                placeholder="john@example.com"
                                value={feedbackForm.email}
                                onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                                required
                                className="h-10 rounded-lg bg-background w-full"
                            />
                            {feedbackErrors.email && (
                                <p className="text-xs text-destructive mt-1">{feedbackErrors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="fb-subject" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Subject <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="fb-subject"
                                placeholder="Brief summary of your submission"
                                value={feedbackForm.subject}
                                onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                                required
                                className="h-10 rounded-lg bg-background w-full"
                            />
                            {feedbackErrors.subject && (
                                <p className="text-xs text-destructive mt-1">{feedbackErrors.subject}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="fb-message" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Message <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="fb-message"
                                placeholder="Provide detailed information here..."
                                value={feedbackForm.message}
                                onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                                required
                                className="min-h-[100px] rounded-lg bg-background w-full"
                            />
                            {feedbackErrors.message && (
                                <p className="text-xs text-destructive mt-1">{feedbackErrors.message}</p>
                            )}
                        </div>

                        <DialogFooter className="pt-2 sm:space-x-2 flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setFeedbackOpen(false)}
                                className="h-11 px-6 rounded-lg text-sm font-semibold border-border hover:bg-muted"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={feedbackSubmitting}
                                className="h-11 px-6 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-2"
                            >
                                {feedbackSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Submit Now"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Grievance Modal */}
            <Dialog open={grievanceOpen} onOpenChange={setGrievanceOpen}>
                <DialogContent className="sm:max-w-[550px] p-6 gap-6 rounded-2xl border border-border">
                    <DialogHeader className="space-y-1.5 text-left">
                        <DialogTitle className="text-xl font-bold text-foreground">Submit a Grievance</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Submit your grievance and our team will address it promptly.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleGrievanceSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="gr-name" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    Full Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="gr-name"
                                    placeholder="John Doe"
                                    value={grievanceForm.name}
                                    onChange={(e) => setGrievanceForm({ ...grievanceForm, name: e.target.value })}
                                    required
                                    className="h-10 rounded-lg bg-background"
                                />
                                {grievanceErrors.name && (
                                    <p className="text-xs text-destructive mt-1">{grievanceErrors.name}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="gr-mobile" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    Mobile Number
                                </Label>
                                <Input
                                    id="gr-mobile"
                                    placeholder="9876543210"
                                    value={grievanceForm.mobile}
                                    onChange={(e) => setGrievanceForm({ ...grievanceForm, mobile: e.target.value })}
                                    className="h-10 rounded-lg bg-background"
                                />
                                {grievanceErrors.mobile && (
                                    <p className="text-xs text-destructive mt-1">{grievanceErrors.mobile}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="gr-email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Email Address
                            </Label>
                            <Input
                                id="gr-email"
                                type="email"
                                placeholder="john@example.com"
                                value={grievanceForm.email}
                                onChange={(e) => setGrievanceForm({ ...grievanceForm, email: e.target.value })}
                                className="h-10 rounded-lg bg-background w-full"
                            />
                            {grievanceErrors.email && (
                                <p className="text-xs text-destructive mt-1">{grievanceErrors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1.5 flex flex-col">
                            <Label htmlFor="gr-category" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                                Category
                            </Label>
                            <Select
                                value={grievanceForm.category}
                                onValueChange={(val) => setGrievanceForm({ ...grievanceForm, category: val })}
                            >
                                <SelectTrigger className="h-10 rounded-lg bg-background w-full text-left">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Academic">Academic</SelectItem>
                                    <SelectItem value="Admissions">Admissions</SelectItem>
                                    <SelectItem value="Fee & Payments">Fee & Payments</SelectItem>
                                    <SelectItem value="Facilities & Infrastructure">Facilities & Infrastructure</SelectItem>
                                    <SelectItem value="Hostel & Mess">Hostel & Mess</SelectItem>
                                    <SelectItem value="Transport">Transport</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            {grievanceErrors.category && (
                                <p className="text-xs text-destructive mt-1">{grievanceErrors.category}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="gr-subject" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Subject <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="gr-subject"
                                placeholder="Brief summary of your submission"
                                value={grievanceForm.subject}
                                onChange={(e) => setGrievanceForm({ ...grievanceForm, subject: e.target.value })}
                                required
                                className="h-10 rounded-lg bg-background w-full"
                            />
                            {grievanceErrors.subject && (
                                <p className="text-xs text-destructive mt-1">{grievanceErrors.subject}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="gr-description" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Description <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="gr-description"
                                placeholder="Provide detailed information here..."
                                value={grievanceForm.description}
                                onChange={(e) => setGrievanceForm({ ...grievanceForm, description: e.target.value })}
                                required
                                className="min-h-[100px] rounded-lg bg-background w-full"
                            />
                            {grievanceErrors.description && (
                                <p className="text-xs text-destructive mt-1">{grievanceErrors.description}</p>
                            )}
                        </div>

                        <DialogFooter className="pt-2 sm:space-x-2 flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setGrievanceOpen(false)}
                                className="h-11 px-6 rounded-lg text-sm font-semibold border-border hover:bg-muted"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={grievanceSubmitting}
                                className="h-11 px-6 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-2"
                            >
                                {grievanceSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Submit Now"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
