import SubjectCategoryApi from "@/lib/api/subjectCategoryApi";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type UseSubjectCategoryProps = {
    enabled?: boolean;
};

export const useSubjectCategory = ({
    enabled = true,
}: UseSubjectCategoryProps = {}) => {
    const res = useQuery({
        queryKey: ["subject-categories"],
        queryFn: () => SubjectCategoryApi.getSubjectCategory(),
        enabled: enabled,
    });

    const subjectCategories = useMemo(() => {
        return (
            res.data?.data?.map((item: any) => ({
                id: item.id,
                name: item.name,
                code: item.code,
            })) || []
        );
    }, [res.data]);

    return {
        ...res,
        subjectCategories,
    };
};
