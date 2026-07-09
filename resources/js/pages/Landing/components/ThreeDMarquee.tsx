import React from 'react';
import Each from '@/components/Each';
import { MARQUEE_ROWS, type MarqueeCard } from '@/constants/landing/marquee';

/**
 * 3D Marquee — Aceternity UI inspired
 * Uses pure CSS animations (GPU-accelerated) instead of Framer Motion
 * for silky-smooth infinite scroll without JS overhead.
 */

/* Single card renderer */
function MarqueeCardItem({ card }: { card: MarqueeCard }) {
    if (card.type === 'motif') {
        return (
            <div className="l-hero-tile w-24 h-24 flex-shrink-0 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[var(--l-primary)]/[0.04]" />
                <div className={`absolute inset-0 l-motif-${card.motif}`} style={{ opacity: 1 }} />
                <div
                    className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
                    style={{ background: 'var(--l-motif-glare)' }}
                />
            </div>
        );
    }

    const isShloka = card.type === 'shloka';

    return (
        <div className={`l-hero-tile flex-shrink-0 rounded-xl px-5 py-4 relative overflow-hidden ${isShloka ? 'w-56' : 'w-60'}`}>
            <div className="absolute inset-0 bg-[var(--l-primary)]/[0.03]" />
            <div
                className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
                style={{ background: 'var(--l-card-glare)' }}
            />
            <div className="relative z-10">
                {isShloka && card.textHi && (
                    <p className="text-sm font-bold l-text-primary leading-snug mb-1.5 l-font-heading l-gradient-text">
                        {card.textHi}
                    </p>
                )}
                {card.textEn && (
                    <p className={`text-xs l-text-muted leading-relaxed ${isShloka ? 'italic' : 'font-medium'}`}>
                        &ldquo;{card.textEn}&rdquo;
                    </p>
                )}
                {card.source && (
                    <p className="text-[9px] font-bold l-text-primary opacity-50 mt-2 uppercase tracking-wider">
                        — {card.source}
                    </p>
                )}
            </div>
        </div>
    );
}

/* Single scrolling row — pure CSS animation */
function MarqueeRow({ cards, reverse = false, speed = 35 }: { cards: MarqueeCard[]; reverse?: boolean; speed?: number }) {
    const doubled = [...cards, ...cards];

    return (
        <div className="flex overflow-hidden py-2">
            <div
                className="flex gap-4 flex-shrink-0"
                style={{
                    animation: `marquee-scroll ${speed}s linear infinite`,
                    animationDirection: reverse ? 'reverse' : 'normal',
                    willChange: 'transform',
                }}
            >
                <Each
                    of={doubled}
                    render={(card, index) => <MarqueeCardItem key={`${card.type}-${index}`} card={card} />}
                />
            </div>
        </div>
    );
}

/* Main 3D Marquee */
export default function ThreeDMarquee() {
    return (
        <>
            <style>{`
                @keyframes marquee-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
            `}</style>
            <div
                className="w-full h-full flex flex-col justify-center gap-3"
                style={{ perspective: '800px' }}
            >
                <div
                    className="flex flex-col gap-3"
                    style={{
                        transform: 'rotateX(12deg) rotateY(-8deg) rotateZ(2deg)',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    <Each
                        of={MARQUEE_ROWS}
                        render={(row, index) => (
                            <MarqueeRow
                                key={index}
                                cards={row}
                                reverse={index % 2 === 1}
                                speed={35 + index * 5}
                            />
                        )}
                    />
                </div>
            </div>
        </>
    );
}
