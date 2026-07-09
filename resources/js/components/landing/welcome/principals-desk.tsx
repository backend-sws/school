import { Users, MessageSquare, ArrowRight } from 'lucide-react';
import type { LandingSettings } from '@/types/website';
import { htmlToPlainText } from '@/lib/utils';

const DEFAULT_NAME = 'Prof. Name Surname';
const DEFAULT_DESIGNATION = 'Senior Principal';
const DEFAULT_MESSAGE = '"Our mission is to foster a learning environment that encourages critical thinking and innovation. We assume the responsibility of shaping the leaders of tomorrow with excellence."';

interface PrincipalsDeskProps {
    landingSettings?: LandingSettings;
}

export function PrincipalsDesk({ landingSettings = {} }: PrincipalsDeskProps) {
    const name = htmlToPlainText(landingSettings.principal_name)?.trim() || DEFAULT_NAME;
    const message = htmlToPlainText(landingSettings.principal_message) || DEFAULT_MESSAGE;
    const designation = DEFAULT_DESIGNATION;

    return (
        <div className="min-h-[280px] h-auto md:h-[450px] relative rounded-2xl sm:rounded-3xl border border-border bg-card flex flex-col overflow-hidden transition-all duration-300">
            <div className="p-4 sm:p-5 md:p-7 pb-3 sm:pb-4 shrink-0 relative z-10 flex items-center justify-between gap-3">
                <div className="relative shrink-0">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-xl sm:rounded-2xl bg-muted border border-border p-1 sm:p-1.5 transition-colors group-hover:border-primary/30">
                        <div className="h-full w-full rounded-lg sm:rounded-xl bg-muted-foreground/10 flex items-center justify-center overflow-hidden">
                            <Users className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-muted-foreground/40" />
                        </div>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-primary text-white border border-white/10">
                        <MessageSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </div>
                </div>
                <div className="text-right flex flex-col items-end min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-none mb-1 sm:mb-2">Principal&apos;s Desk</h3>
                    <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-primary/10 border border-primary/20">
                        <span className="text-[8px] sm:text-[10px] font-bold text-primary uppercase tracking-widest">Leadership</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 p-4 sm:p-5 md:p-7 pt-3 sm:pt-5 relative z-10 flex flex-col justify-between overflow-hidden min-h-0">
                <div className="min-h-0 overflow-y-auto scrollbar-hide">
                    <div className="flex flex-col mb-3 sm:mb-4">
                        <p className="text-sm sm:text-base font-bold text-foreground leading-tight">{name}</p>
                        <p className="text-[9px] sm:text-[11px] text-muted-foreground font-bold tracking-wider uppercase">{designation}</p>
                    </div>
                    <div className="relative">
                        <p className="text-xs sm:text-sm md:text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed font-bold italic opacity-90 indent-4 sm:indent-6 line-clamp-4 sm:line-clamp-none">
                            {message}
                        </p>
                    </div>
                </div>
                <div className="mt-6 border-t border-border pt-4">
                    <a href="#" className="flex items-center justify-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">
                        Read Full Message
                        <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                </div>
            </div>
        </div>
    );
}
