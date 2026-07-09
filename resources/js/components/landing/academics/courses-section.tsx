import { Clock, ArrowRight } from 'lucide-react';
import { COURSES } from '@/constants';

interface CoursesSectionProps {
    courses?: {
        degree: string;
        name: string;
        duration: string;
        streams: string[];
        eligibility: string;
    }[];
}

export function CoursesSection({ courses }: CoursesSectionProps) {
    const courseList = courses || COURSES;
    return (
        <div className="space-y-8">
            {/* Section Header */}
            <div>
                <div className="section-title-label">Programs Offered</div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Undergraduate Courses
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                    Explore our range of undergraduate programs designed to shape your future career.
                </p>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {courseList.map((course) => (
                    <div
                        key={course.degree}
                        className="natural-card rounded-xl p-6 hover:border-primary/30 transition-colors"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                {course.degree}
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">{course.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="w-3.5 h-3.5" />
                                    {course.duration}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div>
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Available Subjects
                                </span>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {course.streams.map((stream, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
                                        >
                                            {stream}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Eligibility
                                </span>
                                <p className="text-sm text-foreground mt-1">{course.eligibility}</p>
                            </div>
                        </div>

                        <a
                            href="#admission"
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                            Apply Now
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
