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
        Schema::create('student_leave_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained('institutions')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('student_profile_id')->nullable()->constrained('student_profiles')->nullOnDelete();
            $table->foreignId('lms_class_id')->constrained('lms_classes')->cascadeOnDelete();
            $table->foreignId('session_id')->constrained('academic_sessions')->cascadeOnDelete();
            
            $table->enum('leave_type', ['medical', 'casual', 'emergency', 'duty', 'special', 'other'])->default('casual');
            $table->date('from_date');
            $table->date('to_date');
            $table->unsignedInteger('total_days')->default(1);
            $table->text('reason');
            
            // Physical scan / document copy
            $table->string('document_path', 500)->nullable()->comment('Relative storage path of uploaded physical leave copy/PDF');
            $table->string('document_original_name', 255)->nullable();
            $table->string('document_mime_type', 100)->nullable();
            $table->unsignedBigInteger('document_size')->nullable();
            
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('approved');
            $table->boolean('auto_marked_attendance')->default(false);
            
            $table->foreignId('applied_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->text('admin_remarks')->nullable();
            
            $table->timestamps();

            // Indexes for lightning fast queries
            $table->index(['institution_id', 'user_id'], 'idx_sla_institution_user');
            $table->index(['lms_class_id', 'session_id'], 'idx_sla_class_session');
            $table->index(['user_id', 'from_date', 'to_date'], 'idx_sla_user_dates');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_leave_applications');
    }
};
