import { GuideDefinition } from "@/types/guide";

export const READMISSION_ANALYTICS_GUIDE: GuideDefinition = {
    id: "readmission_analytics_guide",
    pageTitle: "Re-Admission Analytics",
    pageSubtitle: "Analyze student return patterns and retention trends.",
    pageGuidance: [
        "Identify the primary reasons students drop out and the volume of those returning to enrollment.",
        "Track gap durations to understand the long-term retention potential of your student body.",
        "Compare 'Successfully Re-Admitted' against 'Eligible' to measure the effectiveness of your return programs.",
    ],
    settingsTip: "Long gap durations (12+ months) might require additional refresher coursework for returning students. Use 'Retention Overview' to plan academic support.",
    steps: [
        {
            element: "#readmission-analytics-header",
            title: "Retention Insights",
            description: "Deep dive into your educational retention metrics and student lifecycle variations.",
            type: "standard",
            position: "bottom",
        },
        {
            element: "#readmission-analytics-stats",
            title: "Retention Funnel",
            description: "Monitor the bridge between former students (dropped/alumni) and active enrollment.",
            type: "standard",
            position: "bottom",
        },
    ],
};
