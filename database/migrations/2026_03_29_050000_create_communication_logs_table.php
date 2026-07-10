<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

/**
 * Unify sms_logs + whatsapp_logs → communication_logs (polymorphic by channel).
 * Also adds email channel logging.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('communication_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('channel', 20)->index();              // sms, whatsapp, email
            $table->foreignId('sent_by')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('recipient_phone', 20)->nullable();
            $table->string('recipient_email')->nullable();
            $table->string('recipient_name')->nullable();
            $table->foreignId('recipient_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('subject')->nullable();               // email subject
            $table->text('message');
            $table->string('template_id')->nullable();           // DLT template ID (SMS) or WA template name
            $table->string('media_url', 2048)->nullable();       // whatsapp attachment
            $table->string('media_type', 20)->nullable();        // image, document, video
            $table->string('status')->default('queued');          // queued, sent, delivered, read, failed
            $table->string('provider')->nullable();               // msg91, twilio, smtp, etc.
            $table->string('provider_message_id')->nullable();
            $table->text('error_message')->nullable();
            $table->unsignedTinyInteger('retry_count')->default(0);
            $table->string('category')->nullable();               // fee_reminder, attendance, enrollment
            $table->decimal('cost', 8, 4)->default(0);
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('read_at')->nullable();             // whatsapp read receipts
            $table->timestamps();

            $table->index(['institution_id', 'channel', 'status']);
            $table->index(['institution_id', 'channel', 'category']);
            $table->index(['institution_id', 'created_at']);
            $table->index('provider_message_id');
        });

        // Migrate existing data
        if (Schema::hasTable('sms_logs')) {
            DB::statement("
                INSERT INTO communication_logs
                    (institution_id, channel, sent_by, recipient_phone, recipient_name,
                     recipient_user_id, message, template_id, status, provider,
                     provider_message_id, error_message, retry_count, category,
                     cost, sent_at, delivered_at, created_at, updated_at)
                SELECT
                    institution_id, 'sms', sent_by, recipient_phone, recipient_name,
                    recipient_user_id, message, template_id, status, provider,
                    provider_message_id, error_message, COALESCE(retry_count, 0), category,
                    cost, sent_at, delivered_at, created_at, updated_at
                FROM sms_logs
            ");
        }

        if (Schema::hasTable('whatsapp_logs')) {
            DB::statement("
                INSERT INTO communication_logs
                    (institution_id, channel, sent_by, recipient_phone, recipient_name,
                     recipient_user_id, message, template_id, media_url, media_type,
                     status, provider, provider_message_id, error_message, retry_count,
                     category, cost, sent_at, delivered_at, read_at, created_at, updated_at)
                SELECT
                    institution_id, 'whatsapp', sent_by, recipient_phone, recipient_name,
                    recipient_user_id, message, template_name, media_url, media_type,
                    status, provider, provider_message_id, error_message, retry_count,
                    category, cost, sent_at, delivered_at, read_at, created_at, updated_at
                FROM whatsapp_logs
            ");
        }

        // Drop old tables
        Schema::dropIfExists('whatsapp_logs');
        Schema::dropIfExists('sms_logs');
    }

    public function down(): void
    {
        // Recreate original tables
        Schema::create('sms_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('sent_by')->constrained('users')->onDelete('cascade');
            $table->string('recipient_phone', 20);
            $table->string('recipient_name')->nullable();
            $table->foreignId('recipient_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('template_id')->nullable();
            $table->text('message');
            $table->string('status')->default('queued');
            $table->string('provider')->nullable();
            $table->string('provider_message_id')->nullable();
            $table->text('error_message')->nullable();
            $table->unsignedTinyInteger('retry_count')->default(0);
            $table->string('category')->nullable();
            $table->decimal('cost', 8, 4)->default(0);
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
            $table->index(['institution_id', 'status']);
            $table->index(['institution_id', 'category']);
            $table->index(['institution_id', 'created_at']);
        });

        Schema::create('whatsapp_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('sent_by')->constrained('users')->onDelete('cascade');
            $table->string('recipient_phone', 20);
            $table->string('recipient_name')->nullable();
            $table->foreignId('recipient_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('template_name');
            $table->text('message');
            $table->string('media_url', 2048)->nullable();
            $table->string('media_type', 20)->nullable();
            $table->string('status')->default('queued');
            $table->string('provider')->nullable();
            $table->string('provider_message_id')->nullable();
            $table->text('error_message')->nullable();
            $table->unsignedTinyInteger('retry_count')->default(0);
            $table->string('category')->nullable();
            $table->decimal('cost', 8, 4)->default(0);
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            $table->index(['institution_id', 'status']);
            $table->index(['institution_id', 'category']);
            $table->index(['institution_id', 'created_at']);
            $table->index('provider_message_id');
        });

        // Migrate data back
        DB::statement("INSERT INTO sms_logs (institution_id, sent_by, recipient_phone, recipient_name, recipient_user_id, template_id, message, status, provider, provider_message_id, error_message, retry_count, category, cost, sent_at, delivered_at, created_at, updated_at) SELECT institution_id, sent_by, recipient_phone, recipient_name, recipient_user_id, template_id, message, status, provider, provider_message_id, error_message, retry_count, category, cost, sent_at, delivered_at, created_at, updated_at FROM communication_logs WHERE channel = 'sms'");

        DB::statement("INSERT INTO whatsapp_logs (institution_id, sent_by, recipient_phone, recipient_name, recipient_user_id, template_name, message, media_url, media_type, status, provider, provider_message_id, error_message, retry_count, category, cost, sent_at, delivered_at, read_at, created_at, updated_at) SELECT institution_id, sent_by, recipient_phone, recipient_name, recipient_user_id, template_id, message, media_url, media_type, status, provider, provider_message_id, error_message, retry_count, category, cost, sent_at, delivered_at, read_at, created_at, updated_at FROM communication_logs WHERE channel = 'whatsapp'");

        Schema::dropIfExists('communication_logs');
    }
};
