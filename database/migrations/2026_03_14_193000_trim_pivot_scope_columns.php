<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Replace scope_type + scope_id on pivot tables with a single institution_id FK.
 *
 * BEFORE: scope_type ('global'|'institution') + scope_id (int|null)
 * AFTER:  institution_id (nullable FK → institutions.id)
 *         NULL = global, non-NULL = institution-scoped
 */
return new class extends Migration {
    private const PIVOT_TABLES = ['user_roles', 'user_workflows', 'user_permissions'];

    public function up(): void
    {
        // ── user_roles ──────────────────────────────────────────────────
        Schema::table('user_roles', function (Blueprint $table) {
            $table->unsignedBigInteger('institution_id')->nullable()->after('role_id');
        });
        DB::table('user_roles')->whereNotNull('scope_id')->update([
            'institution_id' => DB::raw('scope_id'),
        ]);
        Schema::table('user_roles', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'role_id', 'scope_type', 'scope_id']);
            $table->dropIndex(['scope_type', 'scope_id']);
            $table->dropColumn(['scope_type', 'scope_id']);
            $table->unique(['user_id', 'role_id', 'institution_id']);
            $table->foreign('institution_id')->references('id')->on('institutions')->nullOnDelete();
        });

        // ── user_workflows ──────────────────────────────────────────────
        Schema::table('user_workflows', function (Blueprint $table) {
            $table->unsignedBigInteger('institution_id')->nullable()->after('workflow_id');
        });
        DB::table('user_workflows')->whereNotNull('scope_id')->update([
            'institution_id' => DB::raw('scope_id'),
        ]);
        // Drop old primary, add new one (composite PKs need special handling)
        Schema::table('user_workflows', function (Blueprint $table) {
            $table->dropPrimary(['user_id', 'workflow_id', 'scope_type', 'scope_id']);
        });
        Schema::table('user_workflows', function (Blueprint $table) {
            $table->dropIndex(['scope_type', 'scope_id']);
            $table->dropColumn(['scope_type', 'scope_id']);
            $table->primary(['user_id', 'workflow_id', 'institution_id']);
            $table->foreign('institution_id')->references('id')->on('institutions')->nullOnDelete();
        });

        // ── user_permissions ────────────────────────────────────────────
        Schema::table('user_permissions', function (Blueprint $table) {
            $table->unsignedBigInteger('institution_id')->nullable()->after('permission_id');
        });
        DB::table('user_permissions')->whereNotNull('scope_id')->update([
            'institution_id' => DB::raw('scope_id'),
        ]);
        Schema::table('user_permissions', function (Blueprint $table) {
            $table->dropPrimary(['user_id', 'permission_id', 'scope_type', 'scope_id']);
        });
        Schema::table('user_permissions', function (Blueprint $table) {
            $table->dropIndex(['scope_type', 'scope_id']);
            $table->dropColumn(['scope_type', 'scope_id']);
            $table->primary(['user_id', 'permission_id', 'institution_id']);
            $table->foreign('institution_id')->references('id')->on('institutions')->nullOnDelete();
        });
    }

    public function down(): void
    {
        foreach (self::PIVOT_TABLES as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->string('scope_type', 32)->nullable();
                $table->unsignedBigInteger('scope_id')->nullable();
                $table->index(['scope_type', 'scope_id']);
            });

            // Restore data
            DB::table($table)->whereNotNull('institution_id')->update([
                'scope_type' => 'institution',
                'scope_id' => DB::raw('institution_id'),
            ]);
            DB::table($table)->whereNull('institution_id')->update([
                'scope_type' => 'global',
            ]);
        }

        // Restore unique constraints (user_roles)
        Schema::table('user_roles', function (Blueprint $table) {
            $table->dropForeign(['institution_id']);
            $table->dropUnique(['user_id', 'role_id', 'institution_id']);
            $table->dropColumn('institution_id');
            $table->unique(['user_id', 'role_id', 'scope_type', 'scope_id']);
        });

        // Restore primary keys (user_workflows)
        Schema::table('user_workflows', function (Blueprint $table) {
            $table->dropForeign(['institution_id']);
            $table->dropPrimary(['user_id', 'workflow_id', 'institution_id']);
            $table->dropColumn('institution_id');
            $table->primary(['user_id', 'workflow_id', 'scope_type', 'scope_id']);
        });

        // Restore primary keys (user_permissions)
        Schema::table('user_permissions', function (Blueprint $table) {
            $table->dropForeign(['institution_id']);
            $table->dropPrimary(['user_id', 'permission_id', 'institution_id']);
            $table->dropColumn('institution_id');
            $table->primary(['user_id', 'permission_id', 'scope_type', 'scope_id']);
        });
    }
};
