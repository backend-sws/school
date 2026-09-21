<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Inventory Vendors Master Table
        Schema::create('inventory_vendors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('name', 200);
            $table->string('contact_name', 150)->nullable();
            $table->string('contact_phone', 50)->nullable();
            $table->string('contact_email', 100)->nullable();
            $table->text('location')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('pincode', 20)->nullable();
            $table->string('gstin', 50)->nullable();
            $table->string('pan', 50)->nullable();
            $table->string('bank_name', 150)->nullable();
            $table->string('bank_account_no', 100)->nullable();
            $table->string('bank_ifsc', 50)->nullable();
            $table->decimal('credit_limit', 14, 2)->default(0);
            $table->string('payment_terms', 50)->default('on-demand');
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['institution_id', 'is_active']);
            $table->index(['name']);
        });

        // 2. Inventory Vendor Settlements Table (Payment to vendors for credit purchases)
        Schema::create('inventory_vendor_settlements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->foreignId('inventory_vendor_id')->constrained('inventory_vendors', 'id', 'fk_ivs_vendor_id')->cascadeOnDelete();
            $table->date('settlement_date');
            $table->decimal('amount', 14, 2);
            $table->string('payment_mode', 50)->default('bank_transfer'); // bank_transfer, upi, cheque, cash
            $table->string('reference_number', 100)->nullable(); // UTR, Cheque No, Transaction ID
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->unsignedBigInteger('expense_id')->nullable();
            $table->foreign('expense_id', 'fk_ivs_expense_id')->references('id')->on('expenses')->nullOnDelete();
            $table->timestamps();

            $table->index(['institution_id', 'inventory_vendor_id'], 'idx_ivs_inst_vendor');
            $table->index(['settlement_date']);
        });

        // 3. Alter inventory_purchases table to support credit & vendor tracking
        Schema::table('inventory_purchases', function (Blueprint $table) {
            $table->foreignId('inventory_vendor_id')->nullable()->after('supplier_name')->constrained('inventory_vendors', 'id', 'fk_ip_vendor_id')->nullOnDelete();
            $table->string('payment_status', 30)->default('paid')->after('payment_mode'); // paid, credit, settled
            $table->timestamp('settled_at')->nullable()->after('payment_status');
            $table->foreignId('inventory_vendor_settlement_id')->nullable()->after('settled_at')->constrained('inventory_vendor_settlements', 'id', 'fk_ip_settlement_id')->nullOnDelete();

            $table->index(['payment_status']);
            $table->index(['inventory_vendor_id']);
        });
    }

    public function down(): void
    {
        Schema::table('inventory_purchases', function (Blueprint $table) {
            $table->dropForeign('fk_ip_settlement_id');
            $table->dropForeign('fk_ip_vendor_id');
            $table->dropColumn([
                'inventory_vendor_settlement_id',
                'settled_at',
                'payment_status',
                'inventory_vendor_id',
            ]);
        });

        Schema::dropIfExists('inventory_vendor_settlements');
        Schema::dropIfExists('inventory_vendors');
    }
};
