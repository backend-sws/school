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
        Schema::table('lms_assignment_submissions', function (Blueprint $table) {
            if (!Schema::hasColumn('lms_assignment_submissions', 'notes')) {
                $table->text('notes')->nullable()->after('feedback');
            }
            if (!Schema::hasColumn('lms_assignment_submissions', 'attempt_number')) {
                $table->unsignedInteger('attempt_number')->default(1)->after('status');
            }
            if (!Schema::hasColumn('lms_assignment_submissions', 'submission_history')) {
                $table->json('submission_history')->nullable()->after('attempt_number');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lms_assignment_submissions', function (Blueprint $table) {
            $columns = [];
            if (Schema::hasColumn('lms_assignment_submissions', 'notes')) {
                $columns[] = 'notes';
            }
            if (Schema::hasColumn('lms_assignment_submissions', 'attempt_number')) {
                $columns[] = 'attempt_number';
            }
            if (Schema::hasColumn('lms_assignment_submissions', 'submission_history')) {
                $columns[] = 'submission_history';
            }
            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};
