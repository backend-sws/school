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
            $table->string('for_month', 10)->nullable()->after('fee_head_id')->index();
            $table->string('receipt_no', 50)->nullable()->after('transaction_id')->index();
            $table->jsonb('ledger_snapshot')->nullable()->after('remarks');
            $table->string('payable_entity_type', 100)->nullable()->after('ledger_snapshot')->index();
            $table->unsignedBigInteger('payable_entity_id')->nullable()->after('payable_entity_type')->index();
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
