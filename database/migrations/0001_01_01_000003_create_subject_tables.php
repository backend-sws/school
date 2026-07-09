<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('subject_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('code', 30)->nullable();
            $table->smallInteger('status')->default(1);
            $table->timestamps();

            $table->unique(['institution_id', 'code']);
        });

        Schema::create('subject_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('code', 30)->nullable();
            $table->smallInteger('status')->default(1);
            $table->timestamps();

            $table->unique(['institution_id', 'code']);
        });

        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stream_id')->constrained()->cascadeOnDelete();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_group_id')->nullable()->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('parent_id')->nullable();

            $table->string('name', 150);
            $table->string('code', 50)->nullable();
            $table->smallInteger('status')->default(1);
            $table->boolean('is_practical')->default(false);
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('subjects')->onDelete('cascade');
            $table->index(['stream_id', 'parent_id']);
        });

        Schema::create('subject_category_mappings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_category_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subject_category_mappings');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('subject_categories');
        Schema::dropIfExists('subject_groups');
    }
};
