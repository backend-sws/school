import { GuideDefinition } from "@/types/guide";

export const GRIEVANCES_GUIDE: GuideDefinition = {
    id: "grievances_guide",
    pageTitle: "Grievance Management",
    pageSubtitle: "Coordinate and resolve institutional complaints and suggestions.",
    pageGuidance: [
        "Track the lifecycle of grievances from submission to final resolution.",
        "Categorize issues into academic, administrative, or facility-related for better reporting.",
        "Assign priority levels to ensure critical concerns are addressed immediately."
    ],
    settingsTip: "Speedy resolution is the best way to build trust. Aim to acknowledge every grievance within 24 hours to show your community that their voice matters.",
    steps: [
        {
            element: "#grievances-header",
            title: "Redressal: Grievances",
            description: "This dashboard provides an overview of all active and resolved grievances.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#grievances-table",
            title: "Grievance Log",
            description: "Monitor status, priority, and resolution timelines for all entries.",
            type: "standard",
            position: "top"
        }
    ]
};

export const TICKETS_GUIDE: GuideDefinition = {
    id: "tickets_guide",
    pageTitle: "Support Tickets",
    pageSubtitle: "Technical and operational support request tracking system.",
    pageGuidance: [
        "Monitor student and staff support requests in real-time.",
        "Filter by status (Open, Pending, Closed) to manage your support workload.",
        "Use ticket history to identify recurring technical or operational bottlenecks."
    ],
    settingsTip: "Use ticket categories to identify common issues. If you see many tickets for the same topic, consider publishing a global notice to address it.",
    steps: [
        {
            element: "#tickets-header",
            title: "Support Desk",
            description: "Manage all technical and operational support inquiries from here.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#tickets-filters",
            title: "Filter & Search",
            description: "Narrow down tickets by priority, status, or date to find specific issues.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#tickets-table",
            title: "Active Tickets",
            description: "View ticket details and click through to respond or update status.",
            type: "standard",
            position: "top"
        }
    ]
};

export const FEEDBACK_GUIDE: GuideDefinition = {
    id: "feedback_guide",
    pageTitle: "Stakeholder Feedback",
    pageSubtitle: "Analyze feedback from students, parents, and faculty.",
    pageGuidance: [
        "Collect qualitative feedback to improve institutional services and academics.",
        "Identify trends in satisfaction levels across different departments.",
        "Use feedback to inform policy changes and facility upgrades."
    ],
    settingsTip: "Qualitative feedback offers insights that numbers can't. Regularly review stakeholder comments to find small improvements with big impacts.",
    steps: [
        {
            element: "#feedback-header",
            title: "Feedback Analytics",
            description: "Review general feedback and satisfaction indicators.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#feedback-list",
            title: "Recent Feedback",
            description: "Browse through the latest comments and ratings received from your community.",
            type: "standard",
            position: "top"
        }
    ]
};

export const CONTACTS_GUIDE: GuideDefinition = {
    id: "contacts_guide",
    pageTitle: "Contact Directory",
    pageSubtitle: "Manage stakeholder communication channels and contact records.",
    pageGuidance: [
        "Maintain a centralized directory for all institutional contact inquiries.",
        "Track follow-ups for admission inquiries or general office visits.",
        "Organize contacts into categories for targeted communication campaigns."
    ],
    settingsTip: "The contact directory is a goldmine for admissions. Follow up with inquiries promptly to improve your conversion rates and enrollment numbers.",
    steps: [
        {
            element: "#contacts-header",
            title: "Communication Log",
            description: "A directory of all external inquiries and contact points.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#contacts-table",
            title: "Contact Records",
            description: "Manage personal details, inquiry types, and follow-up status.",
            type: "standard",
            position: "top"
        }
    ]
};
