<?php

namespace App\Notifications\Auth;

use App\Models\Institution;
use App\Models\Setting;
use App\Services\NotificationTemplateRenderer;
use App\Services\UrlShortener;
use App\Traits\NotifiesViaChannelMatrix;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;

class ResetPasswordNotification extends Notification implements ShouldQueue
{
    use NotifiesViaChannelMatrix, Queueable;

    public string $notificationType = 'password_reset';

    /**
     * The password reset token.
     *
     * @var string
     */
    public $token;

    /**
     * Create a notification instance.
     *
     * @param  string  $token
     * @return void
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $url = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        return (new MailMessage)
            ->subject(Lang::get('Reset Password Notification'))
            ->line(Lang::get('You are receiving this email because we received a password reset request for your account.'))
            ->action(Lang::get('Reset Password'), $url)
            ->line(Lang::get('This password reset link will expire in :count minutes.', ['count' => config('auth.passwords.'.config('auth.defaults.passwords').'.expire')]))
            ->line(Lang::get('If you did not request a password reset, no further action is required.'));
    }

    /**
     * Get the SMS representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toSms($notifiable)
    {
        $url = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        // Shorten for SMS — raw URL with token is 100+ chars, DLT CTA limit matters
        $shortUrl = UrlShortener::shorten($url, now()->addHours(1));

        $vars = [
            'url' => $shortUrl,
            'institution' => $this->getInstitutionName($notifiable),
        ];

        $result = NotificationTemplateRenderer::render('password_reset', 'sms', $vars);

        return [
            'phone' => $notifiable->phone ?? $notifiable->mobile ?? '',
            'message' => $result['message'] ?? "Your password reset link: {$shortUrl}",
            'institution_id' => $notifiable->institution_id ?? config('ems.default_institution_id'),
            'category' => 'auth',
            'template_id' => $result['provider_template_id'] ?? null,
        ];
    }

    /**
     * Get the WhatsApp representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toWhatsapp($notifiable)
    {
        $url = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        $shortUrl = UrlShortener::shorten($url, now()->addHours(1));

        $vars = [
            'url' => $shortUrl,
            'institution' => $this->getInstitutionName($notifiable),
        ];

        $result = NotificationTemplateRenderer::render('password_reset', 'whatsapp', $vars);

        return [
            'phone' => $notifiable->phone ?? $notifiable->mobile ?? '',
            'message' => $result['message'] ?? "Your password reset link: {$shortUrl}",
            'template_name' => $result['provider_template_id'] ?? 'password_reset',
            'institution_id' => $notifiable->institution_id ?? config('ems.default_institution_id'),
            'category' => 'auth',
        ];
    }

    protected function getInstitutionName($notifiable): string
    {
        $institutionId = $notifiable->institution_id ?? config('ems.default_institution_id');
        
        return Institution::where('id', $institutionId)->value('name')
            ?? Setting::where('setting_key', 'college_name')->value('setting_value')
            ?? 'Our Institution';
    }
}
