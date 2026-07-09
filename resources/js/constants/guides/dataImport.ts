import { GuideDefinition } from "@/types/guide";

export const DATA_IMPORT_GUIDE: GuideDefinition = {
    id: "data_import_guide",
    steps: [
        {
            element: "#data-import-header",
            title: "Welcome to Data Import",
            description: "This center helps you onboard institutional data in bulk. Let's take a quick tour of how to use it effectively.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#academic-backbone-section",
            title: "The Academic Backbone",
            description: "Start here! These modules (Departments, Streams, Subjects) are the foundation. Other modules like Students depend on these being imported first.",
            type: "graphic",
            imageUrl: "/assets/guides/academic-dependency.svg", // We'll need to ensure this exists or use a placeholder
            imageAlt: "Dependency Flow Diagram",
            position: "top"
        },
        {
            element: ".module-card-departments", // We should add IDs or specific classes to cards
            title: "Downloading Templates",
            description: "Click 'Template' to download a pre-formatted Excel file. Fill it with your data while following the embedded instructions.",
            type: "standard",
            position: "right"
        },
        {
            element: "#view-full-history-btn",
            title: "Audit Your Imports",
            description: "Every import attempt is logged. Click here to see detailed row-level error reports in the Analytics section.",
            type: "standard",
            position: "left"
        }
    ]
};
