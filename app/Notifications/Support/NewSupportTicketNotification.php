<?php

namespace App\Notifications\Support;

use App\Models\SupportTicket;
use App\Traits\NotifiesViaChannelMatrix;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;

class NewSupportTicketNotification extends Notification implements ShouldQueue
{
    use NotifiesViaChannelMatrix, Queueable;

    public string $notificationType = 'support_ticket';

    public function __construct(
        public SupportTicket $ticket
    ) {
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_support_ticket',
            'title' => 'New Support Ticket: ' . $this->ticket->ticket_id,
            'body' => sprintf(
                'Ticket raised by %s: %s',
                $this->ticket->user?->name ?? 'User',
                $this->ticket->subject
            ),
            'url' => '/support/tickets/' . $this->ticket->id,
            'ticket_id' => $this->ticket->id,
            'ticket_display_id' => $this->ticket->ticket_id,
        ];
    }

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        return (new WebPushMessage)
            ->title('New Support Ticket: ' . $this->ticket->ticket_id)
            ->body($this->ticket->subject)
            ->data([
                'url' => '/support/tickets/' . $this->ticket->id,
                'type' => 'new_support_ticket',
                'ticket_id' => $this->ticket->id,
            ]);
    }
}
