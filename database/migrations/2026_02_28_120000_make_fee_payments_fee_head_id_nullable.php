<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Make fee_head_id nullable so ledger/collect can create payments without a fee head
     * (universal design: class-based expected vs head-based payments).
     */
    public function up(): void
    {
        Schema::table('fee_payments', function (Blueprint $table) {
            $table->dropForeign(['fee_head_id']);
        });
        Schema::table('fee_payments', function (Blueprint $table) {
            $table->unsignedBigInteger('fee_head_id')->nullable()->change();
        });
        Schema::table('fee_payments', function (Blueprint $table) {
            $table->foreign('fee_head_id')->references('id')->on('fee_heads')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('fee_payments', function (Blueprint $table) {
            $table->dropForeign(['fee_head_id']);
        });
        Schema::table('fee_payments', function (Blueprint $table) {
            $table->unsignedBigInteger('fee_head_id')->nullable(false)->change();
        });
        Schema::table('fee_payments', function (Blueprint $table) {
            $table->foreign('fee_head_id')->references('id')->on('fee_heads')->cascadeOnDelete();
        });
    }
};
