import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CountUpProps {
    /** Target number to count up to */
    target: number;
    /** Duration of animation in ms (default: 2000) */
    duration?: number;
    /** Prefix before the number (e.g. "₹") */
    prefix?: string;
    /** Suffix after the number (e.g. "+", "%") */
    suffix?: string;
    /** CSS class for the number */
    className?: string;
    /** Use locale formatting (commas) — default: true */
    formatted?: boolean;
}

/**
 * Number count-up animation triggered on scroll into view.
 * Uses requestAnimationFrame for smooth 60fps counting.
 */
export default function CountUp({
    target,
    duration = 2000,
    prefix = '',
    suffix = '',
    className,
    formatted = true,
}: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        const startTime = performance.now();
        let animationFrame: number;

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic for natural deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            setDisplayValue(current);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [isInView, target, duration]);

    const formattedValue = formatted
        ? displayValue.toLocaleString()
        : String(displayValue);

    return (
        <span ref={ref} className={className}>
            {prefix}{formattedValue}{suffix}
        </span>
    );
}
