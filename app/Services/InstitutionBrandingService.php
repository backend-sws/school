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
        $logoBase64 = null;

        if (!empty($rawLogoPath)) {
            $isFullUrl = str_starts_with($rawLogoPath, 'http://') || str_starts_with($rawLogoPath, 'https://');

            if ($isFullUrl) {
                // If it is a local storage path, read it directly from disk to bypass single-threaded server locking
                $urlPath = parse_url($rawLogoPath, PHP_URL_PATH);
                if ($urlPath && str_starts_with($urlPath, '/storage/')) {
                    $localPath = public_path(substr($urlPath, 1));
                    if (file_exists($localPath)) {
                        $mimeType = @mime_content_type($localPath) ?: 'image/png';
                        $logoBase64 = 'data:' . $mimeType . ';base64,' . base64_encode(file_get_contents($localPath));
                    }
                }

                // If not resolved locally, fetch via stream context to bypass self-request SSL verification blocks
                if (empty($logoBase64)) {
                    try {
                        $ctx = stream_context_create([
                            "ssl" => [
                                "verify_peer" => false,
                                "verify_peer_name" => false,
                            ],
                        ]);
                        $imgData = @file_get_contents($rawLogoPath, false, $ctx);
                        if ($imgData !== false) {
                            $logoBase64 = 'data:image/png;base64,' . base64_encode($imgData);
                        } else {
                            $logoBase64 = $rawLogoPath;
                        }
                    } catch (\Throwable $e) {
                        $logoBase64 = $rawLogoPath;
                    }
                }
            } else {
                // R2 path — compress and embed as base64 via ImageCompressionService
                $logoBase64 = app(ImageCompressionService::class)->compressForPdf($rawLogoPath);
            }
        }

        return [
            'name' => $institution?->name ?? config('app.name', 'PDS Education'),
            'address' => $this->formatAddress($institution),
            'phone' => $institution?->phone ?? '',
            'email' => $institution?->email ?? '',
            'logo' => $logoBase64,
            'brand_color' => Setting::getBranding('brand_color') ?? '#4F46E5',
            'brand_theme' => Setting::getBranding('brand_theme') ?? 'royal',
        ];
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
