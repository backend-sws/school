import { GuideDefinition } from "@/types/guide";

export const ROLES_GUIDE: GuideDefinition = {
    id: "roles_guide",
    pageTitle: "Security Roles",
    pageSubtitle: "Create and manage institution-specific roles.",
    pageGuidance: [
        "Roles define what staff can see and do.",
        "Use custom roles to map your internal hierarchy directly to platform permissions.",
        "Ensure data security and focused functional workflows for every department."
    ],
    settingsTip: "Security is a shared responsibility. Assign the most restrictive roles necessary for each staff member's daily tasks to maintain data integrity.",
    steps: [
        {
            element: "#roles-header",
            title: "Access Control",
            description: "Security roles define what your staff members can see and do within the platform.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#create-role-btn",
            title: "Custom Workflows",
            description: "While the system comes with defaults, you can create custom roles for your specific institutional needs.",
            type: "standard",
            position: "left"
        },
        {
            element: "#roles-table",
            title: "Manage Permissions",
            description: "Edit roles to fine-tune permissions. Use the sync feature to apply changes across all assigned staff.",
            type: "standard",
            position: "top"
        }
    ]
};
