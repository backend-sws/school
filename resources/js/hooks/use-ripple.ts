import { useState, useLayoutEffect, useCallback } from 'react';

interface Ripple {
    x: number;
    y: number;
    size: number;
    id: number;
}

export const useRipple = () => {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
        const container = event.currentTarget;
        const rect = container.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const newRipple: Ripple = {
            x,
            y,
            size,
            id: Date.now(),
        };

        setRipples((prevRipples) => [...prevRipples, newRipple]);
    }, []);

    useLayoutEffect(() => {
        if (ripples.length > 0) {
            const timer = setTimeout(() => {
                setRipples((prevRipples) => prevRipples.slice(1));
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [ripples]);

    return { ripples, createRipple };
};
