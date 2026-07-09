<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fee_payments', function (Blueprint $table) {
            $table->string('cheque_number', 50)->nullable()->after('online_transaction_id');
            $table->string('bank_name', 100)->nullable()->after('cheque_number');
        });
    }

    public function down(): void
    {
        Schema::table('fee_payments', function (Blueprint $table) {
            $table->dropColumn(['cheque_number', 'bank_name']);
        });
    }
};
