<?php

namespace App\Http\Controllers\Api\V1\Notifications;

use App\Http\Controllers\Api\V1\BaseController;
use App\Services\SmsService;
use App\Services\WhatsappService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends BaseController
{
    /**
     * List all notifications for the authenticated user (paginated).
     * Query: filter=all|unread (default all), per_page, page.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $filter = $request->input('filter', 'all');
        $perPage = (int) $request->input('per_page', 20);

        $query = $user->notifications()->orderByDesc('created_at');
        if ($filter === 'unread') {
            $query->whereNull('read_at');
        }

        $notifications = $query->paginate($perPage);

        $data = $notifications->getCollection()->map(function ($notification) {
            $notificationType = $notification->data['type'] ?? null;
            return [
                'id' => $notification->id,
                'type' => $notification->type,
                'data' => $notification->data,
                'channels_sent' => $notificationType
                    ? self::resolveActiveChannels($notificationType)
                    : ['push'],
                'read_at' => $notification->read_at ? $notification->read_at->toIso8601String() : null,
                'created_at' => $notification->created_at ? $notification->created_at->toIso8601String() : null,
            ];
        });

        return $this->success([
            'data' => $data,
            'unread_count' => $user->unreadNotifications()->count(),
            'meta' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ],
        ]);
    }

    /**
     * List unread notifications for the authenticated user.
     */
    public function unread(Request $request): JsonResponse
    {
        $user = $request->user();
        $perPage = (int) $request->input('per_page', 15);
        $notifications = $user->unreadNotifications()->paginate($perPage);

        $data = $notifications->getCollection()->map(function ($notification) {
            return [
                'id' => $notification->id,
                'type' => $notification->type,
                'data' => $notification->data,
                'read_at' => $notification->read_at ? $notification->read_at->toIso8601String() : null,
                'created_at' => $notification->created_at ? $notification->created_at->toIso8601String() : null,
            ];
        });

        return $this->success([
            'data' => $data,
            'unread_count' => $user->unreadNotifications()->count(),
            'meta' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ],
        ]);
    }

    /**
     * Mark a single notification as read.
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $notification = $user->notifications()->findOrFail($id);
        $notification->markAsRead();

        return $this->success(null, 'Marked as read');
    }

    /**
     * Mark all notifications as read for the authenticated user.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);

        return $this->success(null, 'All marked as read');
    }

    /**
     * Get active channels for a given notification type.
     *
     * Returns both the configured channels and which are actually active
     * (i.e. env keys are present and service is configured).
     */
    public function channels(Request $request, string $type): JsonResponse
    {
        $configured = config("notifications.channels.{$type}", ['database', 'broadcast', 'push']);

        $active = array_values(array_filter($configured, function (string $ch) {
            return match ($ch) {
                'sms'      => SmsService::isConfigured(),
                'whatsapp' => WhatsappService::isConfigured(),
                default    => true,
            };
        }));

        return $this->success([
            'type'       => $type,
            'configured' => $configured,
            'active'     => $active,
        ]);
    }

    /**
     * Resolve which channels are active for a notification type.
     * Filters out unconfigured services (SMS, WhatsApp).
     */
    private static function resolveActiveChannels(string $notificationType): array
    {
        $channels = config("notifications.channels.{$notificationType}", ['database', 'broadcast', 'push']);

        // Filter to user-facing channels only (skip database, broadcast)
        $userFacing = array_filter($channels, fn(string $ch) => !in_array($ch, ['database', 'broadcast']));

        return array_values(array_filter($userFacing, function (string $ch) {
            return match ($ch) {
                'sms'      => SmsService::isConfigured(),
                'whatsapp' => WhatsappService::isConfigured(),
                default    => true,
            };
        }));
    }
}

