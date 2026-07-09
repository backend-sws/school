/**
 * VCache — PDS Education Frontend Cache Engine
 *
 * Generic, O(1) caching for any module in the project.
 * In-memory Map per namespace (no JSON.parse per read) + sessionStorage/localStorage backing.
 *
 * ── Usage ──────────────────────────────────────────────────
 *
 *   import { VCache } from "@/lib/cache";
 *
 *   // Create a namespaced cache bucket
 *   const cache = VCache.bucket("forms", { ttl: 5 * 60_000, maxEntries: 20 });
 *
 *   cache.set("key", { content: "Hello" });    // O(1) write
 *   cache.get("key");                           // O(1) read → { content: "Hello" } | null
 *   cache.has("key");                           // O(1) check
 *   cache.remove("key");                        // O(1) delete
 *   cache.clear();                              // wipe this bucket
 *
 *   // Different modules get isolated namespaces
 *   const formCache = VCache.bucket("form-drafts", { ttl: 30 * 60_000, storage: "local" });
 *   const apiCache  = VCache.bucket("api-responses", { ttl: 60_000, maxEntries: 50 });
 *
 * ── Design ─────────────────────────────────────────────────
 *
 *   - In-memory Map per bucket → O(1) get/set/has/remove
 *   - Lazy hydration → sessionStorage parsed once per bucket, on first access
 *   - FIFO eviction → oldest entry dropped when maxEntries reached
 *   - TTL enforced on read → expired entries return null and get pruned
 *   - Storage-agnostic → sessionStorage (default) or localStorage
 *   - SSR-safe → no-ops when window/storage unavailable
 */

// ── Types ──────────────────────────────────────────────────────────

interface BucketOptions {
    /** Time-to-live in milliseconds. Default: 5 minutes. */
    ttl?: number;
    /** Max entries before FIFO eviction. Default: 30. */
    maxEntries?: number;
    /** Storage backend. Default: "session". */
    storage?: "session" | "local";
}

interface CacheRecord<T = unknown> {
    data: T;
    ts: number;
}

interface CacheBucket<T = unknown> {
    get: (key: string) => T | null;
    set: (key: string, value: T) => void;
    has: (key: string) => boolean;
    remove: (key: string) => void;
    clear: () => void;
}

// ── Internals ──────────────────────────────────────────────────────

const BUCKETS = new Map<string, CacheBucket<any>>();

const getStorage = (type: "session" | "local"): Storage | null => {
    if (typeof window === "undefined") return null;
    try {
        return type === "local" ? localStorage : sessionStorage;
    } catch {
        return null;
    }
};

// ── Bucket Factory ─────────────────────────────────────────────────

function createBucket<T = unknown>(
    namespace: string,
    options: BucketOptions = {},
): CacheBucket<T> {
    const ttl = options.ttl ?? 5 * 60_000;
    const maxEntries = options.maxEntries ?? 30;
    const storageType = options.storage ?? "session";
    const storageKey = `vcache:${namespace}`;

    const map = new Map<string, CacheRecord<T>>();
    let hydrated = false;

    // ── Lazy hydrate from storage (once) ──
    const hydrate = (): void => {
        if (hydrated) return;
        hydrated = true;

        const storage = getStorage(storageType);
        if (!storage) return;

        try {
            const raw = storage.getItem(storageKey);
            if (!raw) return;

            const entries: Record<string, CacheRecord<T>> = JSON.parse(raw);
            const now = Date.now();

            for (const [key, record] of Object.entries(entries)) {
                if (now - record.ts < ttl) map.set(key, record);
            }
        } catch {
            storage.removeItem(storageKey);
        }
    };

    // ── Persist to storage ──
    const persist = (): void => {
        const storage = getStorage(storageType);
        if (!storage) return;

        try {
            const obj: Record<string, CacheRecord<T>> = {};
            for (const [k, v] of map) obj[k] = v;
            storage.setItem(storageKey, JSON.stringify(obj));
        } catch {
            // Storage full — silently skip
        }
    };

    // ── Public bucket API ──
    return {
        get(key: string): T | null {
            hydrate();
            const record = map.get(key);
            if (!record) return null;

            if (Date.now() - record.ts > ttl) {
                map.delete(key);
                return null;
            }

            return record.data;
        },

        set(key: string, value: T): void {
            hydrate();

            // FIFO eviction
            if (map.size >= maxEntries && !map.has(key)) {
                const oldest = map.keys().next().value;
                if (oldest) map.delete(oldest);
            }

            map.set(key, { data: value, ts: Date.now() });
            persist();
        },

        has(key: string): boolean {
            hydrate();
            const record = map.get(key);
            if (!record) return false;
            if (Date.now() - record.ts > ttl) {
                map.delete(key);
                return false;
            }
            return true;
        },

        remove(key: string): void {
            hydrate();
            map.delete(key);
            persist();
        },

        clear(): void {
            map.clear();
            const storage = getStorage(storageType);
            if (storage) {
                try { storage.removeItem(storageKey); } catch { /* noop */ }
            }
        },
    };
}

// ── VCache Singleton ───────────────────────────────────────────────

export const VCache = {
    /**
     * Get or create a namespaced cache bucket.
     * Same namespace → same bucket instance (singleton per name).
     */
    bucket<T = unknown>(namespace: string, options?: BucketOptions): CacheBucket<T> {
        const existing = BUCKETS.get(namespace);
        if (existing) return existing as CacheBucket<T>;

        const bucket = createBucket<T>(namespace, options);
        BUCKETS.set(namespace, bucket);
        return bucket;
    },

    /** Clear ALL cache buckets. */
    clearAll(): void {
        for (const bucket of BUCKETS.values()) bucket.clear();
        BUCKETS.clear();
    },
};

export type { CacheBucket, BucketOptions };
