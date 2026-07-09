<?php

namespace App\Notifications;

use App\Models\AdmissionApplication;
use App\Traits\NotifiesViaChannelMatrix;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;

class AdmissionPaymentRecordedNotification extends Notification implements ShouldQueue
{
    use NotifiesViaChannelMatrix, Queueable;

    public string $notificationType = 'admission_payment_recorded';

    public function __construct(
        public AdmissionApplication $application,
        public string $amount,
        public string $transactionId
    ) {}

    private function isReadmission(): bool
    {
        return ($this->application->application_type ?? 'new') === 're-admission';
    }

    private function titleText(): string
    {
        return $this->isReadmission() ? 'Re-admission payment recorded' : 'Payment recorded';
    }

    private function bodyText(): string
    {
        $type = $this->isReadmission() ? 'Re-admission' : 'Admission';

        return sprintf(
            '%s payment of %s recorded for application %s.',
            $type,
            $this->amount,
            $this->application->application_id
        );
    }

    private function mailConfig(): array
    {
        $key = $this->isReadmission() ? 'readmission' : 'new';

        return config("admission_mail.payment.{$key}");
    }

    public function toMail(object $notifiable): MailMessage
    {
        $name = $this->application->applicant_name ?? 'Applicant';
        $cfg = $this->mailConfig();
        $app = $this->application;

        $feeBase = (float) ($app->amount ?? 0);
        $transport = (float) ($app->transport_amount ?? 0);
        $hostel = (float) ($app->hostel_amount ?? 0);
        $gross = $feeBase + $transport + $hostel;
        $discount = (float) ($app->discount_amount ?? 0);
        $cash = (float) ($app->cash_amount ?? 0);
        $online = (float) ($app->online_amount ?? 0);
        $paid = $cash + $online;
        $due = (float) ($app->due_amount ?? 0);

        $mail = (new MailMessage)
            ->subject($this->titleText() . ' — ' . $this->application->application_id)
            ->greeting(str_replace(':name', $name, $cfg['greeting']))
            ->line($this->bodyText())
            ->line('**Transaction ID:** ' . $this->transactionId)
            ->line('**Application ID:** ' . $this->application->application_id)
            ->line('**Billable (fee + transport + hostel):** ₹' . number_format($gross, 2));

        if ($discount > 0) {
            $mail->line('**Concession / discount:** ₹' . number_format($discount, 2) . ($app->discount_reason ? ' — ' . $app->discount_reason : ''));
        }

        if ($paid > 0) {
            $mail->line('**Total paid to date:** ₹' . number_format($paid, 2));
            if ($cash > 0) {
                $mail->line('— Cash: ₹' . number_format($cash, 2));
            }
            if ($online > 0) {
                $mail->line('— Online: ₹' . number_format($online, 2));
            }
        }

        $mail->line('**Balance due:** ₹' . number_format($due, 2))
            ->action('View Application', url('/admission/applications/' . $this->application->id))
            ->line($cfg['closing'])
            ->line('[' . $cfg['cta_label'] . '](' . url($cfg['cta_url']) . ')');

        return $mail;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $app = $this->application;

        return [
            'type' => 'admission_payment_recorded',
            'title' => $this->titleText(),
            'body' => $this->bodyText(),
            'url' => '/admission/applications/'.$this->application->id,
            'application_id' => $this->application->id,
            'application_id_display' => $this->application->application_id,
            'amount' => $this->amount,
            'transaction_id' => $this->transactionId,
            'application_type' => $this->application->application_type,
            'billable_total' => (float) ($app->amount ?? 0) + (float) ($app->transport_amount ?? 0) + (float) ($app->hostel_amount ?? 0),
            'discount_amount' => (float) ($app->discount_amount ?? 0),
            'due_amount' => (float) ($app->due_amount ?? 0),
            'paid_total' => (float) ($app->cash_amount ?? 0) + (float) ($app->online_amount ?? 0),
        ];
    }

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        $app = $this->application;
        $due = (float) ($app->due_amount ?? 0);

        return (new WebPushMessage)
            ->title($this->titleText())
            ->body($this->bodyText() . ' Balance due: ₹' . number_format($due, 2) . '.')
            ->data([
                'url' => '/admission/applications/'.$this->application->id,
                'type' => 'admission_payment_recorded',
                'application_id' => $this->application->id,
                'due_amount' => $due,
            ]);
    }

    public function toWhatsapp(object $notifiable): array
    {
        $verb = $this->isReadmission() ? 're-admission' : 'admission';
        $app = $this->application;
        $gross = (float) ($app->amount ?? 0) + (float) ($app->transport_amount ?? 0) + (float) ($app->hostel_amount ?? 0);
        $discount = (float) ($app->discount_amount ?? 0);
        $paid = (float) ($app->cash_amount ?? 0) + (float) ($app->online_amount ?? 0);
        $due = (float) ($app->due_amount ?? 0);

        return [
            'phone' => $notifiable->phone ?? $notifiable->mobile ?? '',
            'message' => sprintf(
                '%s payment ₹%s recorded for %s. Txn: %s. Billable ₹%s, discount ₹%s, paid ₹%s, balance ₹%s. Thank you!',
                ucfirst($verb),
                $this->amount,
                $this->application->application_id,
                $this->transactionId,
                number_format($gross, 2),
                number_format($discount, 2),
                number_format($paid, 2),
                number_format($due, 2)
            ),
            'template_name' => config('notifications.whatsapp_templates.admission_payment_recorded', 'admission_payment_v1'),
            'institution_id' => $this->application->institution_id ?? config('ems.default_institution_id'),
            'category' => 'admission',
        ];
    }
}
