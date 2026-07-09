import { Head, usePage } from '@inertiajs/react';
import { useInstitution } from '@/hooks/use-institution';
import PublicLayout from '@/layouts/public/public-layout';
import { AboutHero } from '@/components/landing/about-us/about-hero';
import { VisionMissionGrid } from '@/components/landing/about-us/vision-mission-grid';
import { AboutPrincipalsDesk } from '@/components/landing/about-us/about-principals-desk';
import { HistorySection } from '@/components/landing/about-us/history-section';
import { AdministrationAffiliation } from '@/components/landing/about-us/administration-affiliation';
import { AboutContact } from '@/components/landing/about-us/about-contact';

interface AboutSettings {
    about_hero_title?: string;
    about_hero_subtitle?: string;
    about_hero_description?: string;
    about_vision?: string;
    about_mission?: string;
    about_history?: string;
    about_principal_name?: string;
    about_principal_designation?: string;
    about_principal_message?: string;
    about_principal_image?: string;
    about_history_image?: string;
    about_university_logo?: string;
    college_logo?: string;
}

interface CollegeDetails {
    name: string;
    location: string;
    affiliation: string;
    established: string;
    contact: {
        phone: string;
        email: string;
        address: string;
    };
}

interface PageProps {
    aboutSettings?: AboutSettings;
    collegeDetails?: CollegeDetails;
}

export default function AboutUs() {
    const { aboutSettings, collegeDetails } = usePage<{ props: PageProps }>().props as unknown as PageProps;
    const institution = useInstitution();
    const details = { ...institution, ...collegeDetails };

    return (
        <PublicLayout
            title={`About Us | ${institution.name}`}
            description={`Learn about ${institution.name} – history, vision, mission, and leadership. ${institution.affiliation}. Established ${institution.established}.`}
        >
            {/* Hero Section */}
            <AboutHero
                title={aboutSettings?.about_hero_title}
                subtitle={aboutSettings?.about_hero_subtitle}
                description={aboutSettings?.about_hero_description}
            />

            {/* Narrative Flow Sections */}
            <div className="space-y-0">
                {/* Vision & Mission Grid */}
                <div className="border-t border-border/50">
                    <VisionMissionGrid
                        vision={aboutSettings?.about_vision}
                        mission={aboutSettings?.about_mission}
                    />
                </div>

                {/* History Narrative */}
                <div className="border-t border-border/50 bg-muted/30">
                    <HistorySection
                        history={aboutSettings?.about_history}
                        image={aboutSettings?.about_history_image}
                        logo={aboutSettings?.college_logo}
                        established={details.established}
                    />
                </div>

                {/* Principal's Message */}
                <div className="border-t border-border/50">
                    <AboutPrincipalsDesk
                        name={aboutSettings?.about_principal_name}
                        designation={aboutSettings?.about_principal_designation}
                        message={aboutSettings?.about_principal_message}
                        image={aboutSettings?.about_principal_image}
                    />
                </div>

                {/* Administration & Affiliation */}
                <div className="border-t border-border/50 bg-muted/30">
                    <AdministrationAffiliation
                        universityLogo={aboutSettings?.about_university_logo}
                        collegeLogo={aboutSettings?.college_logo}
                    />
                </div>

                {/* Contact & Inquiry */}
                <div className="border-t border-border/50">
                    <AboutContact />
                </div>
            </div>
        </PublicLayout>
    );
}
