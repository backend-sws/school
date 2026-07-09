import { Link } from '@inertiajs/react';
import { QUICK_ACCESS_CARDS } from '@/constants';
import { login } from '@/routes';
import { Users, ArrowRight, FileText, GraduationCap, ChevronDown } from 'lucide-react';

export function QuickAccessSidebar() {
    // Process quick access cards with route helpers
    const processedQuickAccessCards = QUICK_ACCESS_CARDS.map(card => ({
        ...card,
        href: card.href === 'login' ? login().url : card.href
    }));

    return (
        <aside className="xl:col-span-3 space-y-6 order-2 xl:order-1">
            {/* Login Widget - Glass Card */}
            <div className="group rounded-2xl bg-card border border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/5 transition-all overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
                <div className="p-5">
                    <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Users className="h-4 w-4" />
                        </div>
                        Student Zone
                    </h3>
                    <div className="space-y-3">
                        <Link href={login()} className="flex items-center justify-between w-full p-3 rounded-xl bg-muted/50 border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all group/item">
                            <div>
                                <p className="text-sm font-bold text-foreground group-hover/item:text-primary transition-colors">Student Login</p>
                                <p className="text-xs text-muted-foreground">Access Dashboard</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform">
                                <ArrowRight className="h-4 w-4 text-primary" />
                            </div>
                        </Link>
                        <div className="grid grid-cols-2 gap-3">
                            <a href="#" className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-background hover:shadow-md transition-all">
                                <FileText className="h-5 w-5 text-primary/80" />
                                <span className="text-xs font-medium">Result</span>
                            </a>
                            <a href="#" className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-background hover:shadow-md transition-all">
                                <GraduationCap className="h-5 w-5 text-primary/80" />
                                <span className="text-xs font-medium">Alumni</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links - Clean List */}
            <div className="rounded-2xl bg-card border border-border/50 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-border/50 bg-muted/30">
                    <h3 className="text-sm font-bold text-foreground">Quick Access</h3>
                </div>
                <div className="p-2 space-y-1">
                    {processedQuickAccessCards.map((card, idx) => (
                        <a key={idx} href={card.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/5 transition-colors group">
                            <div className={`p-2 rounded-lg text-white bg-gradient-to-br ${card.color} shadow-sm group-hover:scale-105 transition-transform shadow-${card.color.split('-')[1]}-500/30`}>
                                <card.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{card.title}</p>
                            </div>
                            <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                        </a>
                    ))}
                </div>
            </div>
        </aside>
    );
}
