<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('admission_applications', function (Blueprint $table) {
            $table->string('payment_mode', 50)->nullable();
            $table->decimal('hostel_amount', 12, 2)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('admission_applications', function (Blueprint $table) {
            $table->dropColumn(['payment_mode', 'hostel_amount']);
        });
    }
};
