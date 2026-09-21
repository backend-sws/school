<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Fuel Vendor (Petrol Pump) Master
        Schema::create('transport_fuel_vendors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('name', 200);
            $table->string('location', 300)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('pincode', 20)->nullable();
            $table->string('contact_name', 150)->nullable();
            $table->string('contact_phone', 20)->nullable();
            $table->string('gstin', 20)->nullable();
            $table->decimal('credit_limit', 12, 2)->default(0); // 0 = unlimited
            $table->string('payment_terms', 50)->default('on-demand'); // weekly, monthly, on-demand
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['institution_id', 'is_active'], 'tfv_inst_active_idx');
        });

        // 2. Vendor Settlement Records
        Schema::create('transport_fuel_vendor_settlements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('transport_fuel_vendor_id');
            $table->foreign('transport_fuel_vendor_id', 'tfvs_vendor_fk')
                ->references('id')->on('transport_fuel_vendors')->cascadeOnDelete();
            $table->date('settlement_date');
            $table->decimal('amount', 12, 2);
            $table->string('payment_mode', 50)->default('cash');
            $table->string('reference_number', 100)->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['institution_id', 'transport_fuel_vendor_id'], 'tfvs_inst_vendor_idx');
        });

        // 3. Add vendor + payment-status columns to existing fuel table
        Schema::table('transport_vehicle_fuels', function (Blueprint $table) {
            $table->unsignedBigInteger('transport_fuel_vendor_id')->nullable()->after('vendor_name');
            $table->foreign('transport_fuel_vendor_id', 'tvf_vendor_fk')
                ->references('id')->on('transport_fuel_vendors')->nullOnDelete();
            $table->string('payment_status', 20)->default('paid')
                ->after('payment_mode')
                ->comment('paid | credit | settled');
            $table->unsignedBigInteger('transport_fuel_vendor_settlement_id')->nullable()->after('payment_status');
            $table->foreign('transport_fuel_vendor_settlement_id', 'tvf_settlement_fk')
                ->references('id')->on('transport_fuel_vendor_settlements')->nullOnDelete();
            $table->timestamp('settled_at')->nullable()->after('transport_fuel_vendor_settlement_id');

            $table->index(['transport_fuel_vendor_id', 'payment_status'], 'tvf_vendor_status_idx');
        });
    }

    public function down(): void
    {
        Schema::table('transport_vehicle_fuels', function (Blueprint $table) {
            $table->dropIndex('tvf_vendor_status_idx');
            $table->dropForeign('tvf_settlement_fk');
            $table->dropForeign('tvf_vendor_fk');
            $table->dropColumn([
                'transport_fuel_vendor_id',
                'payment_status',
                'transport_fuel_vendor_settlement_id',
                'settled_at',
            ]);
        });
        Schema::dropIfExists('transport_fuel_vendor_settlements');
        Schema::dropIfExists('transport_fuel_vendors');
    }
};
