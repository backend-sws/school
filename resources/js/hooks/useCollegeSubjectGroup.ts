import SubjectGroupApi from "@/lib/api/subjectGroupApi";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface UseCollegeSubjectGroupParams {
    enabled?: boolean;
}

export const useCollegeSubjectGroup = ({
    enabled = true,
}: UseCollegeSubjectGroupParams = {}) => {
    const res = useQuery({
        queryKey: ["college-subject-groups"],
        queryFn: () => SubjectGroupApi.getSubjectGroup(),
        enabled: enabled,
    });

    const subjectGroups = useMemo(() => {
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
        subjectGroups,
    };
};
