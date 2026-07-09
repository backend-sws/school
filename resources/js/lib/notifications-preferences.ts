const ALLOWED_KEY = "notifications_realtime_allowed";
const PROMPT_DISMISSED_KEY = "notifications_prompt_dismissed";

export function getRealtimeNotificationsAllowed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(ALLOWED_KEY) === "true";
  } catch {
    return false;
  }
}

const PREFERENCES_CHANGED_EVENT = "notifications-preferences-changed";

export function setRealtimeNotificationsAllowed(allowed: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (allowed) {
      localStorage.setItem(ALLOWED_KEY, "true");
      localStorage.removeItem(PROMPT_DISMISSED_KEY);
    } else {
      localStorage.removeItem(ALLOWED_KEY);
    }
    window.dispatchEvent(new CustomEvent(PREFERENCES_CHANGED_EVENT, { detail: { allowed } }));
  } catch {
    // ignore
  }
}

export function subscribeToNotificationsPreferencesChanged(
  callback: (allowed: boolean) => void
): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => callback((e as CustomEvent<{ allowed: boolean }>).detail?.allowed ?? getRealtimeNotificationsAllowed());
  window.addEventListener(PREFERENCES_CHANGED_EVENT, handler);
  return () => window.removeEventListener(PREFERENCES_CHANGED_EVENT, handler);
}

export function getNotificationsPromptDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(PROMPT_DISMISSED_KEY) === "true";
  } catch {
    return false;
  }
}

export function setNotificationsPromptDismissed(dismissed: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (dismissed) {
      localStorage.setItem(PROMPT_DISMISSED_KEY, "true");
    } else {
      localStorage.removeItem(PROMPT_DISMISSED_KEY);
    }
  } catch {
    // ignore
  }
}
