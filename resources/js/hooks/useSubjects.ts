import SubjectApi from "@/lib/api/subjectApi";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type UseCollegeSubjectProps = {
  stream_id?: number | null;
  enabled?: boolean;
  params?: {
    active_only?: boolean;
    all?: boolean;
  };
};

export const useCollegeSubject = ({
  stream_id,
  enabled = true,
  params,
}: UseCollegeSubjectProps = {}) => {
  const res = useQuery({
    queryKey: ["college-subjects", stream_id],
    queryFn: () => SubjectApi.getSubjects({ stream_id, ...(params ?? {}) }),
    enabled: enabled || !!stream_id,
  });

  const subjects = useMemo(() => {
    return (
      res.data?.data?.map((item: any) => ({
        key: String(item.id),
        value: String(item.id),
        text: item.name,
      })) || []
    );
  }, [res.data]);

  return {
    ...res,
    subjects,
  };
};
