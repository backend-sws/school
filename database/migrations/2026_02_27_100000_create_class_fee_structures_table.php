<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('class_fee_structures', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('institution_id');
            $table->unsignedBigInteger('lms_class_id');
            $table->unsignedBigInteger('fee_particular_id');
            $table->decimal('amount', 10, 2)->default(0);
            $table->timestamps();

            $table->foreign('institution_id')->references('id')->on('institutions')->onDelete('cascade');
            $table->foreign('lms_class_id')->references('id')->on('lms_classes')->onDelete('cascade');
            $table->foreign('fee_particular_id')->references('id')->on('fee_particulars')->onDelete('cascade');

            $table->unique(['lms_class_id', 'fee_particular_id'], 'class_fee_struct_class_particular_unique');
            $table->index('institution_id');
            $table->index('lms_class_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_fee_structures');
    }
};
