import { useQuery } from "@tanstack/react-query";
import DepartmentApi from "@/lib/api/departmentApi";

export const useDepartments = (params?: Record<string, any>) => {
    const { data, isLoading } = useQuery({
        queryKey: ["departments", params],
        queryFn: () => DepartmentApi.getDepartment(params),
    });

    const departments = data?.data?.map((dept: any) => ({
        key: dept.id,
        text: dept.name,
        value: dept.id,
    })) || [];

    return {
        departments,
        isLoading,
    };
};
