import { GuideDefinition } from "@/types/guide";

export const SETTINGS_GUIDE: GuideDefinition = {
    id: "settings_guide",
    pageTitle: "Profile Information",
    pageSubtitle: "Update your name and email address",
    pageGuidance: [
        "Your name will be used across the portal for attribution and reports.",
        "Ensure your email is verified to receive important notifications.",
        "Update your avatar to personalize your experience."
    ],
    settingsTip: "Keep your profile information accurate. This ensures that any automated notifications or reports identify you correctly.",
    steps: [
        {
            element: "#settings-sidebar",
            title: "Settings Navigation",
            description: "Easily navigate between personal profiles, institutional settings, and security configurations.",
            type: "standard",
            position: "right"
        },
        {
            element: "#settings-content-area",
            title: "Configuration Workspace",
            description: "This is where you update your details. Most settings pages follow this clean, form-based layout.",
            type: "standard",
            position: "left"
        },
        {
            element: "[data-test='update-profile-button']",
            title: "Apply Changes",
            description: "Don't forget to save your updates! We'll notify you once they're successfully applied.",
            type: "standard",
            position: "top"
        }
    ]
};

export const INSTITUTION_PROFILE_GUIDE: GuideDefinition = {
    id: "institution_profile_guide",
    pageTitle: "Institution Profile",
    pageSubtitle: "Manage your institution's core identity and contact information.",
    pageGuidance: [
        "Your institution name and logo will appear on all official documents and reports.",
        "Accurate contact details ensure smooth communication with stakeholders.",
        "This profile defines how your institution is represented throughout the system."
    ],
    settingsTip: "Your institution logo is used for receipts and certificates. Use a high-quality PNG with a transparent background for the best results.",
    steps: [
        {
            element: "#institution-header",
            title: "Institution Identity",
            description: "Update the core details that define your institution's public and internal presence.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#institution-form",
            title: "Details & Contact",
            description: "Carefully enter your official name, address, and contact information.",
            type: "standard",
            position: "top"
        }
    ]
};

export const STAFF_DIRECTORY_GUIDE: GuideDefinition = {
    id: "staff_directory_guide",
    pageTitle: "Staff Directory",
    pageSubtitle: "Centralized management of all your academic and non-academic staff.",
    pageGuidance: [
        "Add new staff members and manage their profile details from a single dashboard.",
        "Filter staff by department or role to quickly find specific team members.",
        "Update staff status and manage their access permissions within the institution."
    ],
    settingsTip: "Regularly audit your staff directory to ensure that former employees' access is revoked and new joiners are correctly onboarded.",
    steps: [
        {
            element: "#staff-header",
            title: "Personnel Management",
            description: "Overview of your institution's human resources and their current status.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#new-staff-btn",
            title: "Onboard Staff",
            description: "Use this button to start the onboarding process for new employees.",
            type: "standard",
            position: "left"
        },
        {
            element: "#staff-table",
            title: "Staff Records",
            description: "View, edit, or manage the profiles and permissions of your team members.",
            type: "standard",
            position: "top"
        }
    ]
};

export const ROLES_GUIDE: GuideDefinition = {
    id: "roles_guide",
    pageTitle: "Security Roles",
    pageSubtitle: "Define and manage user permissions and access levels.",
    pageGuidance: [
        "Create custom roles with granular permissions for different staff functions.",
        "Review existing roles to ensure they follow the principle of least privilege.",
        "Update role permissions as your institution's operational needs evolve."
    ],
    settingsTip: "Assign roles based on job functions rather than individuals. This makes it much easier to scale your team as your institution grows.",
    steps: [
        {
            element: "#roles-header",
            title: "Access Control",
            description: "Manage the different security roles available within your institution.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#new-role-btn",
            title: "Create Role",
            description: "Define a new set of permissions for specific user groups.",
            type: "standard",
            position: "left"
        },
        {
            element: "#roles-table",
            title: "Role Inventory",
            description: "List of all defined roles. You can view or edit their specific permission sets here.",
            type: "standard",
            position: "top"
        }
    ]
};

export const DATA_IMPORT_GUIDE: GuideDefinition = {
    id: "data_import_guide",
    pageTitle: "Bulk Data Import",
    pageSubtitle: "Easily upload large datasets into the system using CSV templates.",
    pageGuidance: [
        "Select the module you want to import data for and download the corresponding template.",
        "Fill the template carefully, ensuring all required fields are present and correctly formatted.",
        "Upload the completed file to initiate the bulk import process."
    ],
    settingsTip: "Always download the latest CSV template before starting an import. Column structures may change after system updates.",
    steps: [
        {
            element: "#import-header",
            title: "Bulk Onboarding",
            description: "Streamline your data entry process by importing records in bulk.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#import-form",
            title: "Import Workflow",
            description: "Choose your target module and follow the on-screen instructions to upload your data.",
            type: "standard",
            position: "top"
        }
    ]
};

export const ADMISSION_POLICY_GUIDE: GuideDefinition = {
    id: "admission_policy_guide",
    pageTitle: "Admission Policy",
    pageSubtitle: "Configure rules and instructions for admission and re-admission.",
    pageGuidance: [
        "These settings control the branding and steps shown to students in the public portals.",
        "Ensure instructions are clear to reduce support tickets during peak enrollment.",
        "You can toggle separate controls for new and returning student applications."
    ],
    settingsTip: "A well-defined admission policy reduces manual overhead. Clearly state your required documents to speed up the verification process.",
    steps: [
        {
            element: "#admission-settings-header",
            title: "Policy Configuration",
            description: "Overview of your institution's admission rules and student-facing instructions.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#admission-settings-form",
            title: "Configuration Form",
            description: "Update specific fields like admission titles, guidelines, and processing rules.",
            type: "standard",
            position: "top"
        }
    ]
};

