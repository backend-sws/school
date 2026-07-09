<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('fee_structures', function (Blueprint $table) {
            $table->string('fee_slot', 30)->nullable()->after('scope_id');
            $table->index(['institution_id', 'scope_type', 'scope_id', 'fee_slot']);
        });
    }

    public function down(): void
    {
        Schema::table('fee_structures', function (Blueprint $table) {
            $table->dropIndex(['institution_id', 'scope_type', 'scope_id', 'fee_slot']);
            $table->dropColumn('fee_slot');
        });
    }
};
