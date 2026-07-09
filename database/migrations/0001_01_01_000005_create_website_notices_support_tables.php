<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('home_sliders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained();
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->text('image_url');
            $table->string('button_caption', 100)->nullable();
            $table->text('button_url')->nullable();
            $table->smallInteger('status')->default(0);
            $table->integer('sort_order')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained();
            $table->string('title', 300);
            $table->string('news_for', 20);
            $table->jsonb('news_types')->nullable();
            $table->text('content')->nullable();
            $table->timestamp('event_start_at')->nullable();
            $table->timestamp('event_end_at')->nullable();
            $table->string('event_venue', 200)->nullable();
            $table->jsonb('tags')->nullable();
            $table->smallInteger('status')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('image_galleries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained();
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->smallInteger('status')->default(0);
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('gallery_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('gallery_id')->constrained('image_galleries')->cascadeOnDelete();
            $table->text('image_url');
            $table->string('caption', 200)->nullable();
            $table->string('media_type', 20)->default('image');
            $table->integer('sort_order')->default(0);
        });

        Schema::create('home_tickers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained();
            $table->string('title', 200);
            $table->string('tag', 50)->nullable();
            $table->text('url')->nullable();
            $table->integer('sort_order')->default(0);
            $table->smallInteger('status')->default(1);
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('grievances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained();
            $table->string('ticket_no', 50)->unique();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->string('name', 150);
            $table->string('email', 150)->nullable();
            $table->string('mobile', 15)->nullable();
            $table->string('category', 100)->nullable();
            $table->string('subject', 300)->nullable();
            $table->text('description')->nullable();
            $table->string('status', 20)->default('open');
            $table->string('priority', 20)->default('medium');
            $table->foreignId('assigned_to')->nullable()->constrained('users');
            $table->text('resolution')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('resolved_at')->nullable();
        });

        Schema::create('contact_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->nullable()->constrained();
            $table->string('name', 150);
            $table->string('email', 150)->nullable();
            $table->string('mobile', 15)->nullable();
            $table->string('subject', 300)->nullable();
            $table->text('message')->nullable();
            $table->string('status', 20)->default('new');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->nullable()->constrained();
            $table->string('setting_key', 100);
            $table->text('setting_value')->nullable();
            $table->string('setting_group', 50)->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamp('updated_at')->useCurrent();
            $table->unique(['institution_id', 'setting_key']);
        });

        Schema::create('notices', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->boolean('final_publish')->default(false);
            $table->string('target_type')->default('all');
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('notice_targets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notice_id')->constrained()->cascadeOnDelete();
            $table->string('target_type', 50);
            $table->unsignedBigInteger('target_id');
            $table->timestamps();
            $table->index(['target_type', 'target_id']);
        });

        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->string('name', 150)->nullable();
            $table->string('email', 150)->nullable();
            $table->string('mobile', 15)->nullable();
            $table->string('subject', 500)->nullable();
            $table->text('message');
            $table->smallInteger('rating')->nullable();
            $table->string('status', 20)->default('new');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained();
            $table->string('ticket_no', 50)->unique();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->string('subject', 300);
            $table->text('message')->nullable();
            $table->text('attachment_url')->nullable();
            $table->string('priority', 20)->default('medium');
            $table->string('status', 20)->default('open');
            $table->foreignId('assigned_to')->nullable()->constrained('users');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
        });

        Schema::create('support_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('support_ticket_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->text('message');
            $table->boolean('is_staff')->default(false);
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('student_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type', 20)->default('permanent');
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('pincode', 10)->nullable();
            $table->timestamps();
            $table->index(['user_id']);
        });

        Schema::create('student_verification_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('field_key', 100);
            $table->text('field_value')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'field_key']);
        });

        Schema::create('student_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('document_type', 100);
            $table->text('file_url');
            $table->string('file_name', 200)->nullable();
            $table->timestamps();
            $table->index(['institution_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_documents');
        Schema::dropIfExists('student_verification_data');
        Schema::dropIfExists('student_addresses');
        Schema::dropIfExists('support_messages');
        Schema::dropIfExists('support_tickets');
        Schema::dropIfExists('feedbacks');
        Schema::dropIfExists('notice_targets');
        Schema::dropIfExists('notices');
        Schema::dropIfExists('settings');
        Schema::dropIfExists('contact_submissions');
        Schema::dropIfExists('grievances');
        Schema::dropIfExists('home_tickers');
        Schema::dropIfExists('gallery_images');
        Schema::dropIfExists('image_galleries');
        Schema::dropIfExists('news');
        Schema::dropIfExists('home_sliders');
    }
};
