import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { BreadcrumbItem } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Bell, CheckCheck, ChevronRight, Inbox } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi, type NotificationItem, type NotificationsResponse } from "@/lib/api/notificationsApi";
import { formatDistanceToNow } from "date-fns";
import { useRegisterGuide } from '@/components/GuideProvider';
import { NOTIFICATIONS_GUIDE } from "@/constants/guides/misc";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import useSearchFilter from "@/hooks/useSearchfilter";
import Each from "@/components/Each";
import { NotificationChannelBadges } from "@/components/shared/NotificationChannelBadges";
import {
  getRealtimeNotificationsAllowed,
  setRealtimeNotificationsAllowed,
  subscribeToNotificationsPreferencesChanged,
} from "@/lib/notifications-preferences";

type Filter = "all" | "unread";

const INITIAL_FILTERS = { filter: "all" as Filter, page: 1, per_page: 20 };

export default function NotificationsPage() {
useRegisterGuide(NOTIFICATIONS_GUIDE);

  const queryClient = useQueryClient();
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const [realtimeAllowed, setRealtimeAllowed] = useState(() => getRealtimeNotificationsAllowed());

  useEffect(() => {
    return subscribeToNotificationsPreferencesChanged(setRealtimeAllowed);
  }, []);

  const { data: response, isLoading } = useQuery({
    queryKey: ["notifications", filter],
    queryFn: () => notificationsApi.list(filter),
  });

  const payload = (response as { data?: NotificationsResponse } | undefined)?.data;
  const notifications = payload?.data ?? [];
  const meta = payload?.meta;
  const unreadCount = payload?.unread_count ?? 0;

  const markAsRead = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Notifications", href: "/notifications" },
  ];

  const handleItemClick = (item: NotificationItem) => {
    if (!item.read_at) {
      markAsRead.mutate(item.id);
    }
    const url = item.data?.url as string | undefined;
    if (url) {
      router.visit(url);
    }
  };


  return (
    <TooltipProvider>
      <Head title="Notifications" />
      <div className="flex flex-col gap-6 p-6">
        <MainPageHeader
          id="notifications-header"
          breadcrumbs={breadcrumbs}
          icon={Bell}
          title="Notifications"
          subtitle="View and manage your notifications"
        />

        {!realtimeAllowed && (
          <Card variant="action" className="border-primary/30 bg-primary/5">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3 pr-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bell className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Live notifications are off</p>
                  <p className="text-xs text-muted-foreground">
                    Enable real-time notifications to get instant toasts for new updates.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setRealtimeNotificationsAllowed(true);
                  setRealtimeAllowed(true);
                }}
              >
                Enable live notifications
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={filter.filter as string} onValueChange={(v) => handleFilter({ filter: v, page: 1 })}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p>Loading notifications…</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                <Inbox className="h-12 w-12" />
                <p className="font-medium">No notifications</p>
                <p className="text-sm">
                  {filter.filter === "unread" ? "You have no unread notifications." : "You have no notifications yet."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                <Each
                  of={notifications}
                  render={(item, index) => {
                    const title = (item.data?.title as string) ?? "Notification";
                    const body = (item.data?.body as string) ?? "";
                    const isUnread = !item.read_at;
                    return (
                      <Card
                        key={item.id}
                        variant={isUnread ? "action" : "ghost"}
                        delay={index * 0.03}
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          "flex w-full items-start gap-4 px-4 py-4 text-left sm:px-6 h-auto border-none rounded-none shadow-none",
                          isUnread && "bg-muted/30"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                            isUnread ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          )}
                        >
                          <Bell className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={cn("font-bold text-base", isUnread && "text-foreground")}>
                            {title}
                          </p>
                          {body && (
                            <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground font-medium">
                              {body}
                            </p>
                          )}
                          <p className="mt-1 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                            {item.created_at &&
                              formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                          </p>
                          {item.channels_sent && item.channels_sent.length > 0 && (
                            <div className="mt-1.5">
                              <NotificationChannelBadges activeChannels={item.channels_sent} showInactive={false} size="sm" />
                            </div>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {isUnread && (
                            <span
                              className="rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter"
                              title="Unread"
                            >
                              New
                            </span>
                          )}
                          {item.data?.url && (
                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-40" />
                          )}
                        </div>
                      </Card>
                    );
                  }}
                />
              </div>
            )}

            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-between border-t border-border px-4 py-3 sm:px-6">
                <p className="text-sm text-muted-foreground">
                  Page {meta.current_page} of {meta.last_page} ({meta.total} total)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.current_page <= 1}
                    onClick={() => handleFilter({ page: Math.max(1, (filter.page ?? 1) - 1) })}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.current_page >= meta.last_page}
                    onClick={() => handleFilter({ page: (filter.page ?? 1) + 1 })}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
