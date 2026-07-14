import React from 'react';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { CoolMode } from '@/components/ui/cool-mode';
import { Vortex } from '@/components/ui/vortex';

export default function FinalCTASection() {
    const { name: appName, institution } = usePage<SharedData>().props;
    const theme = institution?.brand_theme ?? 'nature'

    const getBaseHue = (themeName: string) => {
        const hues: Record<string, number> = {
            nature: 160,
            royal: 240,
            heritage: 25,
            vibrant: 280,
            sunset: 35,
            oceanic: 200,
            desert: 45,
            midnight: 265,
            forest: 145,
            corporate: 225,
            diwali: 35,
            holi: 320,
            christmas: 140,
            republic: 25,
            independence: 35
        };
        return hues[themeName] || 240;
    };

    return (
        <section className="py-[var(--space-section)] px-4 l-bg">
            <div className="max-w-5xl mx-auto">
                <Vortex
                    backgroundColor="transparent"
                    baseHue={getBaseHue(theme)}
                    particleCount={500}
                    rangeY={200}
                    baseSpeed={0.0}
                    rangeSpeed={1.2}
                    baseRadius={1}
                    rangeRadius={2}
                    containerClassName="rounded-3xl overflow-hidden l-gradient-cta min-h-[400px]"
                    className="flex items-center justify-center p-12 md:p-16"
                >
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="size-14 rounded-xl flex items-center justify-center overflow-hidden mb-6"
                        >
                            <img src="/logo.png" alt={appName} className="w-full h-full object-contain" />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-[1.1] l-font-heading text-white"
                        >
                            Ready to Transform Your Institution?
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-lg md:text-xl text-white/60 max-w-2xl mb-12 font-medium l-font-body"
                        >
                            Join 500+ institutional leaders who have already modernized their governance with {appName}.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="flex flex-col sm:flex-row items-center gap-4"
                        >
                            {/* <CoolMode>
                                <Button asChild size="lg" className="h-14 px-10 rounded-xl font-bold l-bg-primary text-white hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300 l-shimmer cursor-pointer">
                                    <a href="/register">
                                        Get Started Free
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </a>
                                </Button>
                            </CoolMode> */}
                            <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-xl font-bold text-white border-white/20 hover:bg-white hover:text-black bg-transparent transition-all hover:-translate-y-0.5 duration-300 cursor-pointer">
                                <a href="/login">
                                    Request Demo
                                </a>
                            </Button>
                        </motion.div>

                        <p className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                            Instant Setup · Cancel Anytime
                        </p>
                    </div>
                </Vortex>
            </div>
        </section>
    );
}
