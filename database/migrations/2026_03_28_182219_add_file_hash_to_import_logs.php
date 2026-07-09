<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('import_logs', function (Blueprint $table) {
            $table->string('file_hash', 32)->nullable()->after('file_disk')
                ->comment('MD5 hash of file contents for idempotent re-import detection');
            $table->index(['institution_id', 'module', 'file_hash', 'status'], 'import_logs_dedup_idx');
        });
    }

    public function down(): void
    {
        Schema::table('import_logs', function (Blueprint $table) {
            $table->dropIndex('import_logs_dedup_idx');
            $table->dropColumn('file_hash');
        });
    }
};
