/**
 * Video query key factory.
 *
 * Pattern: VideoQueryKeys.all, .list(filters), .detail(id)
 */
export const VideoQueryKeys = {
    all: ["videos"] as const,

    list: (filters?: { status?: string; page?: number }) =>
        [...VideoQueryKeys.all, "list", filters] as const,

    detail: (id: number) => [...VideoQueryKeys.all, "detail", id] as const,

    playbackUrl: (id: number) =>
        [...VideoQueryKeys.all, "playback", id] as const,

    storageUsage: () => [...VideoQueryKeys.all, "storage-usage"] as const,
};
