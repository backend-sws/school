import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Mode = 'light' | 'dark';

export function ThemeSettings() {
    const [mode, setMode] = useState<Mode>('light');

    useEffect(() => {
        const saved = localStorage.getItem('app-mode') as Mode | null;
        const initial: Mode = saved === 'dark' ? 'dark' : 'light';
        setMode(initial);
        applyMode(initial);
    }, []);

    const applyMode = (m: Mode) => {
        document.documentElement.classList.toggle('dark', m === 'dark');
        localStorage.setItem('app-mode', m);
    };

    const toggle = () => {
        const next: Mode = mode === 'light' ? 'dark' : 'light';
        setMode(next);
        applyMode(next);
    };

    return (
        <Button variant="ghost" size="icon" className="focus-ring h-9 w-9" onClick={toggle}>
            {mode === 'light' ? (
                <Moon className="h-[1.1rem] w-[1.1rem]" />
            ) : (
                <Sun className="h-[1.1rem] w-[1.1rem]" />
            )}
            <span className="sr-only">Toggle {mode === 'light' ? 'dark' : 'light'} mode</span>
        </Button>
    );
}

