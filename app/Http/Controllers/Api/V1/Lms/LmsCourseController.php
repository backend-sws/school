<?php

namespace App\Http\Controllers\Api\V1\Lms;

use App\Enums\LmsScopeType;
use App\Http\Controllers\Api\V1\BaseController;
use App\Models\LmsCourse;
use App\Support\InstitutionContext;
use App\Support\LmsScope;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LmsCourseController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_lms_courses')) {
            return $this->forbidden('You do not have permission to view LMS courses.');
        }

        $query = LmsCourse::query()->with(['stream:id,name,code', 'subject:id,name,code', 'session:id,name,start_year,end_year']);

        LmsScope::applyScope($query);

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(title) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(COALESCE(slug, \'\')) LIKE ?', [$search]);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', (int) $request->status);
        }

        return $this->paginatedWithMap(
            $query->orderBy('title', 'asc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_lms_courses')) {
            return $this->forbidden('You do not have permission to create LMS courses.');
        }

        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());
        if (! $institutionId) {
            return $this->error('Active institution context is required.', 422);
        }

        $validated = $request->validate([
            'scope_type' => 'required|string|in:' . implode(',', LmsScopeType::values()),
            'scope_id' => 'nullable|integer',
            'stream_id' => 'nullable|exists:streams,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'session_id' => 'nullable|exists:academic_sessions,id',
            'title' => 'required|string|max:200',
            'slug' => 'nullable|string|max:220',
            'description' => 'nullable|string',
            'status' => 'nullable|integer|min:0|max:255',
            'instructor_id' => 'nullable|exists:users,id',
        ]);

        $scopeType = $validated['scope_type'];
        $scopeId = isset($validated['scope_id']) ? (int) $validated['scope_id'] : null;
        if (! LmsScope::validateScopeId($scopeType, $scopeId, $institutionId)) {
            return $this->error('Invalid scope_type/scope_id for this institution.', 422);
        }

        $validated['scope_id'] = $scopeId;
        $validated['created_by'] = $request->user()->id;
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }
        $validated['status'] = $validated['status'] ?? 1;

        $course = LmsCourse::create($validated);

        return $this->created($course->load(['stream:id,name,code', 'subject:id,name,code', 'session:id,name']), 'Course created successfully');
    }

    public function show(Request $request, LmsCourse $lms_course): JsonResponse
    {
        if (! $request->user()->hasAbility('view_lms_courses')) {
            return $this->forbidden('You do not have permission to view LMS courses.');
        }

        return $this->successWithMap($lms_course->load(['stream', 'subject', 'session', 'instructor:id,name,email']), 'passthrough');
    }

    public function update(Request $request, LmsCourse $lms_course): JsonResponse
    {
        if (! $request->user()->hasAbility('update_lms_courses')) {
            return $this->forbidden('You do not have permission to update LMS courses.');
        }

        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());
        if (! $institutionId) {
            return $this->error('Active institution context is required.', 422);
        }

        $validated = $request->validate([
            'scope_type' => 'sometimes|string|in:' . implode(',', LmsScopeType::values()),
            'scope_id' => 'nullable|integer',
            'stream_id' => 'nullable|exists:streams,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'session_id' => 'nullable|exists:academic_sessions,id',
            'title' => 'sometimes|string|max:200',
            'slug' => 'nullable|string|max:220',
            'description' => 'nullable|string',
            'status' => 'nullable|integer|min:0|max:255',
            'instructor_id' => 'nullable|exists:users,id',
        ]);

        if (isset($validated['scope_type'])) {
            $scopeType = $validated['scope_type'];
            $scopeId = array_key_exists('scope_id', $validated) ? (int) $validated['scope_id'] : null;
            if (! LmsScope::validateScopeId($scopeType, $scopeId, $institutionId)) {
                return $this->error('Invalid scope_type/scope_id for this institution.', 422);
            }
            $validated['scope_id'] = $scopeId;
        }

        $lms_course->update($validated);

        return $this->successWithMap($lms_course->fresh(['stream', 'subject', 'session', 'instructor:id,name,email']), 'passthrough', 'Course updated successfully');
    }

    public function destroy(Request $request, LmsCourse $lms_course): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_lms_courses')) {
            return $this->forbidden('You do not have permission to delete LMS courses.');
        }

        $lms_course->delete();

        return $this->success(null, 'Course deleted');
    }
}
