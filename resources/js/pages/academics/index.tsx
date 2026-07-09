import { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { useInstitution } from '@/hooks/use-institution';
import PublicLayout from '@/layouts/public/public-layout';
import { AcademicsTabs, ACADEMIC_TABS, type TabId } from '@/components/landing/academics/academics-tabs';
import { AdmissionSection } from '@/components/landing/academics/admission-section';
import { CalendarSection } from '@/components/landing/academics/calendar-section';
import { SyllabusSection } from '@/components/landing/academics/syllabus-section';
import { StaffSection } from '@/components/landing/academics/staff-section';
import { CoursesSection } from '@/components/landing/academics/courses-section';
import { PoliciesSection } from '@/components/landing/academics/policies-section';

interface AcademicsSettings {
    admission_steps?: any[];
    admission_dates?: any[];
    admission_downloads?: any[];
    academic_events?: any[];
    teaching_staff?: any[];
    non_teaching_staff?: any[];
    disciplinary_rules?: string[];
    anti_ragging_policies?: string[];
    anti_ragging_helpline?: string;
    attendance_policies?: any[];
    syllabus_departments?: any[];
    courses_list?: any[];
}

interface PageProps {
    academicsSettings?: AcademicsSettings;
}

export default function Academics() {
    const { academicsSettings } = usePage<{ props: PageProps }>().props as unknown as PageProps;
    const { name, affiliation } = useInstitution();

    const [activeTab, setActiveTab] = useState<TabId>('admission');
    const tabsSectionRef = useRef<HTMLElement>(null);

    const scrollToTabs = () => {
        tabsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    useEffect(() => {
        const hash = window.location.hash.replace('#', '') as TabId;
        if (hash && ACADEMIC_TABS.some(tab => tab.id === hash)) {
            setActiveTab(hash);
            setTimeout(scrollToTabs, 100);
        }

        const handleHashChange = () => {
            const newHash = window.location.hash.replace('#', '') as TabId;
            if (newHash && ACADEMIC_TABS.some(tab => tab.id === newHash)) {
                setActiveTab(newHash);
                scrollToTabs();
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleTabChange = (tab: TabId) => {
        setActiveTab(tab);
        window.history.replaceState(null, '', `#${tab}`);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'admission':
                return (
                    <AdmissionSection
                        steps={academicsSettings?.admission_steps}
                        dates={academicsSettings?.admission_dates}
                        downloads={academicsSettings?.admission_downloads}
                    />
                );
            case 'calendar':
                return <CalendarSection events={academicsSettings?.academic_events} />;
            case 'syllabus':
                return <SyllabusSection departments={academicsSettings?.syllabus_departments} />;
            case 'staff':
                return (
                    <StaffSection
                        teachingStaff={academicsSettings?.teaching_staff}
                        nonTeachingStaff={academicsSettings?.non_teaching_staff}
                    />
                );
            case 'courses':
                return <CoursesSection courses={academicsSettings?.courses_list} />;
            case 'policies':
                return (
                    <PoliciesSection
                        rules={academicsSettings?.disciplinary_rules}
                        antiRagging={academicsSettings?.anti_ragging_policies}
                        helpline={academicsSettings?.anti_ragging_helpline}
                        attendance={academicsSettings?.attendance_policies}
                    />
                );
            default:
                return <AdmissionSection />;
        }
    };

    return (
        <PublicLayout
            title={`Academics | ${name}`}
            description={`Academics at ${name} – admissions, courses, syllabus, faculty, and academic policies. ${affiliation}.`}
        >
            {/* Hero Section */}
            <section className="relative py-16 md:py-24 bg-background overflow-hidden">
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.2em] text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                        Academic Excellence
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 text-foreground tracking-tight">
                        Academics
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Everything you need to know about admissions, courses, faculty, and academic policies.
                    </p>

                    <nav className="flex justify-center items-center space-x-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                        <a href="/" className="hover:text-primary transition-colors">Home</a>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-foreground">Academics</span>
                    </nav>
                </div>
            </section>

            {/* Tabs Navigation */}
            <section ref={tabsSectionRef} className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50">
                <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-4">
                    <AcademicsTabs activeTab={activeTab} onTabChange={handleTabChange} />
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                    {renderContent()}
                </div>
            </section>
        </PublicLayout>
    );
}
