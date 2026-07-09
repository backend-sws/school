<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('admission_applications', function (Blueprint $table) {
            $table->string('religion', 50)->nullable()->after('category');
            $table->string('nationality', 50)->nullable()->after('religion');
            $table->string('previous_school_name', 200)->nullable()->after('previous_roll_no');
            $table->boolean('has_tc')->default(false)->after('previous_school_name');
            $table->string('photo_url', 500)->nullable()->after('has_tc');
            $table->boolean('hostel_required')->default(false)->after('photo_url');
            $table->date('admission_date')->nullable()->after('submitted_at');
            $table->string('medical_condition', 200)->nullable()->after('place');
            $table->string('disability', 200)->nullable()->after('medical_condition');
            $table->string('allergy', 200)->nullable()->after('disability');
            $table->jsonb('guardian_snapshot')->nullable()->after('address_snapshot');
        });
    }

    public function down(): void
    {
        Schema::table('admission_applications', function (Blueprint $table) {
            $table->dropColumn([
                'religion',
                'nationality',
                'previous_school_name',
                'has_tc',
                'photo_url',
                'hostel_required',
                'admission_date',
                'medical_condition',
                'disability',
                'allergy',
                'guardian_snapshot',
            ]);
        });
    }
};
