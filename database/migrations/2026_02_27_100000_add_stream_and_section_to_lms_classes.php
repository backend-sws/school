<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lms_classes', function (Blueprint $table) {
            $table->foreignId('stream_id')->nullable()->after('institution_id')->constrained('streams')->nullOnDelete();
            $table->string('section', 50)->nullable()->after('session_id');
            $table->index(['stream_id', 'session_id']);
        });
    }

    public function down(): void
    {
        Schema::table('lms_classes', function (Blueprint $table) {
            $table->dropIndex(['stream_id', 'session_id']);
            $table->dropForeign(['stream_id']);
            $table->dropColumn(['stream_id', 'section']);
        });
    }
};
