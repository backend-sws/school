<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guardians', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('institution_id')->nullable()->index();
            $table->string('name')->nullable();
            $table->string('email', 150)->nullable();
            $table->string('mobile', 15)->nullable();
            $table->unsignedBigInteger('user_id')->nullable()->index()->comment('Parent login account; set when parent registers');
            $table->timestamps();

            $table->foreign('institution_id')->references('id')->on('institutions')->nullOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guardians');
    }
};
