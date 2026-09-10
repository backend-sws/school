<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('staff_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('staff_profiles', 'leaving_date')) {
                $table->date('leaving_date')->nullable()->after('joining_date');
            }
            if (!Schema::hasColumn('staff_profiles', 'leaving_reason')) {
                $table->string('leaving_reason', 255)->nullable()->after('leaving_date');
            }
        });
    }

    public function down(): void
    {
        Schema::table('staff_profiles', function (Blueprint $table) {
            $table->dropColumn(['leaving_date', 'leaving_reason']);
        });
    }
};
