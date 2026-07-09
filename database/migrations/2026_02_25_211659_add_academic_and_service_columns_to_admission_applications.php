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
            $table->foreignId('class_id')->nullable()->after('session_name');
            $table->foreignId('section_id')->nullable()->after('class_id');
            $table->foreignId('transport_stop_id')->nullable()->after('address_snapshot');
            $table->decimal('transport_amount', 12, 2)->default(0)->after('transport_stop_id');
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
