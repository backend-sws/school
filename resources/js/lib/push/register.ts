/**
 * Register for web push: request permission, subscribe with VAPID key, send subscription to API.
 * Call from a user action (e.g. "Enable notifications" in settings) so the browser allows permission prompt.
 *
 * @param vapidPublicKey - VAPID public key from auth.vapid_public_key (base64url)
 * @param apiBaseUrl - Base URL for API (e.g. "" for same origin, or full origin for SPA)
 */
export async function registerForPushNotifications(
  vapidPublicKey: string | null | undefined,
  apiBaseUrl: string = ""
): Promise<{ success: boolean; error?: string }> {
  if (!vapidPublicKey) {
    return { success: false, error: "VAPID key not configured" };
  }
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { success: false, error: "Push not supported" };
  }

  try {
    // Use the same PWA service worker (handles precache + push)
    const swUrl = `${apiBaseUrl || ""}/build/sw.js`;
    let registration = await navigator.serviceWorker.getRegistration("/");
    const isPwaSw = registration?.active?.scriptURL?.includes("/build/sw.js");
    if (!registration || !isPwaSw) {
      registration = await navigator.serviceWorker.register(swUrl, { scope: "/" });
    }
    await registration.update();

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return { success: false, error: "Permission denied" };
    }

    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as BufferSource,
    });
    const sub = subscription.toJSON();
    const endpoint = sub.endpoint;
    const keys = sub.keys;
    const publicKey = keys?.p256dh ?? null;
    const authToken = keys?.auth ?? null;

    const res = await fetch(`${apiBaseUrl || ""}/api/v1/notifications/push/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
      credentials: "include",
      body: JSON.stringify({
        endpoint,
        public_key: publicKey,
        auth_token: authToken,
        content_encoding: "aes128gcm",
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: (err as { message?: string }).message || res.statusText };
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}
