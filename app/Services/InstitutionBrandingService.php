<?php

namespace App\Services;

use App\Models\Institution;
use App\Models\Setting;

class InstitutionBrandingService
{
    /**
     * Resolve branding details for an institution.
     */
    public function resolve(?int $institutionId = null): array
    {
        $institution = $institutionId ? Institution::find($institutionId) : null;

        $rawLogoPath = $institution?->logo_url;
        $rawHeaderPath = Setting::where('setting_group', 'general')->where('setting_key', 'receipt_header')->value('setting_value');
        $rawFooterPath = Setting::where('setting_group', 'general')->where('setting_key', 'receipt_footer')->value('setting_value');

        return [
            'name' => $institution?->name ?? config('app.name', 'PDS Education'),
            'address' => $this->formatAddress($institution),
            'phone' => $institution?->phone ?? '',
            'email' => $institution?->email ?? '',
            'logo' => $this->processImageToUrlOrBase64($rawLogoPath, 300),
            'receipt_header' => $this->processImageToUrlOrBase64($rawHeaderPath, 1200),
            'receipt_footer' => $this->processImageToUrlOrBase64($rawFooterPath, 1200),
            'brand_color' => Setting::getBranding('brand_color') ?? '#4F46E5',
            'brand_theme' => Setting::getBranding('brand_theme') ?? 'royal',
        ];
    }

    private function processImageToUrlOrBase64(?string $rawPath, int $maxWidth = 300): ?string
    {
        if (empty($rawPath)) {
            return null;
        }

        $imageBase64 = null;
        $isFullUrl = str_starts_with($rawPath, 'http://') || str_starts_with($rawPath, 'https://');

        if ($isFullUrl) {
            // If it is a local storage path, read it directly from disk to bypass single-threaded server locking
            $urlPath = parse_url($rawPath, PHP_URL_PATH);
            if ($urlPath && str_starts_with($urlPath, '/storage/')) {
                $localPath = public_path(substr($urlPath, 1));
                if (file_exists($localPath)) {
                    $mimeType = @mime_content_type($localPath) ?: 'image/png';
                    $imageBase64 = 'data:' . $mimeType . ';base64,' . base64_encode(file_get_contents($localPath));
                }
            }

            // If not resolved locally, fetch via stream context to bypass self-request SSL verification blocks
            if (empty($imageBase64)) {
                try {
                    $ctx = stream_context_create([
                        "ssl" => [
                            "verify_peer" => false,
                            "verify_peer_name" => false,
                        ],
                    ]);
                    $imgData = @file_get_contents($rawPath, false, $ctx);
                    if ($imgData !== false) {
                        $imageBase64 = 'data:image/png;base64,' . base64_encode($imgData);
                    } else {
                        $imageBase64 = $rawPath;
                    }
                } catch (\Throwable $e) {
                    $imageBase64 = $rawPath;
                }
            }
        } else {
            // R2 path — compress and embed as base64 via ImageCompressionService
            $imageBase64 = app(ImageCompressionService::class)->compressForPdf($rawPath, $maxWidth);
        }

        return $imageBase64;
    }

    /**
     * Format institution address into a single line.
     */
    private function formatAddress(?Institution $institution): string
    {
        if (!$institution) return '';

        return trim(implode(', ', array_filter([
            $institution->address,
            $institution->city,
            $institution->state,
            $institution->pincode,
        ])));
    }
}
