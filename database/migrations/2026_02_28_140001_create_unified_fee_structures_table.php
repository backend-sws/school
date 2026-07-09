<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::rename('fee_structures', 'fee_structures_legacy');

        Schema::create('fee_structures', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('institution_id');
            $table->unsignedBigInteger('fee_type_id');
            $table->decimal('amount', 10, 2)->default(0);
            $table->string('scope_type', 50);
            $table->unsignedBigInteger('scope_id')->nullable();
            $table->date('effective_from')->nullable();
            $table->date('effective_to')->nullable();
            $table->timestamps();

            $table->foreign('institution_id')->references('id')->on('institutions')->onDelete('cascade');
            $table->foreign('fee_type_id')->references('id')->on('fee_types')->onDelete('cascade');
            $table->index(['institution_id', 'scope_type', 'scope_id']);
            $table->index(['fee_type_id', 'scope_type', 'scope_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fee_structures');
        Schema::rename('fee_structures_legacy', 'fee_structures');
    }
};
