<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('staff_profiles', function (Blueprint $table) {
            $table->string('aadhaar_no', 12)->nullable()->after('employee_id');
            $table->string('professional_qualification', 100)->nullable()->after('qualification');
            $table->string('appointment_type', 30)->nullable()->after('professional_qualification');
            $table->string('gender', 20)->nullable()->after('designation');
            $table->date('dob')->nullable()->after('gender');
            $table->boolean('trained_status')->default(false)->after('appointment_type');
        });
    }

    public function down(): void
    {
        Schema::table('staff_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'aadhaar_no',
                'professional_qualification',
                'appointment_type',
                'gender',
                'dob',
                'trained_status',
            ]);
        });
    }
};
