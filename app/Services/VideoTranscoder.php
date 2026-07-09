<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;

/**
 * FFmpeg wrapper for video transcoding operations.
 *
 * Handles:
 * - Probing video metadata (resolution, duration, codec, fps)
 * - Extracting thumbnails
 * - Multi-resolution HLS transcoding (360p, 720p, 1080p)
 * - Generating adaptive master playlist
 */
class VideoTranscoder
{
    protected string $ffmpegBinary;
    protected string $ffprobeBinary;
    protected string $tempDir;
    protected array $profiles;
    protected int $segmentDuration;
    protected int $thumbnailAt;

    public function __construct()
    {
        $this->ffmpegBinary = config('video.ffmpeg_binary', '/usr/bin/ffmpeg');
        $this->ffprobeBinary = config('video.ffprobe_binary', '/usr/bin/ffprobe');
        $this->tempDir = config('video.temp_directory', '/tmp/video-engine');
        $this->profiles = config('video.profiles', []);
        $this->segmentDuration = config('video.segment_duration', 10);
        $this->thumbnailAt = config('video.thumbnail_at_seconds', 5);
    }

    /**
     * Probe video metadata using FFprobe.
     *
     * @return array{duration: int, width: int, height: int, codec: string, fps: float, bitrate: int, audio_codec: string|null}
     */
    public function probe(string $inputPath): array
    {
        $cmd = sprintf(
            '%s -v quiet -print_format json -show_format -show_streams %s',
            escapeshellcmd($this->ffprobeBinary),
            escapeshellarg($inputPath)
        );

        $result = Process::run($cmd);

        if (!$result->successful()) {
            throw new \RuntimeException("FFprobe failed: " . $result->errorOutput());
        }

        $data = json_decode($result->output(), true);

        $videoStream = collect($data['streams'] ?? [])
            ->firstWhere('codec_type', 'video');

        $audioStream = collect($data['streams'] ?? [])
            ->firstWhere('codec_type', 'audio');

        if (!$videoStream) {
            throw new \RuntimeException("No video stream found in file.");
        }

        $duration = (int) round(floatval($data['format']['duration'] ?? 0));
        $fps = 0;
        if (!empty($videoStream['r_frame_rate'])) {
            $parts = explode('/', $videoStream['r_frame_rate']);
            $fps = count($parts) === 2 && $parts[1] > 0
                ? round($parts[0] / $parts[1], 2)
                : floatval($parts[0]);
        }

        return [
            'duration' => $duration,
            'width' => (int) ($videoStream['width'] ?? 0),
            'height' => (int) ($videoStream['height'] ?? 0),
            'codec' => $videoStream['codec_name'] ?? 'unknown',
            'fps' => $fps,
            'bitrate' => (int) ($data['format']['bit_rate'] ?? 0),
            'audio_codec' => $audioStream['codec_name'] ?? null,
        ];
    }

    /**
     * Extract a thumbnail frame from the video.
     */
    public function extractThumbnail(string $inputPath, string $outputPath): void
    {
        $cmd = sprintf(
            '%s -y -i %s -ss %d -vframes 1 -vf "scale=640:360:force_original_aspect_ratio=decrease,pad=640:360:(ow-iw)/2:(oh-ih)/2" -q:v 2 %s',
            escapeshellcmd($this->ffmpegBinary),
            escapeshellarg($inputPath),
            $this->thumbnailAt,
            escapeshellarg($outputPath)
        );

        $result = Process::timeout(60)->run($cmd);

        if (!$result->successful()) {
            Log::warning("[VIDEO] Thumbnail extraction failed, trying at 0s", [
                'error' => $result->errorOutput(),
            ]);

            // Fallback: extract from first frame
            $cmd = sprintf(
                '%s -y -i %s -vframes 1 -vf "scale=640:360:force_original_aspect_ratio=decrease,pad=640:360:(ow-iw)/2:(oh-ih)/2" -q:v 2 %s',
                escapeshellcmd($this->ffmpegBinary),
                escapeshellarg($inputPath),
                escapeshellarg($outputPath)
            );

            $result = Process::timeout(60)->run($cmd);

            if (!$result->successful()) {
                throw new \RuntimeException("Thumbnail extraction failed: " . $result->errorOutput());
            }
        }
    }

