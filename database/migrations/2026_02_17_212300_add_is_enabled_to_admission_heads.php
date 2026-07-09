<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('admission_heads', function (Blueprint $table) {
            if (!Schema::hasColumn('admission_heads', 'is_enabled')) {
                $table->boolean('is_enabled')->default(true)->after('status');
            }
            if (!Schema::hasColumn('admission_heads', 'updated_at')) {
                $table->timestamp('updated_at')->nullable()->after('created_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('admission_heads', function (Blueprint $table) {
            $table->dropColumn(['is_enabled', 'updated_at']);
        });
    }
};
