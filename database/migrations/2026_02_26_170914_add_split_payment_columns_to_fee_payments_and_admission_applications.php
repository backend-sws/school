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
            $table->decimal('cash_amount', 10, 2)->nullable();
            $table->decimal('online_amount', 10, 2)->nullable();
            $table->string('online_transaction_id', 100)->nullable();
        });

        Schema::table('admission_applications', function (Blueprint $table) {
            $table->decimal('cash_amount', 10, 2)->nullable();
            $table->decimal('online_amount', 10, 2)->nullable();
            $table->string('online_transaction_id', 100)->nullable();
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
