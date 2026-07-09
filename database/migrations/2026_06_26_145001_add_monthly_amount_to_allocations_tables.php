<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transport_assignments', function (Blueprint $table) {
            $table->decimal('monthly_amount', 10, 2)->nullable()->after('transport_stop_id');
        });

        Schema::table('hostel_allocations', function (Blueprint $table) {
            $table->decimal('monthly_amount', 10, 2)->nullable()->after('hostel_bed_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transport_assignments', function (Blueprint $table) {
            $table->dropColumn('monthly_amount');
        });

        Schema::table('hostel_allocations', function (Blueprint $table) {
            $table->dropColumn('monthly_amount');
        });
    }
};
