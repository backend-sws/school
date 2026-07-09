import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Each from '@/components/Each';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import GeometryPattern from './shared/GeometryPattern';

interface FAQ {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    faqs: FAQ[];
}

const FAQItem = ({
    faq,
    isOpen,
    onClick,
}: {
    faq: FAQ;
    isOpen: boolean;
    onClick: () => void;
}) => (
    <motion.div
        animate={{
            boxShadow: isOpen
                ? '0 8px 30px var(--l-primary-soft)'
                : '0 1px 3px rgba(0,0,0,0.04)',
            y: isOpen ? -2 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={cn(
            'border rounded-2xl px-6 overflow-hidden transition-colors duration-300',
            isOpen
                ? 'border-[var(--l-primary)]/20 l-bg-surface'
                : 'border-[var(--l-border)] l-bg-surface hover:border-[var(--l-border)]/80'
        )}
    >
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between text-left l-fg font-semibold text-base py-5 focus:outline-none group cursor-pointer l-font-body"
        >
            {faq.question}
            <motion.div
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <Plus className={cn(
                    'w-5 h-5 transition-colors duration-300',
                    isOpen ? 'l-text-primary' : 'l-text-muted'
                )} />
            </motion.div>
        </button>

        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                    <p className="l-text-muted text-sm leading-relaxed font-medium pb-5 l-font-body">
                        {faq.answer}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

export default function FAQSection({ faqs }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-[var(--space-section)] l-bg relative overflow-hidden">
            {/* Auto-swapping Madhubani patterns */}
            <GeometryPattern autoSwap opacity={0.08} borderBeam position="top" />

            <div className="max-w-3xl mx-auto px-4 relative z-10">
                <div className="text-center mb-12 space-y-4">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] l-text-primary/60">Inquiries</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight l-fg l-font-heading">Got Questions?</h2>
                </div>
                <div className="space-y-3">
                    <Each
                        of={faqs}
                        render={(faq, i) => (
                            <FAQItem
                                faq={faq}
                                isOpen={openIndex === i}
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            />
                        )}
                    />
                </div>
            </div>
        </section>
    );
}
