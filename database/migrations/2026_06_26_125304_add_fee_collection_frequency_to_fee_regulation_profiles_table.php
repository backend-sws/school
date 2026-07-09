<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('fee_regulation_profiles', function (Blueprint $table) {
            $table->string('fee_collection_frequency', 50)->nullable()->after('is_default');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fee_regulation_profiles', function (Blueprint $table) {
            $table->dropColumn('fee_collection_frequency');
        });
    }
};
