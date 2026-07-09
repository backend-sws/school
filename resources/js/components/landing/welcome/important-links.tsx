import { IMPORTANT_LINKS } from '@/constants';
import { ExternalLink, LinkIcon } from 'lucide-react';
import { SectionCard } from './section-card';

export function ImportantLinks() {
    return (
        <SectionCard
            title="Important Links"
            subtitle="Quick access to external resources"
            icon={<LinkIcon className="h-4 w-4" />}
            iconBgClass="bg-primary/10 text-primary"
        >
            <div className="p-3 space-y-1">
                {IMPORTANT_LINKS.map((link) => (
                    <a
                        key={link.title}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-all group"
                    >
                        <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                            <ExternalLink className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                {link.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {link.description}
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </SectionCard>
    );
}
