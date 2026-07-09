<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lms_live_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lms_class_id')->constrained('lms_classes')->cascadeOnDelete();
            $table->string('title', 200);
            $table->timestamp('scheduled_at');
            $table->timestamp('ends_at')->nullable();
            $table->string('meeting_url', 500)->nullable();
            $table->string('meeting_provider', 50)->nullable(); // zoom | meet | other
            $table->string('status', 20)->default('scheduled'); // scheduled | live | ended | cancelled
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['lms_class_id']);
        });

        Schema::create('lms_recordings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lms_class_id')->constrained('lms_classes')->cascadeOnDelete();
            $table->foreignId('lms_live_session_id')->nullable()->constrained('lms_live_sessions')->nullOnDelete();
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->string('video_url', 500)->nullable();
            $table->string('file_path', 500)->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->string('thumbnail_url', 500)->nullable();
            $table->timestamp('published_at')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['lms_class_id']);
            $table->index(['lms_live_session_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lms_recordings');
        Schema::dropIfExists('lms_live_sessions');
    }
};
