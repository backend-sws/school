<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('id_card_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('name', 200);
            $table->enum('card_type', ['student', 'staff', 'temporary'])->default('student');
            $table->json('front_layout')->nullable();
            $table->json('back_layout')->nullable();
            $table->string('background_color', 7)->default('#1a237e');
            $table->string('background_image_url')->nullable();
            $table->string('logo_url')->nullable();
            $table->json('color_scheme')->nullable(); // {primary, secondary, text, bg}
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['institution_id', 'card_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('id_card_templates');
    }
};
