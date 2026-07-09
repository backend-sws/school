import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import React from 'react';

interface IconLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    icon: React.ElementType;
    children: React.ReactNode;
    href: string | object;
}

export function IconLink({ href, icon: Icon, children, className, ...props }: IconLinkProps) {
    const isExternal = typeof href === 'string' && (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:'));
    const Component = isExternal ? 'a' : Link;

    return (
        // @ts-ignore
        <Component
            href={href as any}
            className={cn("hover:text-white transition-colors flex items-center gap-1.5", className)}
            {...props}
        >
            <Icon className="h-3 w-3" />
            <span className="hidden sm:inline">{children}</span>
        </Component>
    );
}
