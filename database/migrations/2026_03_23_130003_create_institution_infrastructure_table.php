<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('institution_infrastructure', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('session_id')->constrained('academic_sessions')->cascadeOnDelete();

            // ─── Building ─────────────────────────────────────────────
            $table->string('building_status', 20)->nullable(); // pucca / semi_pucca / kuccha
            $table->unsignedSmallInteger('total_classrooms')->default(0);
            $table->unsignedSmallInteger('classrooms_good_condition')->default(0);
            $table->unsignedSmallInteger('classrooms_need_repair')->default(0);

            // ─── Toilets ──────────────────────────────────────────────
            $table->unsignedSmallInteger('toilets_boys')->default(0);
            $table->unsignedSmallInteger('toilets_girls')->default(0);
            $table->unsignedSmallInteger('toilets_cwsn')->default(0);
            $table->unsignedSmallInteger('toilets_functional')->default(0);

            // ─── Facilities ───────────────────────────────────────────
            $table->boolean('has_drinking_water')->default(false);
            $table->string('drinking_water_source', 30)->nullable(); // borewell / tap / hand_pump
            $table->boolean('has_electricity')->default(false);
            $table->boolean('has_library')->default(false);
            $table->unsignedInteger('library_books_count')->default(0);
            $table->boolean('has_playground')->default(false);
            $table->unsignedInteger('playground_area_sqm')->nullable();
            $table->boolean('has_boundary_wall')->default(false);
            $table->boolean('has_ramp')->default(false);
            $table->boolean('has_kitchen_shed')->default(false);

            // ─── Labs ─────────────────────────────────────────────────
            $table->boolean('has_science_lab')->default(false);
            $table->boolean('has_computer_lab')->default(false);
            $table->boolean('has_integrated_lab')->default(false);

            // ─── ICT ──────────────────────────────────────────────────
            $table->unsignedSmallInteger('computers_count')->default(0);
            $table->boolean('has_smart_classroom')->default(false);
            $table->unsignedSmallInteger('smart_classroom_count')->default(0);
            $table->boolean('has_internet')->default(false);
            $table->string('internet_type', 30)->nullable(); // broadband / dongle / leased_line

            // ─── Safety ───────────────────────────────────────────────
            $table->boolean('has_fire_extinguisher')->default(false);
            $table->boolean('has_cctv')->default(false);
            $table->boolean('has_first_aid')->default(false);
            $table->boolean('has_rainwater_harvesting')->default(false);
            $table->boolean('has_solar_panel')->default(false);

            // ─── Meta ─────────────────────────────────────────────────
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();

            $table->unique(['institution_id', 'session_id']);
            $table->index(['institution_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('institution_infrastructure');
    }
};
