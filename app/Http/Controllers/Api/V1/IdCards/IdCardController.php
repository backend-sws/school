<?php

namespace App\Http\Controllers\Api\V1\IdCards;

use App\Http\Controllers\Api\V1\BaseController;
use App\Services\IdCardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IdCardController extends BaseController
{
    protected IdCardService $service;

    public function __construct(IdCardService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse
    {
        $cards = $this->service->getAll($request->all());
        return $this->paginated($cards);
    }

    public function show(int $id): JsonResponse
    {
        $card = $this->service->getById($id);
        return $this->success($card);
    }

    /**
     * Bulk generate cards for students matching the filters.
     */
    public function generate(Request $request): JsonResponse
    {
        if ($request->has('snapshot_data')) {
            $validated = $request->validate([
                'template_id'   => 'required|exists:id_card_templates,id',
                'session_id'    => 'required|exists:academic_sessions,id',
                'stream_id'     => 'nullable|exists:streams,id',
                'user_id'       => 'nullable|exists:users,id',
                'snapshot_data' => 'required|array',
                'snapshot_data.name' => 'required|string|max:200',
                'photo_url'     => 'nullable|string',
            ]);

            try {
                $card = $this->service->generateFromSnapshot($validated['template_id'], $validated);
                return $this->success([
                    'count' => 1,
                    'card'  => $card,
                    'message' => 'ID card generated successfully',
                ], 'Card generated');
            } catch (\Exception $e) {
                return $this->error($e->getMessage(), 500);
            }
        }

        $validated = $request->validate([
            'template_id' => 'required|exists:id_card_templates,id',
            'session_id'  => 'required|exists:academic_sessions,id',
            'stream_id'   => 'nullable|exists:streams,id',
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'exists:users,id',
        ]);

        try {
            $result = $this->service->generate($validated['template_id'], $validated);
            return $this->success([
                'count' => $result['count'],
                'message' => "{$result['count']} ID cards generated successfully",
            ], 'Cards generated');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    /**
     * Regenerate a single card with fresh data.
     */
    public function regenerate(int $id): JsonResponse
    {
        $card = $this->service->regenerate($id);
        return $this->success($card, 'Card regenerated successfully');
    }

    /**
     * Revoke a card.
     */
    public function revoke(int $id): JsonResponse
    {
        $card = $this->service->revoke($id);
        return $this->success($card, 'Card revoked');
    }

    /**
     * Download single card PDF.
     */
    public function download(int $id): \Symfony\Component\HttpFoundation\BinaryFileResponse|JsonResponse
    {
        $card = $this->service->getById($id);

        // Always generate fresh PDF on download to apply layout updates immediately
        $this->service->generatePdf($id);
        $card->refresh();

        $path = \Storage::disk('local')->path($card->pdf_path);
        $filename = 'id-card-' . ($card->snapshot_data['reg_no'] ?? $card->id) . '.pdf';

        return response()->download($path, $filename, [
            'Content-Type' => 'application/pdf',
        ]);
    }

    /**
     * Bulk download PDF (multiple cards per A4).
     */
    public function bulkDownload(Request $request): \Symfony\Component\HttpFoundation\BinaryFileResponse|JsonResponse
    {
        $validated = $request->validate([
            'session_id' => 'nullable|exists:academic_sessions,id',
            'stream_id'  => 'nullable|exists:streams,id',
        ]);

        try {
            $path = $this->service->bulkDownload($validated);
            $fullPath = \Storage::disk('local')->path($path);

            return response()->download($fullPath, 'id-cards-bulk.pdf', [
                'Content-Type' => 'application/pdf',
            ]);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
