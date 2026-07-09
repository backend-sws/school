<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * Image compression service using PHP GD.
 * Provides methods for PDF-optimized and upload-optimized image compression.
 */
class ImageCompressionService
{
    /**
     * Compress an image from R2 storage for PDF embedding.
     * Resizes to a small width (for header logos) and returns a base64 data URI.
     *
     * @param string $r2Path    R2 storage path (e.g. "uploads/9/abc.png")
     * @param int    $maxWidth  Maximum width in pixels (default: 300 for PDF header)
     * @param int    $quality   JPEG quality 1-100 (default: 80)
     * @return string|null      Base64 data URI or null on failure
     */
    public function compressForPdf(string $r2Path, int $maxWidth = 300, int $quality = 80): ?string
    {
        if (empty($r2Path)) return null;

        $cacheKey = 'logo_pdf_b64_' . md5($r2Path . $maxWidth . $quality);

        return Cache::remember($cacheKey, 86400, function () use ($r2Path, $maxWidth, $quality) {
            try {
                $r2 = app(R2Service::class);
                $object = $r2->getObject($r2Path);

                if (!$object) {
                    Log::warning('ImageCompressionService: File not found in R2', ['path' => $r2Path]);
                    return null;
                }

                // Read stream into memory in chunks (safer than full file read)
                $body = $object['Body'];
                $rawData = '';
                while (!$body->eof()) {
                    $rawData .= $body->read(8192);
                }

                $compressed = $this->resizeAndCompress($rawData, $maxWidth, $quality);
                if (!$compressed) return null;

                // Clean up raw data immediately to free memory
                unset($rawData);

                return 'data:image/jpeg;base64,' . base64_encode($compressed);
            } catch (\Throwable $e) {
                Log::warning('ImageCompressionService: compressForPdf failed', [
                    'path' => $r2Path,
                    'error' => $e->getMessage(),
                ]);
                return null;
            }
        });
    }

    /**
     * Compress an uploaded image file for R2 storage.
     * Resizes to a reasonable max width and returns the compressed binary data.
     *
     * @param string $filePath  Absolute path to the temp uploaded file
     * @param int    $maxWidth  Maximum width in pixels (default: 1200)
     * @param int    $quality   JPEG quality 1-100 (default: 85)
     * @return array{data: string, mime: string}|null  Compressed data + mime type, or null
     */
    public function compressForUpload(string $filePath, int $maxWidth = 1200, int $quality = 85): ?array
    {
        try {
            $rawData = file_get_contents($filePath);
            if ($rawData === false) return null;

            $compressed = $this->resizeAndCompress($rawData, $maxWidth, $quality);
            unset($rawData);

            if (!$compressed) return null;

            return [
                'data' => $compressed,
                'mime' => 'image/jpeg',
            ];
        } catch (\Throwable $e) {
            Log::warning('ImageCompressionService: compressForUpload failed', [
                'path' => $filePath,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Core: resize and compress raw image data using GD.
     *
     * @param string $rawData   Raw image binary data
     * @param int    $maxWidth  Maximum output width
     * @param int    $quality   JPEG quality 1-100
     * @return string|null      Compressed JPEG binary data or null
     */
    private function resizeAndCompress(string $rawData, int $maxWidth, int $quality): ?string
    {
        $source = @imagecreatefromstring($rawData);
        if (!$source) {
            Log::warning('ImageCompressionService: GD could not parse image data');
            return null;
        }

        $origWidth = imagesx($source);
        $origHeight = imagesy($source);

        // Only resize if wider than maxWidth
        if ($origWidth > $maxWidth) {
            $ratio = $maxWidth / $origWidth;
            $newWidth = $maxWidth;
            $newHeight = (int) round($origHeight * $ratio);
        } else {
            $newWidth = $origWidth;
            $newHeight = $origHeight;
        }

        $resized = imagecreatetruecolor($newWidth, $newHeight);

        // Preserve transparency for PNG → fill with white background for JPEG output
        $white = imagecolorallocate($resized, 255, 255, 255);
        imagefill($resized, 0, 0, $white);

        imagecopyresampled($resized, $source, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);
        imagedestroy($source);

        // Output to buffer as JPEG
        ob_start();
        imagejpeg($resized, null, $quality);
        $output = ob_get_clean();
        imagedestroy($resized);

        return $output ?: null;
    }
}
