<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('admission_applications', function (Blueprint $table) {
            $table->string('religion', 50)->nullable();
            $table->string('nationality', 50)->nullable();
            $table->string('previous_school_name', 200)->nullable();
            $table->boolean('has_tc')->default(false);
            $table->string('photo_url', 500)->nullable();
            $table->boolean('hostel_required')->default(false);
            $table->date('admission_date')->nullable();
            $table->string('medical_condition', 200)->nullable();
            $table->string('disability', 200)->nullable();
            $table->string('allergy', 200)->nullable();
            $table->jsonb('guardian_snapshot')->nullable();
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
