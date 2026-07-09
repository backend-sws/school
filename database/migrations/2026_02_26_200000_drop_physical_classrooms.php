<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('class_subject_allocations', function (Blueprint $table) {
            $table->dropConstrainedForeignId('classroom_id');
        });
        Schema::table('lms_classes', function (Blueprint $table) {
            $table->dropConstrainedForeignId('classroom_id');
        });
        Schema::dropIfExists('classrooms');
    }

    public function down(): void
    {
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('code', 50)->nullable();
            $table->unsignedInteger('capacity')->nullable();
            $table->unsignedTinyInteger('status')->default(1);
            $table->timestamps();
        });
        Schema::table('lms_classes', function (Blueprint $table) {
            $table->foreignId('classroom_id')->nullable()->after('session_id')->constrained('classrooms')->nullOnDelete();
        });
        Schema::table('class_subject_allocations', function (Blueprint $table) {
            $table->foreignId('classroom_id')->nullable()->after('session_id')->constrained('classrooms')->nullOnDelete();
        });
    }
};
