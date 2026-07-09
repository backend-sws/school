import { GuideDefinition } from "@/types/guide";

export const PROMOTION_ANALYTICS_GUIDE: GuideDefinition = {
    id: "promotion_analytics_guide",
    pageTitle: "Promotion Analytics",
    pageSubtitle: "Track student transition trends and promotion velocity.",
    pageGuidance: [
        "Monitor how many students are eligible for promotion versus how many have actually transitioned.",
        "Track detention rates and rollback volumes to identify potential academic bottlenecks.",
        "Use the session filter to compare year-over-year promotion performance.",
    ],
    settingsTip: "High rollback counts often indicate data entry errors or changes in academic policy. Review 'Promotion Rollbacks' to maintain data integrity.",
    steps: [
        {
            element: "#promotion-analytics-header",
            title: "Promotion Strategy",
            description: "Analyze the success and accuracy of student transitions across academic sessions.",
            type: "standard",
            position: "bottom",
        },
        {
            element: "#promotion-analytics-stats",
            title: "Performance Metrics",
            description: "Quickly view your promotion funnel: from total eligible to final completed transitions.",
            type: "standard",
            position: "bottom",
        },
    ],
};
