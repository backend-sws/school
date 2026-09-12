<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // 1. Add fleet tracking and compliance columns to transport_vehicles
        Schema::table('transport_vehicles', function (Blueprint $table) {
            $table->string('model_name', 100)->nullable()->after('vehicle_type');
            $table->unsignedSmallInteger('make_year')->nullable()->after('model_name');
            $table->string('chassis_number', 100)->nullable()->after('make_year');
            $table->string('engine_number', 100)->nullable()->after('chassis_number');
            $table->string('fuel_type', 30)->default('diesel')->after('engine_number');
            $table->decimal('current_odometer', 10, 2)->default(0)->after('capacity');
            $table->string('insurance_policy_number', 100)->nullable()->after('notes');
            $table->date('insurance_expiry_date')->nullable()->after('insurance_policy_number');
            $table->date('puc_expiry_date')->nullable()->after('insurance_expiry_date');
            $table->date('fitness_expiry_date')->nullable()->after('puc_expiry_date');
            $table->date('road_tax_expiry_date')->nullable()->after('fitness_expiry_date');
            $table->date('permit_expiry_date')->nullable()->after('road_tax_expiry_date');
            $table->json('documents')->nullable()->after('permit_expiry_date');
        });

        // 2. Create transport_vehicle_logs (Daily trip & running records)
        Schema::create('transport_vehicle_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('transport_vehicle_id')->constrained()->cascadeOnDelete();
            $table->foreignId('transport_driver_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('transport_route_id')->nullable()->constrained()->nullOnDelete();
            $table->date('log_date');
            $table->string('trip_type', 40)->default('regular'); // regular, event, excursion, maintenance, other
            $table->string('purpose', 255)->nullable();
            $table->decimal('start_odometer', 10, 2);
            $table->decimal('end_odometer', 10, 2)->nullable();
            $table->decimal('total_km', 10, 2)->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('status', 30)->default('completed'); // completed, in_progress, cancelled
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['institution_id', 'transport_vehicle_id'], 'tv_logs_inst_veh_idx');
            $table->index(['institution_id', 'log_date'], 'tv_logs_inst_date_idx');
            $table->index(['transport_vehicle_id', 'log_date'], 'tv_logs_veh_date_idx');
            $table->index('status', 'tv_logs_status_idx');
        });

        // 3. Create transport_vehicle_fuels (Fuel refill records)
        Schema::create('transport_vehicle_fuels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('transport_vehicle_id')->constrained()->cascadeOnDelete();
            $table->foreignId('transport_driver_id')->nullable()->constrained()->nullOnDelete();
            $table->date('fuel_date');
            $table->time('fuel_time')->nullable();
            $table->string('fuel_type', 30)->default('diesel'); // diesel, petrol, cng, electric
            $table->decimal('odometer_reading', 10, 2);
            $table->decimal('liters', 10, 2);
            $table->decimal('rate_per_liter', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->boolean('is_full_tank')->default(true);
            $table->string('vendor_name', 150)->nullable();
            $table->string('payment_mode', 50)->default('cash'); // cash, upi, card, fuel_card, credit, bank_transfer
            $table->string('invoice_number', 100)->nullable();
            $table->text('bill_url')->nullable();
            $table->decimal('calculated_mileage', 8, 2)->nullable(); // km per liter
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['institution_id', 'transport_vehicle_id'], 'tv_fuels_inst_veh_idx');
            $table->index(['institution_id', 'fuel_date'], 'tv_fuels_inst_date_idx');
            $table->index(['transport_vehicle_id', 'fuel_date'], 'tv_fuels_veh_date_idx');
        });

        // 4. Create transport_vehicle_expenses (Maintenance, service, repairs, taxes, tolls)
        Schema::create('transport_vehicle_expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('transport_vehicle_id')->constrained()->cascadeOnDelete();
            $table->date('expense_date');
            $table->string('category', 50)->default('maintenance'); // maintenance, repair, tyre, battery, cleaning, insurance, puc, fitness, road_tax, toll, fine, other
            $table->string('title', 200);
            $table->decimal('amount', 10, 2);
            $table->decimal('odometer_reading', 10, 2)->nullable();
            $table->string('vendor_name', 150)->nullable();
            $table->string('invoice_number', 100)->nullable();
            $table->text('bill_url')->nullable();
            $table->date('next_service_date')->nullable();
            $table->decimal('next_service_odometer', 10, 2)->nullable();
            $table->string('payment_mode', 50)->default('cash');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['institution_id', 'transport_vehicle_id'], 'tv_exp_inst_veh_idx');
            $table->index(['institution_id', 'expense_date'], 'tv_exp_inst_date_idx');
            $table->index(['transport_vehicle_id', 'category'], 'tv_exp_veh_cat_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transport_vehicle_expenses');
        Schema::dropIfExists('transport_vehicle_fuels');
        Schema::dropIfExists('transport_vehicle_logs');

        Schema::table('transport_vehicles', function (Blueprint $table) {
            $cols = [
                'model_name',
                'make_year',
                'chassis_number',
                'engine_number',
                'fuel_type',
                'current_odometer',
                'insurance_policy_number',
                'insurance_expiry_date',
                'puc_expiry_date',
                'fitness_expiry_date',
                'road_tax_expiry_date',
                'permit_expiry_date',
                'documents',
            ];
            foreach ($cols as $c) {
                if (Schema::hasColumn('transport_vehicles', $c)) {
                    $table->dropColumn($c);
                }
            }
        });
    }
};
