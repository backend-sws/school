<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('admission_applications', function (Blueprint $table) {
            $table->foreignId('class_id')->nullable();
            $table->foreignId('section_id')->nullable();
            $table->foreignId('transport_stop_id')->nullable();
            $table->decimal('transport_amount', 12, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('admission_applications', function (Blueprint $table) {
            $table->dropColumn(['class_id', 'section_id', 'transport_stop_id', 'transport_amount']);
        });
    }
};
