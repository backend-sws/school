<?php

namespace App\Http\Controllers\Api\V1\HR;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\HR\Holiday;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HolidayController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $institutionId = $request->user()->activeInstitutionId();
        $year = $request->input('year', now()->year);

        $holidays = Holiday::where('institution_id', $institutionId)
            ->where(function ($q) use ($year) {
                $q->where('year', $year)
                  ->orWhere('is_recurring', true); // recurring holidays apply to every year
            })
            ->orderBy('date')
            ->get()
            ->map(function ($h) use ($year) {
                $rawDate = $h->getRawOriginal('date');
                if ($h->is_recurring && $rawDate) {
                    $parts = explode('-', $rawDate);
                    if (count($parts) === 3) {
                        $rawDate = sprintf('%04d-%02d-%02d', (int) $year, (int) $parts[1], (int) $parts[2]);
                    }
                }
                $h->date = $rawDate;
                return $h;
            });

        return $this->success($holidays);
    }

    public function store(Request $request): JsonResponse
    {
        $institutionId = $request->user()->activeInstitutionId();

        $validated = $request->validate([
            'name'        => 'required|string|max:150',
            'date'        => 'required|date',
            'is_recurring'=> 'boolean',
            'description' => 'nullable|string|max:500',
        ]);

        $date = Carbon::parse($validated['date']);

        // Check duplicate (same institution + same date)
        $exists = Holiday::where('institution_id', $institutionId)
            ->where('date', $date->toDateString())
            ->exists();

        if ($exists) {
            return $this->error('A holiday already exists on this date.', 422);
        }

        $holiday = Holiday::create([
            'institution_id' => $institutionId,
            'name'           => $validated['name'],
            'date'           => $date->toDateString(),
            'year'           => $date->year,
            'is_recurring'   => $validated['is_recurring'] ?? false,
            'description'    => $validated['description'] ?? null,
        ]);

        return $this->created($holiday, 'Holiday added successfully');
    }

    public function update(Request $request, Holiday $holiday): JsonResponse
    {
        if ($holiday->institution_id !== $request->user()->activeInstitutionId()) {
            return $this->forbidden();
        }

        $validated = $request->validate([
            'name'        => 'sometimes|string|max:150',
            'date'        => 'sometimes|date',
            'is_recurring'=> 'boolean',
            'description' => 'nullable|string|max:500',
        ]);

        if (isset($validated['date'])) {
            $date = Carbon::parse($validated['date']);

            // Check duplicate (excluding self)
            $exists = Holiday::where('institution_id', $holiday->institution_id)
                ->where('date', $date->toDateString())
                ->where('id', '!=', $holiday->id)
                ->exists();

            if ($exists) {
                return $this->error('Another holiday already exists on this date.', 422);
            }

            $validated['date'] = $date->toDateString();
            $validated['year'] = $date->year;
        }

        $holiday->update($validated);

        return $this->success($holiday, 'Holiday updated successfully');
    }

    public function destroy(Request $request, Holiday $holiday): JsonResponse
    {
        if ($holiday->institution_id !== $request->user()->activeInstitutionId()) {
            return $this->forbidden();
        }

        $holiday->delete();

        return $this->success(null, 'Holiday deleted successfully');
    }
}
