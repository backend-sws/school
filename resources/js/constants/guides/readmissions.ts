import { GuideDefinition } from "@/types/guide";

export const READMISSIONS_GUIDE: GuideDefinition = {
    id: "readmissions_guide",
    pageTitle: "Re-Admissions",
    pageSubtitle: "Bring back dropped or alumni students into active enrollment.",
    pageGuidance: [
        "Re-admit students who were dropped, transferred, or completed their program (alumni).",
        "The form pre-fills from the student's existing profile — no need to re-enter personal details.",
        "After re-admission, the student's enrollment status resets to \"active\" in the target session.",
    ],
    settingsTip: "Search by name to find dropped students quickly. The gap duration helps track and report on student retention rates.",
    steps: [
        {
            element: "#readmissions-header",
            title: "Re-Admissions",
            description: "Bring back former students into active enrollment by selecting from eligible profiles.",
            type: "standard",
            position: "bottom",
        },
        {
            element: "#readmissions-table",
            title: "Process & Track",
            description: "Click 'Re-admit' to open the pre-filled form. Switch to History tab to view past re-admissions or rollback.",
            type: "standard",
            position: "top",
        },
    ],
};
