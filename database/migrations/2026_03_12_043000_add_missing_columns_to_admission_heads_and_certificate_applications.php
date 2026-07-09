<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('admission_heads', function (Blueprint $table) {
            $table->boolean('allow_subject_paper_selection')->default(false);
            $table->boolean('has_application_fees')->default(false);
            $table->decimal('application_fees', 10, 2)->default(0);
            $table->decimal('total_admission_fees', 10, 2)->default(0);
        });

        Schema::table('certificate_applications', function (Blueprint $table) {
            $table->timestamp('updated_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('admission_heads', function (Blueprint $table) {
            $table->dropColumn([
                'allow_subject_paper_selection',
                'has_application_fees',
                'application_fees',
                'total_admission_fees',
            ]);
        });

        Schema::table('certificate_applications', function (Blueprint $table) {
            $table->dropColumn('updated_at');
        });
    }
};
