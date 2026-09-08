<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('inventory_movements', function (Blueprint $table) {
            $table->boolean('is_reverted')->default(false)->after('remarks');
            $table->timestamp('reverted_at')->nullable()->after('is_reverted');
            $table->foreignId('reverted_by')->nullable()->after('reverted_at')->constrained('users')->nullOnDelete();
            $table->text('revert_reason')->nullable()->after('reverted_by');

            $table->index(['is_reverted']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventory_movements', function (Blueprint $table) {
            $table->dropForeign(['reverted_by']);
            $table->dropIndex(['is_reverted']);
            $table->dropColumn(['is_reverted', 'reverted_at', 'reverted_by', 'revert_reason']);
        });
    }
};
