<?php

namespace App\Http\Controllers\Api\V1\Communications;

use App\Exceptions\SmsQuotaExceededException;
use App\Http\Controllers\Controller;
use App\Models\AlertRule;
use App\Models\CommunicationLog;
use App\Services\AlertRuleEngine;
use App\Services\SmsService;
use App\Services\WhatsappService;
use App\Support\ApiErrorMap;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommunicationsController extends Controller
{
    // ── Unified Logs ───────────────────────────────────────────────

    /**
     * List all communication logs (SMS + WhatsApp + Email), filterable by channel.
     */
    public function logs(Request $request): JsonResponse
    {
        $institutionId = config('ems.default_institution_id');

        $query = CommunicationLog::forInstitution($institutionId)
            ->with('sender:id,name');

        if ($channel = $request->query('channel')) {
            $query->byChannel($channel);
        }
        if ($status = $request->query('status')) {
            $query->byStatus($status);
        }
        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        $logs = $query->orderByDesc('created_at')
            ->paginate($request->input('per_page', 30));

        return response()->json($logs);
    }

    // ── SMS ────────────────────────────────────────────────────────

    public function smsLogs(Request $request): JsonResponse
    {
        $institutionId = config('ems.default_institution_id');

        $query = CommunicationLog::forInstitution($institutionId)->sms()
            ->with('sender:id,name');

        if ($status = $request->query('status')) {
            $query->byStatus($status);
        }
        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        $logs = $query->orderByDesc('created_at')
            ->paginate($request->input('per_page', 30));

        return response()->json($logs);
    }

    public function sendSms(Request $request, SmsService $smsService): JsonResponse
    {
        $validated = $request->validate([
            'recipients'           => 'required|array|min:1',
            'recipients.*.phone'   => 'required|string|max:20',
            'recipients.*.name'    => 'nullable|string',
            'recipients.*.user_id' => 'nullable|integer|exists:users,id',
            'message'              => 'required|string|max:1000',
            'category'             => 'nullable|string|max:50',
            'template_id'          => 'nullable|string',
        ]);

        $institutionId = config('ems.default_institution_id');

        try {
            $logs = $smsService->sendBulk(
                $institutionId,
                $request->user()->id,
                $validated['recipients'],
                $validated['message'],
                $validated['category'] ?? null,
                $validated['template_id'] ?? null
            );
        } catch (SmsQuotaExceededException $e) {
            return ApiErrorMap::respond('sms.quota_exceeded');
        }

        return response()->json([
            'message' => count($logs) . ' message(s) queued.',
            'data'    => $logs,
        ], 201);
    }

    public function smsStats(Request $request, SmsService $smsService): JsonResponse
    {
        $institutionId = config('ems.default_institution_id');

        $stats = $smsService->getStats(
            $institutionId,
            $request->query('from'),
            $request->query('to')
        );

        return response()->json(['data' => $stats]);
    }

    // ── WhatsApp ──────────────────────────────────────────────────

    public function whatsappLogs(Request $request): JsonResponse
    {
        $institutionId = config('ems.default_institution_id');

        $query = CommunicationLog::forInstitution($institutionId)->whatsapp()
            ->with('sender:id,name');

        if ($status = $request->query('status')) {
            $query->byStatus($status);
        }
        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        $logs = $query->orderByDesc('created_at')
            ->paginate($request->input('per_page', 30));

        return response()->json($logs);
    }

    public function sendWhatsapp(Request $request, WhatsappService $whatsappService): JsonResponse
    {
        $validated = $request->validate([
            'recipients'           => 'required|array|min:1',
            'recipients.*.phone'   => 'required|string|max:20',
            'recipients.*.name'    => 'nullable|string',
            'recipients.*.user_id' => 'nullable|integer|exists:users,id',
            'message'              => 'required|string|max:4096',
            'template_name'        => 'required|string|max:255',
            'category'             => 'nullable|string|max:50',
            'media_url'            => 'nullable|url|max:2048',
            'media_type'           => 'nullable|in:image,document,video',
        ]);

        $institutionId = config('ems.default_institution_id');

        try {
            $logs = $whatsappService->sendBulk(
                $institutionId,
                $request->user()->id,
                $validated['recipients'],
                $validated['message'],
                $validated['template_name'],
                $validated['category'] ?? null,
                $validated['media_url'] ?? null,
                $validated['media_type'] ?? null
            );
        } catch (SmsQuotaExceededException $e) {
            return ApiErrorMap::respond('whatsapp.quota_exceeded');
        }

        return response()->json([
            'message' => count($logs) . ' WhatsApp message(s) queued.',
            'data'    => $logs,
        ], 201);
    }

    public function whatsappStats(Request $request, WhatsappService $whatsappService): JsonResponse
    {
        $institutionId = config('ems.default_institution_id');

        $stats = $whatsappService->getStats(
            $institutionId,
            $request->query('from'),
            $request->query('to')
        );

        return response()->json(['data' => $stats]);
    }

    // ── Alert Rules ────────────────────────────────────────────────

    public function alertRules(Request $request): JsonResponse
    {
        $rules = AlertRule::forInstitution(config('ems.default_institution_id'))
            ->with('creator:id,name')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => $rules]);
    }

    public function storeAlertRule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'trigger_event'    => 'required|in:' . implode(',', AlertRule::TRIGGER_EVENTS),
            'conditions'       => 'nullable|array',
            'channel'          => 'sometimes|in:sms,whatsapp,email,push,all',
            'message_template' => 'required|string|max:1000',
            'recipient_type'   => 'required|in:student,guardian,faculty,all',
            'frequency'        => 'sometimes|in:once,daily,weekly',
        ]);

        $rule = AlertRule::create([
            'institution_id' => config('ems.default_institution_id'),
            'created_by'     => $request->user()->id,
            ...$validated,
        ]);

        return response()->json(['data' => $rule], 201);
    }

    public function updateAlertRule(Request $request, int $id): JsonResponse
    {
        $rule = AlertRule::forInstitution(config('ems.default_institution_id'))
            ->findOrFail($id);

        $validated = $request->validate([
            'name'             => 'sometimes|string|max:255',
            'trigger_event'    => 'sometimes|in:' . implode(',', AlertRule::TRIGGER_EVENTS),
            'conditions'       => 'nullable|array',
            'channel'          => 'sometimes|in:sms,whatsapp,email,push,all',
            'message_template' => 'sometimes|string|max:1000',
            'recipient_type'   => 'sometimes|in:student,guardian,faculty,all',
            'is_active'        => 'sometimes|boolean',
            'frequency'        => 'sometimes|in:once,daily,weekly',
        ]);

        $rule->update($validated);

        return response()->json(['data' => $rule]);
    }

    public function destroyAlertRule(int $id): JsonResponse
    {
        $rule = AlertRule::forInstitution(config('ems.default_institution_id'))
            ->findOrFail($id);

        $rule->delete();

        return response()->json(['message' => 'Alert rule deleted.']);
    }

    public function triggerAlertRules(AlertRuleEngine $engine): JsonResponse
    {
        $institutionId = config('ems.default_institution_id');
        $results = $engine->processAll($institutionId);

        return response()->json(['data' => $results]);
    }
}
