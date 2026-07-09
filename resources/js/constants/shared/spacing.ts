/**
 * SPACING FACTORY
 * Standardized spacing levels for the entire application.
 * Maps semantic levels to CSS variables defined in base-tokens.css.
 */
export const SPACING_FACTORY = {
    /** 4px - Tightest gaps (e.g., label to input, icon to text) */
    TIGHT: 'var(--space-1)',
    
    /** 8px - Focused gaps (e.g., small internal card padding, helper text margin) */
    COMPACT: 'var(--space-2)',
    
    /** 12px - Component gaps (e.g., internal component structure) */
    COMPONENT: 'var(--space-3)',
    
    /** 16px - Standard block spacing (e.g., form field gap, regular card padding) */
    REGULAR: 'var(--space-4)',
    
    /** 24px - Structural gaps (e.g., card to card, section header to content) */
    STRUCTURAL: 'var(--space-6)',
    
    /** 32px - Layout padding (e.g., main container padding, large card padding) */
    LAYOUT: 'var(--space-8)',
    
    /** 40px - Major layout sections */
    MAJOR: 'var(--space-10)',
    
    /** 48px - Section level spacing */
    SECTION: 'var(--space-12)',
} as const;

export type SpacingLevel = keyof typeof SPACING_FACTORY;
