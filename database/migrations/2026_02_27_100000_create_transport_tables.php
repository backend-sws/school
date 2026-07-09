<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('transport_stops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('code', 50)->nullable();
            $table->string('address', 255)->nullable();
            $table->string('landmark', 150)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['institution_id', 'code']);
            $table->index(['institution_id']);
            $table->index(['is_active']);
        });

        Schema::create('transport_routes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('code', 50)->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['institution_id', 'code']);
            $table->index(['institution_id']);
            $table->index(['is_active']);
        });

        Schema::create('transport_route_stops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transport_route_id')->constrained()->cascadeOnDelete();
            $table->foreignId('transport_stop_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('sequence');
            $table->time('arrival_time')->nullable();
            $table->time('departure_time')->nullable();
            $table->timestamps();

            $table->unique(['transport_route_id', 'sequence']);
            $table->index(['transport_route_id']);
            $table->index(['transport_stop_id']);
        });

        Schema::create('transport_drivers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('license_number', 80)->nullable();
            $table->date('license_valid_until')->nullable();
            $table->string('mobile', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['institution_id']);
            $table->index(['user_id']);
            $table->index(['is_active']);
        });

        Schema::create('transport_vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('registration_number', 30);
            $table->string('vehicle_type', 30)->default('bus');
            $table->unsignedInteger('capacity');
            $table->foreignId('transport_route_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('transport_driver_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status', 20)->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['institution_id', 'registration_number']);
            $table->index(['institution_id']);
            $table->index(['transport_route_id']);
            $table->index(['transport_driver_id']);
            $table->index(['status']);
        });

        Schema::create('transport_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('transport_route_id')->constrained()->restrictOnDelete();
            $table->foreignId('transport_stop_id')->constrained()->restrictOnDelete();
            $table->date('effective_from');
            $table->date('effective_until')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->index(['institution_id']);
            $table->index(['user_id']);
            $table->index(['transport_route_id']);
            $table->index(['transport_stop_id']);
            $table->index(['effective_from']);
            $table->index(['effective_until']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transport_assignments');
        Schema::dropIfExists('transport_vehicles');
        Schema::dropIfExists('transport_drivers');
        Schema::dropIfExists('transport_route_stops');
        Schema::dropIfExists('transport_routes');
        Schema::dropIfExists('transport_stops');
    }
};
