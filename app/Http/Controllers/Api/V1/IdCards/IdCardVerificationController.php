<?php

namespace App\Http\Controllers\Api\V1\IdCards;

use App\Http\Controllers\Api\V1\BaseController;
use App\Services\IdCardService;
use Illuminate\Http\JsonResponse;

class IdCardVerificationController extends BaseController
{
    protected IdCardService $service;

    public function __construct(IdCardService $service)
    {
        $this->service = $service;
    }

    /**
     * Public verification endpoint. No auth required.
     * Returns card holder info + status for QR code scanning.
     */
    public function verify(string $token): JsonResponse
    {
        $card = $this->service->verifyByToken($token);

        if (!$card) {
            return $this->notFound('Invalid or expired verification code');
        }

        $snapshot = $card->snapshot_data;

        return $this->success([
            'reg_no'      => $snapshot['reg_no'] ?? null,
            'name'        => $snapshot['name'] ?? null,
            'photo_url'   => $card->photo_url,
            'stream'      => $snapshot['stream'] ?? null,
            'department'   => $snapshot['department'] ?? null,
            'roll_no'     => $snapshot['roll_no'] ?? null,
            'session'     => $card->session?->name,
            'card_type'   => $card->card_type,
            'status'      => $card->status,
            'valid_from'  => $card->valid_from?->format('Y-m-d'),
            'valid_until' => $card->valid_until?->format('Y-m-d'),
            'institution' => [
                'name' => $card->institution?->name,
                'logo' => $card->institution?->logo,
            ],
        ], 'Verification successful');
    }
}
