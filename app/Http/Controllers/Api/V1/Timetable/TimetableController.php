<?php

namespace App\Http\Controllers\Api\V1\Timetable;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Timetable;
use App\Services\Scheduling\SchedulingService;
use App\Services\InstitutionBrandingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TimetableController extends BaseController
{
    use \App\Traits\OptimizesHeavyTasks;

    protected SchedulingService $schedulingService;
    protected InstitutionBrandingService $brandingService;

    public function __construct(SchedulingService $schedulingService, InstitutionBrandingService $brandingService)
    {
        $this->schedulingService = $schedulingService;
        $this->brandingService = $brandingService;
    }

    public function index(Request $request): JsonResponse
    {
        $query = Timetable::with([
            'session',
            'template' => function ($q) {
                $q->withCount('periodSlots');
            }
        ])->withCount('entries');

        if ($request->has('session_id')) {
            $query->where('session_id', $request->session_id);
        }

        return $this->success($query->get());
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'session_id' => 'required|exists:sessions,id',
            'timetable_template_id' => 'required|exists:timetable_templates,id',
            'scheduleable_type' => 'nullable|string',
            'scheduleable_id' => 'nullable|integer',
            'status' => 'string|in:draft,published,archived',
        ]);

        $timetable = Timetable::create($request->all());

        return $this->success($timetable, "Timetable created successfully.", 201);
    }

    public function show(Timetable $timetable): JsonResponse
    {
        return $this->success($timetable->load([
            'session',
            'template.periodSlots',
            'entries.activity',
            'entries.room',
            'entries.teacher'
        ]));
    }

    /**
     * Bulk save entries for a timetable.
     */
    public function saveEntries(Request $request, Timetable $timetable): JsonResponse
    {
        $request->validate([
            'entries' => 'required|array',
            'entries.*.period_slot_id' => 'required|exists:period_slots,id',
            'entries.*.day_of_week' => 'required|integer|between:1,7',
            'entries.*.activity_type' => 'required|string',
            'entries.*.activity_id' => 'required|integer',
            'entries.*.teacher_id' => 'nullable|exists:users,id',
            'entries.*.room_id' => 'nullable|exists:rooms,id',
        ]);

        $results = $this->schedulingService->saveEntries($timetable, $request->entries);

        return $this->success($results, "Entries processed.");
    }

    public function publish(Timetable $timetable): JsonResponse
    {
        $timetable->update(['status' => 'published']);
        return $this->success($timetable, "Timetable published.");
    }

    /**
     * Download timetable as branded PDF.
     */
    public function download(Timetable $timetable)
    {
        $this->optimizeForExport('1024M', 600); // 1GB memory, 10 minutes timeout for reports

        $timetable->load([
            'session',
            'template.periodSlots',
            'entries.activity',
            'entries.room',
            'entries.teacher',
            'scheduleable' // Load the class/group it belongs to
        ]);

        $branding = $this->brandingService->resolve($timetable->institution_id);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.timetable', [
            'timetable' => $timetable,
            'branding' => $branding,
            'metadata' => [
                'title' => 'Timetable: ' . ($timetable->name ?? $timetable->id),
                'orientation' => 'landscape' // Better for 7-day tables
            ]
        ]);

        return $pdf->setPaper('a4', 'landscape')
            ->setOptions([
                'isRemoteEnabled' => true,
                'defaultFont' => 'DejaVu Sans',
            ])
            ->download("timetable_{$timetable->id}.pdf");
    }
}
