import { cn } from "@/lib/utils";
import { Link, router, usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
import { AppBrand } from "@/components/AppBrand";
import AppLogoIcon from '@/components/app-logo-icon';
import { LogOut, Users, Zap, BarChart3, GraduationCap, Shield, BookOpen } from "lucide-react";
import type { ReactNode } from "react";
import PremiumBackground from "@/components/shared/PremiumBackground";
import { BorderBeam } from '@/components/ui/border-beam';
import { COLLEGE_DETAILS, AUTH_FALLBACK_QUOTE } from '@/constants';
import { AuthPageHeader } from '@/components/shared/AuthPageHeader';
import { LegalDisclaimer } from '@/components/shared/LegalDisclaimer';
import { home } from '@/routes';

interface OnboardingLayoutProps {
  /** Current step number (1-indexed) */
  currentStep: number;
  /** Page title */
  title: string;
  /** Subtitle/description below the title */
  description?: ReactNode;
  /** Step content */
  children: ReactNode;
  /** Max width of the card — wider for plan/data-import steps */
  wide?: boolean;
  /** Extra class on the outer wrapper */
  className?: string;
}

const BRAND_FEATURES = [
    { label: 'Multi-Tenant Architecture', icon: Users },
    { label: 'Automated Workflow Activation', icon: Zap },
    { label: 'Fee Management & Analytics', icon: BarChart3 },
    { label: 'Admissions & Certificates', icon: GraduationCap },
    { label: 'Inventory & Transport', icon: Shield },
    { label: 'LMS & Attendance', icon: BookOpen },
];

export default function OnboardingLayout({
  currentStep,
  title,
  description,
  children,
  wide = false,
  className,
}: OnboardingLayoutProps) {
  const { name: appName, quote, institution } = usePage<SharedData>().props;

  const isBrand = !!institution?.is_brand;
  const institutionName = isBrand
      ? appName
      : (institution?.name || institution?.short_name || COLLEGE_DETAILS.name);

  const authPanel = institution?.auth_panel;
  const quoteMessage = isBrand
      ? `The future of education management is here. One platform, every institution.`
      : (authPanel?.quote?.message ?? quote?.message ?? AUTH_FALLBACK_QUOTE.message);
  const quoteAuthor = isBrand
      ? `${appName} Team`
      : (authPanel?.quote?.author ?? quote?.author ?? AUTH_FALLBACK_QUOTE.author);

  const handleLogout = () => {
    router.post("/logout");
  };

  return (
    <div className="l-theme relative h-dvh w-full overflow-y-auto overflow-x-hidden bg-background text-foreground font-family-applied transition-colors duration-500">
        {/* Unified Premium Background */}
        <PremiumBackground variant="onboarding" />

        {/* Layout Container */}
        <div className="relative z-10 flex w-full flex-col items-center justify-start py-(--space-4) lg:pt-(--space-8) lg:pb-(--space-12)">
            
            {/* Centered Content Card */}
            <div className={cn(
                "relative w-full bg-transparent lg:bg-background/60 dark:lg:bg-card/30 lg:backdrop-blur-xl rounded-none lg:rounded-[2.5rem] border-0 lg:border lg:border-border lg:shadow-2xl space-y-(--space-10) lg:space-y-(--space-12) animate-in lg:zoom-in-95 lg:duration-500 p-(--space-6) sm:p-(--space-10) lg:p-(--space-12)",
                wide ? "max-w-4xl" : "max-w-lg",
                className
            )}>
                {/* Header: Logo & Institution Info */}
                <div className="flex flex-col items-center justify-center gap-(--space-3) mb-(--space-4) text-center animate-in fade-in slide-in-from-top-4 duration-700">
                    <Link href={isBrand ? '/' : home()} className="group">
                        <div className="mx-auto h-10 w-10 lg:h-12 lg:w-12 rounded-2xl bg-primary/5 backdrop-blur-2xl border border-primary/10 p-2 lg:p-2.5 shadow-2xl transition-all duration-500 group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:scale-105 group-hover:-rotate-2">
                            <AppLogoIcon className="h-full w-full object-contain" />
                        </div>
                    </Link>
                    <div className="space-y-(--space-0-5,0.125rem)">
                        <span className="block text-xs lg:text-lg font-black tracking-tightest uppercase leading-none text-foreground">{institutionName}</span>
                        <div className="flex items-center justify-center gap-(--space-2)">
                            <div className="h-px w-3 bg-primary/40" />
                            <span className="block text-[7px] lg:text-[8px] font-bold text-muted-foreground tracking-[0.3em] uppercase whitespace-nowrap">Step {currentStep}</span>
                            <div className="h-px w-3 bg-primary/40" />
                        </div>
                    </div>
                </div>

                {/* Title & Description */}
                {/* Title & Description */}
                <AuthPageHeader 
                    title={title} 
                    description={description} 
                    className="border-l-2 pl-(--space-6)" 
                />

                {/* Form content and Legal Grouped */}
                <div className="space-y-(--space-3) sm:space-y-(--space-4)">
                    <div className="onboarding-content animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        {children}
                    </div>
                    <LegalDisclaimer hideBorder className="pt-0 lg:pt-0" />
                </div>

                {/* Footer Actions: Logout / Start Over */}
                <div className="pt-(--space-8) lg:pt-(--space-10) border-t border-border/20 flex flex-col items-center gap-(--space-4)">
                    {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex items-center gap-2 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-foreground transition-colors cursor-pointer"
                        >
                          <LogOut className="w-2.5 h-2.5" />
                          Logout & Start Over
                        </button>
                    )}
                    <div className="flex items-center gap-2 opacity-15">
                        <div className="h-px w-6 bg-foreground" />
                        <span className="text-[6px] sm:text-[7px] font-black tracking-[0.4em] text-foreground transition-all group-hover:tracking-[0.5em]">Secure Session</span>
                        <div className="h-px w-6 bg-foreground" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
