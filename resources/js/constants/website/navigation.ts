export const NAV_ITEMS = [
    { title: 'Home', href: '/' },
    { title: 'About Us', href: '/about-us' },
    {
        title: 'Academics',
        children: [
            { title: 'Admission', href: '/academics#admission' },
            { title: 'Academic Calendar', href: '/academics#calendar' },
            { title: 'Syllabus', href: '/academics#syllabus' },
            { title: 'Teaching Staff', href: '/academics#staff' },
            { title: 'Course Details', href: '/academics#courses' },
            { title: 'Policies', href: '/academics#policies' },
        ]
    },
    {
        title: 'Departments',
        children: [
            { title: 'Arts', href: '/departments#arts' },
            { title: 'Science', href: '/departments#science' },
            { title: 'Commerce', href: '/departments#commerce' },
            { title: 'Vocational', href: '/departments#vocational' },
        ]
    },
    {
        title: 'Facilities',
        children: [
            { title: 'Bank', href: '/facilities#bank' },
            { title: 'Central Library', href: '/facilities#central-library' },
            { title: 'Club', href: '/facilities#club' },
            { title: 'Computer Center', href: '/facilities#computer-center' },
            { title: 'Guest House', href: '/facilities#guest-house' },
            { title: 'Gymnasium', href: '/facilities#gymnasium' },
            { title: 'Hostels', href: '/facilities#hostels' },
            { title: 'Medical Facilities', href: '/facilities#medical-facilities' },
            { title: 'Sports Facilities', href: '/facilities#sports-facilities' },
            { title: 'Wi-Fi Campus', href: '/facilities#wifi' },
        ]
    },
    {
        title: 'Approval',
        children: [
            { title: 'AISHE', href: '/approval#aishe' },
            { title: 'BSEB', href: '/approval#bseb' },
            { title: 'NAAC', href: '/approval#naac' },
            { title: 'University', href: '/approval#university' },
            { title: 'Other Bodies', href: '/approval#other-bodies' },
        ]
    },
    { title: 'Training & Placement', href: '/training-placement' },
    {
        title: 'Gallery',
        children: [
            { title: 'Image Gallery', href: '/gallery' },
            { title: 'Video Gallery', href: '/gallery' },
        ]
    },
    { title: 'Contact', href: '/contact' },
];

export const FOOTER_SECTIONS = [
    {
        title: 'Quick Links',
        links: [
            { title: 'Admission', href: '/academics#admission' },
            { title: 'Exam Notice', href: '#' },
            { title: 'Result', href: '#' },
            { title: 'Academic Calendar', href: '/academics#calendar' },
            { title: 'Syllabus', href: '/academics#syllabus' },
            { title: 'Approvals', href: '/approval' },
        ]
    },
    {
        title: 'Department',
        links: [
            { title: 'Arts', href: '/departments#arts' },
            { title: 'Science', href: '/departments#science' },
            { title: 'Commerce', href: '/departments#commerce' },
            { title: 'Vocational', href: '/departments#vocational' },
            { title: 'Teaching Staff', href: '/academics#staff' },
        ]
    },
    {
        title: 'Services',
        links: [
            { title: 'Library', href: '#' },
            { title: 'Hostel', href: '#' },
            { title: 'Training & Placement', href: '/training-placement' },
            { title: 'Computer Center', href: '#' },
            { title: 'NSS / NCC', href: '#' },
        ]
    }
];
