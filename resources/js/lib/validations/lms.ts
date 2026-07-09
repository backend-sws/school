import { z } from "zod";
import { safeRequiredString, safeOptionalString } from "./common";

const scopeTypeEnum = z.enum(["global", "stream", "department", "session"]);

export const LmsCourseFormSchema = z.object({
  scope_type: scopeTypeEnum,
  scope_id: z.number().int().nullable().optional(),
  stream_id: z.number().int().nullable().optional(),
  department_id: z.number().int().nullable().optional(), // used when scope_type = department to set scope_id
  subject_id: z.number().int().nullable().optional(),
  session_id: z.number().int().nullable().optional(),
  title: safeRequiredString(200, "Title is required"),
  slug: safeOptionalString(220, "Slug"),
  description: safeOptionalString(5000, "Description"),
  status: z.number().int().min(0).max(255).optional().default(1),
  instructor_id: z.number().int().nullable().optional(),
});
export type LmsCourseFormValues = z.infer<typeof LmsCourseFormSchema>;

export const LmsClassFormSchema = z.object({
  name: safeRequiredString(200, "Name is required"),
  code: safeOptionalString(50, "Code"),
  stream_id: z.number().int().nullable().optional(),
  lms_course_id: z.number().int().nullable().optional(),
  class_subject_allocation_id: z.number().int().nullable().optional(),
  session_id: z.number().int().nullable().optional(),
  section: safeOptionalString(50, "Section"),
  status: z.number().int().min(0).max(255).optional().default(1),
});
export type LmsClassFormValues = z.infer<typeof LmsClassFormSchema>;

export const subjectTeacherSchema = z.object({
  instructor_id: z.any().refine((val) => !!val, { message: "Select a teacher" }),
});
export type SubjectTeacherFormValues = z.infer<typeof subjectTeacherSchema>;

export const LmsClassTeacherSchema = z.object({
  class_teacher_id: z.number().min(1, "Please select a teacher"),
});
export type LmsClassTeacherFormValues = z.infer<typeof LmsClassTeacherSchema>;

export const LmsEnrollmentManagerSchema = z.object({
  user_ids: z.array(z.number()).min(1, "Select at least one student"),
});
export type LmsEnrollmentManagerFormValues = z.infer<typeof LmsEnrollmentManagerSchema>;

export const LmsAnnouncementSchema = z.object({
  title: safeRequiredString(200, "Title is required"),
  body: safeOptionalString(5000, "Body"),
});
export type LmsAnnouncementFormValues = z.infer<typeof LmsAnnouncementSchema>;

export const LmsRecordingSchema = z.object({
  title: safeRequiredString(200, "Title is required"),
  video_url: safeOptionalString(500, "Video URL"),
  file_path: safeOptionalString(500, "File path"),
  description: safeOptionalString(2000, "Description"),
});
export type LmsRecordingFormValues = z.infer<typeof LmsRecordingSchema>;

export const LmsMaterialSchema = z.object({
  title: safeRequiredString(200, "Title is required"),
  file_path: safeOptionalString(500, "File path"),
  file_type: safeOptionalString(100, "File type"),
});
export type LmsMaterialFormValues = z.infer<typeof LmsMaterialSchema>;

export const LmsAssignmentSchema = z.object({
  title: safeRequiredString(200, "Title is required"),
  file_path: safeOptionalString(500, "File path"),
  description: safeOptionalString(5000, "Description"),
  type: z.enum(["assignment", "homework", "project"]),
  due_at: safeOptionalString(50, "Due at"),
  max_score: z.union([z.literal(""), z.coerce.number().min(0)]).optional(),
  allow_late: z.boolean().optional(),
});
export type LmsAssignmentFormValues = z.infer<typeof LmsAssignmentSchema>;

export const LmsTestSchema = z.object({
  title: safeRequiredString(200, "Title is required"),
  description: safeOptionalString(5000, "Description"),
  duration_minutes: z.union([z.literal(""), z.coerce.number().min(0)]).optional(),
  max_attempts: z.union([z.literal(""), z.coerce.number().min(1)]).optional(),
});
export type LmsTestFormValues = z.infer<typeof LmsTestSchema>;

export const LmsLiveSessionSchema = z.object({
  title: safeRequiredString(200, "Title is required"),
  scheduled_at: safeRequiredString(50, "Scheduled at is required"),
  ends_at: safeOptionalString(50, "Ends at"),
  meeting_url: safeOptionalString(500, "Meeting URL"),
  meeting_provider: safeOptionalString(100, "Provider"),
});
export type LmsLiveSessionFormValues = z.infer<typeof LmsLiveSessionSchema>;

export const LmsTestQuestionSchema = z.object({
  question_text: safeRequiredString(5000, "Question text is required"),
  type: z.enum(["mcq", "short_answer", "true_false", "essay"]),
  options: z.array(z.object({
    key: safeRequiredString(10, "Key is required"),
    text: safeRequiredString(2000, "Text is required")
  })).optional(),
  correct_answer: safeOptionalString(2000, "Answer"),
  points: z.coerce.number().min(0).optional().default(1),
  sort_order: z.coerce.number().min(0).optional().default(0),
});
export type LmsTestQuestionFormValues = z.infer<typeof LmsTestQuestionSchema>;

