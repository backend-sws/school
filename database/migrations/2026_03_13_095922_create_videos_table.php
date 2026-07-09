<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained('institutions')->cascadeOnDelete();
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status', 20)->default('uploading'); // uploading|processing|ready|failed
            $table->string('file_name')->nullable();
            $table->string('raw_path', 500)->nullable();
            $table->string('hls_path', 500)->nullable();
            $table->string('thumbnail_path', 500)->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->unsignedBigInteger('file_size_bytes')->nullable();
            $table->string('resolution_original', 20)->nullable();
            $table->jsonb('resolutions_available')->default('[]');
            $table->jsonb('metadata')->default('{}');
            $table->string('upload_id', 500)->nullable(); // R2 multipart upload ID
            $table->jsonb('upload_parts')->default('[]');  // Completed parts for multipart
            $table->unsignedInteger('upload_progress')->default(0); // 0-100
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->index(['institution_id', 'status']);
            $table->index(['uploaded_by']);
        });

        Schema::create('videoables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_id')->constrained('videos')->cascadeOnDelete();
            $table->string('videoable_type', 100);
            $table->unsignedBigInteger('videoable_id');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['video_id', 'videoable_type', 'videoable_id'], 'videoable_unique');
            $table->index(['videoable_type', 'videoable_id'], 'videoable_morph_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('videoables');
        Schema::dropIfExists('videos');
    }
};
