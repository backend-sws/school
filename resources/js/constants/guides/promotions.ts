import { GuideDefinition } from "@/types/guide";

export const PROMOTIONS_GUIDE: GuideDefinition = {
    id: "promotions_guide",
    pageTitle: "Student Promotions",
    pageSubtitle: "Promote students to the next session or semester.",
    pageGuidance: [
        "Promote eligible students from the current session to the next academic session or semester.",
        "Use bulk promote to move an entire class or stream at once — detained students can be excluded.",
        "Review the History tab to track all past promotions and rollback any mistakes.",
    ],
    settingsTip: "Run bulk promotions at the end of each academic session. Filter by stream and semester to promote class by class for maximum accuracy.",
    steps: [
        {
            element: "#promotions-header",
            title: "Student Promotions",
            description: "Promote students between sessions and semesters. Start by filtering eligible students below.",
            type: "standard",
            position: "bottom",
        },
        {
            element: "#promotions-table",
            title: "Promote & Track",
            description: "Select students and click Bulk Promote. Switch to History tab to review or rollback past promotions.",
            type: "standard",
            position: "top",
        },
    ],
};
