import { useLayoutContext } from "@/lib/layout-resolver";
import { useInstitution } from "@/hooks/use-institution";
import AppLogoIcon from "@/components/app-logo-icon";
import { Building, Phone, Mail, ExternalLink, ArrowRight } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { type SharedData } from "@/types";

/**
 * Public Footer — shared across all public/website pages.
 *
 * All content is config-driven:
 * - Footer sections from `useLayoutContext().footerSections` (DB override → type defaults)
 * - Description from `useLayoutContext().footerDescription` (DB or fallback)
 * - Legal links from `useLayoutContext()` (DB or '#' fallback)
 * - Contact info from `useInstitution()`
 */
export function PublicFooter() {
    const { name, locationLine, contact } = useInstitution();
    const { props } = usePage<SharedData>();
    const branding = props.branding;
    const {
        footerSections,
        importantLinks,
        footerDescription,
        privacyPolicyUrl,
        termsOfServiceUrl,
        sitemapUrl,
    } = useLayoutContext();

    const description = footerDescription || `${name} — committed to revolutionizing education through technology, innovation, and academic excellence.`;

    return (
        <footer className="relative bg-card text-foreground mt-10 pt-10 sm:mt-16 sm:pt-16 md:mt-20 md:pt-20 pb-8 sm:pb-12  border-t border-border transition-colors duration-500">
            <div className="mx-auto max-w-[1440px] px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-14 md:mb-16 pb-10 sm:pb-14 md:pb-16 border-b border-border/60">
                    {/* Brand Info */}
                    <div className="md:col-span-4 space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-3 sm:gap-5">
                            <div className="p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl bg-muted border border-border transition-colors group-hover:border-primary/30 shrink-0">
                                <AppLogoIcon
                                    alt=""
                                    className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                                />
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-bold text-base sm:text-lg md:text-xl text-foreground leading-none tracking-tight">
                                    {name}
                                </h4>
                                <p className="text-[10px] sm:text-[11px] text-primary font-bold mt-1.5 sm:mt-2 uppercase tracking-widest">
                                    {locationLine}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs sm:text-[13px] text-muted-foreground font-medium leading-relaxed max-w-sm">
                            {description}
                        </p>
                    </div>

                    {/* Dynamic footer sections — institution-type-aware */}
                    <div className="md:col-span-5 grid grid-cols-2 gap-6 sm:gap-8">
                        {footerSections.slice(0, 2).map((section) => (
                            <div key={section.title}>
                                <h4 className="font-bold text-foreground text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-2.5">
                                    <span className="h-[1px] w-4 sm:w-6 bg-primary shrink-0" />
                                    {section.title}
                                </h4>
                                <ul className="space-y-2.5 sm:space-y-4 text-muted-foreground">
                                    {section.links.map((link) => (
                                        <li key={link.title}>
                                            <a
                                                href={link.href}
                                                className="group flex items-center gap-2 text-xs sm:text-[13px] font-bold hover:text-primary transition-colors"
                                            >
                                                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary shrink-0" />
                                                <span>{link.title}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Contact details */}
                    <div className="md:col-span-3 bg-muted/30 border border-border/60 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl">
                        <h4 className="font-bold text-foreground text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-6 md:mb-8">
                            Contact Us
                        </h4>
                        <ul className="space-y-4 sm:space-y-6">
                            <li className="flex items-start gap-3 sm:gap-4">
                                <div className="p-2.5 sm:p-3 rounded-lg bg-muted text-foreground border border-border shrink-0">
                                    <Building className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                                </div>
                                <span className="text-xs sm:text-[13px] font-bold text-foreground leading-relaxed pt-0.5 sm:pt-1">
                                    {contact.address || ''}
                                </span>
                            </li>
                            <li>
                                <a
                                    href={`tel:${(contact.phone || '').replace(/\s/g, '')}`}
                                    className="flex items-center gap-3 sm:gap-4 group"
                                >
                                    <div className="p-2.5 sm:p-3 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <Phone className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                                    </div>
                                    <span className="text-xs sm:text-[13px] font-bold text-foreground group-hover:text-primary transition-colors break-all">
                                        {contact.phone || ''}
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`mailto:${contact.email || ''}`}
                                    className="flex items-center gap-3 sm:gap-4 group"
                                >
                                    <div className="p-2.5 sm:p-3 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <Mail className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                                    </div>
                                    <span className="text-xs sm:text-[13px] font-bold text-foreground group-hover:text-primary transition-colors break-all">
                                        {contact.email || ''}
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Vital Portals Section — hidden when no links */}
                {importantLinks.length > 0 && (
                    <div className="mb-10 sm:mb-14 md:mb-16">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
                            <span className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                                Vital Portals
                            </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                            {importantLinks.map((link) => (
                                <a
                                    key={link.title}
                                    href={link.url}
                                    target={link.url.startsWith('/') ? undefined : '_blank'}
                                    rel={link.url.startsWith('/') ? undefined : 'noopener noreferrer'}
                                    className="inline-flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-3.5 text-[9px] sm:text-[10px] font-bold bg-muted/30 border border-border/60 rounded-lg sm:rounded-xl text-muted-foreground hover:text-primary hover:border-primary/20 transition-colors uppercase tracking-widest group"
                                >
                                    <span className="line-clamp-1 min-w-0">{link.title}</span>
                                    {!link.url.startsWith('/') && (
                                        <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-40 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bottom Bar — legal links from config */}
                <div className="pt-6 sm:pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-[8px] sm:text-[9px] text-muted-foreground font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-center md:text-left">
                    <p>
                        © {new Date().getFullYear()} {name}. All Rights Reserved.
                        {branding?.powered_by && (
                            <>
                                <span className="mx-2 text-border/40">|</span>
                                <span>Powered by </span>
                                <a
                                    href={branding.powered_by_url || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary hover:underline transition-colors"
                                >
                                    {branding.powered_by}
                                </a>
                            </>
                        )}
                        {branding?.designed_by && (
                            <>
                                <span className="mx-2 text-border/40">|</span>
                                <span>Designed by </span>
                                <a
                                    href={branding.designed_by_url || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary hover:underline transition-colors"
                                >
                                    {branding.designed_by}
                                </a>
                            </>
                        )}
                    </p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <a href={privacyPolicyUrl} className="hover:text-primary transition-colors">
                            Privacy Policy
                        </a>
                        <a href={termsOfServiceUrl} className="hover:text-primary transition-colors">
                            Terms of Service
                        </a>
                        <a href={sitemapUrl} className="hover:text-primary transition-colors">
                            Sitemap
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
