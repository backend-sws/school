<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('transport_route_stops') && !Schema::hasColumn('transport_route_stops', 'fare')) {
            Schema::table('transport_route_stops', function (Blueprint $table) {
                $table->double('fare', 8, 2)->default(0.00);
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('transport_route_stops') && Schema::hasColumn('transport_route_stops', 'fare')) {
            Schema::table('transport_route_stops', function (Blueprint $table) {
                $table->dropColumn('fare');
            });
        }
    }
};
