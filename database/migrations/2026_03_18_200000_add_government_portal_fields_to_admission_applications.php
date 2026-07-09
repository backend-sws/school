<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('admission_applications', function (Blueprint $table) {
            $table->boolean('has_government_portal')->default(false)->after('previous_marks');
            $table->string('government_portal_name', 200)->nullable()->after('has_government_portal');
        });
    }

    public function down(): void
    {
        Schema::table('admission_applications', function (Blueprint $table) {
            $table->dropColumn(['has_government_portal', 'government_portal_name']);
        });
    }
};
