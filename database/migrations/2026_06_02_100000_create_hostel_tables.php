<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // ── Hostel Buildings ─────────────────────────────────────
        Schema::create('hostels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('code', 50)->nullable();
            $table->string('type', 30)->default('boys'); // boys, girls, co-ed, staff
            $table->foreignId('warden_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('warden_name', 150)->nullable();
            $table->string('warden_contact', 20)->nullable();
            $table->string('address', 255)->nullable();
            $table->unsignedInteger('total_capacity')->default(0);
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['institution_id', 'code']);
            $table->index(['institution_id']);
            $table->index(['is_active']);
            $table->index(['type']);
        });

        // ── Hostel Floors ────────────────────────────────────────
        Schema::create('hostel_floors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hostel_id')->constrained()->cascadeOnDelete();
            $table->string('name', 100); // e.g. "Ground Floor", "First Floor"
            $table->unsignedSmallInteger('floor_number')->default(0);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['hostel_id', 'floor_number']);
            $table->index(['hostel_id']);
        });

        // ── Hostel Rooms ─────────────────────────────────────────
        Schema::create('hostel_rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('hostel_id')->constrained()->cascadeOnDelete();
            $table->foreignId('hostel_floor_id')->nullable()->constrained()->nullOnDelete();
            $table->string('room_number', 30);
            $table->string('type', 30)->default('double'); // single, double, triple, dormitory
            $table->unsignedSmallInteger('bed_count')->default(1);
            $table->decimal('monthly_fee', 10, 2)->nullable();
            $table->jsonb('amenities')->nullable(); // e.g. ["AC", "Attached Bath", "WiFi"]
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['hostel_id', 'room_number']);
            $table->index(['institution_id']);
            $table->index(['hostel_id']);
            $table->index(['hostel_floor_id']);
            $table->index(['type']);
            $table->index(['is_active']);
        });

        // ── Hostel Beds ──────────────────────────────────────────
        Schema::create('hostel_beds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hostel_room_id')->constrained()->cascadeOnDelete();
            $table->string('bed_label', 30); // e.g. "A", "B", "1", "Upper", "Lower"
            $table->string('status', 20)->default('vacant'); // vacant, occupied, maintenance
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['hostel_room_id', 'bed_label']);
            $table->index(['hostel_room_id']);
            $table->index(['status']);
        });

        // ── Hostel Allocations ───────────────────────────────────
        Schema::create('hostel_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('hostel_room_id')->constrained()->restrictOnDelete();
            $table->foreignId('hostel_bed_id')->nullable()->constrained()->nullOnDelete();
            $table->date('check_in_date');
            $table->date('check_out_date')->nullable();
            $table->string('status', 20)->default('active'); // active, checked_out, cancelled
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->index(['institution_id']);
            $table->index(['user_id']);
            $table->index(['hostel_room_id']);
            $table->index(['hostel_bed_id']);
            $table->index(['status']);
            $table->index(['check_in_date']);
            $table->index(['check_out_date']);
        });

        // ── Hostel Complaints ────────────────────────────────────
        Schema::create('hostel_complaints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('hostel_room_id')->nullable()->constrained()->nullOnDelete();
            $table->string('subject', 255);
            $table->text('description')->nullable();
            $table->string('status', 20)->default('open'); // open, in_progress, resolved, closed
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->index(['institution_id']);
            $table->index(['user_id']);
            $table->index(['hostel_room_id']);
            $table->index(['status']);
        });

        // ── Hostel Mess Plans ────────────────────────────────────
        Schema::create('hostel_mess_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('type', 30)->default('veg'); // veg, non-veg, both
            $table->decimal('monthly_fee', 10, 2)->default(0);
            $table->text('description')->nullable();
            $table->jsonb('meal_schedule')->nullable(); // {"breakfast": "7:30-9:00", "lunch": "12:30-2:00", ...}
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['institution_id']);
            $table->index(['is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hostel_mess_plans');
        Schema::dropIfExists('hostel_complaints');
        Schema::dropIfExists('hostel_allocations');
        Schema::dropIfExists('hostel_beds');
        Schema::dropIfExists('hostel_rooms');
        Schema::dropIfExists('hostel_floors');
        Schema::dropIfExists('hostels');
    }
};
