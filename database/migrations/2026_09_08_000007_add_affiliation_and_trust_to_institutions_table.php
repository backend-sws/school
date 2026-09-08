<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('institutions', function (Blueprint $table) {
            $table->string('affiliation_no', 100)->nullable()->after('affiliation_board');
            $table->string('trust_name', 255)->nullable()->after('affiliation_no');
        });
    }

    public function down(): void
    {
        Schema::table('institutions', function (Blueprint $table) {
            $table->dropColumn(['affiliation_no', 'trust_name']);
        });
    }
};
