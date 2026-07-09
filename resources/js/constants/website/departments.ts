/**
 * Department Section Static Data
 * Following the same pattern as academics.ts
 */

// Types
export interface FacultyMember {
    name: string;
    qualification?: string;
    designation: string;
    contact?: string;
}

export interface Department {
    id: string;
    name: string;
    faculty: FacultyMember[];
}

export interface DepartmentCategory {
    id: string;
    name: string;
    icon: string;
    description: string;
    color: string; // Theme-aware color class
}

// Department Categories
export const DEPARTMENT_CATEGORIES: DepartmentCategory[] = [
    {
        id: 'arts',
        name: 'Arts Department',
        icon: '🎨',
        description: 'Humanities and Social Sciences',
        color: 'bg-primary/10 text-primary',
    },
    {
        id: 'science',
        name: 'Science Department',
        icon: '🔬',
        description: 'Natural and Physical Sciences',
        color: 'bg-info/10 text-info',
    },
    {
        id: 'commerce',
        name: 'Commerce Department',
        icon: '📊',
        description: 'Business and Accounting Studies',
        color: 'bg-success/10 text-success',
    },
    {
        id: 'vocational',
        name: 'Vocational Department',
        icon: '💼',
        description: 'Professional and Technical Courses',
        color: 'bg-warning/10 text-warning',
    },
];

// Arts Department
export const ARTS_DEPARTMENTS: Department[] = [
    {
        id: 'hindi',
        name: 'Hindi',
        faculty: [
            { name: 'Dr. Sharda Kumari', qualification: 'Ph.D.', designation: 'Assistant Professor' },
        ],
    },
    {
        id: 'english',
        name: 'English',
        faculty: [
            { name: 'Dr. Ram Krishna Paramhans', qualification: 'Ph.D.', designation: 'Principal' },
        ],
    },
    {
        id: 'geography',
        name: 'Geography',
        faculty: [
            { name: 'Dr. Amar Kumar', qualification: 'Ph.D.', designation: 'Guest Faculty' },
        ],
    },
    {
        id: 'history',
        name: 'History',
        faculty: [
            { name: 'Dr. Dhirendra Upadhyay', qualification: 'Ph.D.', designation: 'Guest Faculty' },
        ],
    },
    {
        id: 'home-science',
        name: 'Home Science',
        faculty: [
            { name: 'Dr. Aprajita Raj', qualification: 'Ph.D.', designation: 'Guest Faculty' },
        ],
    },
    {
        id: 'public-administration',
        name: 'Public Administration',
        faculty: [
            { name: 'Dr. Kamana', qualification: 'Ph.D.', designation: 'Assistant Professor' },
        ],
    },
    {
        id: 'pmir-lsw',
        name: 'PMIR/LSW',
        faculty: [
            { name: 'Dr. Rahul Prasad', qualification: 'Ph.D.', designation: 'Assistant Professor' },
        ],
    },
    {
        id: 'economics',
        name: 'Economics',
        faculty: [],
    },
    {
        id: 'philosophy',
        name: 'Philosophy',
        faculty: [],
    },
    {
        id: 'political-science',
        name: 'Political Science',
        faculty: [],
    },
];

// Science Department
export const SCIENCE_DEPARTMENTS: Department[] = [
    {
        id: 'physics',
        name: 'Physics',
        faculty: [],
    },
    {
        id: 'chemistry',
        name: 'Chemistry',
        faculty: [
            { name: 'Dr. Sahdeo Kumar', qualification: 'Ph.D.', designation: 'Guest Faculty' },
        ],
    },
    {
        id: 'mathematics',
        name: 'Mathematics',
        faculty: [],
    },
    {
        id: 'botany',
        name: 'Botany',
        faculty: [],
    },
    {
        id: 'electronics',
        name: 'Electronics',
        faculty: [
            { name: 'Dr. Shashi Bhushan Pandey', qualification: 'Ph.D.', designation: 'Assistant Professor' },
            { name: 'Dr. Haider', qualification: 'Ph.D.', designation: 'Assistant Professor' },
        ],
    },
    {
        id: 'zoology',
        name: 'Zoology',
        faculty: [],
    },
];

// Commerce Department
export const COMMERCE_DEPARTMENTS: Department[] = [
    {
        id: 'commerce',
        name: 'Commerce',
        faculty: [],
    },
];

// Vocational Department
export const VOCATIONAL_DEPARTMENTS: Department[] = [
    {
        id: 'bca',
        name: 'BCA (Computer Application)',
        faculty: [
            { name: 'Alpana Kumari', qualification: 'M.C.A.', designation: 'Guest Faculty' },
        ],
    },
    {
        id: 'bbm',
        name: 'BBM (Business Management)',
        faculty: [],
    },
    {
        id: 'bttm',
        name: 'BTTM (Tourism & Travel Management)',
        faculty: [],
    },
    {
        id: 'bsc-it',
        name: 'BSc-IT (Information Technology)',
        faculty: [],
    },
    {
        id: 'blis',
        name: 'BLIS (Library & Information Science)',
        faculty: [
            { name: 'Shyamali Kumari', qualification: 'M.L.I.Sc.', designation: 'Guest Faculty' },
        ],
    },
];

// All departments mapped by category
export const ALL_DEPARTMENTS = {
    arts: ARTS_DEPARTMENTS,
    science: SCIENCE_DEPARTMENTS,
    commerce: COMMERCE_DEPARTMENTS,
    vocational: VOCATIONAL_DEPARTMENTS,
} as const;
