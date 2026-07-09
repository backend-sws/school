import SessionApi from "@/lib/api/sessionApi";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type UseCollegeSessionsProps = {
  streamId?: any | null;
  enabled?: boolean;
  params?: {
    active_only?: boolean;
    all?: boolean;
  };
};

export const useCollegeSessions = ({
  streamId,
  enabled = true,
  params,
}: UseCollegeSessionsProps = {}) => {
  const res = useQuery({
    queryKey: ["college-sessions", streamId, params],
    queryFn: () =>
      SessionApi.getSessionsWithParams({
        stream_id: streamId,
        ...(params ?? {}),
      }),
    enabled: enabled,
  });

  /** Raw session list (id, name, is_current) */
  const rawSessions = useMemo(() => {
    const list = res.data?.data;
    return Array.isArray(list) ? list : [];
  }, [res.data]);

  /** Dropdown options for ControlledFormComponent selects: { key, value, text } */
  const sessions = useMemo(() => {
    return rawSessions.map((item: any) => ({
      key: String(item.id),
      value: String(item.id),
      text: item.name,
    }));
  }, [rawSessions]);

  /** FilterBar-ready options: works with both FilterBar native selects and ControlledFormComponent */
  const filterOptions = useMemo(() => {
    return rawSessions.map((item: any) => ({
      key: String(item.id),
      value: String(item.id),
      text: `${item.name}${item.is_current ? " (Current)" : ""}`,
      label: `${item.name}${item.is_current ? " (Current)" : ""}`,
    }));
  }, [rawSessions]);

  /** Current session ID as string (for filter defaults) */
  const currentSessionId = useMemo(() => {
    const current = rawSessions.find((s: any) => s.is_current);
    return current ? String(current.id) : rawSessions[0] ? String(rawSessions[0].id) : "";
  }, [rawSessions]);

  return {
    ...res,
    sessions,
    filterOptions,
    currentSessionId,
    rawSessions,
  };
};

export const useCollegePublicSessions = ({
  streamId,
  enabled = true,
  params,
}: UseCollegeSessionsProps = {}) => {
  const res = useQuery({
    queryKey: ["college-sessions", streamId, params],
    queryFn: () =>
      SessionApi.getPublicSessions({
        stream_id: streamId,
        ...(params ?? {}),
      }),
    enabled: enabled,
  });

  const sessions = useMemo(() => {
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
    sessions,
  };
};