    /**
     * Determine which resolution profiles to transcode based on source resolution.
     *
     * @return array<string, array> Filtered profiles
     */
    public function getApplicableProfiles(int $sourceWidth, int $sourceHeight): array
    {
        $applicable = [];

        foreach ($this->profiles as $name => $profile) {
            // Only transcode to resolutions at or below the source
            if ($profile['height'] <= $sourceHeight) {
                $applicable[$name] = $profile;
            }
        }

        // Always include at least the lowest profile
        if (empty($applicable) && !empty($this->profiles)) {
            $lowest = array_key_first($this->profiles);
            $applicable[$lowest] = $this->profiles[$lowest];
        }

        return $applicable;
    }

    /**
     * Transcode video to HLS for a single resolution profile.
     */
    public function transcodeToHls(
        string $inputPath,
        string $outputDir,
        string $profileName,
        array $profile
    ): void {
        $profileDir = $outputDir . '/' . $profileName;
        if (!is_dir($profileDir)) {
            mkdir($profileDir, 0755, true);
        }

        $cmd = sprintf(
            '%s -y -i %s ' .
            '-vf "scale=%d:%d:force_original_aspect_ratio=decrease,pad=%d:%d:(ow-iw)/2:(oh-ih)/2" ' .
            '-c:v libx264 -preset %s -crf %d ' .
            '-maxrate %s -bufsize %s ' .
            '-c:a aac -b:a %s -ac 2 -ar 44100 ' .
            '-hls_time %d -hls_list_size 0 ' .
            '-hls_segment_filename %s ' .
            '-f hls %s',
            escapeshellcmd($this->ffmpegBinary),
            escapeshellarg($inputPath),
            $profile['width'],
            $profile['height'],
            $profile['width'],
            $profile['height'],
            $profile['preset'],
            $profile['crf'],
            $profile['video_bitrate'],
            $this->calculateBufsize($profile['video_bitrate']),
            $profile['audio_bitrate'],
            $this->segmentDuration,
            escapeshellarg($profileDir . '/segment_%04d.ts'),
            escapeshellarg($profileDir . '/playlist.m3u8')
        );

        Log::info("[VIDEO] Transcoding {$profileName}", ['profile' => $profile]);

        // Long timeout: 4-hour video can take up to 2 hours to transcode
        $result = Process::timeout(7200)->run($cmd);

        if (!$result->successful()) {
            throw new \RuntimeException(
                "FFmpeg transcode failed for {$profileName}: " . $result->errorOutput()
            );
        }

        Log::info("[VIDEO] Transcode {$profileName} complete");
    }

    /**
     * Generate the adaptive master playlist.
     *
     * @param string $outputDir Directory containing resolution subdirectories
     * @param array<string, array> $completedProfiles Profiles that were successfully transcoded
     */
    public function generateMasterPlaylist(string $outputDir, array $completedProfiles): void
    {
        $bandwidthMap = [
            '360p' => 800000,
            '720p' => 2500000,
            '1080p' => 5000000,
        ];

        $lines = ['#EXTM3U', '#EXT-X-VERSION:3', ''];

        foreach ($completedProfiles as $name => $profile) {
            $bandwidth = $bandwidthMap[$name] ?? 1000000;
            $lines[] = sprintf(
                '#EXT-X-STREAM-INF:BANDWIDTH=%d,RESOLUTION=%dx%d,NAME="%s"',
                $bandwidth,
                $profile['width'],
                $profile['height'],
                $name
            );
            $lines[] = "{$name}/playlist.m3u8";
            $lines[] = '';
        }

        file_put_contents(
            $outputDir . '/master.m3u8',
            implode("\n", $lines)
        );
    }

    /**
     * Get the working directory for a video transcode operation.
     */
    public function getWorkDir(int $videoId): string
    {
        $dir = $this->tempDir . '/' . $videoId;
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        return $dir;
    }

    /**
     * Cleanup temp files for a video.
     */
    public function cleanup(int $videoId): void
    {
        $dir = $this->tempDir . '/' . $videoId;
        if (is_dir($dir)) {
            Process::run("rm -rf " . escapeshellarg($dir));
            Log::info("[VIDEO] Cleaned up temp directory", ['video_id' => $videoId]);
        }
    }

    /**
     * Calculate bufsize as 2x the video bitrate.
     */
    protected function calculateBufsize(string $bitrate): string
    {
        $value = (int) $bitrate;
        return ($value * 2) . 'k';
    }
}
