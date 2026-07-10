<?php

namespace App\Listeners;

use App\Models\CommunicationLog;
use App\Models\User;
use Illuminate\Mail\Events\MessageSent;
use Illuminate\Support\Facades\Log;

class LogSentMessage
{
    /**
     * Handle the event.
     */
    public function handle(MessageSent $event): void
    {
        try {
            $message = $event->message;
            $to = collect($message->getTo())->map(fn($address) => $address->getAddress())->first();
            $toName = collect($message->getTo())->map(fn($address) => $address->getName())->first();

            // Resolve sent_by: try auth first, then look up the recipient user
            $sentBy = auth()->id();
            $recipientUserId = null;

            if (!$sentBy && $to) {
                // In queued context, auth() is null. Look up user by email.
                $recipientUser = User::where('email', $to)->first();
                $recipientUserId = $recipientUser?->id;
                // Use the recipient as the "sent_by" for system-generated emails
                $sentBy = $recipientUserId;
            }

            // Resolve institution_id from session, or from the recipient user's profile
            $institutionId = session('active_institution_id');
            if (!$institutionId && isset($recipientUser)) {
                $institutionId = $recipientUser->studentProfile?->institution_id
                    ?? $recipientUser->institution_id
                    ?? null;
            }
            $institutionId = $institutionId ?? config('ems.default_institution_id') ?? null;

            CommunicationLog::create([
                'institution_id'      => $institutionId,
                'channel'             => CommunicationLog::CHANNEL_EMAIL,
                'sent_by'             => $sentBy,
                'recipient_email'     => $to,
                'recipient_name'      => $toName,
                'recipient_user_id'   => $recipientUserId,
                'subject'             => $message->getSubject(),
                'message'             => $message->getHtmlBody() ?? $message->getTextBody(),
                'status'              => 'sent',
                'provider'            => 'smtp',
                'category'            => 'notification',
                'sent_at'             => now(),
                'provider_message_id' => $message->generateMessageId(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to log email communication: ' . $e->getMessage());
        }
    }
}
