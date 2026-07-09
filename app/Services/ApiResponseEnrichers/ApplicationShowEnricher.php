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
            return ['main_stream_name' => null, 'branch_stream_name' => null];
        }

        $head = $source->admissionHead;
        $mainStreamName = $head?->mainStream?->name
            ?? $head?->stream?->mainStream?->name
            ?? null;
        if ($mainStreamName === null && $head?->main_stream_id) {
            $mainStreamName = MainStream::withoutGlobalScopes()->find($head->main_stream_id)?->name;
        }
        $branchStreamName = $head?->stream?->name
            ?? $source->lmsClass?->name
            ?? $source->class_name
            ?? null;

        return [
            'main_stream_name' => $mainStreamName,
            'branch_stream_name' => $branchStreamName,
        ];
    }
}
