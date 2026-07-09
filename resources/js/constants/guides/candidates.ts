import { GuideDefinition } from "@/types/guide";

export const CANDIDATES_GUIDE: GuideDefinition = {
    id: "candidates_guide",
    pageTitle: "Admission Enquiry",
    pageSubtitle: "Monitor and verify new student registrations, applications, and preliminary profiles",
    pageGuidance: [
        "Track incoming student enquiries from your digital registration portals and website.",
        "Verify student identity via email and mobile checks before escalating to formal applications.",
        "Toggle account access for candidates to manage lead progression and security."
    ],
    settingsTip: "Speed up your enrollment process by verifying documents as soon as they're uploaded. This moves candidates through the pipeline faster.",
    steps: [
        {
            element: "#candidates-header",
            title: "Admission Enquiries",
            description: "This is where all new student enquiries and registrations land before they become formal applications.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#candidates-filter-bar",
            title: "Smart Filtering",
            description: "Search by phone, email, or name. You can also filter by verification status to focus on actionable leads.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#candidates-table",
            title: "Enquiry Management",
            description: "View, edit, or toggle the account status of each candidate. Verified accounts can proceed to formal admission.",
            type: "standard",
            position: "top"
        }
    ]
};
