<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guardian_students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guardian_id')->constrained('guardians')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->comment('Student user');
            $table->string('relation', 50)->default('guardian')->comment('e.g. father, mother, guardian');
            $table->boolean('is_primary')->default(true);
            $table->timestamps();

            $table->unique(['guardian_id', 'user_id'], 'guardian_students_guardian_user_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guardian_students');
    }
};
