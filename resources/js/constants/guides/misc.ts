import { GuideDefinition } from "@/types/guide";

export const INSTITUTES_GUIDE: GuideDefinition = {
    id: "institutes_guide",
    pageTitle: "Institute Management",
    pageSubtitle: "Manage child institutes and campus branches under your organization.",
    pageGuidance: [
        "Configure individual branches with unique logos, addresses, and contacts.",
        "Manage branch-specific settings while maintaining central oversight.",
        "Monitor status and operational health of all campuses in your network."
    ],
    settingsTip: "Centralized management of your institute branches ensures consistency in branding and academic standards across all your campuses.",
    steps: [
        {
            element: "#institutes-header",
            title: "Institute Directory",
            description: "Overview of all branches under your central management.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#new-institute-btn",
            title: "Add Branch",
            description: "Register a new campus or sub-institute under your organization.",
            type: "standard",
            position: "bottom"
        }
    ]
};

export const ADMISSION_HEADS_GUIDE: GuideDefinition = {
    id: "admission_heads_guide",
    pageTitle: "Admission Categories",
    pageSubtitle: "Define custom admission types and entry points.",
    pageGuidance: [
        "Categorize admissions into types like 'Regular', 'Lateral Entry', or 'Scholarship'.",
        "Enable or disable admission heads based on the current session requirements.",
        "Standardize admission reporting by using consistent head definitions."
    ],
    settingsTip: "Admission categories help you track different entry points for students. Use them to analyze which channels are most effective for your institution.",
    steps: [
        {
            element: "#admission-heads-header",
            title: "Admission Types",
            description: "Define the various channels through which students join.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#new-admission-head-btn",
            title: "Create Entry Type",
            description: "Define a new admission category (e.g., Transfer Student).",
            type: "standard",
            position: "bottom"
        }
    ]
};

export const CERTIFICATE_HEADS_GUIDE: GuideDefinition = {
    id: "certificate_heads_guide",
    pageTitle: "Document Types",
    pageSubtitle: "Design and manage various certificates and identity documents.",
    pageGuidance: [
        "Create templates for Transfer Certificates, Character Certificates, and ID Cards.",
        "Configure custom fields and layout preferences for each document type.",
        "Ensure standardization of all outgoing institutional documents."
    ],
    settingsTip: "Templates ensure that all your institutional documents look professional and consistent. Use high-resolution logos and clear fonts for the best results.",
    steps: [
        {
            element: "#certificate-heads-header",
            title: "Document Builder",
            description: "Manage the types of certificates your institution issues.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#new-certificate-head-btn",
            title: "Add Template",
            description: "Define a new document type for issuance.",
            type: "standard",
            position: "bottom"
        }
    ]
};
export const FEE_HEADS_GUIDE: GuideDefinition = {
    id: "fee_heads_guide",
    pageTitle: "Fee Head Management",
    pageSubtitle: "Define and manage primary fee components for your institution.",
    pageGuidance: [
        "Fee heads represent the core financial categories like 'Admission Fee' or 'Exam Fee'.",
        "Associate fee heads with ledger accounts for accurate financial tracking.",
        "Enable or disable fee heads based on seasonal or specific academic requirements."
    ],
    settingsTip: "Clear fee heads are the foundation of your financial reporting. Use descriptive names that are easy for both staff and parents to understand.",
    steps: [
        {
            element: "#fee-heads-header",
            title: "Financial Blueprint",
            description: "Define the fundamental building blocks of your institution's fee structure.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#new-fee-head-btn",
            title: "Add Fee Component",
            description: "Register a new primary fee head to start collecting related payments.",
            type: "standard",
            position: "bottom"
        }
    ]
};

export const CERTIFICATE_APPLICATIONS_GUIDE: GuideDefinition = {
    id: "certificate_applications_guide",
    pageTitle: "Certificate Desk",
    pageSubtitle: "Process and manage student requests for official documents.",
    pageGuidance: [
        "Review and approve requests for Transfer Certificates, ID Cards, and more.",
        "Track the status of applications from submission to final issuance.",
        "Generate and download documents directly after approval."
    ],
    settingsTip: "Processing certificate requests promptly improves student satisfaction. Aim for a quick turnaround time to support your students' future endeavors.",
    steps: [
        {
            element: "#certificate-applications-header",
            title: "Request Management",
            description: "Centralized hub for all outgoing student document requests.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#applications-table",
            title: "Processing Queue",
            description: "Manage the lifecycle of document requests and monitor their current status.",
            type: "standard",
            position: "top"
        }
    ]
};

export const NOTIFICATIONS_GUIDE: GuideDefinition = {
    id: "notifications_guide",
    pageTitle: "Notifications",
    pageSubtitle: "Stay updated with institutional activity and personal alerts.",
    pageGuidance: [
        "Receive real-time alerts for fee payments, exam schedules, and library dues.",
        "Mark notifications as read to keep your inbox organized.",
        "Enable live notifications to get instant popups for any institutional activity."
    ],
    settingsTip: "Don't miss a beat! Regularly check your notifications and keep 'Live Notifications' enabled to stay informed about critical institutional updates.",
    steps: [
        {
            element: "#notifications-header",
            title: "Alert Center",
            description: "Manage all your institutional updates and personal alerts from this hub.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "[role='tablist']",
            title: "Filter Alerts",
            description: "Switch between 'All' and 'Unread' notifications to focus on what needs your attention.",
            type: "standard",
            position: "bottom"
        }
    ]
};
