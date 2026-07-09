<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('id_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('template_id')->constrained('id_card_templates')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('session_id')->constrained('academic_sessions')->cascadeOnDelete();
            $table->enum('card_type', ['student', 'staff', 'temporary'])->default('student');
            $table->uuid('verification_token')->unique();
            $table->json('snapshot_data'); // frozen profile data including reg_no
            $table->string('photo_url')->nullable();
            $table->string('pdf_path')->nullable();
            $table->enum('status', ['generated', 'printed', 'revoked', 'expired'])->default('generated');
            $table->date('valid_from');
            $table->date('valid_until');
            $table->timestamp('generated_at')->nullable();
            $table->timestamp('printed_at')->nullable();
            $table->timestamps();

            $table->index(['institution_id', 'session_id']);
            $table->index(['user_id', 'session_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('id_cards');
    }
};
