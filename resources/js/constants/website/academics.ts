/**
 * Academic Section Static Data
 */

// Admission Section
export const ADMISSION_STEPS = [
    {
        step: 1,
        title: 'Online Registration',
        description: 'Create your account on the College Admission Portal and fill in basic details.',
    },
    {
        step: 2,
        title: 'Document Upload',
        description: 'Upload required documents including marksheets, photo, and certificates.',
    },
    {
        step: 3,
        title: 'Fee Payment',
        description: 'Complete the admission fee payment through online banking or UPI.',
    },
];

export const ADMISSION_IMPORTANT_DATES = [
    { event: 'Application Start', date: 'June 1, 2025' },
    { event: 'Last Date to Apply', date: 'July 15, 2025' },
    { event: 'Merit List', date: 'July 25, 2025' },
    { event: 'Admission Confirmation', date: 'August 10, 2025' },
];

export const ADMISSION_DOWNLOADS = [
    { name: 'Admission Prospectus 2025', type: 'PDF', href: '#' },
    { name: 'Fee Structure', type: 'PDF', href: '#' },
    { name: 'Required Documents Checklist', type: 'PDF', href: '#' },
];

// Calendar Section
export const ACADEMIC_EVENTS = [
    { month: 'July', events: ['Academic Session Begins', 'Orientation Program'] },
    { month: 'August', events: ['Independence Day Celebration', 'Internal Assessment 1'] },
    { month: 'September', events: ['Annual Sports Meet', 'Teachers Day'] },
    { month: 'October', events: ['Mid-Semester Exams', 'Durga Puja Vacation'] },
    { month: 'November', events: ['Cultural Fest', 'Internal Assessment 2'] },
    { month: 'December', events: ['End Semester Exams', 'Winter Vacation Begins'] },
];

// Syllabus Section
export const SYLLABUS_DEPARTMENTS = [
    {
        name: 'Science',
        subjects: ['Physics', 'Chemistry', 'Mathematics', 'Botany', 'Zoology'],
    },
    {
        name: 'Arts',
        subjects: ['History', 'Political Science', 'Economics', 'Sociology', 'Hindi'],
    },
    {
        name: 'Commerce',
        subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics'],
    },
];

// Staff Section
export const TEACHING_STAFF = [
    { name: 'Dr. Rajesh Kumar', designation: 'Associate Professor', department: 'Physics', qualification: 'Ph.D.' },
    { name: 'Dr. Sunita Devi', designation: 'Assistant Professor', department: 'Chemistry', qualification: 'Ph.D.' },
    { name: 'Prof. Anil Singh', designation: 'Associate Professor', department: 'Mathematics', qualification: 'M.Sc., M.Phil.' },
    { name: 'Dr. Meera Kumari', designation: 'Assistant Professor', department: 'Botany', qualification: 'Ph.D.' },
    { name: 'Dr. Vikash Yadav', designation: 'Assistant Professor', department: 'History', qualification: 'Ph.D.' },
    { name: 'Prof. Ranjana Singh', designation: 'Associate Professor', department: 'Economics', qualification: 'M.A., M.Phil.' },
];

export const NON_TEACHING_STAFF = [
    { name: 'Shri Ram Prasad', designation: 'Head Clerk', department: 'Administration', contact: '9876543210' },
    { name: 'Shri Sunil Kumar', designation: 'Computer Operator', department: 'IT Cell', contact: '9876543211' },
    { name: 'Smt. Geeta Devi', designation: 'Lab Technician', department: 'Science Lab', contact: '9876543212' },
    { name: 'Shri Manoj Yadav', designation: 'Library Assistant', department: 'Library', contact: '9876543213' },
];

// Courses Section
export const COURSES = [
    {
        degree: 'B.Sc.',
        name: 'Bachelor of Science',
        duration: '3 Years',
        streams: ['Physics', 'Chemistry', 'Mathematics', 'Botany', 'Zoology'],
        eligibility: '10+2 with Science stream',
    },
    {
        degree: 'B.A.',
        name: 'Bachelor of Arts',
        duration: '3 Years',
        streams: ['History', 'Political Science', 'Economics', 'Sociology', 'Hindi', 'English'],
        eligibility: '10+2 from any recognized board',
    },
    {
        degree: 'B.Com.',
        name: 'Bachelor of Commerce',
        duration: '3 Years',
        streams: ['General', 'Honors'],
        eligibility: '10+2 with Commerce stream',
    },
];

// Policies Section
export const DISCIPLINARY_RULES = [
    'Proper college uniform is mandatory',
    'Minimum 75% attendance required',
    'Identity card must be worn at all times',
    'Mobile phones prohibited in classrooms',
    'Carrying weapons or prohibited items is punishable',
];

export const ANTI_RAGGING_POINTS = [
    'Zero tolerance for physical or mental harassment',
    'Immediate suspension pending inquiry',
    'Criminal prosecution under IPC',
];

export const ATTENDANCE_POLICIES = [
    { threshold: '75%', label: 'Minimum attendance required for examination', variant: 'primary' as const },
    { threshold: '65-74%', label: 'Condoned with medical certificate', variant: 'warning' as const },
    { threshold: '<65%', label: 'Not eligible to appear in exams', variant: 'destructive' as const },
];

export const ANTI_RAGGING_HELPLINE = '1800-180-5522';
