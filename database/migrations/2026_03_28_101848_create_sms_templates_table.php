<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_templates', function (Blueprint $table) {
            $table->id();
            $table->string('key')->comment('Notification type e.g. admission_status_changed');
            $table->string('channel')->comment('Channel: sms, whatsapp, email, push, in_app');
            $table->string('name')->comment('Human-readable name');
            $table->string('subject')->nullable()->comment('Email subject line');
            $table->text('content')->comment('Message body with {variable} placeholders');
            $table->string('provider_template_id')->nullable()->comment('DLT template ID (SMS) / Meta template (WhatsApp)');
            $table->json('variables')->nullable()->comment('[{name, description}]');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['key', 'channel']);
            $table->index('key');
            $table->index('channel');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_templates');
    }
};
