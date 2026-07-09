/**
 * Facilities Section Static Data
 * Theme-centric design with consistent styling
 */

import {
    Landmark,
    Library,
    Users,
    Monitor,
    Home,
    Dumbbell,
    Building,
    Heart,
    Trophy,
    Wifi,
    type LucideIcon,
} from 'lucide-react';

// Types
export interface Facility {
    id: string;
    name: string;
    icon: LucideIcon;
    description: string;
    color: string; // Theme-aware color class
    features?: string[];
}

// Facilities List
export const FACILITIES_LIST: Facility[] = [
    {
        id: 'bank',
        name: 'Bank',
        icon: Landmark,
        description: 'On-campus banking facility for students and staff to manage their financial needs conveniently.',
        color: 'bg-primary/10 text-primary',
        features: ['ATM Available', 'Account Services', 'Scholarship Disbursement'],
    },
    {
        id: 'central-library',
        name: 'Central Library',
        icon: Library,
        description: 'A well-stocked library with extensive collection of books, journals, and digital resources for academic excellence.',
        color: 'bg-info/10 text-info',
        features: ['10,000+ Books', 'Digital Repository', 'Reading Hall', 'E-Journals Access'],
    },
    {
        id: 'club',
        name: 'Club',
        icon: Users,
        description: 'Various student clubs and societies promoting extracurricular activities and holistic development.',
        color: 'bg-success/10 text-success',
        features: ['Cultural Club', 'Literary Club', 'Science Club', 'Debate Society'],
    },
    {
        id: 'computer-center',
        name: 'Computer Center',
        icon: Monitor,
        description: 'State-of-the-art computer lab with modern systems and high-speed internet connectivity.',
        color: 'bg-warning/10 text-warning',
        features: ['50+ Computers', 'High-Speed Internet', 'Programming Lab', 'Digital Learning'],
    },
    {
        id: 'guest-house',
        name: 'Guest House',
        icon: Home,
        description: 'Comfortable accommodation facility for visiting faculty, guests, and parents.',
        color: 'bg-primary/10 text-primary',
        features: ['AC Rooms', 'Dining Facility', '24/7 Service'],
    },
    {
        id: 'gymnasium',
        name: 'Gymnasium',
        icon: Dumbbell,
        description: 'Well-equipped gymnasium promoting physical fitness and healthy lifestyle among students.',
        color: 'bg-destructive/10 text-destructive',
        features: ['Modern Equipment', 'Trained Instructor', 'Separate Timings'],
    },
    {
        id: 'hostels',
        name: 'Hostels',
        icon: Building,
        description: 'Separate hostel facilities for boys and girls with all modern amenities and security.',
        color: 'bg-info/10 text-info',
        features: ['Boys Hostel', 'Girls Hostel', '24/7 Security', 'Mess Facility'],
    },
    {
        id: 'medical-facilities',
        name: 'Medical Facilities',
        icon: Heart,
        description: 'On-campus health center providing primary healthcare services and first-aid facilities.',
        color: 'bg-destructive/10 text-destructive',
        features: ['Medical Room', 'First Aid', 'Health Checkups', 'Emergency Services'],
    },
    {
        id: 'sports-facilities',
        name: 'Sports Facilities',
        icon: Trophy,
        description: 'Comprehensive sports infrastructure including playgrounds, courts, and indoor games.',
        color: 'bg-success/10 text-success',
        features: ['Cricket Ground', 'Football Field', 'Badminton Court', 'Indoor Games'],
    },
    {
        id: 'wifi',
        name: 'Wi-Fi Campus',
        icon: Wifi,
        description: 'Complete Wi-Fi enabled campus ensuring seamless connectivity for digital learning.',
        color: 'bg-warning/10 text-warning',
        features: ['High-Speed Connection', 'Campus-Wide Coverage', 'Secure Network'],
    },
];
