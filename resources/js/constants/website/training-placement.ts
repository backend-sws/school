/**
 * Training & Placement Section Static Data
 * Theme-centric design with consistent styling
 */

import {
    FileText,
    Users,
    Briefcase,
    Target,
    Award,
    Phone,
    Mail,
    MapPin,
    type LucideIcon,
} from 'lucide-react';

// Types
export interface PlacementStat {
    value: string;
    label: string;
    color: string;
}

export interface PlacementService {
    icon: LucideIcon;
    title: string;
    description: string;
    color: string;
}

export interface PlacementOfficer {
    name: string;
    designation: string;
    phone: string;
    email: string;
    address: string;
}

// Placement Statistics
export const PLACEMENT_STATS: PlacementStat[] = [
    { value: '80%', label: 'Placement Rate', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    { value: '15+', label: 'Partner Companies', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { value: '₹4.5L', label: 'Highest Package', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    { value: '500+', label: 'Students Placed', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
];

// Placement Services
export const PLACEMENT_SERVICES: PlacementService[] = [
    {
        icon: FileText,
        title: 'Resume Building',
        description: 'Professional guidance to craft impactful resumes that highlight your skills and achievements.',
        color: 'bg-primary/10 text-primary',
    },
    {
        icon: Users,
        title: 'Mock Interviews',
        description: 'Practice sessions with industry experts to boost your confidence and interview skills.',
        color: 'bg-info/10 text-info',
    },
    {
        icon: Briefcase,
        title: 'Industry Connect',
        description: 'Direct interaction with recruiters and companies through campus visits and job fairs.',
        color: 'bg-success/10 text-success',
    },
    {
        icon: Target,
        title: 'Skill Development',
        description: 'Training programs in soft skills, communication, and technical competencies.',
        color: 'bg-warning/10 text-warning',
    },
    {
        icon: Award,
        title: 'Career Counseling',
        description: 'One-on-one guidance to help you choose the right career path aligned with your goals.',
        color: 'bg-destructive/10 text-destructive',
    },
];

// Placement Officer Details
export const PLACEMENT_OFFICER: PlacementOfficer = {
    name: 'Training & Placement Officer',
    designation: 'Training & Placement Cell',
    phone: '',
    email: '',
    address: 'Training & Placement Cell',
};

// About Content
export const PLACEMENT_ABOUT = {
    title: 'Training & Placement Cell',
    subtitle: 'Bridging Academics and Industry',
    description: `The Training and Placement Cell is dedicated to 
    preparing students for successful careers. We work closely with industry partners to provide 
    students with opportunities that match their skills and aspirations. Our comprehensive approach 
    includes skill development, career counseling, and direct placement assistance.`,
    mission: 'To empower every student with the skills, knowledge, and opportunities needed to achieve their career aspirations.',
};
