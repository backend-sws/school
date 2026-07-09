<?php

namespace App\Http\Controllers\Api\V1\Library;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\LibraryCopy;
use App\Models\LibraryIssue;
use App\Support\InstitutionContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LibraryIssueController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_library_issues')) {
            return $this->forbidden('You do not have permission to view library issues.');
        }

        $query = LibraryIssue::query()->with(['copy.book', 'user', 'issuedByUser']);

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('library_copy_id')) {
            $query->where('library_copy_id', $request->library_copy_id);
        }

        if ($request->filled('status')) {
            if ($request->status === 'open') {
                $query->open();
            } elseif ($request->status === 'overdue') {
                $query->overdue();
            } elseif ($request->status === 'returned') {
                $query->whereNotNull('returned_at');
            }
        }

        return $this->paginatedWithMap(
            $query->orderBy('issued_at', 'desc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_library_issues')) {
            return $this->forbidden('You do not have permission to issue books.');
        }

        $validated = $request->validate([
            'library_copy_id' => 'required|exists:library_copies,id',
            'user_id' => 'required|exists:users,id',
            'due_at' => 'required|date|after_or_equal:today',
            'remarks' => 'nullable|string',
        ]);

        $copy = LibraryCopy::findOrFail($validated['library_copy_id']);
        if (! $copy->is_available) {
            return $this->error('This copy is not available for issue.', 422);
        }

        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());
        if ($institutionId === null) {
            return $this->error('Active institution context is required.', 400);
        }

        $issue = DB::transaction(function () use ($validated, $copy, $institutionId) {
            $copy->update(['is_available' => false]);

            return LibraryIssue::create([
                'institution_id' => $institutionId,
                'library_copy_id' => $copy->id,
                'user_id' => $validated['user_id'],
                'issued_at' => now(),
                'due_at' => $validated['due_at'],
                'issued_by' => $request->user()->id,
                'remarks' => $validated['remarks'] ?? null,
            ]);
        });

        return $this->created($issue->load(['copy.book', 'user', 'issuedByUser']), 'Book issued successfully');
    }

    public function show(Request $request, LibraryIssue $library_issue): JsonResponse
    {
        if (! $request->user()->hasAbility('view_library_issues')) {
            return $this->forbidden('You do not have permission to view library issues.');
        }

        return $this->success($library_issue->load(['copy.book', 'user', 'issuedByUser']), 'Success');
    }

    public function update(Request $request, LibraryIssue $library_issue): JsonResponse
    {
        if (! $request->user()->hasAbility('update_library_issues')) {
            return $this->forbidden('You do not have permission to update library issues.');
        }

        if ($library_issue->returned_at !== null) {
            return $this->error('This issue has already been returned.', 422);
        }

        $validated = $request->validate([
            'returned_at' => 'required_without:remarks|nullable|date',
            'remarks' => 'nullable|string',
        ]);

        if (isset($validated['returned_at']) && $validated['returned_at']) {
            DB::transaction(function () use ($library_issue) {
                $library_issue->update(['returned_at' => now()]);
                $library_issue->copy->update(['is_available' => true]);
            });
            return $this->success($library_issue->fresh(['copy.book', 'user', 'issuedByUser']), 'Book returned successfully');
        }

        if (isset($validated['remarks'])) {
            $library_issue->update(['remarks' => $validated['remarks']]);
        }

        return $this->success($library_issue->fresh(['copy.book', 'user', 'issuedByUser']), 'Issue updated successfully');
    }

    public function returnBook(Request $request, LibraryIssue $library_issue): JsonResponse
    {
        if (! $request->user()->hasAbility('create_library_issues')) {
            return $this->forbidden('You do not have permission to return books.');
        }

        if ($library_issue->returned_at !== null) {
            return $this->error('This issue has already been returned.', 422);
        }

        DB::transaction(function () use ($library_issue) {
            $library_issue->update(['returned_at' => now()]);
            $library_issue->copy->update(['is_available' => true]);
        });

        return $this->success($library_issue->fresh(['copy.book', 'user', 'issuedByUser']), 'Book returned successfully');
    }
}
