import type { Ticker } from '@/types/website';
import { htmlToPlainText } from '@/lib/utils';
import Each from '@/components/Each';

interface NewsTickerProps {
    tickers: Ticker[];
}

export function NewsTicker({ tickers }: NewsTickerProps) {
    if(!tickers.length) return null
    return (
        <div className="relative z-40 -mt-px border-b border-border/40 bg-background/40 backdrop-blur-md">
            <div className="mx-auto max-w-[1440px] px-3 py-1.5 sm:px-4 sm:py-2 md:px-8 flex items-center gap-3 sm:gap-6 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-primary uppercase tracking-widest shrink-0">
                    <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-primary"></span>
                    </span>
                    Latest
                </div>
                <div className="w-px h-3 sm:h-4 bg-border shrink-0" />
                <div className="relative flex-1 overflow-hidden h-5 sm:h-6 min-w-0">
                    <div className="absolute flex animate-marquee gap-8 sm:gap-12 items-center h-full">
                        <Each
                            of={tickers}
                            keyExtractor={(t) => t.id}
                            render={(t) => (
                                <span className="text-xs sm:text-sm font-medium text-foreground/80 shrink-0">
                                    {htmlToPlainText(t.content)}
                                </span>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
