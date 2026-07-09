<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * WhatsApp message logs — mirrors sms_logs with WhatsApp-specific fields.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('whatsapp_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('sent_by')->constrained('users')->onDelete('cascade');
            $table->string('recipient_phone', 20);
            $table->string('recipient_name')->nullable();
            $table->foreignId('recipient_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('template_name');                    // WhatsApp requires pre-approved templates
            $table->text('message');
            $table->string('media_url', 2048)->nullable();      // image/doc/video attachment
            $table->string('media_type', 20)->nullable();       // image, document, video
            $table->string('status')->default('queued');         // queued, sent, delivered, read, failed
            $table->string('provider')->nullable();              // msg91, meta, etc.
            $table->string('provider_message_id')->nullable();
            $table->text('error_message')->nullable();
            $table->unsignedTinyInteger('retry_count')->default(0);
            $table->string('category')->nullable();              // fee_reminder, attendance, exam, general
            $table->decimal('cost', 8, 4)->default(0);
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('read_at')->nullable();            // WhatsApp read receipts
            $table->timestamps();

            $table->index(['institution_id', 'status']);
            $table->index(['institution_id', 'category']);
            $table->index(['institution_id', 'created_at']);
            $table->index('provider_message_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('whatsapp_logs');
    }
};
