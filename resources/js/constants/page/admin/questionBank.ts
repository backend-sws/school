import type { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";

// ─── Breadcrumbs ─────────────────────────────────────────────────────────
export const QUESTION_BANK_BREADCRUMBS: BreadcrumbItem[] = [
    { title: "Question Bank", href: "/question-bank" },
];

export const QUESTION_BANK_QUESTIONS_BREADCRUMBS: BreadcrumbItem[] = [
    ...QUESTION_BANK_BREADCRUMBS,
    { title: "Questions", href: "/question-bank" },
];

export const QUESTION_BANK_CATEGORIES_BREADCRUMBS: BreadcrumbItem[] = [
    ...QUESTION_BANK_BREADCRUMBS,
    { title: "Categories", href: "/question-bank/categories" },
];


export const QUESTION_BANK_PRACTICE_BREADCRUMBS: BreadcrumbItem[] = [
    ...QUESTION_BANK_BREADCRUMBS,
    { title: "Practice Mode", href: "/question-bank/practice" },
];

// ─── Guidelines ──────────────────────────────────────────────────────────
export const QUESTION_BANK_GUIDELINES = [
    "Create and manage categorized question repositories for assessments.",
    "Add questions manually and organize them by category.",
    "Students can practice with randomized quizzes from the question bank.",
];

export const QUESTION_BANK_TIP =
    "Organize your questions into categories and subcategories for easy filtering and assessment creation.";

export const QUESTION_BANK_CATEGORIES_GUIDELINES = [
    "Organize questions into categories and subcategories for easy filtering.",
    "Categories can be nested — e.g., Physics > Mechanics > Newton's Laws.",
];


// ─── Table Columns ───────────────────────────────────────────────────────
export const QUESTION_BANK_TABLE_COLUMNS = [
    { key: "serial", label: "#" },
    { key: "question_text", label: "Question" },
    { key: "type", label: "Type" },
    { key: "difficulty", label: "Difficulty" },
    { key: "category", label: "Category" },
    { key: "source", label: "Source" },
    { key: "action", label: "Actions" },
];

export const QUESTION_BANK_CATEGORIES_TABLE_COLUMNS = [
    { key: "serial", label: "#" },
    { key: "name", label: "Category Name" },
    { key: "description", label: "Description" },
    { key: "questions_count", label: "Questions" },
    { key: "action", label: "Actions" },
];

// ─── Permissions ─────────────────────────────────────────────────────────
export const QUESTION_BANK_PERMISSIONS = {
    view: "view_question_bank",
    create: "create_questions",
    edit: "update_questions",
    delete: "delete_questions",
} as const;

// ─── Form Layouts ────────────────────────────────────────────────────────
export const QUESTION_FORM_LAYOUT = [
    {
        name: "category_id",
        label: "Category",
        type: FORM_TYPE.SELECT,
        placeholder: "Select category",
        required: true,
        options: [] as { value: string; label: string }[],
        tooltip: "Category this question belongs to.",
    },
    {
        name: "type",
        label: "Question Type",
        type: FORM_TYPE.SELECT,
        placeholder: "Select type",
        required: true,
        options: [
            { value: "mcq", label: "Multiple Choice (MCQ)" },
            { value: "true_false", label: "True / False" },
            { value: "fill_in_blank", label: "Fill in the Blank" },
            { value: "short_answer", label: "Short Answer" },
            { value: "long_answer", label: "Long Answer" },
        ],
        tooltip: "Type of question.",
    },
    {
        name: "difficulty",
        label: "Difficulty",
        type: FORM_TYPE.SELECT,
        placeholder: "Select difficulty",
        required: true,
        options: [
            { value: "easy", label: "Easy" },
            { value: "medium", label: "Medium" },
            { value: "hard", label: "Hard" },
        ],
        tooltip: "Difficulty level of this question.",
    },
    {
        name: "question_text",
        label: "Question Text",
        type: FORM_TYPE.TEXTAREA,
        placeholder: "Enter your question...",
        required: true,
        rows: 3,
        tooltip: "The question statement.",
    },
    {
        name: "correct_answer",
        label: "Correct Answer",
        type: FORM_TYPE.TEXTAREA,
        placeholder: "Enter the correct answer",
        rows: 2,
        tooltip: "The correct answer for this question.",
    },
    {
        name: "explanation",
        label: "Explanation",
        type: FORM_TYPE.TEXTAREA,
        placeholder: "Optional explanation for the answer",
        rows: 2,
        tooltip: "Explanation shown after answering.",
    },
    {
        name: "marks",
        label: "Marks",
        type: FORM_TYPE.NUMBER,
        placeholder: "1",
        tooltip: "Marks awarded for correct answer.",
    },
    {
        name: "negative_marks",
        label: "Negative Marks",
        type: FORM_TYPE.NUMBER,
        placeholder: "0",
        tooltip: "Marks deducted for wrong answer.",
    },
    {
        name: "tags",
        label: "Tags",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. physics, mechanics, newton",
        tooltip: "Comma-separated tags for filtering.",
    },
];

export const QUESTION_FORM_INITIAL = {
    category_id: "" as string | number,
    type: "mcq",
    difficulty: "medium",
    question_text: "",
    correct_answer: "",
    explanation: "",
    marks: 1,
    negative_marks: 0,
    tags: "",
};

export const CATEGORY_FORM_LAYOUT = [
    {
        name: "name",
        label: "Category Name",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. Physics, Algebra",
        required: true,
        maxLength: 255,
        tooltip: "Name of the question category.",
    },
    {
        name: "description",
        label: "Description",
        type: FORM_TYPE.TEXTAREA,
        placeholder: "Optional description",
        rows: 2,
        tooltip: "Brief description of this category.",
    },
];

export const CATEGORY_FORM_INITIAL = {
    name: "",
    description: "",
    parent_id: undefined as number | undefined,
};


// ─── Filter Options ──────────────────────────────────────────────────────
export const DIFFICULTY_OPTIONS = [
    { value: "", label: "All Difficulties" },
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
];

export const QUESTION_TYPE_OPTIONS = [
    { value: "", label: "All Types" },
    { value: "mcq", label: "MCQ" },
    { value: "true_false", label: "True/False" },
    { value: "fill_in_blank", label: "Fill in Blank" },
    { value: "short_answer", label: "Short Answer" },
    { value: "long_answer", label: "Long Answer" },
];

export const SOURCE_OPTIONS = [
    { value: "", label: "All Sources" },
    { value: "manual", label: "Manual" },
];

// ─── FilterBar Config ────────────────────────────────────────────────────
export const QUESTION_BANK_FILTER_CONFIG = {
    search: {
        name: "search",
        placeholder: "Search questions...",
    },
    filters: [
        {
            name: "difficulty",
            type: "select",
            label: "Difficulty",
            options: DIFFICULTY_OPTIONS,
        },
        {
            name: "type",
            type: "select",
            label: "Type",
            options: QUESTION_TYPE_OPTIONS,
        },
        {
            name: "source",
            type: "select",
            label: "Source",
            options: SOURCE_OPTIONS,
        },
    ],
};

// ─── Display Helpers ─────────────────────────────────────────────────────
export const DIFFICULTY_BADGE_VARIANT: Record<string, string> = {
    easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export const TYPE_LABELS: Record<string, string> = {
    mcq: "MCQ",
    true_false: "True/False",
    fill_in_blank: "Fill in Blank",
    short_answer: "Short Answer",
    long_answer: "Long Answer",
};

export const SOURCE_BADGE_VARIANT: Record<string, string> = {
    manual: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};
