<?php
namespace App\Notifications\Support;

use App\Models\Institution;
use App\Support\VerificationToken;
use App\Traits\NotifiesViaChannelMatrix;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StaffInvitationNotification extends Notification
{
    use NotifiesViaChannelMatrix;

    public string $notificationType = 'staff_invitation';

    public function __construct(
        public Institution $institution
    ) {
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = VerificationToken::verifyEmailUrl($notifiable);

        return (new MailMessage)
            ->subject('Invitation to join ' . $this->institution->name)
            ->view('emails.staff-invitation', [
                'recipientName' => $notifiable->name,
                'institutionName' => $this->institution->name,
                'url' => $url,
                'expiryDays' => VerificationToken::EXPIRY_DAYS,
                'appName' => config('app.name'),
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'staff_invitation',
            'title' => 'Staff Invitation',
            'body' => 'You have been invited to join ' . $this->institution->name . ' as a staff member.',
            'url' => '/dashboard',
            'institution_id' => $this->institution->id,
            'institution_name' => $this->institution->name,
        ];
    }
}
