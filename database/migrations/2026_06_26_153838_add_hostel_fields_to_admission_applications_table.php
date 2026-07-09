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
        Schema::table('admission_applications', function (Blueprint $table) {
            $table->foreignId('hostel_id')->nullable()->constrained('hostels')->nullOnDelete();
            $table->foreignId('hostel_room_id')->nullable()->constrained('hostel_rooms')->nullOnDelete();
            $table->foreignId('hostel_bed_id')->nullable()->constrained('hostel_beds')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('admission_applications', function (Blueprint $table) {
            $table->dropForeign(['hostel_id']);
            $table->dropColumn('hostel_id');
            $table->dropForeign(['hostel_room_id']);
            $table->dropColumn('hostel_room_id');
            $table->dropForeign(['hostel_bed_id']);
            $table->dropColumn('hostel_bed_id');
        });
    }
};
