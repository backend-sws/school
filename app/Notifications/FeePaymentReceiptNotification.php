<?php

namespace App\Notifications;

use App\Models\FeePayment;
use App\Models\User;
use App\Services\FinancialDocuments\AssembleFeePaymentReceipt;
use App\Services\FinancialDocuments\FinancialDocumentTextFormatter;
use App\Traits\NotifiesViaChannelMatrix;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;

class FeePaymentReceiptNotification extends Notification implements ShouldQueue
{
    use NotifiesViaChannelMatrix, Queueable;

    public string $notificationType = 'fee_payment_receipt';

    public function __construct(
        public User $student,
        public FeePayment $payment,
    ) {
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $period = $this->payment->for_month ?? '—';
        $receiptNo = $this->payment->receipt_no ?? $this->payment->payment_id;
        $snap = $this->payment->ledger_snapshot ?? [];

        return array_merge([
            'type' => 'fee_payment_receipt',
            'title' => 'Fee payment received',
            'body' => sprintf(
                'Payment of ₹%s for %s (period %s). Receipt: %s.',
                number_format((float) $this->payment->total_amount, 2),
                $this->student->name,
                $period,
                $receiptNo
            ),
            'url' => '/fees/payments',
            'student_id' => $this->student->id,
            'student_name' => $this->student->name,
            'period' => $period,
            'amount' => (float) $this->payment->total_amount,
            'base_amount' => (float) $this->payment->amount,
            'late_fee_applied' => (float) $this->payment->late_fee_applied,
            'receipt_no' => $receiptNo,
            'payment_id' => $this->payment->id,
            'payment_mode' => $this->payment->payment_mode,
        ], $this->snapshotPayload($snap));
    }

    public function toMail(object $notifiable): MailMessage
    {
        $period = $this->payment->for_month ?? '—';
        $receiptNo = $this->payment->receipt_no ?? $this->payment->payment_id;

        $document = app(AssembleFeePaymentReceipt::class)->assemble($this->payment, $this->student);
        $lines = app(FinancialDocumentTextFormatter::class)->toPlainLines($document);
        // Drop duplicate title line (Mail subject already names the receipt).
        if ($lines !== [] && ($lines[0] ?? '') === $document->documentTitle) {
            array_shift($lines);
        }

        $mail = (new MailMessage)
            ->subject('Fee Payment Receipt - ' . $this->student->name . ' (' . $period . ')')
            ->greeting('Hello ' . $this->student->name . '!')
            ->line('We received **₹'.number_format((float) $this->payment->total_amount, 2).'** for period **'.$period.'**.')
            ->line('**Receipt number:** '.$receiptNo);

        foreach ($lines as $line) {
            if ($line !== '') {
                $mail->line($line);
            }
        }

        $mail->line('**Date:** '.($this->payment->payment_date?->format('d M Y, h:i A') ?? now()->format('d M Y, h:i A')))
            ->action('View My Payments', url('/fees/payments'))
            ->line('Thank you for your payment!');

        return $mail;
    }

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        $period = $this->payment->for_month ?? '—';
        $receiptNo = $this->payment->receipt_no ?? $this->payment->payment_id;
        $snap = $this->payment->ledger_snapshot ?? [];
        $dueAfter = $snap['balance_after'] ?? $snap['due'] ?? null;
        $tail = $dueAfter !== null && (float) $dueAfter > 0.009
            ? ' Balance ₹' . number_format((float) $dueAfter, 2)
            : '';

        return (new WebPushMessage)
            ->title('Fee received — ' . $period)
            ->body(sprintf(
                '₹%s total (base ₹%s + late ₹%s). Rcpt %s.%s',
                number_format((float) $this->payment->total_amount, 2),
                number_format((float) $this->payment->amount, 2),
                number_format((float) $this->payment->late_fee_applied, 2),
                $receiptNo,
                $tail
            ))
            ->data([
                'url' => '/fees/payments',
                'type' => 'fee_payment_receipt',
                'student_id' => $this->student->id,
                'payment_id' => $this->payment->id,
            ]);
    }

    public function toWhatsapp(object $notifiable): array
    {
        $period = $this->payment->for_month ?? '—';
        $receiptNo = $this->payment->receipt_no ?? $this->payment->payment_id;
        $snap = $this->payment->ledger_snapshot ?? [];
        $dueAfter = $snap['balance_after'] ?? $snap['due'] ?? null;
        $balanceText = $dueAfter !== null && (float) $dueAfter > 0.009
            ? sprintf(' Balance after: ₹%s.', number_format((float) $dueAfter, 2))
            : '';

        $msg = sprintf(
            'Fee receipt — %s | Period %s | Rcpt %s. Base ₹%s + late ₹%s = Total ₹%s. Mode %s.%s Thank you!',
            $this->student->name,
            $period,
            $receiptNo,
            number_format((float) $this->payment->amount, 2),
            number_format((float) $this->payment->late_fee_applied, 2),
            number_format((float) $this->payment->total_amount, 2),
            strtoupper((string) ($this->payment->payment_mode ?? '')),
            $balanceText
        );

        return [
            'phone' => $notifiable->phone ?? $notifiable->mobile ?? '',
            'message' => $msg,
            'template_name' => config('notifications.whatsapp_templates.fee_payment_receipt', 'payment_receipt_v1'),
            'institution_id' => $notifiable->institution_id ?? config('ems.default_institution_id'),
            'category' => 'fee_payment',
            'recipient_name' => $notifiable->name ?? null,
            'recipient_user_id' => $notifiable->id ?? null,
        ];
    }

    /**
     * @param  array<string, mixed>  $snap
     * @return array<string, float|int|string|null>
     */
    private function snapshotPayload(array $snap): array
    {
        $dueAfter = $snap['balance_after'] ?? $snap['due'] ?? null;

        return [
            'ledger_previous_dues' => (float) ($snap['previous_dues'] ?? 0),
            'ledger_monthly_total' => (float) ($snap['monthly_total'] ?? 0),
            'ledger_total_payable_before' => (float) ($snap['total_payable_before'] ?? 0),
            'ledger_total_fees' => (float) ($snap['total_fees'] ?? 0),
            'ledger_discount' => (float) ($snap['discount'] ?? 0),
            'ledger_balance_after' => $dueAfter !== null ? (float) $dueAfter : null,
        ];
    }
}
