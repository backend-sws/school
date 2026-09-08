<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('hostel_allocations', function (Blueprint $table) {
            $table->foreignId('hostel_mess_plan_id')
                ->nullable()
                ->after('hostel_bed_id')
                ->constrained('hostel_mess_plans')
                ->nullOnDelete();

            $table->decimal('room_monthly_amount', 10, 2)->default(0)->after('monthly_amount');
            $table->decimal('mess_monthly_amount', 10, 2)->default(0)->after('room_monthly_amount');

            $table->index(['hostel_mess_plan_id']);
        });

        // Backfill existing allocations: room_monthly_amount = monthly_amount, mess_monthly_amount = 0
        DB::table('hostel_allocations')->update([
            'room_monthly_amount' => DB::raw('COALESCE(monthly_amount, 0)'),
            'mess_monthly_amount' => 0.00,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hostel_allocations', function (Blueprint $table) {
            $table->dropForeign(['hostel_mess_plan_id']);
            $table->dropIndex(['hostel_mess_plan_id']);
            $table->dropColumn(['hostel_mess_plan_id', 'room_monthly_amount', 'mess_monthly_amount']);
        });
    }
};
