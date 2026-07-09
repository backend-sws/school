import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;
/** Tailwind xl breakpoint (calendar shown in hero when true) */
const XL_BREAKPOINT = 1280;

const mql =
    typeof window === 'undefined'
        ? undefined
        : window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

const xlMql =
    typeof window === 'undefined'
        ? undefined
        : window.matchMedia(`(min-width: ${XL_BREAKPOINT}px)`);

function mediaQueryListener(callback: (event: MediaQueryListEvent) => void) {
    if (!mql) {
        return () => {};
    }

    mql.addEventListener('change', callback);

    return () => {
        mql.removeEventListener('change', callback);
    };
}

function xlMediaQueryListener(callback: (event: MediaQueryListEvent) => void) {
    if (!xlMql) {
        return () => {};
    }
    xlMql.addEventListener('change', callback);
    return () => xlMql.removeEventListener('change', callback);
}

function isSmallerThanBreakpoint(): boolean {
    return mql?.matches ?? false;
}

function isXlOrLarger(): boolean {
    return xlMql?.matches ?? false;
}

function getServerSnapshot(): boolean {
    return false;
}

export function useIsMobile(): boolean {
    return useSyncExternalStore(
        mediaQueryListener,
        isSmallerThanBreakpoint,
        getServerSnapshot
    );
}

/** True when viewport is xl (1280px) or larger. Use to show Study Calendar in hero vs in a popover. */
export function useIsXl(): boolean {
    return useSyncExternalStore(
        xlMediaQueryListener,
        isXlOrLarger,
        getServerSnapshot
    );
}
