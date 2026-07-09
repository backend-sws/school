<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Phase 3: Communications & Alerts
 *
 * sms_logs     — record of every SMS sent
 * alert_rules  — configurable auto-alert triggers
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sms_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('sent_by')->constrained('users')->onDelete('cascade');
            $table->string('recipient_phone', 20);
            $table->string('recipient_name')->nullable();
            $table->foreignId('recipient_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('template_id')->nullable(); // DLT template ID
            $table->text('message');
            $table->string('status')->default('queued'); // queued, sent, delivered, failed
            $table->string('provider')->nullable(); // twilio, msg91, etc.
            $table->string('provider_message_id')->nullable();
            $table->text('error_message')->nullable();
            $table->string('category')->nullable(); // fee_reminder, attendance, exam, general
            $table->decimal('cost', 8, 4)->default(0);
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();

            $table->index(['institution_id', 'status']);
            $table->index(['institution_id', 'category']);
            $table->index(['institution_id', 'created_at']);
        });

        Schema::create('alert_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('trigger_event'); // fee_overdue, attendance_absent, exam_score_low, etc.
            $table->jsonb('conditions')->default('{}'); // {days_overdue: 7, min_absent_days: 3}
            $table->string('channel')->default('sms'); // sms, email, push, all
            $table->text('message_template');
            $table->string('recipient_type'); // student, guardian, faculty, all
            $table->boolean('is_active')->default(true);
            $table->string('frequency')->default('once'); // once, daily, weekly
            $table->timestamp('last_triggered_at')->nullable();
            $table->integer('trigger_count')->default(0);
            $table->timestamps();

            $table->index(['institution_id', 'trigger_event', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alert_rules');
        Schema::dropIfExists('sms_logs');
    }
};
