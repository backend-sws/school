<?php

namespace App\Mail;

use App\Models\Payslip;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PayslipEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $payslip;
    public $pdfData;

    /**
     * Create a new message instance.
     */
    public function __construct(Payslip $payslip, $pdfData)
    {
        $this->payslip = $payslip;
        $this->pdfData = $pdfData;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $month = Carbon::createFromDate($this->payslip->payroll->year, $this->payslip->payroll->month, 1)->format('F Y');
        
        return new Envelope(
            subject: "Salary Slip for {$month}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.payslip',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        $monthStr = Carbon::createFromDate($this->payslip->payroll->year, $this->payslip->payroll->month, 1)->format('M_Y');
        $fileName = "Payslip_{$monthStr}.pdf";

        return [
            Attachment::fromData(fn () => $this->pdfData, $fileName)
                    ->withMime('application/pdf'),
        ];
    }
}
