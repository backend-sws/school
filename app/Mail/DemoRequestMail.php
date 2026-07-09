<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Demo request email — sent to CONTACT_MAIL_ID when a visitor
 * requests a demo through the Guru AI chat.
 */
class DemoRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $leadName,
        public string $organization,
        public string $leadEmail,
        public ?string $phone = null,
        public ?string $leadMessage = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "🎓 New Demo Request — {$this->organization}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.demo-request',
            with: [
                'leadName'     => $this->leadName,
                'organization' => $this->organization,
                'leadEmail'    => $this->leadEmail,
                'phone'        => $this->phone,
                'leadMessage'  => $this->leadMessage,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
