<?php

namespace App\Http\Controllers\Api\V1\Notifications;

use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PushSubscriptionController extends BaseController
{
    /**
     * Subscribe the authenticated user to web push (no-op: push notifications disabled).
     */
    public function subscribe(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'endpoint' => 'required|string|max:500',
            'public_key' => 'nullable|string',
            'auth_token' => 'nullable|string',
            'content_encoding' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->first(), 422, $validator->errors());
        }

        return $this->success(null, 'Push subscription saved');
    }

    /**
     * Unsubscribe (no-op: push notifications disabled).
     */
    public function unsubscribe(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'endpoint' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->first(), 422, $validator->errors());
        }

        return $this->success(null, 'Push subscription removed');
    }
}
