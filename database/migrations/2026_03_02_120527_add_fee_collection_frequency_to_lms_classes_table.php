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
        Schema::table('lms_classes', function (Blueprint $table) {
            $table->string('fee_collection_frequency', 20)->nullable()->after('section')->comment('monthly | quarterly');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lms_classes', function (Blueprint $table) {
            $table->dropColumn('fee_collection_frequency');
        });
    }
};
