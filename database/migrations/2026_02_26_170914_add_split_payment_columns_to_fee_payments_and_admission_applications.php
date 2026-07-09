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
            $table->decimal('cash_amount', 10, 2)->nullable()->after('total_amount');
            $table->decimal('online_amount', 10, 2)->nullable()->after('cash_amount');
            $table->string('online_transaction_id', 100)->nullable()->after('online_amount');
        });

        Schema::table('admission_applications', function (Blueprint $table) {
            $table->decimal('cash_amount', 10, 2)->nullable()->after('amount');
            $table->decimal('online_amount', 10, 2)->nullable()->after('cash_amount');
            $table->string('online_transaction_id', 100)->nullable()->after('online_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fee_payments', function (Blueprint $table) {
            $table->dropColumn(['cash_amount', 'online_amount', 'online_transaction_id']);
        });

        Schema::table('admission_applications', function (Blueprint $table) {
            $table->dropColumn(['cash_amount', 'online_amount', 'online_transaction_id']);
        });
    }
};
