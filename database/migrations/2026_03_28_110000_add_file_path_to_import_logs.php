<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('import_logs', function (Blueprint $table) {
            $table->string('file_path', 500)->nullable();
            $table->string('file_disk', 30)->default('s3');
        });
    }

    public function down(): void
    {
        Schema::table('import_logs', function (Blueprint $table) {
            $table->dropColumn(['file_path', 'file_disk']);
        });
    }
};
