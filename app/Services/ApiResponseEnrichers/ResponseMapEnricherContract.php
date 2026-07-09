<?php

namespace App\Services\ApiResponseEnrichers;

/**
 * Contract for enrichers that add computed attributes to API response payloads
 * before key filtering. Used by ApiResponseMapService when a map defines an enricher.
 */
interface ResponseMapEnricherContract
{
    /**
     * Return extra attributes to merge into the payload before key filtering.
     *
     * @param  object  $source  The model or source object (e.g. AdmissionApplication)
     * @return array<string, mixed>
     */
    public function enrich(object $source): array;
}
