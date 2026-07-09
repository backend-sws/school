<?php
namespace App\Notifications;

use App\Models\User;
use App\Services\NotificationTemplateRenderer;
use App\Traits\NotifiesViaChannelMatrix;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;

class FeeDueReminderNotification extends Notification implements ShouldQueue
{
    use NotifiesViaChannelMatrix, Queueable;

    public string $notificationType = 'fee_due_reminder';

    /**
     * @param  array<string, float|int|string>  $ledgerBreakdown  previous_dues, total_payable, late_fee, period_fee, paid_in_period
     */
    public function __construct(
        public User $student,
        public string $periodKey,
        public Carbon $dueDate,
        public float $expectedAmount,
        public float $balanceAmount,
        public int $institutionId,
        public array $ledgerBreakdown = [],
    ) {
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $dueStr = $this->dueDate->format('M j, Y');
        $body = sprintf(
            'Fee for %s (period %s) is due on %s. Balance: ₹%s.',
            $this->student->name,
            $this->periodKey,
            $dueStr,
            number_format($this->balanceAmount, 2)
        );

        return array_merge([
            'type' => 'fee_due_reminder',
            'title' => 'Fee due soon',
            'body' => $body,
            'url' => '/fees/payments',
            'student_id' => $this->student->id,
            'student_name' => $this->student->name,
            'period' => $this->periodKey,
            'due_date' => $this->dueDate->toDateString(),
            'expected_amount' => $this->expectedAmount,
            'balance_amount' => $this->balanceAmount,
        ], $this->ledgerPayload());
    }

    public function toMail(object $notifiable): MailMessage
    {
        $dueStr = $this->dueDate->format('d M Y');
        $mail = (new MailMessage)
            ->subject('Fee Due Reminder - ' . $this->student->name . ' (' . $this->periodKey . ')')
            ->greeting('Hello ' . $this->student->name . '!')
            ->line(sprintf(
                'This is a reminder that your fee for the period **%s** is due on **%s**.',
                $this->periodKey,
                $dueStr
            ));

        $L = $this->ledgerBreakdown;
        if (! empty($L)) {
            $mail->line('**Amount breakdown**');
            if (($L['previous_dues'] ?? 0) > 0) {
                $mail->line('Previous dues / arrears: **₹' . number_format((float) $L['previous_dues'], 2) . '**');
            }
            $mail->line('Period fee (this cycle): **₹' . number_format((float) ($L['period_fee'] ?? $this->expectedAmount), 2) . '**');
            if (($L['late_fee'] ?? 0) > 0) {
                $mail->line('Late fee (if applicable): **₹' . number_format((float) $L['late_fee'], 2) . '**');
            }
            if (($L['discount'] ?? 0) > 0) {
                $mail->line('Discount on structure: **₹' . number_format((float) $L['discount'], 2) . '**');
            }
            if (($L['total_payable'] ?? 0) > 0) {
                $mail->line('Total payable (before further payments): **₹' . number_format((float) $L['total_payable'], 2) . '**');
            }
            if (($L['paid_in_period'] ?? 0) > 0) {
                $mail->line('Already paid toward this period: **₹' . number_format((float) $L['paid_in_period'], 2) . '**');
            }
        }

        $mail->line('**Balance due now:** ₹' . number_format($this->balanceAmount, 2))
            ->action('Pay Now', url('/fees/payments'))
            ->line('Please ensure timely payment to avoid late fees.');

        return $mail;
    }

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        $dueStr = $this->dueDate->format('M j, Y');
        $L = $this->ledgerBreakdown;
        $line2 = sprintf('Balance due: ₹%s', number_format($this->balanceAmount, 2));
        if (! empty($L) && ($L['total_payable'] ?? 0) > 0) {
            $line2 = sprintf(
                'Total payable ₹%s · Balance ₹%s',
                number_format((float) $L['total_payable'], 2),
                number_format($this->balanceAmount, 2)
            );
        }

        return (new WebPushMessage)
            ->title('Fee due soon — ' . $this->periodKey)
            ->body($this->student->name . ' — due ' . $dueStr . '. ' . $line2)
            ->data([
                'url' => '/fees/payments',
                'type' => 'fee_due_reminder',
                'student_id' => $this->student->id,
                'period' => $this->periodKey,
                'balance_amount' => $this->balanceAmount,
            ]);
    }

    public function toSms(object $notifiable): array
    {
        $vars = $this->templateVariables();
        $result = NotificationTemplateRenderer::render('fee_due_reminder', 'sms', $vars);

        return [
            'phone' => $notifiable->phone ?? $notifiable->mobile ?? '',
            'message' => $result['message'],
            'institution_id' => $this->institutionId,
            'category' => 'fee_reminder',
            'template_id' => $result['provider_template_id'],
            'recipient_name' => $notifiable->name ?? null,
            'recipient_user_id' => $notifiable->id ?? null,
        ];
    }

    public function toWhatsapp(object $notifiable): array
    {
        $vars = $this->templateVariables();
        $result = NotificationTemplateRenderer::render('fee_due_reminder', 'whatsapp', $vars);

        return [
            'phone' => $notifiable->phone ?? $notifiable->mobile ?? '',
            'message' => $result['message'],
            'template_name' => $result['provider_template_id'],
            'institution_id' => $this->institutionId,
            'category' => 'fee_reminder',
            'recipient_name' => $notifiable->name ?? null,
            'recipient_user_id' => $notifiable->id ?? null,
        ];
    }

    /**
     * @return array<string, string>
     */
    private function templateVariables(): array
    {
        $L = $this->ledgerBreakdown;
        $fmt = static fn (float $v): string => number_format($v, 2);

        return [
            'amount' => $fmt($this->balanceAmount),
            'date' => $this->dueDate->format('d M Y'),
            'name' => $this->student->name,
            'period' => $this->periodKey,
            'previous_dues' => $fmt((float) ($L['previous_dues'] ?? 0)),
            'period_fee' => $fmt((float) ($L['period_fee'] ?? $this->expectedAmount)),
            'late_fee' => $fmt((float) ($L['late_fee'] ?? 0)),
            'total_payable' => $fmt((float) ($L['total_payable'] ?? 0)),
            'paid_in_period' => $fmt((float) ($L['paid_in_period'] ?? 0)),
            'discount' => $fmt((float) ($L['discount'] ?? 0)),
        ];
    }

    /**
     * @return array<string, float>
     */
    private function ledgerPayload(): array
    {
        $L = $this->ledgerBreakdown;

        return [
            'ledger_previous_dues' => (float) ($L['previous_dues'] ?? 0),
            'ledger_period_fee' => (float) ($L['period_fee'] ?? $this->expectedAmount),
            'ledger_late_fee' => (float) ($L['late_fee'] ?? 0),
            'ledger_total_payable' => (float) ($L['total_payable'] ?? 0),
            'ledger_paid_in_period' => (float) ($L['paid_in_period'] ?? 0),
            'ledger_discount' => (float) ($L['discount'] ?? 0),
        ];
    }
}
