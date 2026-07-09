import { Quote, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const TESTIMONIALS = [
    {
        name: 'Aisha Sharma',
        exam: 'JEE Advanced 2025',
        result: 'AIR 42',
        quote: 'The faculty here is world-class. Their focused approach and personal mentoring helped me crack JEE Advanced on my first attempt. The test series was incredibly helpful.',
        rating: 5,
    },
    {
        name: 'Rahul Kumar',
        exam: 'NEET UG 2025',
        result: 'AIR 156',
        quote: 'I joined the NEET batch after 12th and the structured curriculum plus daily practice tests made all the difference. I am grateful to the entire team.',
        rating: 5,
    },
    {
        name: 'Priya Singh',
        exam: 'UPSC CSE 2024',
        result: 'AIR 23',
        quote: 'The answer writing practice and mock interviews were game-changers. The GS faculty breaks down complex topics into easy-to-understand modules.',
        rating: 5,
    },
    {
        name: 'Arjun Patel',
        exam: 'NEET UG 2024',
        result: 'AIR 89',
        quote: 'Joining the crash course was the best decision I made. The revision strategy and previous year analysis were spot on.',
        rating: 4,
    },
];

/**
 * Testimonials — Coaching-specific landing section.
 * Carousel of student quotes with star ratings.
 */
export function Testimonials() {
    const [activeIdx, setActiveIdx] = useState(0);
    const activeTestimonial = TESTIMONIALS[activeIdx];

    return (
        <section className="py-6 sm:py-10 md:py-14">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="h-[1px] w-6 sm:w-8 bg-primary" />
                <h2 className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    Student Testimonials
                </h2>
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-6 sm:p-8 md:p-10">
                {/* Active Testimonial */}
                <div className="relative mb-6 sm:mb-8">
                    <Quote className="h-8 w-8 sm:h-10 sm:w-10 text-primary/20 absolute -top-1 -left-1" />
                    <p className="text-sm sm:text-base md:text-lg text-foreground font-medium leading-relaxed pl-8 sm:pl-10 italic">
                        "{activeTestimonial.quote}"
                    </p>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <p className="text-sm sm:text-base font-bold text-foreground">
                            {activeTestimonial.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">
                            {activeTestimonial.exam} • {activeTestimonial.result}
                        </p>
                        <div className="flex gap-0.5 mt-1.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3.5 w-3.5 ${i < activeTestimonial.rating
                                        ? 'text-primary fill-primary'
                                        : 'text-border'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex items-center gap-2">
                        {TESTIMONIALS.map((_, idx) => (
                            <Button
                                key={idx}
                                type="button"
                                variant="ghost"
                                onClick={() => setActiveIdx(idx)}
                                className={`h-2 p-0 min-w-0 transition-all duration-300 rounded-full ${idx === activeIdx
                                    ? 'w-6 bg-primary'
                                    : 'w-2 bg-border hover:bg-muted-foreground/30'
                                    }`}
                                aria-label={`View testimonial ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
