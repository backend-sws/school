<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('fee_payments', function (Blueprint $table) {
            $table->string('for_month', 10)->nullable()->index();
            $table->string('receipt_no', 50)->nullable()->index();
            $table->jsonb('ledger_snapshot')->nullable();
            $table->string('payable_entity_type', 100)->nullable()->index();
            $table->unsignedBigInteger('payable_entity_id')->nullable()->index();
        });
    }

    public function down(): void
    {
        Schema::table('fee_payments', function (Blueprint $table) {
            $table->dropIndex(['for_month']);
            $table->dropIndex(['receipt_no']);
            $table->dropIndex(['payable_entity_type']);
            $table->dropIndex(['payable_entity_id']);
            $table->dropColumn(['for_month', 'receipt_no', 'ledger_snapshot', 'payable_entity_type', 'payable_entity_id']);
        });
    }
};
