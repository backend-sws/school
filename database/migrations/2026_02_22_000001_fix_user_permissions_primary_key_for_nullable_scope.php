<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * PostgreSQL does not allow NULL in primary key columns.
 * Replace composite PK with an id column so scope_type/scope_id can remain nullable.
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::table('user_permissions', function (Blueprint $table) {
            $table->dropPrimary(['user_id', 'permission_id', 'scope_type', 'scope_id']);
        });

        Schema::table('user_permissions', function (Blueprint $table) {
            $table->id();
            $table->unique(['user_id', 'permission_id', 'scope_type', 'scope_id'], 'user_permissions_user_perm_scope_unique');
        });
    }

    public function down(): void
    {
        Schema::table('user_permissions', function (Blueprint $table) {
            $table->dropUnique('user_permissions_user_perm_scope_unique');
            $table->dropColumn('id');
        });

        Schema::table('user_permissions', function (Blueprint $table) {
            $table->primary(['user_id', 'permission_id', 'scope_type', 'scope_id']);
        });
    }
};
