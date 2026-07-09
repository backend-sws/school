import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo?: InstanceType<typeof Echo>;
  }
}

const reverbHost = import.meta.env.VITE_REVERB_HOST ?? "localhost";
const reverbPort = import.meta.env.VITE_REVERB_PORT ?? "8080";
const reverbScheme = import.meta.env.VITE_REVERB_SCHEME ?? "http";
const reverbKey = import.meta.env.VITE_REVERB_APP_KEY ?? "";
const appUrl = import.meta.env.VITE_APP_URL ?? (typeof window !== "undefined" ? window.location.origin : "");

/**
 * Origin to use for the broadcasting auth request. Prefer current page origin in the browser
 * so session cookies are sent (avoids 401 when using subdomains e.g. school.localhost vs localhost).
 */
function getAuthOrigin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return appUrl;
}


/**
 * Create and return an Echo instance for Reverb (Pusher protocol).
 * Call once when the user is authenticated; use the returned instance to subscribe to private channels.
 * Uses a custom authorizer so the auth request sends credentials (session cookie).
 */
export function getEcho(): InstanceType<typeof Echo> | null {
  if (!reverbKey) return null;
  if (typeof window === "undefined") return null;

  if (window.Echo) return window.Echo;

  window.Pusher = Pusher;

  const wsHost = reverbHost.replace(/^https?:\/\//, "");
  const forceTLS = reverbScheme === "https";
  const wsPort = Number(reverbPort);
  const wssPort = forceTLS ? 443 : wsPort;

  window.Echo = new Echo({
    broadcaster: "reverb",
    key: reverbKey,
    wsHost,
    wsPort,
    wssPort,
    forceTLS,
    enabledTransports: ["ws", "wss"],
    authorizer: (channel: { name: string }) => {
      return {
        authorize: (socketId: string, callback: (error: boolean, authData?: any) => void) => {
          const origin = getAuthOrigin();
          const url = `${origin}/broadcasting/auth`;

          const headers: Record<string, string> = {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
          };

          const csrfToken =
            typeof document !== "undefined" &&
            document.cookie
              .split("; ")
              .find((row) => row.startsWith("XSRF-TOKEN="))
              ?.split("=")[1];

          if (csrfToken) {
            headers["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
          }

          const body = new URLSearchParams({
            socket_id: socketId,
            channel_name: channel.name,
          });

          fetch(url, {
            method: "POST",
            headers,
            body: body.toString(),
            credentials: "include",
          })
            .then((res) => {
              if (!res.ok) {
                return res.json().then((data) => callback(true, data?.message ?? `HTTP ${res.status}`));
              }
              return res.json().then((data) => callback(false, data));
            })
            .catch((err) => callback(true, err?.message ?? "Auth request failed"));
        },
      };
    },
  });

  return window.Echo;
}

/**
 * Disconnect and clear the Echo instance (e.g. on logout).
 */
export function disconnectEcho(): void {
  if (typeof window !== "undefined" && window.Echo) {
    window.Echo.disconnect();
    window.Echo = undefined;
  }
}
