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
        Schema::table('student_leave_applications', function (Blueprint $table) {
            $table->string('document_category', 50)->default('leave')->after('session_id');
            $table->string('document_title', 255)->nullable()->after('document_category');
            $table->string('document_disk', 50)->nullable()->default('r2')->after('document_size');
            $table->string('leave_type', 100)->default('casual')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_leave_applications', function (Blueprint $table) {
            $table->dropColumn(['document_category', 'document_title', 'document_disk']);
        });
    }
};
