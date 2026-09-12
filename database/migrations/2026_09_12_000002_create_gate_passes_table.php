<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gate_passes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('institution_id')->nullable()->index();
            $table->string('pass_number', 30)->unique();
            $table->string('visitor_name', 150);
            $table->string('phone', 20)->index();
            $table->string('email', 100)->nullable();
            $table->string('address', 255)->nullable();
            $table->string('id_proof_type', 50)->default('aadhaar'); // aadhaar, driving_license, voter_id, pan, parent_id, other
            $table->string('id_proof_number', 50)->nullable();
            $table->string('photo_url', 255)->nullable();
            $table->string('visitor_type', 50)->default('parent'); // parent, vendor, guest, contractor, delivery, alumni, official, other
            $table->integer('accompanying_count')->default(0);
            $table->string('purpose', 255);
            $table->string('department', 100)->nullable();
            $table->unsignedBigInteger('staff_id')->nullable()->index();
            $table->unsignedBigInteger('student_user_id')->nullable()->index();
            $table->string('student_name', 150)->nullable(); // Cached student name and class e.g. "Rohan Kumar (VI-A)"
            $table->string('person_to_meet_custom', 150)->nullable();
            $table->string('gate_name', 50)->default('Main Gate');
            $table->unsignedBigInteger('guard_user_id')->nullable()->index();
            $table->string('vehicle_type', 30)->nullable()->default('none'); // none, two_wheeler, car, auto, van, truck, bicycle
            $table->string('vehicle_number', 30)->nullable()->index();
            $table->text('belongings')->nullable();
            $table->dateTime('check_in_at')->index();
            $table->dateTime('check_out_at')->nullable()->index();
            $table->integer('duration_minutes')->nullable();
            $table->string('status', 30)->default('inside_campus')->index(); // inside_campus, checked_out, cancelled, blocked
            $table->unsignedBigInteger('exit_guard_user_id')->nullable();
            $table->text('exit_remarks')->nullable();
            $table->boolean('is_blocked')->default(false);
            $table->text('block_reason')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            // Foreign keys
            $table->foreign('institution_id')->references('id')->on('institutions')->nullOnDelete();
            $table->foreign('staff_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('student_user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('guard_user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('exit_guard_user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gate_passes');
    }
};
