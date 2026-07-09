import { useState, useEffect } from 'react';
import { Link } from 'lucide-react';

// Tab configuration
const ACADEMIC_TABS = [
    { id: 'admission', label: 'Admission', icon: '📋' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'syllabus', label: 'Syllabus', icon: '📚' },
    { id: 'staff', label: 'Staff', icon: '👥' },
    { id: 'courses', label: 'Courses', icon: '🎓' },
    { id: 'policies', label: 'Policies', icon: '📜' },
] as const;

type TabId = typeof ACADEMIC_TABS[number]['id'];

interface AcademicsTabsProps {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
}

import { Button } from '@/components/ui/button';

export function AcademicsTabs({ activeTab, onTabChange }: AcademicsTabsProps) {
    return (
        <div className="w-full overflow-x-auto scrollbar-thin">
            <div className="flex gap-2 p-1 bg-muted/50 rounded-xl border border-border/50 min-w-max">
                {ACADEMIC_TABS.map((tab) => (
                    <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? 'default' : 'ghost'}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                            transition-all duration-200 whitespace-nowrap h-auto
                            ${activeTab !== tab.id && 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}
                        `}
                    >
                        <span className="text-base">{tab.icon}</span>
                        <span>{tab.label}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
}

export { ACADEMIC_TABS };
export type { TabId };
