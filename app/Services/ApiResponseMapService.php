<?php

namespace App\Services;

use App\Services\ApiResponseEnrichers\ResponseMapEnricherContract;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

/**
 * Config-driven response filter: exposes only keys defined for a map in config.
 * Optionally runs an enricher to add computed fields before filtering.
 * Create once, reuse by map name.
 */
class ApiResponseMapService
{
    /**
     * Filter a single payload to only allowed keys for the given map.
     * If the map defines an enricher, runs it with $source and merges result into $data first.
     *
     * @param  array<string, mixed>  $data  Raw payload (e.g. model->toArray())
     * @param  object|null  $source  Source model for enricher (e.g. the Eloquent model)
     * @return array<string, mixed>
     */
    public function filter(array $data, string $mapName, ?object $source = null): array
    {
        $map = config('api_response_maps.' . $mapName);
        if (empty($map) || empty($map['keys'])) {
            return $data;
        }

        if (! empty($map['enricher']) && $source !== null && is_string($map['enricher'])) {
            $enricher = app($map['enricher']);
            if ($enricher instanceof ResponseMapEnricherContract) {
                $data = array_merge($data, $enricher->enrich($source));
            }
        }

        $keys = $map['keys'];
        $result = [];
        foreach ($keys as $key) {
            if (Arr::has($data, $key)) {
                Arr::set($result, $key, Arr::get($data, $key));
            }
        }

        return $result;
    }

    /**
     * Filter a collection of items with the same map. Each item is converted to array
     * (Model->toArray() if Model), then filter() is applied with the item as source.
     *
     * @param  iterable<array|Model>  $items
     * @return array<int, array<string, mixed>>
     */
    public function filterCollection(iterable $items, string $mapName): array
    {
        $out = [];
        foreach ($items as $item) {
            $source = $item instanceof Model ? $item : null;
            $array = $item instanceof Model ? $item->toArray() : (is_array($item) ? $item : []);
            $out[] = $this->filter($array, $mapName, $source);
        }

        return $out;
    }
}
