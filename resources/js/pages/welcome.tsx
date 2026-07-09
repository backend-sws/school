import React, { useMemo, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import type { WelcomePageProps } from '@/types/website';
import { useInstitution } from '@/hooks/use-institution';
import { useLayoutContext } from '@/lib/layout-resolver';
import { usePublicWebsite } from '@/providers/PublicWebsiteProvider';
import PublicLayout from '@/layouts/public/public-layout';

// ─── Existing (shared) Components ────────────────────────────────
import { HeroSlider } from '@/components/landing/welcome/hero-slider';
import { NewsTicker } from '@/components/landing/welcome/news-ticker';
import { NoticeBoard } from '@/components/landing/welcome/notice-board';
import { PrincipalsDesk } from '@/components/landing/welcome/principals-desk';
import { StatsGrid } from '@/components/landing/welcome/stats-grid';
import { StudentZone } from '@/components/landing/welcome/student-zone';
import { QuickLinksGrid } from '@/components/landing/welcome/quick-links-grid';
import { DepartmentsShowcase } from '@/components/landing/welcome/departments-showcase';
import { GalleryPreview } from '@/components/landing/welcome/gallery-preview';
import { LatestNewsSidebar } from '@/components/landing/welcome/latest-news-sidebar';
import { UpcomingEventsSidebar } from '@/components/landing/welcome/upcoming-events-sidebar';
import { FeaturedVideos } from '@/components/landing/welcome/featured-videos';

// ─── School-specific Components ──────────────────────────────────
import { ClassesOverview } from '@/components/landing/school/classes-overview';
import { ParentCorner } from '@/components/landing/school/parent-corner';
import { SchoolTrustBar } from '@/components/landing/school/school-trust-bar';
import { WhyChooseUs } from '@/components/landing/school/why-choose-us';
import { AcademicCalendar } from '@/components/landing/school/academic-calendar';
import { AdmissionsCTA } from '@/components/landing/school/admissions-cta';

// ─── Coaching-specific Components ────────────────────────────────
import { ProgramShowcase } from '@/components/landing/coaching/program-showcase';
import { ResultsHighlight } from '@/components/landing/coaching/results-highlight';
import { FacultySpotlight } from '@/components/landing/coaching/faculty-spotlight';
import { BatchesTable } from '@/components/landing/coaching/batches-table';
import { Testimonials } from '@/components/landing/coaching/testimonials';

// ─── University-specific Components ──────────────────────────────
import { FacultiesOverview } from '@/components/landing/university/faculties-overview';
import { ResearchWing } from '@/components/landing/university/research-wing';
import { Collaborations } from '@/components/landing/university/collaborations';

import type { ComponentType } from 'react';
import type { SectionMeta } from '@/constants/landing/sections';
import Each from '@/components/Each';

// ─── Section → Component Map ─────────────────────────────────────
// Maps section IDs from the registry to actual React components.
// Each component is passed all page-level props it might need.

interface SectionProps {
    sliders: WelcomePageProps['sliders'];
    tickers: WelcomePageProps['tickers'];
    newsPreview: WelcomePageProps['newsPreview'];
    upcomingEvents: WelcomePageProps['upcomingEvents'];
    landingSettings: WelcomePageProps['landingSettings'];
    stats: WelcomePageProps['stats'];
    galleryPreview: WelcomePageProps['galleryPreview'];
    headDeskLabel: string;
    ctaLabel: string;
}

/**
 * Renders a section by its registry ID.
 * Returns null for unknown section IDs (safe fallback).
 */
function renderSection(section: SectionMeta, props: SectionProps) {
    switch (section.id) {
        // ── Hero Variants ────────────────────────────
        case 'hero':
            return <HeroSlider sliders={props.sliders} />;

        case 'hero-3col':
            return (
                <section className="mx-auto max-w-[1440px] px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6 items-start">
                        <div className="lg:col-span-6 lg:order-2 order-1">
                            <HeroSlider sliders={props.sliders} />
                        </div>
                        <div className="lg:col-span-3 lg:order-1 order-2">
                            <LatestNewsSidebar newsPreview={props.newsPreview} />
                        </div>
                        <div className="lg:col-span-3 lg:order-3 order-3">
                            <UpcomingEventsSidebar upcomingEvents={props.upcomingEvents} />
                        </div>
                    </div>
                </section>
            );

        // ── Shared Sections ──────────────────────────
        case 'principal':
            return <PrincipalsDesk landingSettings={props.landingSettings} />;

        case 'stats':
            return <StatsGrid stats={props.stats} />;

        case 'student-zone':
            return <StudentZone />;

        case 'notices':
            return <NoticeBoard />;

        case 'quick-links':
            return <QuickLinksGrid />;

        case 'gallery':
            return (
                <div className="border-t border-border/50">
                    <GalleryPreview galleryPreview={props.galleryPreview} />
                </div>
            );

        case 'departments':
            return (
                <div className="border-t border-border/50">
                    <DepartmentsShowcase />
                </div>
            );

        case 'videos':
            return <FeaturedVideos />;

        // ── School-specific ──────────────────────────
        case 'classes-overview':
            return <ClassesOverview />;

        case 'parent-corner':
            return <ParentCorner />;

        case 'school-trust-bar':
            return <SchoolTrustBar stats={props.stats} />;

        case 'why-choose-us':
            return <WhyChooseUs />;

        case 'academic-calendar':
            return <AcademicCalendar upcomingEvents={props.upcomingEvents} />;

        case 'admissions-cta':
            return <AdmissionsCTA />;

        // ── Coaching-specific ────────────────────────
        case 'programs':
            return <ProgramShowcase />;

        case 'results':
            return <ResultsHighlight />;

        case 'faculty-spotlight':
            return <FacultySpotlight />;

        case 'batches':
            return <BatchesTable ctaLabel={props.ctaLabel} />;

        case 'testimonials':
            return <Testimonials />;

        // ── University-specific ──────────────────────
        case 'faculties-overview':
            return <FacultiesOverview />;

        case 'research':
            return <ResearchWing />;

        case 'news-events-2col':
            return (
                <section className="py-5 sm:py-8 md:py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                        <LatestNewsSidebar newsPreview={props.newsPreview} />
                        <UpcomingEventsSidebar upcomingEvents={props.upcomingEvents} />
                    </div>
                </section>
            );

        case 'collaborations':
            return <Collaborations />;

        default:
            return null;
    }
}

/**
 * Determines the grid wrapper class based on section layout hint.
 */
function getSectionWrapper(layout: SectionMeta['layout']) {
    switch (layout) {
        case 'hero-3col':
            return ''; // hero-3col renders its own grid
        case '3col':
            return 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6';
        case '2col':
            return 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6';
        case 'full':
        default:
            return '';
    }
}

// ─── Main Welcome Page ───────────────────────────────────────────

export default function WelcomePage() {
    const { props: pageProps } = usePage<WelcomePageProps>();
    const { name, location, affiliation } = useInstitution();
    const { headDeskLabel, ctaLabel } = useLayoutContext();

    // Section order comes from PublicWebsiteProvider (merged DB + defaults)
    const { resolvedSections } = usePublicWebsite();

    const sliders = pageProps.sliders ?? [];
    const tickers = pageProps.tickers ?? [];

    const sectionProps: SectionProps = {
        sliders: pageProps.sliders,
        tickers: pageProps.tickers,
        newsPreview: pageProps.newsPreview,
        upcomingEvents: pageProps.upcomingEvents,
        landingSettings: pageProps.landingSettings,
        stats: pageProps.stats,
        galleryPreview: pageProps.galleryPreview,
        headDeskLabel,
        ctaLabel,
    };

    // Separate hero sections from content sections
    const heroSections = resolvedSections.filter(
        (s) => s.layout === 'hero-3col' || s.id === 'hero'
    );
    const contentSections = resolvedSections.filter(
        (s) => s.layout !== 'hero-3col' && s.id !== 'hero'
    );

    // Group consecutive sections with the same layout for grid wrapping
    const groupedSections = groupBySameLayout(contentSections);

    return (
        <PublicLayout
            title={`${name}, ${location}`}
            description={`${name}, ${location}. ${affiliation}. Official website for admissions, academics, events, and campus life.`}
        >
            <link rel="preconnect" href="https://fonts.bunny.net" />
            <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700|playfair-display:400,700|outfit:400,600,700" rel="stylesheet" />

            <a href="#main-content" className="skip-link">Skip to main content</a>

            {/* Background Decoration */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full" />
            </div>

            <NewsTicker tickers={tickers} />

            <main id="main-content" className="relative z-10 flex-1 min-h-[60vh]">
                {/* Hero Section(s) */}
                <Each
                    of={heroSections}
                    keyExtractor={(section) => String(section.id)}
                    render={(section) => (
                        <div key={section.id}>{renderSection(section, sectionProps)}</div>
                    )}
                />

                {/* Content Sections */}
                <div className="mx-auto max-w-[1440px] px-3 sm:px-4 md:px-6 lg:px-8">
                    {groupedSections.map((group, groupIdx) => {
                        if (group.layout === '3col' || group.layout === '2col') {
                            return (
                                <section key={groupIdx} className="py-5 sm:py-8 md:py-12">
                                    <div className={getSectionWrapper(group.layout)}>
                                        <Each
                                            of={group.sections}
                                            keyExtractor={(section) => String(section.id)}
                                            render={(section, idx) => (
                                                <React.Fragment key={`${section.id}-${idx}`}>
                                                    {renderSection(section, sectionProps)}
                                                </React.Fragment>
                                            )}
                                        />
                                    </div>
                                </section>
                            );
                        }
                        // Full-width sections render individually
                        return group.sections.map((section, idx) => (
                            <React.Fragment key={`${section.id}-${idx}`}>
                                {renderSection(section, sectionProps)}
                            </React.Fragment>
                        ));
                    })}
                </div>
            </main>
        </PublicLayout>
    );
}

// ─── Helper: Group consecutive sections with the same layout ─────
interface SectionGroup {
    layout: SectionMeta['layout'];
    sections: SectionMeta[];
}

function groupBySameLayout(sections: SectionMeta[]): SectionGroup[] {
    const groups: SectionGroup[] = [];
    for (const section of sections) {
        const lastGroup = groups[groups.length - 1];
        if (lastGroup && lastGroup.layout === section.layout && section.layout !== 'full') {
            lastGroup.sections.push(section);
        } else {
            groups.push({ layout: section.layout, sections: [section] });
        }
    }
    return groups;
}
