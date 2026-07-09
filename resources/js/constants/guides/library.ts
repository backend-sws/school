import { GuideDefinition } from "@/types/guide";

export const LIBRARY_BOOKS_GUIDE: GuideDefinition = {
    id: "library_books_guide",
    pageTitle: "Book Catalog",
    pageSubtitle: "Centralized management of the institution's library collection.",
    pageGuidance: [
        "Catalog books with detailed metadata: Author, ISBN, Publisher, and Genre.",
        "Track the total quantity and available copies for each title in real-time.",
        "Categorize books to help students and staff find resources easily."
    ],
    settingsTip: "Keep your catalog up to date by adding new arrivals immediately to ensure students always have access to the latest resources.",
    steps: [
        {
            element: "#library-books-header",
            title: "Main Catalog",
            description: "Explore and manage your complete book collection.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#new-book-btn",
            title: "Add New Title",
            description: "Register a new book in the library database.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#books-table",
            title: "Inventory Control",
            description: "Monitor stock levels and edit book details.",
            type: "standard",
            position: "top"
        }
    ]
};

export const LIBRARY_ISSUES_GUIDE: GuideDefinition = {
    id: "library_issues_guide",
    pageTitle: "Issues & Returns",
    pageSubtitle: "Manage circulation and monitor student/staff borrowings.",
    pageGuidance: [
        "Streamline the check-out and check-in process for library resources.",
        "Identify daily issues and returns to manage circulation workload.",
        "Track book status (Issued, Available, Damaged) across the entire collection."
    ],
    settingsTip: "Regularly monitor the circulation desk to ensure timely book returns and maintain high resource availability for all members.",
    steps: [
        {
            element: "#library-issues-header",
            title: "Circulation Desk",
            description: "The primary workspace for handling book loans and returns.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#issues-table",
            title: "Active Loans",
            description: "Monitor currently borrowed books and their due dates.",
            type: "standard",
            position: "top"
        }
    ]
};

export const LIBRARY_COPIES_GUIDE: GuideDefinition = {
    id: "library_copies_guide",
    pageTitle: "Book Copies",
    pageSubtitle: "Manage individual physical copies and accessions.",
    pageGuidance: [
        "Track setiap physical copy of a book with its unique Accession Number.",
        "Monitor the condition and availability of each individual unit.",
        "Update barcode or shelf location for easier retrieval from the library stacks."
    ],
    settingsTip: "Accurate accession records are the backbone of library inventory. Ensure every physical copy is correctly labeled and shelved.",
    steps: [
        {
            element: "#library-copies-header",
            title: "Accession Registry",
            description: "Manage individual copies and their physical locations.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#copies-table",
            title: "Unit Inventory",
            description: "Monitor condition and availability of physical copies.",
            type: "standard",
            position: "top"
        }
    ]
};

export const LIBRARY_OVERDUE_GUIDE: GuideDefinition = {
    id: "library_overdue_guide",
    pageTitle: "Overdue Reports",
    pageSubtitle: "Identify and manage late book returns and fines.",
    pageGuidance: [
        "Monitor books that have passed their return deadline.",
        "Calculate and track pending fines for late returns.",
        "Send reminders or export lists for follow-up with borrowers."
    ],
    settingsTip: "Use the overdue report to proactively reach out to borrowers. Timely reminders significantly improve book return rates.",
    steps: [
        {
            element: "#library-overdue-header",
            title: "Overdue Registry",
            description: "Identify late returns across the library collection.",
            type: "standard",
            position: "bottom"
        },
        {
            element: "#overdue-table",
            title: "Delayed Returns",
            description: "Filter and manage late returns and fine calculations.",
            type: "standard",
            position: "top"
        }
    ]
};
