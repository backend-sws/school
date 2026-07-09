<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fee_payments', function (Blueprint $table) {
            $table->index(['user_id', 'payment_status', 'for_month'], 'fee_payments_user_status_month_idx');
            $table->index(['institution_id', 'user_id', 'for_month'], 'fee_payments_inst_user_month_idx');
        });
    }

    public function down(): void
    {
        Schema::table('fee_payments', function (Blueprint $table) {
            $table->dropIndex('fee_payments_user_status_month_idx');
            $table->dropIndex('fee_payments_inst_user_month_idx');
        });
    }
};
