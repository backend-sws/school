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
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            // Drop the old primary key (email) so it can be nullable
            // In Laravel/Postgres, the default PK index name for this table is usually password_reset_tokens_pkey
            $table->dropPrimary(); 
            $table->string('email')->nullable()->change();
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            $table->dropIndex(['email']);
            $table->string('email')->nullable(false)->change();
            $table->primary('email');
        });
    }
};
