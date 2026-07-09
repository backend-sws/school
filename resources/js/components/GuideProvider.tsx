import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { GuideDefinition } from '@/types/guide';

interface GuideContextType {
    startGuide: (definition: GuideDefinition) => void;
    registerGuide: (definition: GuideDefinition) => void;
    activeGuide: GuideDefinition | null;
    isGuideSeen: (guideId: string) => boolean;
}

const GuideContext = createContext<GuideContextType | undefined>(undefined);

export const GuideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeGuide, setActiveGuide] = useState<GuideDefinition | null>(null);

    const isGuideSeen = (guideId: string) => {
        return true;
    };

    const startGuide = useCallback((definition: GuideDefinition) => {
        // Guide tours have been disabled globally.
    }, []);

    const registerGuide = useCallback((definition: GuideDefinition) => {
        setActiveGuide(definition);
        return () => {
            setActiveGuide(null);
        };
    }, []);

    return (
        <GuideContext.Provider value={{ startGuide, registerGuide, activeGuide, isGuideSeen }}>
            {children}
        </GuideContext.Provider>
    );
};

export const useGuide = () => {
    const context = useContext(GuideContext);
    if (!context) {
        throw new Error('useGuide must be used within a GuideProvider');
    }
    return context;
};

/**
 * Register a guide definition on mount — replaces the manual useEffect + registerGuide pattern.
 * Usage: `useRegisterGuide(MY_GUIDE_CONFIG);`
 */
export const useRegisterGuide = (definition: GuideDefinition) => {
    const { registerGuide } = useGuide();
    useEffect(() => {
        return registerGuide(definition);
    }, [registerGuide, definition]);
};
