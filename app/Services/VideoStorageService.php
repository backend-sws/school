<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * R2 storage operations for the video engine.
 *
 * Handles:
 * - Multipart upload (init, part, complete, abort)
 * - HLS file uploads (segments + playlists)
 * - Signed URL generation for secure playback
 * - Storage quota checks
 * - Cleanup of video files
 */
class VideoStorageService
{
    protected string $disk;
    protected string $rawPrefix;
    protected string $hlsPrefix;
    protected string $thumbnailPrefix;
    protected int $signedUrlTtl;

    public function __construct()
    {
        $this->disk = config('video.storage_disk', 'r2');
        $this->rawPrefix = config('video.raw_prefix', 'videos/raw');
        $this->hlsPrefix = config('video.hls_prefix', 'videos/hls');
        $this->thumbnailPrefix = config('video.thumbnail_prefix', 'videos/thumbnails');
        $this->signedUrlTtl = config('video.signed_url_ttl', 3600);
    }

    // ── Multipart Upload ───────────────────────────────────────────

    /**
     * Get the raw storage path for a video.
     */
    public function getRawPath(int $videoId, string $fileName): string
    {
        $ext = pathinfo($fileName, PATHINFO_EXTENSION);
        return "{$this->rawPrefix}/{$videoId}/original.{$ext}";
    }

    /**
     * Store the uploaded raw file to R2.
     * For chunked uploads, this stores the final assembled file.
     */
    public function storeRawFile(int $videoId, string $localPath, string $fileName): string
    {
        $r2Path = $this->getRawPath($videoId, $fileName);

        Storage::disk($this->disk)->putFileAs(
            dirname($r2Path),
            new \SplFileInfo($localPath),
            basename($r2Path)
        );

        Log::info("[VIDEO] Raw file stored to R2", ['video_id' => $videoId, 'path' => $r2Path]);
        return $r2Path;
    }

    /**
     * Download raw file from R2 to local temp directory.
     */
    public function downloadRaw(string $r2Path, string $localPath): void
    {
        $dir = dirname($localPath);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $stream = Storage::disk($this->disk)->readStream($r2Path);

        if (!$stream) {
            throw new \RuntimeException("Failed to download raw file from R2: {$r2Path}");
        }

        $fp = fopen($localPath, 'w');
        stream_copy_to_stream($stream, $fp);
        fclose($fp);
        fclose($stream);

        Log::info("[VIDEO] Raw file downloaded from R2", ['path' => $r2Path, 'local' => $localPath]);
    }

    // ── HLS Upload ─────────────────────────────────────────────────

    /**
     * Upload all HLS files from local directory to R2.
     *
     * Recursively uploads: master.m3u8, {profile}/playlist.m3u8, {profile}/segment_*.ts
     */
    public function uploadHlsFiles(int $videoId, string $localDir): string
    {
        $r2Base = "{$this->hlsPrefix}/{$videoId}";

        $this->uploadDirectoryRecursive($localDir, $r2Base);

        Log::info("[VIDEO] HLS files uploaded to R2", [
            'video_id' => $videoId,
            'r2_path' => $r2Base,
        ]);

        return "{$r2Base}/master.m3u8";
    }

    /**
     * Upload a thumbnail to R2.
     */
    public function uploadThumbnail(int $videoId, string $localPath): string
    {
        $r2Path = "{$this->thumbnailPrefix}/{$videoId}.jpg";

        Storage::disk($this->disk)->putFileAs(
            dirname($r2Path),
            new \SplFileInfo($localPath),
            basename($r2Path)
        );

        Log::info("[VIDEO] Thumbnail uploaded to R2", ['video_id' => $videoId]);
        return $r2Path;
    }

    // ── Signed URLs ────────────────────────────────────────────────

    /**
     * Generate a time-limited signed URL for HLS playback.
     */
    public function getSignedPlaybackUrl(string $r2Path): string
    {
        return Storage::disk($this->disk)->temporaryUrl(
            $r2Path,
            now()->addSeconds($this->signedUrlTtl)
        );
    }

    /**
     * Generate a signed thumbnail URL.
     */
    public function getSignedThumbnailUrl(string $r2Path): string
    {
        return Storage::disk($this->disk)->temporaryUrl(
            $r2Path,
            now()->addSeconds($this->signedUrlTtl)
        );
    }

    // ── Storage Quota ──────────────────────────────────────────────

    /**
     * Get total video storage used by an institution (in bytes).
     */
    public function getStorageUsed(int $institutionId): int
    {
        return \App\Models\Video::forInstitution($institutionId)
            ->sum('file_size_bytes') ?? 0;
    }

    /**
     * Check if institution has storage quota remaining.
     */
    public function hasStorageQuota(int $institutionId, int $fileSizeBytes): bool
    {
        $maxStorage = config('video.max_storage_per_institution');
        $used = $this->getStorageUsed($institutionId);

        return ($used + $fileSizeBytes) <= $maxStorage;
    }

    // ── Cleanup ────────────────────────────────────────────────────

    /**
     * Delete all R2 files for a video (raw + HLS + thumbnail).
     */
    public function deleteAllFiles(int $videoId): void
    {
        // Delete raw
        Storage::disk($this->disk)->deleteDirectory("{$this->rawPrefix}/{$videoId}");

        // Delete HLS
        Storage::disk($this->disk)->deleteDirectory("{$this->hlsPrefix}/{$videoId}");

        // Delete thumbnail
        Storage::disk($this->disk)->delete("{$this->thumbnailPrefix}/{$videoId}.jpg");

        Log::info("[VIDEO] All R2 files deleted", ['video_id' => $videoId]);
    }

    // ── Private Helpers ────────────────────────────────────────────

    /**
     * Recursively upload a local directory to R2.
     */
    protected function uploadDirectoryRecursive(string $localDir, string $r2Base): void
    {
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($localDir, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST
        );

        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $relativePath = substr($file->getPathname(), strlen($localDir) + 1);
                $r2Path = $r2Base . '/' . $relativePath;

                Storage::disk($this->disk)->putFileAs(
                    dirname($r2Path),
                    new \SplFileInfo($file->getPathname()),
                    basename($r2Path)
                );
            }
        }
    }
}
