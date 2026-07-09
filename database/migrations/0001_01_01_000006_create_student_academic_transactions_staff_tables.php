<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('student_academic_info', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('stream_id')->constrained();
            $table->foreignId('session_id')->constrained('academic_sessions');
            $table->integer('semester');
            $table->jsonb('subjects')->nullable();
            $table->decimal('sgpa', 5, 2)->nullable();
            $table->decimal('cgpa', 5, 2)->nullable();
            $table->string('result_status', 20)->nullable();
            $table->timestamps();

            $table->index(['institution_id', 'user_id']);
        });

        Schema::create('student_previous_exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('exam_name', 150);
            $table->string('board_university', 150)->nullable();
            $table->integer('passing_year')->nullable();
            $table->decimal('marks_percentage', 5, 2)->nullable();
            $table->string('division', 50)->nullable();
            $table->timestamps();

            $table->index(['institution_id', 'user_id']);
        });

        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_id', 100)->unique();
            $table->foreignId('user_id')->constrained();
            $table->string('type', 50);
            $table->string('payable_type', 100)->nullable();
            $table->unsignedBigInteger('payable_id')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('payment_mode', 50)->nullable();
            $table->string('status', 20)->default('pending');
            $table->jsonb('meta')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['user_id']);
            $table->index(['payable_type', 'payable_id']);
        });

        Schema::create('staff_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('institution_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('category')->nullable();
            $table->string('employee_id', 50)->nullable();
            $table->string('designation', 100)->nullable();
            $table->date('joining_date')->nullable();
            $table->string('qualification', 200)->nullable();
            $table->text('bio')->nullable();
            $table->string('photo_url')->nullable();
            $table->smallInteger('status')->default(1);
            $table->timestamps();

            $table->unique(['user_id', 'institution_id']);
            $table->index(['institution_id']);
        });

        Schema::create('staff_profile_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('staff_profile_id')->constrained()->cascadeOnDelete();
            $table->string('link_type', 50);
            $table->unsignedBigInteger('link_id');
            $table->timestamps();

            $table->index(['staff_profile_id', 'link_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_profile_links');
        Schema::dropIfExists('staff_profiles');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('student_previous_exams');
        Schema::dropIfExists('student_academic_info');
    }
};
