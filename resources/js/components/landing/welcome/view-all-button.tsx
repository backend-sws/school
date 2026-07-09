import { ChevronRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ViewAllButtonProps {
    label: string | ReactNode;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon | null;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    variant?: 'glass' | 'link' | 'subtle';
}

export function ViewAllButton({
    label,
    href,
    onClick,
    icon: Icon = ChevronRight,
    className,
    type = 'button',
    disabled = false,
    variant = 'glass',
}: ViewAllButtonProps) {
    const isLink = variant === 'link';

    const baseStyles = cn(
        "flex items-center justify-center gap-2.5 transition-all group/btn uppercase tracking-widest font-black h-auto",
        variant === 'glass' && "py-3 pb-3.5 px-6 rounded-xl bg-primary text-primary-foreground text-[11px] hover:bg-primary/90",
        variant === 'subtle' && "py-2.5 px-6 rounded-xl bg-primary/10 text-primary border border-primary/20 text-[10px] hover:bg-primary/20 transition-all",
        isLink && "py-2 px-4 text-[11px] text-primary hover:text-primary/80",
        className
    );

    const content = (
        <>
            {label}
            {Icon && <Icon className="h-3.5 w-3.5 transform group-hover/btn:translate-x-1 transition-transform" />}
        </>
    );

    if (href) {
        const isExternal = href.startsWith('http') || href.startsWith('//');

        if (isExternal) {
            return (
                <Button
                    asChild
                    variant="ghost"
                    className={baseStyles}
                >
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {content}
                    </a>
                </Button>
            );
        }

        return (
            <Button
                asChild
                variant="ghost"
                className={baseStyles}
            >
                <Link
                    href={href}
                >
                    {content}
                </Link>
            </Button>
        );
    }

    return (
        <Button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={baseStyles}
            variant="ghost"
        >
            {content}
        </Button>
    );
}
