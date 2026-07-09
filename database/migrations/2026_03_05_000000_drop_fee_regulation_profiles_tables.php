<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::dropIfExists('fee_regulation_profile_items');
        Schema::dropIfExists('fee_regulation_profiles');
    }

    public function down(): void
    {
        // Recreate only if needed for rollback; structure was in 2026_03_03_000000_create_fee_regulation_profiles_tables
        Schema::create('fee_regulation_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained('institutions')->cascadeOnDelete();
            $table->string('name', 200);
            $table->string('category', 100)->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
            $table->index(['institution_id']);
        });
        Schema::create('fee_regulation_profile_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('fee_regulation_profiles')->cascadeOnDelete();
            $table->foreignId('fee_type_id')->constrained('fee_types')->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->timestamps();
            $table->index(['profile_id']);
            $table->index(['fee_type_id']);
        });
    }
};
