<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('staff_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('staff_profiles', 'category')) {
                $table->unsignedBigInteger('category')->nullable()->after('institution_id');
            }
            if (!Schema::hasColumn('staff_profiles', 'joining_date')) {
                $table->date('joining_date')->nullable()->after('designation');
            }
        });
    }

    public function down(): void
    {
        Schema::table('staff_profiles', function (Blueprint $table) {
            $table->dropColumn(['category', 'joining_date']);
        });
    }
};
