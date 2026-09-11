<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_fee_one_time_overrides', function (Blueprint $table) {
            $table->dropUnique('student_fee_onetime_override_unique');
            $table->unsignedBigInteger('fee_type_id')->nullable()->change();
            $table->string('charge_name')->nullable()->after('fee_type_id');

            $table->index(['institution_id', 'user_id', 'fee_type_id'], 'idx_fee_onetime_user_feetype');
            $table->index(['institution_id', 'user_id', 'charge_name'], 'idx_fee_onetime_user_chargename');
        });
    }

    public function down(): void
    {
        Schema::table('student_fee_one_time_overrides', function (Blueprint $table) {
            $table->dropIndex('idx_fee_onetime_user_feetype');
            $table->dropIndex('idx_fee_onetime_user_chargename');
            $table->dropColumn('charge_name');
            $table->unsignedBigInteger('fee_type_id')->nullable(false)->change();
            $table->unique(['institution_id', 'user_id', 'fee_type_id'], 'student_fee_onetime_override_unique');
        });
    }
};
