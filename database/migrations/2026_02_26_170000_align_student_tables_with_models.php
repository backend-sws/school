<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add columns to student_addresses, student_academic_info, student_documents, and student_previous_exams
     * so they match the Eloquent models and StudentSeeder can insert data.
     */
    public function up(): void
    {
        // student_addresses: model expects student_profile_id, address_type, village_mohalla, post_office, police_station, district
        if (Schema::hasTable('student_addresses')) {
            Schema::table('student_addresses', function (Blueprint $table) {
                if (! Schema::hasColumn('student_addresses', 'student_profile_id')) {
                    $table->foreignId('student_profile_id')->nullable()->constrained('student_profiles')->cascadeOnDelete();
                }
                if (! Schema::hasColumn('student_addresses', 'address_type')) {
                    $table->string('address_type', 30)->nullable();
                }
                if (! Schema::hasColumn('student_addresses', 'village_mohalla')) {
                    $table->string('village_mohalla', 200)->nullable();
                }
                if (! Schema::hasColumn('student_addresses', 'post_office')) {
                    $table->string('post_office', 100)->nullable();
                }
                if (! Schema::hasColumn('student_addresses', 'police_station')) {
                    $table->string('police_station', 100)->nullable();
                }
                if (! Schema::hasColumn('student_addresses', 'district')) {
                    $table->string('district', 100)->nullable();
                }
            });
        }

        // student_academic_info: model expects institute_name, session, class, section, roll_number
        if (Schema::hasTable('student_academic_info')) {
            Schema::table('student_academic_info', function (Blueprint $table) {
                if (! Schema::hasColumn('student_academic_info', 'institute_name')) {
                    $table->string('institute_name', 200)->nullable();
                }
                if (! Schema::hasColumn('student_academic_info', 'session')) {
                    $table->string('session', 50)->nullable();
                }
                if (! Schema::hasColumn('student_academic_info', 'class')) {
                    $table->string('class', 50)->nullable();
                }
                if (! Schema::hasColumn('student_academic_info', 'section')) {
                    $table->string('section', 20)->nullable();
                }
                if (! Schema::hasColumn('student_academic_info', 'roll_number')) {
                    $table->string('roll_number', 50)->nullable();
                }
            });
        }

        // student_documents: model expects doc_type, doc_path, status, reject_remark
        if (Schema::hasTable('student_documents')) {
            Schema::table('student_documents', function (Blueprint $table) {
                if (! Schema::hasColumn('student_documents', 'doc_type')) {
                    $table->string('doc_type', 100)->nullable();
                }
                if (! Schema::hasColumn('student_documents', 'doc_path')) {
                    $table->text('doc_path')->nullable();
                }
                if (! Schema::hasColumn('student_documents', 'status')) {
                    $table->string('status', 30)->default('pending')->nullable();
                }
                if (! Schema::hasColumn('student_documents', 'reject_remark')) {
                    $table->text('reject_remark')->nullable();
                }
            });
        }

        // student_previous_exams: model expects exam_type, subjects, roll_no, total_marks, marks_obtained, percentage, document_url
        if (Schema::hasTable('student_previous_exams')) {
            Schema::table('student_previous_exams', function (Blueprint $table) {
                if (! Schema::hasColumn('student_previous_exams', 'exam_type')) {
                    $table->string('exam_type', 50)->nullable();
                }
                if (! Schema::hasColumn('student_previous_exams', 'subjects')) {
                    $table->string('subjects', 100)->nullable();
                }
                if (! Schema::hasColumn('student_previous_exams', 'roll_no')) {
                    $table->string('roll_no', 50)->nullable();
                }
                if (! Schema::hasColumn('student_previous_exams', 'total_marks')) {
                    $table->decimal('total_marks', 10, 2)->nullable();
                }
                if (! Schema::hasColumn('student_previous_exams', 'marks_obtained')) {
                    $table->decimal('marks_obtained', 10, 2)->nullable();
                }
                if (! Schema::hasColumn('student_previous_exams', 'percentage')) {
                    $table->decimal('percentage', 5, 2)->nullable();
                }
                if (! Schema::hasColumn('student_previous_exams', 'document_url')) {
                    $table->text('document_url')->nullable();
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('student_addresses')) {
            Schema::table('student_addresses', function (Blueprint $table) {
                $cols = ['student_profile_id', 'address_type', 'village_mohalla', 'post_office', 'police_station', 'district'];
                foreach ($cols as $col) {
                    if (Schema::hasColumn('student_addresses', $col)) {
                        if ($col === 'student_profile_id') {
                            $table->dropForeign(['student_profile_id']);
                        }
                        $table->dropColumn($col);
                    }
                }
            });
        }

        if (Schema::hasTable('student_academic_info')) {
            Schema::table('student_academic_info', function (Blueprint $table) {
                $cols = ['institute_name', 'session', 'class', 'section', 'roll_number'];
                foreach ($cols as $col) {
                    if (Schema::hasColumn('student_academic_info', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }

        if (Schema::hasTable('student_documents')) {
            Schema::table('student_documents', function (Blueprint $table) {
                $cols = ['doc_type', 'doc_path', 'status', 'reject_remark'];
                foreach ($cols as $col) {
                    if (Schema::hasColumn('student_documents', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }

        if (Schema::hasTable('student_previous_exams')) {
            Schema::table('student_previous_exams', function (Blueprint $table) {
                $cols = ['exam_type', 'subjects', 'roll_no', 'total_marks', 'marks_obtained', 'percentage', 'document_url'];
                foreach ($cols as $col) {
                    if (Schema::hasColumn('student_previous_exams', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }
    }
};
