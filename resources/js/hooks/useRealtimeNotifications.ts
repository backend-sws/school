import { usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { getEcho } from "@/lib/realtime/echo";

interface NotificationData {
  type?: string;
  title?: string;
  body?: string;
  url?: string;
  [key: string]: unknown;
}

/**
 * Subscribe to the current user's private notification channel and show toasts for incoming notifications.
 * Only subscribes when enabled is true (e.g. after user has allowed notifications).
 * Use this hook in a layout or page that wraps authenticated content so any screen gets live toasts.
 */
export function useRealtimeNotifications(options?: {
  onNotification?: (data: NotificationData) => void;
  enabled?: boolean;
}) {
  const page = usePage();
  const authUser = (page.props.auth as { user?: { id: number } })?.user;
  const userId = authUser?.id;
  const enabled = options?.enabled !== false;
  const onNotificationRef = useRef(options?.onNotification);
  onNotificationRef.current = options?.onNotification;

  useEffect(() => {
    if (!enabled || !userId || typeof userId !== "number") return;

    const echo = getEcho();
    if (!echo) return;

    // Pass name without "private-" prefix; echo.private() adds it (otherwise we get private-private-...)
    const channelName = `App.Models.User.${userId}`;
    const channel = echo.private(channelName);

    channel.notification((payload: { data?: NotificationData }) => {
      const data = payload?.data ?? payload;
      const title = (data?.title as string) ?? "Notification";
      const body = (data?.body as string) ?? "";
      toast.info(title, { description: body || undefined });
      onNotificationRef.current?.(data as NotificationData);
    });

    return () => {
      echo.leave(`private-${channelName}`);
    };
  }, [userId, enabled]);
}
