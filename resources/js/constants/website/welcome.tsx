import {
    Book,
    Laptop,
    Shield,
    HeartHandshake,
    Bell,
    FileText,
    Briefcase,
    Calendar,
    Users,
    GraduationCap,
    Building,
    BookOpen,
    Library,
    Monitor,
    FlaskConical,
    Trophy,
    Wifi,
    Dumbbell,
    Phone,
    Mail,
    MessageSquare,
    AlertCircle,
    HelpCircle
} from 'lucide-react';
import { COLLEGE_DETAILS } from '../shared/college';

export const CONTACT_LINKS = [
    {
        icon: Phone,
        value: COLLEGE_DETAILS.contact.phone || '',
        href: `tel:${(COLLEGE_DETAILS.contact.phone || '').replace(/\s/g, '')}`,
        label: 'Phone'
    },
    {
        icon: Mail,
        value: COLLEGE_DETAILS.contact.email || '',
        href: `mailto:${COLLEGE_DETAILS.contact.email || ''}`,
        label: 'Email'
    }
];

export const UTILITY_LINKS = [
    {
        icon: MessageSquare,
        href: '#',
        label: 'Feedback'
    },
    {
        icon: AlertCircle,
        href: '#',
        label: 'Grievance'
    },
    {
        icon: HelpCircle,
        href: '#',
        label: 'Enquire'
    }
];

export const HERO_SLIDES = [
    {
        title: "Empowering Minds, Shaping Futures.",
        subtitle: "Admissions Open 2025",
        desc: "Experience world-class education with a legacy of excellence. Join us to discover your true potential.",
        cta: "Apply Now",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1986&auto=format&fit=crop",
        gradient: "from-primary/80 via-primary/40 to-transparent"
    },
    {
        title: "A Legacy of Academic Excellence.",
        subtitle: "Est. 1978",
        desc: "Fostering critical thinking and innovation through our comprehensive curriculum and expert faculty.",
        cta: "Explore Courses",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop",
        gradient: "from-primary/90 via-primary/50 to-transparent"
    },
    {
        title: "Vibrant Campus Life & Culture.",
        subtitle: "Holistic Development",
        desc: "Beyond books, we nurture talent through sports, arts, and community engagement.",
        cta: "View Gallery",
        image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop",
        gradient: "from-primary/90 via-primary/50 to-transparent"
    },
    {
        // Pure Image Slide (No Text)
        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop",
        gradient: "from-transparent to-transparent"
    }
];

export const QUICK_ACCESS_CARDS = [
    {
        title: 'e-Content Study Material',
        description: 'Access digital learning resources prepared by faculty',
        icon: Book,
        color: 'from-blue-600 to-blue-700',
        href: '#',
    },
    {
        title: 'Education ERP System',
        description: 'Online admission & fee payment portal',
        icon: Laptop,
        color: 'from-emerald-600 to-emerald-700',
        href: 'login', // Marker for dynamic route
    },
    {
        title: 'Anti Ragging Cell',
        description: 'Zero tolerance policy - Report incidents',
        icon: Shield,
        color: 'from-orange-600 to-orange-700',
        href: '#',
    },
    {
        title: 'Grievance Redressal',
        description: 'Submit and track your grievances online',
        icon: HeartHandshake,
        color: 'from-purple-600 to-purple-700',
        href: '#',
    },
];

export const NEWS_TICKER = [
    "Semester-I (2025-2029) Practical Examination Notice 2025 has been released.",
    "B.A, B.SC. & B.COM UG Semester-3 Admissions are now open.",
    "Registration Notice for Semester-I (2025-2029) students.",
    "Last date for Admission Notice Semester-III (2024-28) extended.",
];

export const NOTICE_TABS = [
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'tenders', label: 'Tenders', icon: FileText },
    { id: 'placement', label: 'Placement', icon: Briefcase },
    { id: 'events', label: 'Events', icon: Calendar },
];

export const SAMPLE_NOTICES = [
    { title: 'Semester-I Practical Examination Notice 2025', description: 'All students of Semester-I (2025-2029) batch are hereby informed about the practical examination schedule.', date: '02 Jan, 2026', isNew: true },
    { title: 'B.A, B.SC. & B.COM Semester-3 Exam 2025', description: 'Examination dates for undergraduate semester-3 students have been announced.', date: '02 Jan, 2026', isNew: true },
    { title: 'Admission Notice Semester-III Date Extended', description: 'Last date for semester-III admissions has been extended till further notice.', date: '24 Dec, 2025', isNew: false },
    { title: 'Semester-V Practical Examination Notice', description: 'Practical examination schedule for all departments has been released.', date: '10 Dec, 2025', isNew: false },
    { title: 'Mid Term Examination Notice 2025', description: 'Mid-term examination for all UG and PG courses will commence from next week.', date: '08 Dec, 2025', isNew: false },
];

export const IMPORTANT_LINKS = [
    { title: 'PPU', url: 'http://www.ppup.ac.in/', description: 'Patliputra University' },
    { title: 'UGC', url: 'https://ugc.ac.in/', description: 'University Grants Commission' },
    { title: 'AISHE', url: 'https://aishe.gov.in/', description: 'All India Survey on Higher Education' },
    { title: 'NAAC', url: 'http://www.naac.gov.in/', description: 'Accreditation Council' },
    { title: 'RUSA', url: 'http://rusa.nic.in/', description: 'Rashtriya Uchchatar Shiksha Abhiyan' },
    { title: 'SWAYAM PRABHA', url: 'https://www.swayamprabha.gov.in/', description: 'Educational TV Channels' },
    { title: 'National Digital Library', url: 'https://ndl.iitkgp.ac.in/', description: 'Digital Library' },
    { title: 'e-PG Pathshala', url: 'https://epgp.inflibnet.ac.in/', description: 'E-Content for PG Courses' },
    { title: 'DigiLocker', url: 'https://www.digilocker.gov.in/', description: 'Digital Documents' },
];

export const STATS = [
    { label: 'Students Enrolled', value: '4000+', icon: Users },
    { label: 'Faculty Members', value: '120+', icon: GraduationCap },
    { label: 'Departments', value: '15+', icon: Building },
    { label: 'Courses Offered', value: '25+', icon: BookOpen },
];

export const FACILITIES = [
    { name: 'Central Library', icon: Library },
    { name: 'Computer Lab', icon: Monitor },
    { name: 'Science Labs', icon: FlaskConical },
    { name: 'Sports Complex', icon: Trophy },
    { name: 'Wi-Fi Campus', icon: Wifi },
    { name: 'Gymnasium', icon: Dumbbell },
];
