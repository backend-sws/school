<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('id_cards')) {
            return;
        }

        try {
            Schema::table('id_cards', function (Blueprint $table) {
                $table->dropForeign(['session_id']);
            });
        } catch (\Throwable) {
            // FK may already be dropped from a partial migration run
        }

        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE id_cards ALTER COLUMN session_id TYPE BIGINT USING session_id::bigint');
        } elseif ($driver === 'mysql') {
            DB::statement('ALTER TABLE id_cards MODIFY session_id BIGINT UNSIGNED NOT NULL');
        } else {
            Schema::table('id_cards', function (Blueprint $table) {
                $table->unsignedBigInteger('session_id')->change();
            });
        }

        Schema::table('id_cards', function (Blueprint $table) {
            $table->foreign('session_id')->references('id')->on('academic_sessions')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('id_cards')) {
            return;
        }

        try {
            Schema::table('id_cards', function (Blueprint $table) {
                $table->dropForeign(['session_id']);
            });
        } catch (\Throwable) {
            //
        }

        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE id_cards ALTER COLUMN session_id TYPE VARCHAR(255) USING session_id::varchar');
        } elseif ($driver === 'mysql') {
            DB::statement('ALTER TABLE id_cards MODIFY session_id VARCHAR(255) NOT NULL');
        }
    }
};
