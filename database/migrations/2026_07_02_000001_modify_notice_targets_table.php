<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notice_targets', function (Blueprint $table) {
            // Drop indexes and columns if they exist
            $table->dropIndex(['target_type', 'target_id']);
            $table->dropColumn(['target_type', 'target_id']);

            // Add correct columns
            $table->foreignId('stream_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('session_id')->nullable()->constrained('academic_sessions')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('notice_targets', function (Blueprint $table) {
            $table->dropForeign(['stream_id']);
            $table->dropForeign(['session_id']);
            $table->dropColumn(['stream_id', 'session_id']);

            $table->string('target_type', 50)->nullable();
            $table->unsignedBigInteger('target_id')->nullable();
            $table->index(['target_type', 'target_id']);
        });
    }
};
