<?php

namespace App\Jobs;

use App\Models\Video;
use App\Services\VideoStorageService;
use App\Services\VideoTranscoder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Main video transcoding job.
 *
 * Pipeline:
 * 1. Download raw file from R2 to temp
 * 2. Probe metadata (duration, resolution, codec, fps)
 * 3. Extract thumbnail
 * 4. Determine applicable profiles based on source resolution
 * 5. Transcode each profile to HLS (360p, 720p, 1080p)
 * 6. Generate adaptive master playlist
 * 7. Upload all HLS files to R2
 * 8. Update DB with final status
 * 9. Cleanup temp files
 */
class TranscodeVideoJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 7200;  // 2 hours
    public int $tries = 3;
    public array $backoff = [60, 300, 900];

    public function __construct(
        protected int $videoId
    ) {
        $this->onQueue(config('video.queue_name', 'video-processing'));
    }

    public function handle(
        VideoTranscoder $transcoder,
        VideoStorageService $storage
    ): void {
        $video = Video::findOrFail($this->videoId);

        if ($video->status === Video::STATUS_READY) {
            Log::info("[VIDEO] Video already ready, skipping", ['video_id' => $this->videoId]);
            return;
        }

        $video->markProcessing();
        $workDir = $transcoder->getWorkDir($this->videoId);

        try {
            // ── Step 1: Download raw from R2 ───────────────────────
            $localRaw = $workDir . '/original.' . pathinfo($video->file_name, PATHINFO_EXTENSION);
            Log::info("[VIDEO] Downloading raw file", ['video_id' => $this->videoId]);
            $storage->downloadRaw($video->raw_path, $localRaw);

            // ── Step 2: Probe metadata ─────────────────────────────
            Log::info("[VIDEO] Probing metadata", ['video_id' => $this->videoId]);
            $meta = $transcoder->probe($localRaw);

            $video->update([
                'duration_seconds' => $meta['duration'],
                'resolution_original' => "{$meta['width']}x{$meta['height']}",
                'metadata' => [
                    'codec' => $meta['codec'],
                    'fps' => $meta['fps'],
                    'bitrate' => $meta['bitrate'],
                    'audio_codec' => $meta['audio_codec'],
                    'width' => $meta['width'],
                    'height' => $meta['height'],
                ],
            ]);

            Log::info("[VIDEO] Metadata", [
                'video_id' => $this->videoId,
                'duration' => $meta['duration'],
                'resolution' => "{$meta['width']}x{$meta['height']}",
            ]);

            // ── Step 3: Extract thumbnail ──────────────────────────
            $thumbnailPath = $workDir . '/thumbnail.jpg';
            Log::info("[VIDEO] Extracting thumbnail", ['video_id' => $this->videoId]);
            $transcoder->extractThumbnail($localRaw, $thumbnailPath);

            $r2ThumbPath = $storage->uploadThumbnail($this->videoId, $thumbnailPath);
            $video->update(['thumbnail_path' => $r2ThumbPath]);

            // ── Step 4: Determine applicable profiles ──────────────
            $profiles = $transcoder->getApplicableProfiles($meta['width'], $meta['height']);
            Log::info("[VIDEO] Applicable profiles", [
                'video_id' => $this->videoId,
                'profiles' => array_keys($profiles),
            ]);

            // ── Step 5: Transcode each profile ─────────────────────
            $hlsDir = $workDir . '/hls';
            mkdir($hlsDir, 0755, true);

            $completedProfiles = [];
            foreach ($profiles as $name => $profile) {
                Log::info("[VIDEO] Starting transcode", [
                    'video_id' => $this->videoId,
                    'profile' => $name,
                ]);

                $transcoder->transcodeToHls($localRaw, $hlsDir, $name, $profile);
                $completedProfiles[$name] = $profile;
            }

            // ── Step 6: Generate master playlist ───────────────────
            $transcoder->generateMasterPlaylist($hlsDir, $completedProfiles);

            // ── Step 7: Upload HLS to R2 ───────────────────────────
            Log::info("[VIDEO] Uploading HLS files to R2", ['video_id' => $this->videoId]);
            $hlsR2Path = $storage->uploadHlsFiles($this->videoId, $hlsDir);

            // ── Step 8: Mark ready ─────────────────────────────────
            $video->markReady([
                'hls_path' => $hlsR2Path,
                'resolutions_available' => array_keys($completedProfiles),
            ]);

            Log::info("[VIDEO] Transcode complete", [
                'video_id' => $this->videoId,
                'duration' => $meta['duration'],
                'resolutions' => array_keys($completedProfiles),
            ]);

        } catch (\Throwable $e) {
            Log::error("[VIDEO] Transcode failed", [
                'video_id' => $this->videoId,
                'error' => $e->getMessage(),
                'attempt' => $this->attempts(),
            ]);

            // If this was the last retry, mark as failed
            if ($this->attempts() >= $this->tries) {
                $video->markFailed($e->getMessage());
            }

            throw $e; // Let the queue retry mechanism handle it
        } finally {
            // ── Step 9: Always cleanup temp files ──────────────────
            $transcoder->cleanup($this->videoId);
        }
    }

    /**
     * Handle job failure after all retries exhausted.
     */
    public function failed(\Throwable $e): void
    {
        $video = Video::find($this->videoId);
        if ($video) {
            $video->markFailed("All retries exhausted: " . $e->getMessage());
        }

        Log::error("[VIDEO] Job permanently failed", [
            'video_id' => $this->videoId,
            'error' => $e->getMessage(),
        ]);
    }
}
