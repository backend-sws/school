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
        Schema::table('inventory_purchases', function (Blueprint $table) {
            $table->timestamp('reverted_at')->nullable()->after('remarks');
            $table->foreignId('reverted_by')->nullable()->after('reverted_at')->constrained('users')->nullOnDelete();
            $table->text('revert_reason')->nullable()->after('reverted_by');

            $table->index(['reverted_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventory_purchases', function (Blueprint $table) {
            $table->dropForeign(['reverted_by']);
            $table->dropIndex(['reverted_at']);
            $table->dropColumn(['reverted_at', 'reverted_by', 'revert_reason']);
        });
    }
};
