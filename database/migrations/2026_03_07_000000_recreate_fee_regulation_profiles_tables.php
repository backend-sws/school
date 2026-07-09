<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('fee_regulation_profiles')) {
            return;
        }
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

    public function down(): void
    {
        Schema::dropIfExists('fee_regulation_profile_items');
        Schema::dropIfExists('fee_regulation_profiles');
    }
};
