import StreamApi from "@/lib/api/streamApi";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface UseCollegeStreamsParams {
  main_stream_id?: number | null;
  enabled?: boolean;
  params?: {
    active_only?: boolean;
    all?: boolean;
  };
}

export const useCollegeStreams = ({
  main_stream_id,
  enabled = true,
  params,
}: UseCollegeStreamsParams = {}) => {
  const res = useQuery({
    queryKey: ["college-streams", main_stream_id, params],
    queryFn: () =>
      StreamApi.getStreams({
        main_stream_id,
        all: true,
        ...(params ?? {}),
      }),
    enabled,
  });

  const streams = useMemo(() => {
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
    streams,
  };
};

export const useCollegePublicStreams = ({
  main_stream_id,
  enabled = true,
  params,
}: UseCollegeStreamsParams = {}) => {
  const res = useQuery({
    queryKey: ["college-streams", main_stream_id, params],
    queryFn: () =>
      StreamApi.getPublicStreams({
        main_stream_id,
        all: true,
        ...(params ?? {}),
      }),
    enabled,
  });

  const streams = useMemo(() => {
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
    streams,
  };
};
