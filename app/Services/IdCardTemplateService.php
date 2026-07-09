<?php

namespace App\Services;

use App\Models\IdCardTemplate;
use Illuminate\Pagination\LengthAwarePaginator;

class IdCardTemplateService
{
    /**
     * List templates with search, card_type filter, pagination.
     */
    public function getAll(array $filters): LengthAwarePaginator
    {
        $query = IdCardTemplate::query();

        if (!empty($filters['search'])) {
            $searchBy = $filters['search_by'] ?? 'name';
            $column = in_array($searchBy, ['name', 'card_type']) ? $searchBy : 'name';
            $query->where($column, 'like', "%{$filters['search']}%");
        }

        if (!empty($filters['card_type'])) {
            $query->where('card_type', $filters['card_type']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', (bool) $filters['is_active']);
        }

        return $query->orderByDesc('created_at')->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Create a new template. Ensures only one default per card_type.
     */
    public function create(array $data): IdCardTemplate
    {
        if (!empty($data['is_default'])) {
            $this->clearDefaultForType($data['card_type']);
        }

        return IdCardTemplate::create($data);
    }

    /**
     * Get a template by ID.
     */
    public function getById(int $id): IdCardTemplate
    {
        return IdCardTemplate::findOrFail($id);
    }

    /**
     * Update a template.
     */
    public function update(int $id, array $data): IdCardTemplate
    {
        $template = IdCardTemplate::findOrFail($id);

        if (!empty($data['is_default'])) {
            $this->clearDefaultForType($template->card_type);
        }

        $template->update($data);
        return $template->fresh();
    }

    /**
     * Delete a template (only if no cards have been generated from it).
     */
    public function delete(int $id): bool
    {
        $template = IdCardTemplate::findOrFail($id);

        if ($template->idCards()->exists()) {
            throw new \RuntimeException('Cannot delete template: cards have been generated from it.');
        }

        return $template->delete();
    }

    /**
     * Toggle active status.
     */
    public function toggleStatus(int $id): IdCardTemplate
    {
        $template = IdCardTemplate::findOrFail($id);
        $template->update(['is_active' => !$template->is_active]);
        return $template;
    }

    /**
     * Get the default template for a card type.
     */
    public function getDefaultForType(string $type): ?IdCardTemplate
    {
        return IdCardTemplate::where('card_type', $type)
            ->where('is_default', true)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Clear default flag for all templates of a given card_type.
     */
    private function clearDefaultForType(string $cardType): void
    {
        IdCardTemplate::where('card_type', $cardType)
            ->where('is_default', true)
            ->update(['is_default' => false]);
    }
}
