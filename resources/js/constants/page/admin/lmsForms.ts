import { FORM_TYPE } from "@/constants/shared/form";

// ─── Announcement ───────────────────────────────────────────────────────────
export const LMS_ANNOUNCEMENT_FORM_LAYOUT = [
  {
    name: "title",
    label: "Title",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g., Class Rescheduled, New Material Uploaded",
    required: true,
    maxLength: 200,
    tooltip: "Short, clear title for the announcement. Shown in lists and notifications. Max 200 characters.",
  },
  {
    name: "body",
    label: "Body",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "Provide more details about this announcement...",
    rows: 4,
    maxLength: 5000,
    tooltip: "Optional. Full text of the announcement. Supports plain text. Max 5000 characters.",
  },
];

// ─── Assignment ────────────────────────────────────────────────────────────
export const LMS_ASSIGNMENT_TYPE_OPTIONS = [
  { key: "assignment", text: "Assignment", value: "assignment" },
  { key: "homework", text: "Homework", value: "homework" },
  { key: "project", text: "Project", value: "project" },
];

export const LMS_ASSIGNMENT_FORM_LAYOUT = [
  {
    name: "title",
    label: "Item Title",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Chapter 1 Exercises",
    required: true,
    maxLength: 200,
    tooltip: "Short title for the curriculum item. Shown in lists and to students. Max 200 characters.",
  },
  {
    name: "description",
    label: "Description/Instructions",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "Optional instructions or context",
    rows: 3,
    tooltip: "Optional. Instructions or context for students regarding this curriculum item.",
  },
  {
    name: "file_path",
    label: "Attached File",
    type: FORM_TYPE.FILE,
    tooltip: "Upload notes, PDF, or images related to this curriculum item.",
  },
  {
    name: "type",
    label: "Activity Type",
    type: FORM_TYPE.SELECT,
    options: LMS_ASSIGNMENT_TYPE_OPTIONS,
    tooltip: "Assignment = general task; Homework = take-home work; Project = longer deliverable.",
  },
  {
    name: "due_at",
    label: "Deadline",
    type: FORM_TYPE.DATE,
    placeholder: "Optional",
    tooltip: "Optional. When this activity is due. Used for calendar and filtering.",
  },
  {
    name: "max_score",
    label: "Max Points",
    type: FORM_TYPE.NUMBER_TEXT,
    placeholder: "e.g. 100",
    tooltip: "Optional. Maximum points for grading this curriculum item.",
  },
  {
    name: "allow_late",
    label: "Allow late submission",
    type: FORM_TYPE.CHECKBOX,
    tooltip: "When enabled, students can submit after the deadline (may be marked late).",
  },
];

// ─── Test ───────────────────────────────────────────────────────────────────
export const LMS_TEST_FORM_LAYOUT = [
  {
    name: "title",
    label: "Title",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Unit 1 Quiz",
    required: true,
    maxLength: 200,
    tooltip: "Short title for the test. Shown in lists and to students. Max 200 characters.",
  },
  {
    name: "description",
    label: "Description",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "Optional instructions",
    rows: 3,
    tooltip: "Optional. Instructions or context shown to students before or during the test.",
  },
  {
    name: "duration_minutes",
    label: "Duration (minutes)",
    type: FORM_TYPE.NUMBER_TEXT,
    placeholder: "e.g. 30",
    tooltip: "Time limit in minutes for one attempt. Leave empty for no limit.",
  },
  {
    name: "max_attempts",
    label: "Max attempts",
    type: FORM_TYPE.NUMBER_TEXT,
    placeholder: "e.g. 1",
    tooltip: "How many times a student can take this test. Default 1.",
  },
];

// ─── Live Session ───────────────────────────────────────────────────────────
export const LMS_LIVE_SESSION_FORM_LAYOUT = [
  {
    name: "title",
    label: "Title",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Week 1 Live Class",
    required: true,
    maxLength: 200,
    tooltip: "Short title for the live session. Shown in lists and calendar. Max 200 characters.",
  },
  {
    name: "scheduled_at",
    label: "Scheduled at",
    type: FORM_TYPE.DATETIME,
    placeholder: "Date and time",
    required: true,
    tooltip: "When the live class starts. Required for calendar and reminders.",
  },
  {
    name: "ends_at",
    label: "Ends at",
    type: FORM_TYPE.DATETIME,
    placeholder: "Optional",
    tooltip: "Optional. When the session is planned to end.",
  },
  {
    name: "meeting_url",
    label: "Meeting URL",
    type: FORM_TYPE.URL,
    placeholder: "e.g. Zoom or Meet link",
    tooltip: "Zoom, Google Meet, or other link students will use to join the live class.",
  },
  {
    name: "meeting_provider",
    label: "Provider",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. zoom, meet",
    tooltip: "Optional. Name of the platform (e.g. Zoom, Google Meet) for display.",
  },
];

// ─── Material / Resource ────────────────────────────────────────────────────
export const LMS_RESOURCE_SOURCE = {
  UPLOAD: "upload",
  URL: "url",
} as const;

export const LMS_MATERIAL_RESOURCE_DETAILS_LAYOUT = [
  {
    name: "title",
    label: "Title",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Chapter 1 Notes",
    required: true,
    maxLength: 200,
    tooltip: "Display name for the resource. Shown in the list. Max 200 characters.",
  },
  {
    name: "file_type",
    label: "File type",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. PDF, DOC, Video",
    maxLength: 100,
    tooltip: "Optional. File type or extension for display (e.g. PDF, DOC, MP4). Max 100 characters.",
  },
];

/** Accept PDFs, docs, images, video, audio for resource uploads */
export const LMS_RESOURCE_ACCEPT =
  "image/*,application/pdf,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,text/plain,video/*,audio/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation";

// ─── Recording ──────────────────────────────────────────────────────────────
export const LMS_RECORDING_SOURCE = {
  UPLOAD: "upload",
  VIDEO_LINK: "video_link",
  YOUTUBE: "youtube",
} as const;

export const LMS_RECORDING_SOURCE_OPTIONS = [
  { key: "video_link", text: "Video Link", value: LMS_RECORDING_SOURCE.VIDEO_LINK },
  { key: "youtube", text: "YouTube Link", value: LMS_RECORDING_SOURCE.YOUTUBE },
] as const;

export const LMS_RECORDING_DETAILS_LAYOUT = [
  {
    name: "title",
    label: "Recording Title",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Week 3 Lecture – Algebra",
    required: true,
    maxLength: 200,
    tooltip: "Unique, descriptive title for the recording. Shown in the list. Max 200 characters.",
  },
  {
    name: "description",
    label: "Description",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "e.g. Covers linear equations and word problems...",
    maxLength: 2000,
    tooltip: "Optional short description for students. Max 2000 characters.",
  },
];
