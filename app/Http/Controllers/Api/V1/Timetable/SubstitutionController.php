<?php

namespace App\Http\Controllers\Api\V1\Timetable;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Substitution;
use App\Models\TimetableEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubstitutionController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $query = Substitution::with(['timetableEntry', 'originalTeacher', 'substituteTeacher']);

        if ($request->has('date')) {
            $query->where('date', $request->date);
        }

        return $this->success($query->get());
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'timetable_entry_id' => 'required|exists:timetable_entries,id',
            'date' => 'required|date',
            'substitute_teacher_id' => 'required|exists:users,id',
            'reason' => 'nullable|string',
        ]);

        $entry = TimetableEntry::findOrFail($request->timetable_entry_id);

        $substitution = Substitution::create([
            'timetable_entry_id' => $entry->id,
            'date' => $request->date,
            'original_teacher_id' => $entry->teacher_id,
            'substitute_teacher_id' => $request->substitute_teacher_id,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        return $this->success($substitution, "Substitution assigned.", 201);
    }

    /**
     * Get candidate teachers for substitution in a specific slot.
     */
    public function getCandidates(Request $request): JsonResponse
    {
        $request->validate([
            'timetable_entry_id' => 'required|exists:timetable_entries,id',
            'date' => 'required|date',
        ]);

        $entry = TimetableEntry::with('periodSlot')->findOrFail($request->timetable_entry_id);
        $dayOfWeek = date('N', strtotime($request->date));

        // Logic to find teachers who are NOT scheduled in this slot on this day
        // This is a simplified version.
        $busyTeacherIds = TimetableEntry::whereHas('timetable', function ($q) {
            $q->where('status', 'published');
        })
            ->where('period_slot_id', $entry->period_slot_id)
            ->where('day_of_week', $dayOfWeek)
            ->pluck('teacher_id')
            ->toArray();

        // Get all staff who are NOT in the busy list
        $candidates = \App\Models\User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['staff', 'principal', 'college_admin']);
        })
            ->whereNotIn('id', $busyTeacherIds)
            ->get(['id', 'name']);

        return $this->success($candidates);
    }
}
