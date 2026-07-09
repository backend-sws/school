<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained('institutions')->cascadeOnDelete();
            $table->foreignId('lms_class_id')->constrained('lms_classes')->cascadeOnDelete();
            $table->foreignId('class_subject_allocation_id')->nullable()->constrained('class_subject_allocations')->nullOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('date');
            $table->string('status', 20);
            $table->foreignId('marked_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('remarks', 255)->nullable();
            $table->timestamps();

            $table->index(['institution_id', 'date']);
            $table->index(['lms_class_id', 'date']);
            $table->index(['user_id', 'date']);
            $table->index(['lms_class_id', 'date', 'class_subject_allocation_id'], 'att_rec_cls_date_sub_idx');
            // Subject-level: unique (lms_class_id, user_id, date, class_subject_allocation_id) is enforced in app for class_subject_allocation_id NOT NULL.
            // Class-level: at most one row per (lms_class_id, user_id, date) when class_subject_allocation_id IS NULL is enforced in application code.
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
    }
};
