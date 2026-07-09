<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add columns to student_profiles that the model and API expect but the original migration did not include.
     */
    public function up(): void
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->string('father_mobile', 20)->nullable()->after('father_name');
            $table->string('father_qualification', 100)->nullable()->after('father_mobile');
            $table->string('father_occupation', 100)->nullable()->after('father_qualification');
            $table->string('mobile', 20)->nullable()->after('mother_name');
            $table->string('aadhar_no', 20)->nullable()->after('mobile');
            $table->text('address')->nullable()->after('current_semester');
            $table->string('city', 100)->nullable()->after('address');
            $table->string('state', 100)->nullable()->after('city');
            $table->string('pincode', 10)->nullable()->after('state');
            $table->string('caste', 50)->nullable()->after('religion');
            $table->foreignId('subject_id')->nullable()->after('session_id')->constrained('subjects')->nullOnDelete();
            $table->boolean('is_differently_abled')->default(false)->nullable()->after('marital_status');
            if (! Schema::hasColumn('student_profiles', 'abc_no')) {
                $table->string('abc_no', 50)->nullable()->after('aadhar_no');
            }
        });
    }

    public function down(): void
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            if (Schema::hasColumn('student_profiles', 'subject_id')) {
                $table->dropForeign(['subject_id']);
            }
            $cols = [
                'father_mobile', 'father_qualification', 'father_occupation',
                'mobile', 'aadhar_no', 'address', 'city', 'state', 'pincode',
                'caste', 'subject_id', 'is_differently_abled',
            ];
            foreach ($cols as $col) {
                if (Schema::hasColumn('student_profiles', $col)) {
                    $table->dropColumn($col);
                }
            }
            if (Schema::hasColumn('student_profiles', 'abc_no')) {
                $table->dropColumn('abc_no');
            }
        });
    }
};
