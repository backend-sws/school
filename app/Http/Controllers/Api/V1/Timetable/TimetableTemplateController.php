<?php

namespace App\Http\Controllers\Api\V1\Timetable;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\TimetableTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TimetableTemplateController extends BaseController
{
    public function index(): JsonResponse
    {
        $templates = TimetableTemplate::with('periodSlots')->get();
        return $this->success($templates);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:academic,exam,holiday,special',
            'is_active' => 'boolean',
            'is_default' => 'boolean',
        ]);

        $template = TimetableTemplate::create($request->all());

        return $this->success($template, "Template created successfully.", 201);
    }

    public function show(TimetableTemplate $template): JsonResponse
    {
        return $this->success($template->load('periodSlots'));
    }

    public function update(Request $request, TimetableTemplate $template): JsonResponse
    {
        $request->validate([
            'name' => 'string|max:255',
            'type' => 'string|in:academic,exam,holiday,special',
            'is_active' => 'boolean',
            'is_default' => 'boolean',
        ]);

        $template->update($request->all());

        return $this->success($template, "Template updated successfully.");
    }

    public function destroy(TimetableTemplate $template): JsonResponse
    {
        $template->delete();
        return $this->success(null, "Template deleted successfully.");
    }
}
