<?php

namespace App\Http\Controllers\Api\V1\StudentDashboard;

use App\Http\Controllers\Api\V1\BaseController;
use App\Services\IdCardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentIdCardController extends BaseController
{
    protected IdCardService $service;

    public function __construct(IdCardService $service)
    {
        $this->service = $service;
    }

    /**
     * Get the current student's ID card for the active session.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $card = $this->service->getStudentCard($user->id);

        if (!$card) {
            return $this->notFound('No ID card found for current session');
        }

        return $this->success($card->load(['template', 'session']));
    }

    /**
     * Download the current student's ID card PDF.
     */
    public function download(Request $request): \Symfony\Component\HttpFoundation\BinaryFileResponse|JsonResponse
    {
        $user = $request->user();
        $card = $this->service->getStudentCard($user->id);

        if (!$card) {
            return $this->notFound('No ID card found for current session');
        }

        // Generate PDF if not exists
        if (empty($card->pdf_path) || !\Storage::disk('local')->exists($card->pdf_path)) {
            $this->service->generatePdf($card->id);
            $card->refresh();
        }

        $path = \Storage::disk('local')->path($card->pdf_path);
        $filename = "my-id-card.pdf";

        return response()->download($path, $filename, [
            'Content-Type' => 'application/pdf',
        ]);
    }
}
