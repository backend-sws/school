<?php

namespace App\Http\Controllers\Api\V1\Library;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\LibraryBook;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LibraryBookController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_library_books')) {
            return $this->forbidden('You do not have permission to view library books.');
        }

        $query = LibraryBook::query()->withCount('copies');

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(title) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(COALESCE(author, \'\')) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(COALESCE(isbn, \'\')) LIKE ?', [$search]);
            });
        }

        if ($request->has('is_active')) {
            $query->where('is_active', (bool) $request->is_active);
        }

        return $this->paginatedWithMap(
            $query->orderBy('title', 'asc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_library_books')) {
            return $this->forbidden('You do not have permission to create library books.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:300',
            'author' => 'nullable|string|max:200',
            'isbn' => 'nullable|string|max:50',
            'edition' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['is_active'] = $validated['is_active'] ?? true;

        $book = LibraryBook::create($validated);
        return $this->created($book, 'Book created successfully');
    }

    public function show(Request $request, LibraryBook $library_book): JsonResponse
    {
        if (! $request->user()->hasAbility('view_library_books')) {
            return $this->forbidden('You do not have permission to view library books.');
        }

        return $this->success($library_book->load(['copies']), 'Success');
    }

    public function update(Request $request, LibraryBook $library_book): JsonResponse
    {
        if (! $request->user()->hasAbility('update_library_books')) {
            return $this->forbidden('You do not have permission to update library books.');
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:300',
            'author' => 'nullable|string|max:200',
            'isbn' => 'nullable|string|max:50',
            'edition' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $library_book->update($validated);
        return $this->success($library_book->fresh(), 'Book updated successfully');
    }

    public function destroy(Request $request, LibraryBook $library_book): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_library_books')) {
            return $this->forbidden('You do not have permission to delete library books.');
        }

        if ($library_book->copies()->exists()) {
            return $this->error('Cannot delete book that has copies. Remove or reassign copies first.', 422);
        }

        $library_book->delete();
        return $this->success(null, 'Book deleted');
    }
}
