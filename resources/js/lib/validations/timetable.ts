import * as z from "zod";

export const CreateTimetableSchema = z.object({
    session_id: z.string().min(1, "Session is required"),
    timetable_template_id: z.string().min(1, "Template is required"),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export type CreateTimetableValues = z.infer<typeof CreateTimetableSchema>;

export const TimetableEntrySchema = z.object({
    period_slot_id: z.string().min(1, "Period is required"),
    day_of_week: z.number().min(1).max(7),
    activity_type: z.string().default('App\\Models\\Subject'),
    activity_id: z.string().min(1, "Subject is required"),
    teacher_id: z.string().nullable().optional(),
    room_id: z.string().nullable().optional(),
});

export type TimetableEntryValues = z.infer<typeof TimetableEntrySchema>;
