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
 * Standalone thumbnail generation job.
 *
 * Useful when:
 * - Regenerating a thumbnail for an existing video
 * - Generating thumbnail at a custom timestamp
 * - Re-extracting after a failed thumbnail extraction
 */
class GenerateVideoThumbnailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 120;
    public int $tries = 2;

    public function __construct(
        protected int $videoId,
        protected int $atSeconds = 5
    ) {
        $this->onQueue(config('video.queue_name', 'video-processing'));
    }

    public function handle(
        VideoTranscoder $transcoder,
        VideoStorageService $storage
    ): void {
        $video = Video::findOrFail($this->videoId);

        if (!$video->raw_path) {
            Log::warning("[VIDEO] Cannot generate thumbnail — no raw file", ['video_id' => $this->videoId]);
            return;
        }

        $workDir = $transcoder->getWorkDir($this->videoId);

        try {
            // Download raw from R2
            $ext = pathinfo($video->file_name, PATHINFO_EXTENSION);
            $localRaw = $workDir . '/original.' . $ext;
            $storage->downloadRaw($video->raw_path, $localRaw);

            // Extract thumbnail
            $thumbnailPath = $workDir . '/thumbnail.jpg';
            $transcoder->extractThumbnail($localRaw, $thumbnailPath);

            // Upload to R2
            $r2Path = $storage->uploadThumbnail($this->videoId, $thumbnailPath);
            $video->update(['thumbnail_path' => $r2Path]);

            Log::info("[VIDEO] Thumbnail regenerated", ['video_id' => $this->videoId]);
        } catch (\Throwable $e) {
            Log::error("[VIDEO] Thumbnail generation failed", [
                'video_id' => $this->videoId,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        } finally {
            $transcoder->cleanup($this->videoId);
        }
    }
}
