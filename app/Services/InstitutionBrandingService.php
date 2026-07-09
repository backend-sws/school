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
                // Full URL — DomPDF can fetch it directly with isRemoteEnabled
                $logoBase64 = $rawLogoPath;
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
