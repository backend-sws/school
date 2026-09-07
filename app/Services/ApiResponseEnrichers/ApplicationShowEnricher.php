<?php

namespace App\Services\ApiResponseEnrichers;

use App\Models\AdmissionApplication;
use App\Models\MainStream;

/**
 * Enricher for application_show map: adds main_stream_name and branch_stream_name
 * so they are available for key filtering without hardcoding in a Resource.
 */
class ApplicationShowEnricher implements ResponseMapEnricherContract
{
    /**
     * @param  AdmissionApplication  $source
     * @return array{main_stream_name: string|null, branch_stream_name: string|null}
     */
    public function enrich(object $source): array
    {
        if (! $source instanceof AdmissionApplication) {
            return [
                'main_stream_name' => null,
                'branch_stream_name' => null,
                'section_name' => null,
            ];
        }

        $mainStreamName = $source->main_stream_name
            ?? $source->admissionHead?->mainStream?->name
            ?? $source->admissionHead?->stream?->mainStream?->name
            ?? null;

        if ($mainStreamName === null && $source->admissionHead?->main_stream_id) {
            $mainStreamName = MainStream::withoutGlobalScopes()->find($source->admissionHead->main_stream_id)?->name;
        }

        $branchStreamName = $source->class_name
            ?? $source->admissionHead?->stream?->name
            ?? $source->lmsClass?->name
            ?? null;

        $sectionName = $source->section_name
            ?? $source->lmsSection?->name
            ?? null;

        return [
            'main_stream_name' => $mainStreamName,
            'branch_stream_name' => $branchStreamName,
            'section_name' => $sectionName,
        ];
    }
}
