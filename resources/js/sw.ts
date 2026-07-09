/**
 * PWA service worker: precache (Workbox) + push notifications.
 * Built by vite-plugin-pwa (injectManifest); __WB_MANIFEST is injected at build time.
 */
import { precacheAndRoute } from "workbox-precaching";

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{ url: string; revision?: string }>;
};

precacheAndRoute(self.__WB_MANIFEST);

// --- Push notifications (from legacy sw-push.js) ---
self.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;
  let payload: { title?: string; body?: string; data?: Record<string, unknown> };
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Notification", body: event.data.text() ?? "" };
  }
  const title = payload.title ?? "Notification";
  const body = payload.body ?? "";
  const data = payload.data ?? {};
  const options: NotificationOptions = {
    body,
    data: { url: (data as { url?: string }).url ?? "/", ...data },
    icon: (data as { icon?: string }).icon ?? "/favicon.ico",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();
  const url = event.notification.data?.url as string | undefined;
  if (url) {
    event.waitUntil(
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
    );
  }
});
