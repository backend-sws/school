import React, { useEffect, useRef, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import Navbar from './Landing/components/Navbar';
import Hero from './Landing/components/Hero';
import AudienceSection from './Landing/components/AudienceSection';
import FeaturesSection from './Landing/components/FeaturesSection';
import SocialProofSection from './Landing/components/SocialProofSection';
import ResultsSection from './Landing/components/ResultsSection';
import AddOnsSection from './Landing/components/AddOnsSection';
import FinalCTASection from './Landing/components/FinalCTASection';
import FAQSection from './Landing/components/FAQSection';
import OnboardingStepsSection from './Landing/components/OnboardingStepsSection';
import PartnersSection from './Landing/components/PartnersSection';
import Footer from './Landing/components/Footer';
import FlashBanner from './Landing/components/FlashBanner';
import TrustBadgeBanner from './Landing/components/TrustBadgeBanner';
import MotifCorners from '@/components/shared/MotifCorners';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

interface MainLandingProps {
    hero: any;
    stats: any[];
    audience: any[];
    features: any[];
    testimonials: any[];
    results: any[];
    plans: any[];
    addOns: any[];
    onboardingSteps: any[];
    partners: any[];
    faqs: any[];
}

function ScrollProgressBar({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const handleScroll = () => {
            const scrollTop = el.scrollTop;
            const scrollHeight = el.scrollHeight - el.clientHeight;
            setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
        };
        el.addEventListener('scroll', handleScroll, { passive: true });
        return () => el.removeEventListener('scroll', handleScroll);
    }, [scrollRef]);

    return <div className="l-scroll-progress" style={{ width: `${progress}%` }} />;
}



export default function MainLanding({
    hero, stats, audience, features, testimonials,
    results, plans, addOns, onboardingSteps, partners, faqs,
}: MainLandingProps) {
    const { name: appName } = usePage<SharedData>().props;
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={scrollRef}
            className="landing-page h-full l-bg l-fg l-font-body overflow-y-auto overflow-x-hidden"
        >
            <Head title={`${appName} | The Operating System for Modern Education`}>
                <meta name="description" content="Rishi Vidya is an Institutional OS for EdTech startups, coaching centers, schools, colleges, and universities. UDISE+ compliant. Go live in 48 hours with a 14-day free trial." />
                <meta property="og:title" content={`${appName} | The Operating System for Modern Education`} />
                <meta property="og:description" content="Automate admissions, fees, LMS, attendance, and compliance — all from one platform. Built for every type of educational institution." />
                <meta property="og:type" content="website" />
                <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "Rishi Vidya",
                    "url": "https://rishividya.tech",
                    "description": "The Operating System for Modern Education",
                    "founder": { "@type": "Organization", "name": "SutraCode Technologies" },
                    "sameAs": []
                })}</script>
                <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": faqs.map((faq: { question: string; answer: string }) => ({
                        "@type": "Question",
                        "name": faq.question,
                        "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
                    }))
                })}</script>
            </Head>

            <ScrollProgressBar scrollRef={scrollRef} />

            {/* Sticky header: banner + navbar stacked, no overlap */}
            <div className="sticky top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
                <TrustBadgeBanner />
                <FlashBanner />
                <Navbar />
            </div>

            <main className="space-y-0 relative">
                {/* Decorative motif — tiled across full page */}
                <MotifCorners variant="backdrop" />

                <div>
                    {/* 1. What do you do? */}
                    <Hero data={hero} />

                    {/* 2. Who is it for? */}
                    <ScrollReveal delay={0.1}>
                        <AudienceSection audience={audience} />
                    </ScrollReveal>

                    {/* 2b. Who trusts us? */}
                    <ScrollReveal delay={0.1}>
                        <PartnersSection partners={partners} />
                    </ScrollReveal>

                    {/* 3. Why does it matter? */}
                    <ScrollReveal delay={0.1}>
                        <FeaturesSection features={features} />
                    </ScrollReveal>

                    {/* 4. Why should I trust you? — HIDDEN FOR NOW */}
                    {/* <ScrollReveal delay={0.1}>
                        <SocialProofSection stats={stats} testimonials={testimonials} />
                    </ScrollReveal> */}

                    {/* 5. What are your services? */}
                    <ScrollReveal delay={0.1}>
                        <div className="max-w-7xl mx-auto px-4 pb-24">
                            <AddOnsSection addOns={addOns} />
                        </div>
                    </ScrollReveal>

                    {/* 6. How to get started? */}
                    <ScrollReveal delay={0.1}>
                        <OnboardingStepsSection steps={onboardingSteps} />
                    </ScrollReveal>

                    {/* 7. Show the proof? */}
                    <ScrollReveal delay={0.1}>
                        <ResultsSection results={results} />
                    </ScrollReveal>

                    {/* 7. Tell me what to do next? */}
                    <ScrollReveal delay={0.1}>
                        <FinalCTASection />
                    </ScrollReveal>

                    <ScrollReveal delay={0.1}>
                        <FAQSection faqs={faqs} />
                    </ScrollReveal>
                </div>
            </main>

            <Footer />
        </div>
    );
}
