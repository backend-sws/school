import { useInstitutionContent } from "./useInstitutionContent";

/**
 * Type-aware labels for institution: when type is "school", use Class/Term instead of Stream/Semester.
 * Use for navigation, form labels, and table headers so school users see familiar terminology.
 * Implemented via the central institution content registry (useInstitutionContent).
 */
export function useInstitutionLabels() {
  const content = useInstitutionContent();
  return {
    streamLabel: content.stream,
    semesterLabel: content.semester,
    mainStreamLabel: content.main_stream,
    currentSemesterLabel: content.current_semester,
    streamsAndProgramsTitle: content.streams_and_programs_title,
    mainStreamsTitle: content.main_streams_title,
    allStreamsLabel: content.all_streams,
    allMainStreamsLabel: content.all_main_streams,
    streamSlashCourse: content.stream_slash_course,
    streamSlashSession: content.stream_slash_session,
  };
}
