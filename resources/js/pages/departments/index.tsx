import { usePage } from '@inertiajs/react';
import { DEPARTMENT_CATEGORIES, ALL_DEPARTMENTS } from '@/constants';
import { useInstitution } from '@/hooks/use-institution';
import PublicLayout from '@/layouts/public/public-layout';
import { DepartmentSection } from '@/components/landing/departments/department-section';
import Each from '@/components/Each';

interface DepartmentCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
}

interface Department {
    id: string;
    name: string;
    shortName: string;
    description: string;
    faculty: { name: string; designation: string }[];
}

interface DepartmentsByCategory {
    [key: string]: Department[];
}

interface PageProps {
    departmentCategories?: DepartmentCategory[];
    departments?: DepartmentsByCategory;
}

export default function Departments() {
    const { departmentCategories, departments } = usePage<{ props: PageProps }>().props as unknown as PageProps;
    const { name, location, affiliation } = useInstitution();

    // Fallback to constants if backend data not available
    const categories = departmentCategories || DEPARTMENT_CATEGORIES;
    const allDepts = departments || ALL_DEPARTMENTS;

    return (
        <PublicLayout
            title={`Departments | ${name}`}
            description={`Academic departments and programs at ${name}, ${location}. Explore faculty, courses, and disciplines. ${affiliation}.`}
        >
            {/* Hero Section */}
            <section className="relative py-16 md:py-24 bg-background overflow-hidden">
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.2em] text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                        Our Academic Divisions
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 text-foreground tracking-tight">
                        Departments
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Explore our diverse range of academic departments offering quality education across Arts, Science, Commerce, and Vocational streams.
                    </p>

                    <nav className="flex justify-center items-center space-x-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                        <a href="/" className="hover:text-primary transition-colors">Home</a>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-foreground">Departments</span>
                    </nav>
                </div>
            </section>

            {/* Department Sections */}
            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-[1440px] px-4 md:px-8 space-y-16">
                    <Each
                        of={categories}
                        keyExtractor={(category) => String(category.id)}
                        render={(category) => (
                            <DepartmentSection
                                key={category.id}
                                category={category}
                                departments={allDepts[category.id as keyof typeof allDepts] || []}
                            />
                        )}
                    />
                </div>
            </section>
        </PublicLayout>
    );
}
