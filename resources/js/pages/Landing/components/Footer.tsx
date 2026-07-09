import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import Each from '@/components/Each';
import { motion } from 'framer-motion';
import GeometryPattern from './shared/GeometryPattern';

const platformLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
];

const governanceLinks = [
    { label: 'Get Started', href: '/register' },
    { label: 'Sign In', href: '/login' },
    { label: 'Privacy Policy', href: '#' },
];

export default function Footer() {
    const { name: appName } = usePage<SharedData>().props;

    return (
        <footer className="py-[var(--space-section)] l-bg relative overflow-hidden">
            {/* Gradient divider */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--l-primary)]/30 to-transparent" />

            {/* Auto-swapping Madhubani patterns */}
            <GeometryPattern autoSwap opacity={0.08} borderBeam position="top" />

            <div className="max-w-[var(--max-w-content)] mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-2 space-y-6">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="flex items-center gap-2 w-fit"
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                                <img src="/logo.png" alt={appName} className="w-full h-full object-contain" />
                            </div>
                            <span className="text-xl font-bold l-fg tracking-tight uppercase">
                                {appName}
                            </span>
                        </motion.div>
                        <p className="text-sm l-text-muted leading-relaxed max-w-sm l-font-body">
                            Engineering the digital backbone of educational excellence. Modernizing institutions through structured automation and workflows.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 md:col-span-2">
                        <div className="space-y-6">
                            <h5 className="text-[11px] font-black uppercase tracking-widest l-fg">Platform</h5>
                            <ul className="space-y-3 text-sm l-text-muted font-medium">
                                <Each
                                    of={platformLinks}
                                    render={(link) => (
                                        <li>
                                            <a
                                                href={link.href}
                                                className="relative hover:l-text-primary transition-colors group/link inline-block"
                                            >
                                                {link.label}
                                                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--l-primary)] transition-all duration-300 group-hover/link:w-full" />
                                            </a>
                                        </li>
                                    )}
                                />
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h5 className="text-[11px] font-black uppercase tracking-widest l-fg">Governance</h5>
                            <ul className="space-y-3 text-sm l-text-muted font-medium">
                                <Each
                                    of={governanceLinks}
                                    render={(link) => (
                                        <li>
                                            <a
                                                href={link.href}
                                                className="relative hover:l-text-primary transition-colors group/link inline-block"
                                            >
                                                {link.label}
                                                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--l-primary)] transition-all duration-300 group-hover/link:w-full" />
                                            </a>
                                        </li>
                                    )}
                                />
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-[var(--l-border)]">
                    <div className="text-[11px] font-black uppercase tracking-widest l-text-muted">Operations Integrated</div>
                    <div className="text-[10px] l-text-muted font-medium">
                        &copy; {new Date().getFullYear()} {appName} Inc.
                    </div>
                </div>
            </div>
        </footer>
    );
}
