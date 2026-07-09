import AppLogoIcon from '@/components/app-logo-icon';
import { AppBrand } from '@/components/AppBrand';
import Each from '@/components/Each';
import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { COLLEGE_DETAILS, AUTH_FALLBACK_QUOTE, IMPORTANT_LINKS } from '@/constants';
import { ExternalLink, CheckCircle2, Zap, Shield, BarChart3, GraduationCap, BookOpen, Users } from 'lucide-react';
import PremiumBackground from '@/components/shared/PremiumBackground';
import { BorderBeam } from '@/components/ui/border-beam';
import { LegalDisclaimer } from '@/components/shared/LegalDisclaimer';
import { AuthPageHeader } from '@/components/shared/AuthPageHeader';


interface AuthLayoutProps {
    title?: string;
    description?: string;
}

const BRAND_FEATURES = [
    { label: 'Multi-Tenant Architecture', icon: Users, color: '#60a5fa' },
    { label: 'Automated Workflow Activation', icon: Zap, color: '#a78bfa' },
    { label: 'Fee Management & Analytics', icon: BarChart3, color: '#34d399' },
    { label: 'Admissions & Certificates', icon: GraduationCap, color: '#fbbf24' },
    { label: 'Inventory & Transport', icon: Shield, color: '#f472b6' },
    { label: 'LMS & Attendance', icon: BookOpen, color: '#38bdf8' },
];

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name: appName, quote, institution, branding } = usePage<SharedData>().props;
    const isBrand = !!institution?.is_brand;
    const institutionName = isBrand
        ? appName
        : (institution?.name || institution?.short_name || name || COLLEGE_DETAILS.name);

    const authPanel = institution?.auth_panel;
    const quoteMessage = isBrand
        ? `The future of education management is here. One platform, every institution.`
        : (authPanel?.quote?.message ?? quote?.message ?? AUTH_FALLBACK_QUOTE.message);
    const quoteAuthor = isBrand
        ? `${appName} Team`
        : (authPanel?.quote?.author ?? quote?.author ?? AUTH_FALLBACK_QUOTE.author);

    const brandTheme = institution?.brand_theme ?? 'royal';
    const brandFont = institution?.brand_font;

    return (
        <div className="l-theme relative h-dvh w-full overflow-y-auto overflow-x-hidden bg-background text-foreground font-family-applied transition-colors duration-500">
            {/* Unified Premium Background */}
            <PremiumBackground variant="full" />

            {/* Layout Container */}
            <div className="relative z-10 grid w-full grid-cols-1 lg:h-screen lg:grid-cols-2 lg:overflow-hidden">
                
                {/* Left Side: Institution Branding & Content (Fixed & Authoritative) */}
                <div className="hidden lg:flex flex-col justify-between p-(--space-10) lg:p-(--space-12) text-foreground overflow-hidden">
                    {/* Header: Logo & Name */}
                    <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                        {isBrand ? (
                            <Link href="/" className="inline-block group">
                                <AppBrand size="lg" className="text-foreground [&_h1]:text-foreground [&_p]:text-muted-foreground/60" />
                            </Link>
                        ) : (
                            <Link href={home()} className="flex items-center gap-(--space-6) group">
                                <div className="h-20 w-20 rounded-3xl bg-primary/5 backdrop-blur-2xl border border-primary/10 p-(--space-3) shadow-2xl transition-all duration-500 group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:scale-105 group-hover:-rotate-3">
                                    <AppLogoIcon className="h-full w-full object-contain" />
                                </div>
                                <div className="space-y-(--space-1)">
                                    <span className="block text-2xl font-black tracking-tightest uppercase leading-none">{institutionName}</span>
                                    {institution?.motto && (
                                        <div className="flex items-center gap-(--space-2)">
                                            <div className="h-px w-6 bg-primary/40" />
                                            <span className="block text-[10px] font-bold text-muted-foreground tracking-[0.3em] uppercase">{institution.motto}</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* Center Content: Quote & Features */}
                    <div className="max-w-xl animate-in fade-in slide-in-from-left-8 duration-1000 delay-150">
                        <div className="space-y-(--space-12)">
                            <blockquote className="relative pl-(--space-10)">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-full bg-linear-to-b from-primary via-primary/40 to-transparent" />
                                <h2 className="text-2xl xl:text-3xl font-black leading-tight text-foreground tracking-tightest">
                                    &ldquo;{quoteMessage}&rdquo;
                                </h2>
                                <footer className="mt-(--space-8) flex items-center gap-(--space-4)">
                                    <div className="h-[2px] w-8 bg-border" />
                                    <span className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground/30">
                                        // {quoteAuthor}
                                    </span>
                                </footer>
                            </blockquote>

                            {isBrand && (
                                <div className="grid grid-cols-2 gap-(--space-4)">
                                    {BRAND_FEATURES.map((feat, idx) => (
                                        <div 
                                            key={feat.label}
                                            style={{ transitionDelay: `${idx * 100}ms` }}
                                            className="relative group flex items-center gap-(--space-4) rounded-3xl border border-border/40 bg-background/20 dark:bg-card/10 p-(--space-4) backdrop-blur-3xl transition-all duration-500 hover:bg-background/40 dark:hover:bg-card/20 hover:border-primary/20 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 overflow-hidden"
                                        >
                                            <BorderBeam 
                                                size={100} 
                                                duration={8} 
                                                delay={idx * 2} 
                                                colorFrom="var(--primary)" 
                                                colorTo="var(--accent)" 
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            />
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-primary/20">
                                                <feat.icon className="h-4.5 w-4.5" />
                                            </div>
                                            <span className="text-[11px] font-black leading-tight tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">
                                                {feat.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer: Meta Info */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                         {!isBrand && (
                             <div className="space-y-(--space-6)">
                                <div className="flex items-center gap-(--space-3)">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 whitespace-nowrap">Operational Resources</span>
                                    <div className="h-px w-full bg-border/20" />
                                </div>
                                <div className="flex flex-wrap gap-(--space-4)">
                                    {IMPORTANT_LINKS.map(link => (
                                        <a 
                                            key={link.title} 
                                            href={link.url} 
                                            target="_blank" 
                                            className="text-[9px] sm:text-[11px] font-bold text-muted-foreground/40 hover:text-foreground transition-all flex items-center gap-(--space-2) px-4 py-2 rounded-full border border-border bg-background/10 hover:bg-background/30 hover:border-primary/20"
                                        >
                                            {link.title}
                                            <ExternalLink className="h-3 w-3 opacity-50" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Form Container (Glassmorphic & Focused) */}
                <div className="flex flex-col items-center justify-start lg:justify-center px-(--space-4) pt-(--space-4) pb-(--space-12) sm:p-(--space-8) lg:p-0 overflow-y-auto lg:overflow-hidden custom-scrollbar">
                    <div className="w-full max-w-md bg-transparent lg:bg-background/60 dark:lg:bg-card/30 lg:backdrop-blur-xl rounded-none lg:rounded-[3rem] border-0 lg:border lg:border-border lg:p-(--space-12) sm:p-(--space-10) lg:shadow-2xl space-y-(--space-12) lg:animate-in lg:zoom-in-95 lg:duration-700">
                        {/* Mobile Logo Visibility */}
                        <div className="lg:hidden flex justify-center mb-(--space-4) pt-(--space-2)">
                            <Link href={isBrand ? '/' : home()} className="flex items-center gap-(--space-4)">
                                <div className="h-10 w-10 rounded-2xl bg-primary/5 backdrop-blur-xl border border-primary/10 p-2 flex items-center justify-center">
                                    {isBrand ? <img src="/logo.png" className="h-full w-full object-contain" /> : <AppLogoIcon className="h-full w-full object-contain" />}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">{institutionName}</span>
                            </Link>
                        </div>

                        {/* Title & Description */}
                        {/* Title & Description */}
                        <AuthPageHeader title={title || ''} description={description} />

                        {/* Form Body & Legal Grouped for proximity */}
                        <div className="space-y-(--space-3) sm:space-y-(--space-4)">
                            <div>
                                {children}
                            </div>
                            <LegalDisclaimer hideBorder className="pt-0 lg:pt-0" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
