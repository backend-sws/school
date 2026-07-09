<?php

/**
 * Video Engine Configuration.
 *
 * Core config for the platform's video upload, transcoding, and streaming engine.
 * Used by VideoTranscoder, VideoStorageService, and VideoController.
 */

return [
    // ── Upload Limits ──────────────────────────────────────────────
    'max_file_size' => env('VIDEO_MAX_FILE_SIZE', 10 * 1024 * 1024 * 1024), // 10 GB
    'chunk_size' => env('VIDEO_CHUNK_SIZE', 5 * 1024 * 1024),               // 5 MB
    'max_concurrent_uploads' => env('VIDEO_MAX_CONCURRENT_UPLOADS', 3),
    'max_storage_per_institution' => env('VIDEO_MAX_STORAGE', 50 * 1024 * 1024 * 1024), // 50 GB

    // ── Allowed File Types ─────────────────────────────────────────
    'allowed_mimes' => [
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo',
        'video/x-matroska',
        'video/webm',
    ],

    'allowed_extensions' => ['mp4', 'mov', 'avi', 'mkv', 'webm'],

    // ── R2 Storage ─────────────────────────────────────────────────
    'storage_disk' => env('VIDEO_STORAGE_DISK', 'r2'),
    'path_prefix' => 'videos',
    'raw_prefix' => 'videos/raw',
    'hls_prefix' => 'videos/hls',
    'thumbnail_prefix' => 'videos/thumbnails',

    // ── Transcoding ────────────────────────────────────────────────
    'ffmpeg_binary' => env('FFMPEG_BINARY', '/usr/bin/ffmpeg'),
    'ffprobe_binary' => env('FFPROBE_BINARY', '/usr/bin/ffprobe'),
    'temp_directory' => env('VIDEO_TEMP_DIR', '/tmp/video-engine'),

    'thumbnail_at_seconds' => 5,
    'segment_duration' => 10,

    'profiles' => [
        '360p' => [
            'width' => 640,
            'height' => 360,
            'video_bitrate' => '800k',
            'audio_bitrate' => '96k',
            'crf' => 28,
            'preset' => 'medium',
        ],
        '720p' => [
            'width' => 1280,
            'height' => 720,
            'video_bitrate' => '2500k',
            'audio_bitrate' => '128k',
            'crf' => 23,
            'preset' => 'medium',
        ],
        '1080p' => [
            'width' => 1920,
            'height' => 1080,
            'video_bitrate' => '5000k',
            'audio_bitrate' => '192k',
            'crf' => 20,
            'preset' => 'medium',
        ],
    ],

    // ── Queue ──────────────────────────────────────────────────────
    'queue_name' => env('VIDEO_QUEUE', 'video-processing'),
    'max_tries' => 3,
    'retry_backoff' => [60, 300, 900], // 1 min, 5 min, 15 min

    // ── Playback Security ──────────────────────────────────────────
    'signed_url_ttl' => env('VIDEO_SIGNED_URL_TTL', 3600), // 1 hour
    'playback_rate_limit' => 100, // per user per hour
];
