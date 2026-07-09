<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lms_announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lms_class_id')->constrained('lms_classes')->cascadeOnDelete();
            $table->string('title', 200);
            $table->text('body');
            $table->timestamp('published_at')->nullable();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['lms_class_id']);
        });

        Schema::create('lms_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lms_class_id')->constrained('lms_classes')->cascadeOnDelete();
            $table->string('title', 200);
            $table->string('file_path', 500);
            $table->string('file_type', 100)->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['lms_class_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lms_materials');
        Schema::dropIfExists('lms_announcements');
    }
};
