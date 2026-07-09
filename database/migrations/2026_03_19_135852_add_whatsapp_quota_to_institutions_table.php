<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('institutions', function (Blueprint $table) {
            $table->unsignedInteger('whatsapp_monthly_quota')->default(500)->after('sms_daily_limit');
            $table->unsignedInteger('whatsapp_daily_limit')->default(100)->after('whatsapp_monthly_quota');
        });
    }

    public function down(): void
    {
        Schema::table('institutions', function (Blueprint $table) {
            $table->dropColumn(['whatsapp_monthly_quota', 'whatsapp_daily_limit']);
        });
    }
};
