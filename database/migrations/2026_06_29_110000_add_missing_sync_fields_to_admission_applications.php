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
        Schema::table('admission_applications', function (Blueprint $table) {
            $table->string('caste', 50)->nullable();
            $table->string('apaar_id', 50)->nullable();
            $table->string('father_mobile', 15)->nullable();
            $table->string('father_qualification', 100)->nullable();
            $table->string('father_occupation', 100)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('admission_applications', function (Blueprint $table) {
            $table->dropColumn([
                'caste',
                'apaar_id',
                'father_mobile',
                'father_qualification',
                'father_occupation'
            ]);
        });
    }
};
