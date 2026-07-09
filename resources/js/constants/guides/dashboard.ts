import { GuideDefinition } from "@/types/guide";

export const DASHBOARD_GUIDE: GuideDefinition = {
    id: "dashboard_guide",
    pageTitle: "Dashboard Overview",
    pageSubtitle: "Central monitoring hub for your institution's academic and operational vitals.",
    pageGuidance: [
        "Monitor student enrollments, admission trends, and fee collections in real-time.",
        "Track pending tasks that require your immediate attention to ensure smooth operations.",
        "Use the analytics charts to identify growth patterns and seasonal variations in institutional data."
    ],
    settingsTip: "Your dashboard is the pulse of your institution. Review it daily to catch trends early and stay on top of your key operational metrics.",
    steps: [
        {
            element: "#dashboard-header",
            title: "Welcome to your Dashboard",
            description: "Good to see you! Here you can get a bird's eye view of your institution's health.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#dashboard-stats",
            title: "Live Analytics",
            description: "Track key metrics like total students, admissions, and fee collection in real-time.",
            type: "graphic",
            imageUrl: "/assets/guides/dashboard-metrics.svg",
            imageAlt: "Dashboard Stats Breakdown",
            position: "bottom"
        },
        {
            element: "#dashboard-charts",
            title: "Visual Trends",
            description: "Deep dive into your data with interactive charts for admissions and fee collections.",
            type: "standard",
            position: "top"
        }
    ]
};
