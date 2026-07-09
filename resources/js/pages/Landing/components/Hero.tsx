import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TextAnimate } from '@/components/ui/text-animate';
import { Highlighter } from '@/components/ui/highlighter';
import { CoolMode } from '@/components/ui/cool-mode';
import GradientMesh from './shared/GradientMesh';
import ThreeDMarquee from './ThreeDMarquee';

interface HeroProps {
    data: {
        badge: string;
        title: string;
        description: string;
        cta_primary: string;
        cta_secondary: string;
    };
}

export default function Hero({ data }: HeroProps) {
    return (
        <section className="relative pt-36 pb-20 lg:pt-32 lg:pb-24 overflow-hidden l-bg flex items-center min-h-[90vh]">
            <GradientMesh intensity={0.08} />

            {/* Subtle dot pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-1 bg-[radial-gradient(circle_at_1px_1px,var(--l-fg)_1px,transparent_0)] bg-size-[80px_80px]" />

            <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">

                    {/* Left: Content */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Badge variant="secondary" className="mb-6 rounded-full px-4 py-1.5 font-bold flex items-center gap-2 l-bg-surface border-(--l-border)">
                                <Star className="w-3.5 h-3.5 l-text-primary fill-current" />
                                {data.badge}
                            </Badge>
                        </motion.div>

                        {/* Typing animation — character by character */}
                        <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-6 leading-[1.05] max-w-xl drop-shadow-sm l-font-heading">
                            <TextAnimate
                                as="span"
                                animation="fadeIn"
                                by="character"
                                once
                                startOnView={false}
                                duration={0.04}
                                className="l-gradient-text"
                            >
                                {data.title}
                            </TextAnimate>
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                                className="inline-block w-[3px] h-[0.85em] l-bg-primary ml-1 align-baseline translate-y-[0.1em] rounded-sm"
                            />
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="max-w-lg text-base lg:text-lg l-text-muted font-medium leading-relaxed mb-8 l-font-body"
                        >
                            A clinical, high-performance platform designed to{" "}
                            <Highlighter action="underline" color="var(--l-primary)" strokeWidth={2}>
                                <span className="l-gradient-text">automate administrative workflows</span>
                            </Highlighter>
                            , scale institutional governance, and provide{" "}
                            <Highlighter action="highlight" color="var(--l-accent)" strokeWidth={2}>
                                <span className="l-gradient-text">360° operational visibility</span>
                            </Highlighter>
                            .
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center gap-4"
                        >
                            <CoolMode>
                                <Button asChild size="lg" className="h-14 px-10 rounded-xl font-bold l-bg-primary text-white shadow-xl shadow-(--l-primary)/20 hover:shadow-2xl hover:shadow-(--l-primary)/30 hover:-translate-y-0.5 transition-all duration-300 l-shimmer">
                                    <a href="/register">
                                        {data.cta_primary}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </a>
                                </Button>
                            </CoolMode>
                            <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-xl font-bold border-(--l-border) l-bg-surface hover:l-bg-surface/80 hover:-translate-y-0.5 transition-all duration-300">
                                <a href="/login">
                                    {data.cta_secondary}
                                </a>
                            </Button>
                        </motion.div>
                    </div>

                    {/* Right: 3D Marquee — education quotes, shlokas, motif tiles — hidden on mobile */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                        className="relative order-2 hidden lg:block min-h-[500px]"
                    >
                        {/* Left fade mask */}
                        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-linear-to-r from-(--l-bg) to-transparent" />
                        {/* Right fade mask */}
                        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-linear-to-l from-(--l-bg) to-transparent" />
                        {/* Top fade mask */}
                        <div className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none bg-linear-to-b from-(--l-bg) to-transparent" />
                        {/* Bottom fade mask */}
                        <div className="absolute bottom-0 left-0 right-0 h-20 z-10 pointer-events-none bg-linear-to-t from-(--l-bg) to-transparent" />

                        <ThreeDMarquee />
                    </motion.div>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-2 bg-linear-to-t from-(--l-bg) to-transparent" />
        </section>
    );
}
