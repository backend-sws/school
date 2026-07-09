<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('website_themes', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 50)->unique();
            $table->string('name');
            $table->string('category', 30)->default('core'); // core | brand | festival
            $table->string('description')->nullable();
            $table->json('preview_colors')->nullable(); // e.g. ["#4338ca","#6d28d9","#a855f7"] for card swatch
            $table->string('preview_image')->nullable();
            $table->boolean('is_system')->default(true);
            $table->timestamps();
        });

        Schema::create('website_section_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('page_slug', 50)->default('home');
            $table->string('section_id', 80);
            $table->integer('sort_order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->json('custom_props')->nullable();
            $table->timestamps();

            $table->unique(['institution_id', 'page_slug', 'section_id'], 'wso_inst_page_section_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('website_section_orders');
        Schema::dropIfExists('website_themes');
    }
};
