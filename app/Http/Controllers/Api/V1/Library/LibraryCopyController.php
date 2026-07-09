<?php

namespace App\Http\Controllers\Api\V1\Library;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\LibraryCopy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LibraryCopyController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_library_copies')) {
            return $this->forbidden('You do not have permission to view library copies.');
        }

        $query = LibraryCopy::query()->with('book');

        if ($request->filled('library_book_id')) {
            $query->where('library_book_id', $request->library_book_id);
        }

        if ($request->has('is_available')) {
            $query->where('is_available', filter_var($request->is_available, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(COALESCE(barcode, \'\')) LIKE ?', [$search])
                    ->orWhereHas('book', fn ($b) => $b->whereRaw('LOWER(title) LIKE ?', [$search]));
            });
        }

        return $this->paginatedWithMap(
            $query->orderBy('id', 'desc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_library_copies')) {
            return $this->forbidden('You do not have permission to create library copies.');
        }

        $validated = $request->validate([
            'library_book_id' => 'required|exists:library_books,id',
            'barcode' => 'nullable|string|max:80',
            'shelf_location' => 'nullable|string|max:100',
            'condition' => 'nullable|string|max:50',
            'is_available' => 'nullable|boolean',
        ]);

        $validated['is_available'] = $validated['is_available'] ?? true;

        $copy = LibraryCopy::create($validated);
        return $this->created($copy->load('book'), 'Copy created successfully');
    }

    public function show(Request $request, LibraryCopy $library_copy): JsonResponse
    {
        if (! $request->user()->hasAbility('view_library_copies')) {
            return $this->forbidden('You do not have permission to view library copies.');
        }

        return $this->success($library_copy->load(['book', 'issues' => fn ($q) => $q->with('user')->latest()->limit(20)]), 'Success');
    }

    public function update(Request $request, LibraryCopy $library_copy): JsonResponse
    {
        if (! $request->user()->hasAbility('update_library_copies')) {
            return $this->forbidden('You do not have permission to update library copies.');
        }

        $validated = $request->validate([
            'barcode' => 'nullable|string|max:80',
            'shelf_location' => 'nullable|string|max:100',
            'condition' => 'nullable|string|max:50',
            'is_available' => 'nullable|boolean',
        ]);

        $library_copy->update($validated);
        return $this->success($library_copy->fresh('book'), 'Copy updated successfully');
    }

    public function destroy(Request $request, LibraryCopy $library_copy): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_library_copies')) {
            return $this->forbidden('You do not have permission to delete library copies.');
        }

        if ($library_copy->issues()->open()->exists()) {
            return $this->error('Cannot delete copy that is currently issued. Return it first.', 422);
        }

        $library_copy->delete();
        return $this->success(null, 'Copy deleted');
    }
}
