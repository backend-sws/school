<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('institution_id')->constrained();
            $table->foreignId('stream_id')->constrained();
            $table->foreignId('session_id')->constrained('academic_sessions');

            $table->string('reg_no', 50)->unique()->nullable();
            $table->string('app_no', 50)->nullable();
            $table->string('abc_id', 50)->nullable();
            $table->string('roll_no', 50)->nullable();
            $table->string('university_roll_no', 50)->nullable();
            $table->string('university_confidential_no', 50)->nullable();
            $table->date('admission_date')->nullable();
            $table->integer('current_semester')->default(1);

            $table->string('father_name', 150)->nullable();
            $table->string('mother_name', 150)->nullable();
            $table->date('dob')->nullable();
            $table->string('gender', 20)->nullable();
            $table->string('category', 30)->nullable();
            $table->string('religion', 50)->nullable();
            $table->string('blood_group', 10)->nullable();
            $table->string('nationality', 50)->nullable();
            $table->string('marital_status', 20)->nullable();
            $table->text('signature_url')->nullable();

            $table->boolean('verified')->default(false);
            $table->foreignId('verified_by')->nullable()->constrained('users');
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['institution_id']);
            $table->index(['stream_id']);
        });

        Schema::create('admission_heads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained();
            $table->string('title', 200);
            $table->string('slug', 200)->nullable();
            $table->text('instructions')->nullable();
            $table->string('course_for', 20);
            $table->foreignId('main_stream_id')->constrained();
            $table->foreignId('stream_id')->constrained();
            $table->foreignId('major_subject_id')->nullable()->constrained('subjects')->nullOnDelete();
            $table->foreignId('session_id')->constrained('academic_sessions');
            $table->integer('semester')->nullable();

            $table->string('board_criteria', 50)->default('all');
            $table->string('gender_criteria', 50)->default('all');
            $table->jsonb('category_criteria')->default('["all"]');

            $table->date('last_date')->nullable();
            $table->string('payment_gateway', 100)->nullable();
            $table->smallInteger('status')->default(1);
            $table->boolean('is_enabled')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->timestamps();

            $table->index(['institution_id']);
            $table->index(['session_id']);
        });

        Schema::create('fee_structures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admission_head_id')->constrained()->cascadeOnDelete();
            $table->string('fee_type', 100);
            $table->decimal('amount', 10, 2);
            $table->string('category', 50)->default('all');
            $table->string('gender', 20)->default('all');
        });

        Schema::create('admission_applications', function (Blueprint $table) {
            $table->id();
            $table->string('application_id', 50)->unique();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('admission_head_id')->constrained();
            $table->foreignId('institution_id')->constrained();

            $table->string('application_type', 30)->default('new');
            $table->foreignId('session_id')->nullable()->constrained('academic_sessions');
            $table->string('session_name', 100)->nullable();
            $table->integer('semester')->nullable();

            $table->string('applicant_name', 150);
            $table->string('father_name', 150)->nullable();
            $table->string('mother_name', 150)->nullable();
            $table->date('dob')->nullable();
            $table->string('gender', 20)->nullable();
            $table->string('category', 30)->nullable();
            $table->string('blood_group', 10)->nullable();
            $table->string('mobile', 15)->nullable();
            $table->string('email', 150)->nullable();
            $table->string('abc_id', 100)->nullable();
            $table->string('aadhaar_no', 20)->nullable();
            $table->string('place', 150)->nullable();
            $table->string('previous_roll_no', 50)->nullable();
            $table->jsonb('address_snapshot')->nullable();

            $table->jsonb('subject_preferences')->nullable();
            $table->string('previous_board', 100)->nullable();
            $table->decimal('previous_marks', 5, 2)->nullable();

            $table->decimal('amount', 10, 2)->nullable();
            $table->string('payment_status', 20)->default('pending');
            $table->string('transaction_id', 100)->nullable();
            $table->timestamp('payment_date')->nullable();

            $table->string('process_status', 20)->default('pending');
            $table->text('remarks')->nullable();
            $table->text('detailed_remarks')->nullable();
            $table->jsonb('verification_data')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users');
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['process_status']);
            $table->index(['payment_status']);
        });

        Schema::create('admission_head_papers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('admission_head_id')->constrained('admission_heads')->cascadeOnDelete();
            $table->foreignId('subject_category_id')->constrained('subject_categories')->cascadeOnDelete();
            $table->integer('paper_limit')->default(1);
            $table->integer('sort_order')->default(1);
            $table->boolean('is_compulsory')->default(false);
            $table->timestamps();
            $table->index(['admission_head_id', 'subject_category_id']);
        });

        Schema::create('admission_application_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admission_application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['admission_application_id', 'subject_category_id', 'subject_id']);
        });

        Schema::create('admission_verification_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained();
            $table->foreignId('admission_application_id')->constrained('admission_applications')->cascadeOnDelete();
            $table->string('field_key', 100);
            $table->string('field_type', 50)->nullable();
            $table->text('field_value')->nullable();
            $table->text('file_url')->nullable();
            $table->timestamps();

            $table->unique(['admission_application_id', 'field_key']);
        });

        Schema::create('fee_heads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained();
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->foreignId('main_stream_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('stream_id')->nullable()->constrained();
            $table->foreignId('session_id')->nullable()->constrained('academic_sessions');
            $table->integer('semester')->nullable();
            $table->jsonb('subjects_criteria')->nullable();
            $table->jsonb('gender_criteria')->nullable();
            $table->jsonb('category_criteria')->nullable();
            $table->boolean('allow_custom_fee')->default(false);
            $table->decimal('min_allowed_fee', 10, 2)->nullable();
            $table->decimal('fixed_total_amount', 10, 2)->nullable();
            $table->string('payment_gateway', 100)->nullable();
            $table->date('last_date')->nullable();
            $table->decimal('amount', 10, 2)->default(0);
            $table->date('due_date')->nullable();
            $table->decimal('late_fee', 10, 2)->default(0);
            $table->smallInteger('status')->default(1);
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('fee_particulars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained();
            $table->string('name', 200);
            $table->string('type', 50)->default('institution');
            $table->timestamps();
        });

        Schema::create('fee_head_structures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fee_head_id')->constrained()->cascadeOnDelete();
            $table->foreignId('fee_particular_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 10, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('fee_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('payment_id', 50)->unique();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('fee_head_id')->constrained();
            $table->decimal('amount', 10, 2);
            $table->decimal('late_fee_applied', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2);
            $table->string('payment_status', 20)->default('pending');
            $table->string('process_status', 30)->nullable();
            $table->text('remarks')->nullable();
            $table->string('transaction_id', 100)->nullable();
            $table->string('payment_mode', 50)->nullable();
            $table->timestamp('payment_date')->nullable();
            $table->foreignId('collected_by')->nullable()->constrained('users');
            $table->timestamp('created_at')->useCurrent();

            $table->index(['user_id']);
            $table->index(['payment_status']);
        });

        Schema::create('certificate_heads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained();
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->string('slug', 200)->nullable();
            $table->decimal('fee_amount', 10, 2)->default(0);
            $table->integer('processing_days')->default(7);
            $table->text('requirements')->nullable();
            $table->string('template', 50)->nullable();
            $table->smallInteger('status')->default(1);
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('certificate_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('application_id', 50)->unique();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('certificate_head_id')->constrained();
            $table->text('purpose')->nullable();
            $table->jsonb('form_data')->nullable();
            $table->text('document_url')->nullable();
            $table->decimal('amount', 10, 2)->nullable();
            $table->string('payment_status', 20)->default('pending');
            $table->string('transaction_id', 100)->nullable();
            $table->string('process_status', 30)->default('pending');
            $table->foreignId('issued_by')->nullable()->constrained('users');
            $table->text('remarks')->nullable();
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamp('completed_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificate_applications');
        Schema::dropIfExists('certificate_heads');
        Schema::dropIfExists('fee_payments');
        Schema::dropIfExists('fee_head_structures');
        Schema::dropIfExists('fee_particulars');
        Schema::dropIfExists('fee_heads');
        Schema::dropIfExists('admission_verification_data');
        Schema::dropIfExists('admission_application_subjects');
        Schema::dropIfExists('admission_head_papers');
        Schema::dropIfExists('admission_applications');
        Schema::dropIfExists('fee_structures');
        Schema::dropIfExists('admission_heads');
        Schema::dropIfExists('student_profiles');
    }
};
