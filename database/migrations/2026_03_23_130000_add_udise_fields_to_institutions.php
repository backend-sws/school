<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('institutions', function (Blueprint $table) {
            $table->string('udise_code', 11)->nullable()->unique()->after('code');
            $table->smallInteger('established_year')->nullable()->after('website');
            $table->string('medium_of_instruction', 30)->nullable()->after('established_year');
            $table->string('affiliation_board', 30)->nullable()->after('medium_of_instruction');
            $table->string('location_type', 10)->nullable()->after('affiliation_board');
            $table->string('management_type', 30)->nullable()->after('location_type');
        });
    }

    public function down(): void
    {
        Schema::table('institutions', function (Blueprint $table) {
            $table->dropUnique(['udise_code']);
            $table->dropColumn([
                'udise_code',
                'established_year',
                'medium_of_instruction',
                'affiliation_board',
                'location_type',
                'management_type',
            ]);
        });
    }
};
