import { Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { NAV_ITEMS } from '@/constants';
import { login, dashboard, logout } from '@/routes';
import { type SharedData } from '@/types';
import {
    ChevronDown,
    ArrowRight,
    UserCog,
    Users,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    ExternalLink,
    Menu,
    Link2,
} from 'lucide-react';

const STUDENT_ROLES = ['student', 'candidate'];

interface MobileNavProps {
    isOpen: boolean;
}

export function MobileNav({ isOpen }: MobileNavProps) {
    const { auth } = usePage<SharedData>().props;
    const isLoggedIn = Boolean(auth?.user);
    const dashboardHref =
        auth?.role && STUDENT_ROLES.includes(auth.role)
            ? '/student-portal/dashboard'
            : dashboard();

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-40 flex flex-col bg-background animate-in fade-in slide-in-from-top-4 duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
        >
            {/* Spacer to align with header height (h-16 sm:h-20) */}
            <div className="h-16 sm:h-20 shrink-0" aria-hidden />

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
                {/* Section: Main navigation */}
                <div className="py-2">
                    <div className="flex items-center gap-2 px-2 py-3">
                        <Menu className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Menu
                        </span>
                    </div>
                    <ul className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border/50">
                        {NAV_ITEMS.map((item, idx) => (
                            <li key={idx}>
                                {item.children ? (
                                    <details className="group">
                                        <summary className="flex items-center justify-between min-h-[48px] px-4 py-3 text-base font-semibold text-foreground cursor-pointer list-none select-none touch-manipulation active:bg-muted/50">
                                            {item.title}
                                            <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                                        </summary>
                                        <div className="bg-muted/20 px-4 pb-3 pt-1 space-y-0.5">
                                            {item.children.map((child, childIdx) => (
                                                <Link
                                                    key={childIdx}
                                                    href={child.href}
                                                    className="flex items-center min-h-[44px] px-3 rounded-lg text-[15px] text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                                                >
                                                    {child.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </details>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="flex items-center justify-between min-h-[48px] px-4 py-3 text-base font-semibold text-foreground hover:bg-muted/50 active:bg-muted/50 transition-colors"
                                    >
                                        {item.title}
                                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Section: Login / Account */}
                <div className="py-2">
                    <div className="flex items-center gap-2 px-2 py-3">
                        {isLoggedIn ? (
                            <LayoutDashboard className="h-5 w-5 text-primary shrink-0" />
                        ) : (
                            <UserCog className="h-5 w-5 text-primary shrink-0" />
                        )}
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            {isLoggedIn ? 'Account' : 'Login'}
                        </span>
                    </div>
                    <div className="rounded-xl border border-border bg-card overflow-hidden space-y-px">
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href={dashboardHref}
                                    className="flex items-center gap-3 min-h-[52px] px-4 py-3 text-base font-semibold text-foreground hover:bg-muted/50 active:bg-muted/50 transition-colors"
                                >
                                    <LayoutDashboard className="h-5 w-5 text-primary shrink-0" />
                                    Dashboard
                                    <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground shrink-0" />
                                </Link>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => router.post(logout.url())}
                                    className="flex w-full items-center justify-start gap-3 min-h-[52px] px-4 py-3 text-base font-semibold text-foreground hover:bg-muted/50 active:bg-muted/50 transition-colors text-left touch-manipulation h-auto"
                                >
                                    <LogOut className="h-5 w-5 text-destructive shrink-0" />
                                    Logout
                                    <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground shrink-0" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="flex items-center gap-3 min-h-[52px] px-4 py-3 text-base font-semibold text-foreground hover:bg-muted/50 active:bg-muted/50 transition-colors"
                                >
                                    <UserCog className="h-5 w-5 text-primary shrink-0" />
                                    Sign in
                                    <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground shrink-0" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
