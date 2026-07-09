<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;

trait Filterable
{
    /**
     * Common logic to handle active_only, search, and pagination.
     */
    public function applyFilters(Request $request, Builder $query, array $searchFields = ['name'])
    {
        // 1. Filter only active records (Status 1)
        $query->when($request->has('active_only'), function ($q) {
            return $q->where('status', 1);
        });

        // 2. Dynamic Search (Case Insensitive)
        $query->when($request->filled('search'), function ($q) use ($request, $searchFields) {
            $search = strtolower($request->search);
            return $q->where(function ($subQuery) use ($search, $searchFields) {
                foreach ($searchFields as $field) {
                    $subQuery->orWhere($field, 'LIKE', "%{$search}%");
                }
            });
        });

        // 3. Handle 'all' to skip pagination (Perfect for Dropdowns)
        if ($request->boolean('all')) {
            return $this->success($query->get());
        }

        // 4. Default Pagination
        $perPage = $request->input('per_page', 15);
        return $this->paginated($query->paginate($perPage));
    }
}