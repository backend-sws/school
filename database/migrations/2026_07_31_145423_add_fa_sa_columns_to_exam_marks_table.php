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
        Schema::table('exam_marks', function (Blueprint $table) {
            $table->decimal('fa1', 8, 2)->nullable()->after('marks_obtained');
            $table->decimal('fa2', 8, 2)->nullable()->after('fa1');
            $table->decimal('sa1', 8, 2)->nullable()->after('fa2');
            $table->decimal('fa3', 8, 2)->nullable()->after('sa1');
            $table->decimal('fa4', 8, 2)->nullable()->after('fa3');
            $table->decimal('sa2', 8, 2)->nullable()->after('fa4');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_marks', function (Blueprint $table) {
            $table->dropColumn(['fa1', 'fa2', 'sa1', 'fa3', 'fa4', 'sa2']);
        });
    }
};
