<?php

namespace App\Http\Controllers\Api\V1\IdCards;

use App\Http\Controllers\Api\V1\BaseController;
use App\Services\IdCardTemplateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IdCardTemplateController extends BaseController
{
    protected IdCardTemplateService $service;

    public function __construct(IdCardTemplateService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse
    {
        $templates = $this->service->getAll($request->all());
        return $this->paginated($templates);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'                 => 'required|string|max:200',
            'card_type'            => 'required|in:student,staff,temporary',
            'front_layout'         => 'nullable|array',
            'back_layout'          => 'nullable|array',
            'background_color'     => 'nullable|string|max:7',
            'background_image_url' => 'nullable|string',
            'logo_url'             => 'nullable|string',
            'color_scheme'         => 'nullable|array',
            'is_default'           => 'boolean',
            'is_active'            => 'boolean',
        ]);

        $template = $this->service->create($validated);
        return $this->created($template, 'Template created successfully');
    }

    public function show(int $id): JsonResponse
    {
        $template = $this->service->getById($id);
        return $this->success($template);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'name'                 => 'sometimes|string|max:200',
            'card_type'            => 'sometimes|in:student,staff,temporary',
            'front_layout'         => 'nullable|array',
            'back_layout'          => 'nullable|array',
            'background_color'     => 'nullable|string|max:7',
            'background_image_url' => 'nullable|string',
            'logo_url'             => 'nullable|string',
            'color_scheme'         => 'nullable|array',
            'is_default'           => 'boolean',
            'is_active'            => 'boolean',
        ]);

        $template = $this->service->update($id, $validated);
        return $this->success($template, 'Template updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->service->delete($id);
            return $this->success(null, 'Template deleted successfully');
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    public function toggleStatus(int $id): JsonResponse
    {
        $template = $this->service->toggleStatus($id);
        return $this->success($template, 'Template status updated');
    }
}
