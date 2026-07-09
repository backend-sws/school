import { useQueryClient } from "@tanstack/react-query";
import { usePage } from "@inertiajs/react";
import { useCallback, useEffect, useState } from "react";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import {
  getRealtimeNotificationsAllowed,
  getNotificationsPromptDismissed,
  setNotificationsPromptDismissed,
  setRealtimeNotificationsAllowed,
  subscribeToNotificationsPreferencesChanged,
} from "@/lib/notifications-preferences";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

/**
 * Renders an opt-in prompt when the user has not yet allowed real-time notifications;
 * subscribes to the current user's private channel only after they allow.
 * Mount this once in the authenticated app layout (e.g. app-sidebar-layout).
 */
export function RealtimeNotificationsSubscriber() {
  const queryClient = useQueryClient();
  const page = usePage();
  const authUser = (page.props.auth as { user?: { id: number } })?.user;
  const userId = authUser?.id;

  const [allowed, setAllowedState] = useState(() =>
    typeof window !== "undefined" ? getRealtimeNotificationsAllowed() : false
  );
  const [dismissed, setDismissedState] = useState(() =>
    typeof window !== "undefined" ? getNotificationsPromptDismissed() : false
  );

  // Sync allowed state when preferences change (e.g. user enables from notifications page)
  useEffect(() => {
    return subscribeToNotificationsPreferencesChanged((allowedValue) => {
      setAllowedState(allowedValue);
    });
  }, []);

  const allowNotifications = useCallback(() => {
    setRealtimeNotificationsAllowed(true);
    setAllowedState(true);
  }, []);

  const dismissNotifications = useCallback(() => {
    setNotificationsPromptDismissed(true);
    setDismissedState(true);
  }, []);

  useRealtimeNotifications({
    enabled: allowed,
    onNotification: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Show prompt only when user is logged in, has not allowed, and has not dismissed
  const showPrompt = !!userId && !allowed && !dismissed;

  if (!showPrompt) return null;

  return (
    <div
      role="region"
      aria-label="Enable notifications"
      className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm"
    >
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-lg">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Bell className="size-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            Enable real-time notifications
          </p>
          <p className="text-xs text-muted-foreground">
            Get instant updates for classes, attendance, and announcements.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="ghost" size="sm" onClick={dismissNotifications}>
            Not now
          </Button>
          <Button size="sm" onClick={allowNotifications}>
            Enable
          </Button>
        </div>
      </div>
    </div>
  );
}
