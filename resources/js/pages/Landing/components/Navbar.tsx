import { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import Each from '@/components/Each';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
    const { name: appName } = usePage<SharedData>().props;
    const [scrolled, setScrolled] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Find the closest scrollable ancestor (div-based scroll containers)
        const findScrollParent = (el: HTMLElement | null): HTMLElement | Window => {
            while (el) {
                const style = getComputedStyle(el);
                if (/(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight) {
                    return el;
                }
                el = el.parentElement;
            }
            return window;
        };

        const scrollTarget = findScrollParent(navRef.current);
        const onScroll = () => {
            const scrollTop = scrollTarget instanceof Window
                ? scrollTarget.scrollY
                : scrollTarget.scrollTop;
            setScrolled(scrollTop > 20);
        };
        scrollTarget.addEventListener('scroll', onScroll, { passive: true });
        return () => scrollTarget.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <motion.nav
            ref={navRef}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
                'w-full transition-all duration-500 l-font-body relative',
                scrolled
                    ? 'l-nav-scrolled'
                    : 'l-nav-transparent'
            )}
        >
            {/* Gradient bottom border — always visible, intensifies on scroll */}
            <div className={cn(
                'absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500',
                'bg-gradient-to-r from-transparent via-[var(--l-primary)]/40 to-transparent',
                scrolled ? 'opacity-100' : 'opacity-30'
            )} />

            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo + Brand */}
                <a href="/" className="flex items-center gap-3 group cursor-pointer no-underline">
                    <motion.div
                        whileHover={{ rotateY: 15, scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden ring-1 ring-[var(--l-border)]/30 shadow-sm"
                    >
                        <img src="/logo.png" alt={appName} className="w-full h-full object-contain" />
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="text-base font-extrabold tracking-tight l-fg leading-none">
                            {appName}
                        </span>
                        <span className="text-[8px] l-text-primary font-black uppercase tracking-[0.25em] leading-none mt-1 opacity-70">
                            Institutional OS
                        </span>
                    </div>
                </a>

                {/* Nav Links — center */}
                <div className="hidden lg:flex items-center">
                    <div className="flex items-center gap-1 rounded-full px-2 py-1 l-bg-surface ring-1 ring-[var(--l-border)]/20">
                        <Each
                            of={navLinks}
                            render={(item) => (
                                <a
                                    href={item.href}
                                    className="relative text-sm font-semibold px-4 py-1.5 rounded-full l-text-muted hover:l-fg hover:l-bg-surface transition-all duration-300"
                                >
                                    {item.label}
                                </a>
                            )}
                        />
                    </div>
                </div>

                {/* CTA — right */}
                <div className="flex items-center gap-3">
                    <a href="/login" className="text-sm font-semibold l-text-muted hover:l-fg transition-colors hidden sm:inline-block">
                        Sign In
                    </a>
                    <Button size="sm" className="rounded-full font-bold l-bg-primary text-white shadow-lg shadow-[var(--l-primary)]/15 hover:shadow-xl hover:shadow-[var(--l-primary)]/25 hover:-translate-y-0.5 transition-all duration-300 px-5 gap-1.5" asChild>
                        <a href="/register">
                            Get Started
                            <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                    </Button>
                </div>
            </div>
        </motion.nav>
    );
}
