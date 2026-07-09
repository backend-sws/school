import { GuideDefinition } from "@/types/guide";

export const ATTENDANCE_DASHBOARD_GUIDE: GuideDefinition = {
    id: "attendance_dashboard_guide",
    pageTitle: "Attendance Center",
    pageSubtitle: "Precision tracking and reporting for institutional attendance.",
    pageGuidance: [
        "Select a class and subject to mark or view attendance records.",
        "Use the 'Mark Attendance' button to start a new entry for today.",
        "Monitor student participation trends through quick-access report links."
    ],
    settingsTip: "Consistency is key. Marking attendance within the first 10 minutes of a session ensures high accuracy and better student tracking.",
    steps: [
        {
            element: "#attendance-header",
            title: "Performance Monitor",
            description: "A centralized view of your institution's attendance status.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#class-selector",
            title: "Focus Selection",
            description: "Choose the grade or section you want to manage.",
            type: "standard",
            position: "right"
        },
        {
            element: "#mark-attendance-btn",
            title: "Quick Entry",
            description: "Start marking attendance for the selected group immediately.",
            type: "standard",
            position: "bottom"
        }
    ]
};

export const ATTENDANCE_DAILY_GUIDE: GuideDefinition = {
    id: "attendance_daily_guide",
    pageTitle: "Daily Register",
    pageSubtitle: "Examine detailed daily logs across classes.",
    pageGuidance: [
        "Filter results by date, class, and subject to find specific records.",
        "Review presence/absence status for every student in the selected session.",
        "Identify and resolve any gaps in daily attendance data."
    ],
    settingsTip: "The daily register is your primary audit trail. Regularly verify entries to ensure no session goes unmarked.",
    steps: [
        {
            element: "#attendance-daily-header",
            title: "Daily Audit",
            description: "Trace attendance entries down to the individual student level.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#daily-filter-bar",
            title: "Precision Filtering",
            description: "Narrow down your view by date or academic group.",
            type: "standard",
            position: "bottom"
        }
    ]
};

export const ATTENDANCE_SUMMARY_GUIDE: GuideDefinition = {
    id: "attendance_summary_guide",
    pageTitle: "Compliance Summary",
    pageSubtitle: "Monitor 75% threshold and eligibility trends.",
    pageGuidance: [
        "Track cumulative attendance percentages for all students.",
        "Identify students falling below the mandatory attendance threshold.",
        "Generate summaries for parent meetings or administrative review."
    ],
    settingsTip: "Keep an eye on the compliance summary. Identifying students with falling attendance early allows for timely intervention and support.",
    steps: [
        {
            element: "#attendance-summary-header",
            title: "Compliance Overview",
            description: "Monitor school-wide attendance health and policy adherence.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#summary-table",
            title: "Metric Analytics",
            description: "Ranked list of attendance performance across all students.",
            type: "standard",
            position: "top"
        }
    ]
};
