<?php

namespace App\Http\Resources;

use App\Services\ApiResponseMapService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Generic API Resource that filters payload by a config-driven map name.
 * Shape is defined in config/api_response_maps.php; optional enricher adds computed fields.
 * Use once per map name; no per-endpoint Resource class needed.
 */
class ConfigurableResource extends JsonResource
{
    public function __construct(
        mixed $resource,
        protected string $mapName
    ) {
        parent::__construct($resource);
    }

    /**
     * Transform the resource into an array using the map's allowed keys.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = $this->resource instanceof Model
            ? $this->resource->toArray()
            : (is_array($this->resource) ? $this->resource : (is_object($this->resource) ? (array) $this->resource : []));

        return app(ApiResponseMapService::class)->filter(
            $data,
            $this->mapName,
            $this->resource instanceof Model ? $this->resource : null
        );
    }
}
