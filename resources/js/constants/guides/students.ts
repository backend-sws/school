import { GuideDefinition } from "@/types/guide";

export const STUDENTS_GUIDE: GuideDefinition = {
    id: "students_guide",
    pageTitle: "Students & Registry",
    pageSubtitle: "Consolidated overview of student registrations, verification statuses, and account activity",
    pageGuidance: [
        "Get a high-level view of student enrollment trends and account verification lifecycle.",
        "Identify discrepancies in student data by tracking unverified and disabled accounts.",
        "Compare program-specific performance and registration counts across different academic years."
    ],
    settingsTip: "Audit your student registry regularly. High numbers of unverified accounts can lead to bottlenecks during exam or fee collection periods.",
    steps: [
        {
            element: "#student-analytics-header",
            title: "Student Registry Overview",
            description: "Manage your student database and track verification states from this central hub.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#student-stats-grid",
            title: "Vital Statistics",
            description: "Monitor total enrollments vs verified accounts. Keeping this data clean ensures smooth institutional operations.",
            type: "graphic",
            imageUrl: "/assets/guides/student-verification.svg",
            imageAlt: "Verification Process Explained",
            position: "bottom"
        },
        {
            element: "#student-table-card",
            title: "Program Breakdown",
            description: "Compare registrations across different streams and departments. Use the filters to drill down into specific years.",
            type: "standard",
            position: "top"
        }
    ]
};

export const STUDENT_LIST_GUIDE: GuideDefinition = {
    id: "student_list_guide",
    pageTitle: "Student Directory",
    pageSubtitle: "Monitor and manage active student records, profiles, and account statuses",
    pageGuidance: [
        "Use filters to find students by academic program, session, or verification status.",
        "Search by name, email, or mobile to quickly locate specific student profiles.",
        "Click the view icon in the actions column to see detailed student records and history."
    ],
    settingsTip: "The directory is your primary tool for daily operations. Use the 'Session' filter to accurately view student lists for the current year.",
    steps: [
        {
            element: "#student-directory-header",
            title: "Student Hub",
            description: "From here you can manage all active students in your institution.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#student-filters-card",
            title: "Global Search",
            description: "Filter students by class, session, or verification state to narrow down your list.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#student-table-container",
            title: "Student Records",
            description: "View essential details at a glance. You can edit proiles or view full academic history from the actions column.",
            type: "standard",
            position: "top"
        }
    ]
};
