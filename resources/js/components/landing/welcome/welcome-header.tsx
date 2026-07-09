import { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
  NAV_ITEMS,
  UTILITY_LINKS,
  IMPORTANT_LINKS,
  COLLEGE_DETAILS,
} from "@/constants";
import { useInstitution } from "@/hooks/use-institution";
import AppLogoIcon from "@/components/app-logo-icon";
import { ThemeSettings } from "@/components/theme-settings";
import { login, dashboard, logout } from "@/routes";
import { studentRegister } from "@/routes/student";
import { type SharedData } from "@/types";
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
} from "lucide-react";
import { MobileNav } from "./MobileNav";
import { IconLink } from "@/components/ui/icon-link";

const STUDENT_ROLES = ["student", "candidate"];

export function WelcomeHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { auth } = usePage<SharedData>().props;
  const { name, locationLine, contact } = useInstitution();
  const isLoggedIn = Boolean(auth?.user);
  const dashboardHref = auth?.role && STUDENT_ROLES.includes(auth.role)
    ? "/student-portal/dashboard"
    : dashboard();
  const contactLinks = [
    { icon: Phone, value: contact.phone || '', href: `tel:${(contact.phone || '').replace(/\s/g, '')}`, label: 'Phone' },
    { icon: Mail, value: contact.email || '', href: `mailto:${contact.email || ''}`, label: 'Email' },
  ];

  return (
    <>
      {/* Top Bar - Compact on iPhone SE / small screens */}
      <div className="relative z-20 bg-primary text-primary-foreground text-xs py-1.5 sm:py-2">
        <div className="mx-auto max-w-[1440px] px-3 sm:px-4 md:px-8 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          {/* Left: Govt. of Bihar + contact (icons only on xs to save space) */}
          <div className="flex items-center gap-2 sm:gap-6 font-medium min-w-0">
            <span className="bg-white/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[9px] font-bold tracking-[0.1em] uppercase shrink-0">
              {COLLEGE_DETAILS.governmentAgency}
            </span>
            <span className="opacity-20 hidden sm:inline">|</span>
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              {contactLinks.map((link) => (
                <IconLink key={link.label} href={link.href} icon={link.icon}>
                  {link.value}
                </IconLink>
              ))}
            </div>
          </div>
          {/* Right: utility links (icons only on xs) + theme */}
          <div className="flex items-center gap-2 sm:gap-4 font-medium shrink-0">
            {UTILITY_LINKS.map((link) => (
              <IconLink key={link.label} href={link.href} icon={link.icon}>
                <span className="hidden sm:inline">{link.label}</span>
              </IconLink>
            ))}
            <span className="opacity-30 hidden sm:inline">|</span>
            <ThemeSettings />
          </div>
        </div>
      </div>

      {/* Important Links Bar - Clean List */}
      <div className="relative z-20 bg-white dark:bg-card border-b border-border py-2 hidden md:block">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                Important Links
              </span>
            </div>
            <div className="flex items-center gap-5 overflow-x-auto scrollbar-hide">
              {IMPORTANT_LINKS.map((link, idx) => (
                <div key={link.title} className="flex items-center gap-5">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-primary whitespace-nowrap transition-colors uppercase tracking-wider"
                  >
                    {link.title}
                    <ExternalLink className="h-2.5 w-2.5 opacity-40 group-hover:opacity-100" />
                  </a>
                  {idx < IMPORTANT_LINKS.length - 1 && (
                    <span className="h-3 w-[1px] bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Clean & Simple: logo can shrink so menu button stays visible on iPhone SE */}
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto max-w-[1440px] px-3 sm:px-4 md:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6 min-w-0">
          {/* Logo Group - min-w-0 + truncate so hamburger is never pushed off */}
          <Link href="/" className="flex items-center gap-2 sm:gap-4 group min-w-0 shrink">
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
                            <span className="block text-sm font-semibold text-foreground">Dashboard</span>
                            <span className="block text-xs text-muted-foreground">Go to your dashboard</span>
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
                            <span className="block text-sm font-semibold text-foreground">Logout</span>
                            <span className="block text-xs text-muted-foreground">Sign out of your account</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-primary/90 hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background h-auto"
                  >
                    Login
                    <ChevronDown className="h-4 w-4 opacity-90 transition-transform duration-200 group-hover:rotate-180" />
                  </Button>
                  <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 scale-95 group-hover:scale-100 origin-top-right">
                    <div className="bg-card rounded-xl border border-border shadow-xl shadow-black/5 min-w-[220px] overflow-hidden">
                      <div className="px-3 py-2 border-b border-border bg-muted/30">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Sign in as
                        </p>
                      </div>
                      <div className="p-1.5">
                        <Link
                          href={login()}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-muted/80 transition-colors focus:outline-none focus:bg-muted/80"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <UserCog className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <span className="block text-sm font-semibold text-foreground">Admin</span>
                            <span className="block text-xs text-muted-foreground">College admin & settings</span>
                          </div>
                        </Link>
                        <Link
                          href={login()}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-muted/80 transition-colors focus:outline-none focus:bg-muted/80"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Users className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <span className="block text-sm font-semibold text-foreground">Staff</span>
                            <span className="block text-xs text-muted-foreground">Faculty & office staff</span>
                          </div>
                        </Link>
                        <Link
                          href={studentRegister()}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-muted/80 transition-colors focus:outline-none focus:bg-muted/80"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <GraduationCap className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <span className="block text-sm font-semibold text-foreground">Student</span>
                            <span className="block text-xs text-muted-foreground">Student portal & dashboard</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle - always visible on small screens (iPhone SE) */}
          <div className="flex items-center gap-2 sm:gap-3 xl:hidden shrink-0">
            <ThemeSettings />
            <Button
              type="button"
              variant="ghost"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
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

      {/* Navigation Bar - Clean Menu */}
      <div className="hidden xl:block border-b border-border bg-card z-[45] relative">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <nav className="flex items-center justify-center gap-4">
            {NAV_ITEMS.map((item) => (
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
    </>
  );
}