export const ACADEMIC_HIERARCHY_GUIDE: GuideDefinition = {
    id: "academic_hierarchy_guide",
    pageTitle: "Academic Hierarchy",
    pageSubtitle: "Map main courses to specific application form types.",
    pageGuidance: [
        "Mapping ensures students see the correct fields based on their chosen program (UG, Vocational, etc).",
        "This hierarchy streamlines data collection for different academic structures.",
        "Review these mappings when introducing new streams or degree types."
    ],
    settingsTip: "Course mapping is essential for accurate application forms. Ensure every stream is correctly linked to its parent main class.",
    steps: [
        {
            element: "#stream-mapping-header",
            title: "Course Mapping",
            description: "Define which application form type belongs to which main stream.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#stream-mapping-form",
            title: "Mapping Configuration",
            description: "Select the appropriate form categories for each course type.",
            type: "standard",
            position: "top"
        }
    ]
};

export const VERIFICATION_LOGIC_GUIDE: GuideDefinition = {
    id: "verification_logic_guide",
    pageTitle: "Verification Control",
    pageSubtitle: "Manage student eligibility verification via database matching.",
    pageGuidance: [
        "Upload master datasets to automatically verify student identity and eligibility.",
        "Toggle global verification to enable or disable matching for all entry points.",
        "Manage stream-specific verification databases for granular control."
    ],
    settingsTip: "Verification databases act as a firewall against duplicate or ineligible applications. Keep your master student list clean and up to date.",
    steps: [
        {
            element: "#verification-header",
            title: "Verification Hub",
            description: "Control how the system validates incoming applications against your master records.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#upload-db-btn",
            title: "Dataset Management",
            description: "Upload your official student list here. The system uses this to cross-reference applications.",
            type: "standard",
            position: "left"
        },
        {
            element: "#verification-table",
            title: "Stream Status",
            description: "Track which courses have active verification databases and leur individual statuses.",
            type: "standard",
            position: "top"
        }
    ]
};

export const ACADEMIC_CALENDAR_GUIDE: GuideDefinition = {
    id: "academic_calendar_guide",
    pageTitle: "Academic Calendar",
    pageSubtitle: "Configure when your institution's academic year begins.",
    pageGuidance: [
        "Most Indian schools start in April or March — pick the month that matches your institution.",
        "The system uses this to detect the current session automatically from today's date.",
        "New sessions created from Academic Desk will pre-fill years based on this setting.",
    ],
    settingsTip: "Changing the start month does not alter existing session records. Create or sync the matching session if needed.",
    steps: [
        {
            element: "#academic-calendar-header",
            title: "Calendar Overview",
            description: "Set the month when a new academic year officially begins for your institution.",
            type: "standard",
            position: "bottom",
        },
        {
            element: "#academic-calendar-form",
            title: "Start Month",
            description: "Choose March, April, or another month and review the live session preview before saving.",
            type: "standard",
            position: "top",
        },
    ],
};

export const COLLECTION_SETTINGS_GUIDE: GuideDefinition = {
    id: "collection_settings_guide",
    pageTitle: "Collection Policy",
    pageSubtitle: "Define frequency, due dates, and financial penalty rules.",
    pageGuidance: [
        "Frequency settings determine when fee ledgers are automatically generated.",
        "Penalty rules (late fees) encourage timely payments and automate dues management.",
        "Communication settings control automated receipts and reminder notifications."
    ],
    settingsTip: "Automating penalty rules reduces the need for manual fine collection. Set reasonable grace periods to maintain good relations with parents.",
    steps: [
        {
            element: "#collection-settings-header",
            title: "Finance Rules",
            description: "General configuration for fee collection cycles and grace periods.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#collection-settings-form",
            title: "Policy Workspace",
            description: "Update cycles, reminder timing, and late fee amounts from this centralized form.",
            type: "standard",
            position: "top"
        }
    ]
};

export const PASSWORD_GUIDE: GuideDefinition = {
    id: "password_guide",
    pageTitle: "Update Password",
    pageSubtitle: "Ensure your account is using a long, random password to stay secure.",
    pageGuidance: [
        "Use a strong password with a mix of uppercase, lowercase, numbers, and symbols.",
        "Avoid reusing passwords from other platforms or services.",
        "Change your password periodically for enhanced security."
    ],
    settingsTip: "A strong password is your first line of defense. Use a password manager to generate and store unique passwords for each service.",
    steps: [
        {
            element: "#password-header",
            title: "Password Security",
            description: "Update your account password to maintain secure access.",
            type: "standard",
            position: "bottom"
        }
    ]
};

export const TWO_FACTOR_GUIDE: GuideDefinition = {
    id: "two_factor_guide",
    pageTitle: "Two-Factor Authentication",
    pageSubtitle: "Add an extra layer of security to your account with 2FA.",
    pageGuidance: [
        "Enable 2FA to require a one-time code from your authenticator app during login.",
        "Store your recovery codes safely — they are the only way to regain access if you lose your device.",
        "Use a TOTP-compatible app like Google Authenticator or Authy."
    ],
    settingsTip: "Two-factor authentication dramatically reduces the risk of unauthorized access. Enable it for all admin and staff accounts.",
    steps: [
        {
            element: "#two-factor-header",
            title: "2FA Security",
            description: "Manage your two-factor authentication settings for enhanced protection.",
            type: "standard",
            position: "bottom"
        }
    ]
};

