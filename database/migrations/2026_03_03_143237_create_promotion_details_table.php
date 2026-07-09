<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('promotion_details', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_detained')->default(false);
            $table->text('detention_reason')->nullable();
            $table->string('academic_result')->nullable(); // pass, fail, compartment
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotion_details');
    }
};
