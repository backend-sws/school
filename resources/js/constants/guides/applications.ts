import { GuideDefinition } from "@/types/guide";

export const APPLICATIONS_GUIDE: GuideDefinition = {
    id: "applications_guide",
    pageTitle: "Application Desk",
    pageSubtitle: "Onboard new students and re-admit in one go. View and manage applications.",
    pageGuidance: [
        "Manage the transition from candidate enquiries to formal student applications.",
        "Track payment receipts and document verification status for each applicant.",
        "Approve or reject applications to move students into the active registry for the selected academic year."
    ],
    settingsTip: "Speed up your enrollment process by verifying documents as soon as they're uploaded. This moves candidates through the pipeline faster.",
    steps: [
        {
            element: "#applications-header",
            title: "Application Desk",
            description: "Manage formal admission applications. This is where you approve or reject prospective students.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#new-application-btn",
            title: "Onboard Students",
            description: "Directly create a new application to onboard students or re-admit existing ones into new programs.",
            type: "standard",
            position: "left"
        },
        {
            element: "#applications-table",
            title: "Processing Pipeline",
            description: "Track payment statuses and processing stages. Use the actions to view detailed documents or generate invoices.",
            type: "standard",
            position: "top"
        }
    ]
};
