<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $tables = [
            'lms_assignments',
            'lms_tests',
            'lms_live_sessions',
            'lms_recordings',
            'lms_announcements',
            'lms_materials',
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->foreignId('class_subject_allocation_id')
                        ->nullable()
                        ->after('lms_class_id')
                        ->constrained('class_subject_allocations')
                        ->nullOnDelete();
                });
            }
        }

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $blueprint) {
                    $blueprint->index(['class_subject_allocation_id']);
                });
            }
        }
    }

    public function down(): void
    {
        $tables = [
            'lms_assignments',
            'lms_tests',
            'lms_live_sessions',
            'lms_recordings',
            'lms_announcements',
            'lms_materials',
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $blueprint) {
                    $blueprint->dropForeign(['class_subject_allocation_id']);
                    $blueprint->dropIndex(['class_subject_allocation_id']);
                });
            }
        }
    }
};
