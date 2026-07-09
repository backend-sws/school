import MainStreamApi from "@/lib/api/mainStreamApi";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
type UseCollegeMainStreamsProps = {
  enabled?: boolean;
  params?: {
    active_only?: boolean;
    all?: boolean;
  };
};

export const useCollegeMainStreams = ({
  enabled,
  params,
}: UseCollegeMainStreamsProps = {}) => {
  const res = useQuery({
    queryKey: ["college-main-streams", params],
    queryFn: () => MainStreamApi.getMainStreams(params ?? {}),
    enabled: enabled ?? false,
  });

  const mainStreams = useMemo(() => {
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
    mainStreams,
  };
};
