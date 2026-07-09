<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Move scope_type and scope_id from roles into role_scopes so the same role can exist in multiple scopes.
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::create('role_scopes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->string('scope_type', 32)->nullable();
            $table->unsignedBigInteger('scope_id')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['role_id', 'scope_type', 'scope_id'], 'role_scopes_role_scope_unique');
            $table->index(['scope_type', 'scope_id']);
        });

        foreach (DB::table('roles')->orderBy('id')->get() as $row) {
            DB::table('role_scopes')->insert([
                'role_id' => $row->id,
                'scope_type' => $row->scope_type,
                'scope_id' => $row->scope_id,
                'created_at' => $row->created_at ?? now(),
            ]);
        }

        $keyToIds = DB::table('roles')->orderBy('id')->get()->groupBy('key');
        foreach ($keyToIds as $key => $rows) {
            $rows = $rows->values();
            if ($rows->count() <= 1) {
                continue;
            }
            $keepId = $rows[0]->id;
            $mergeIds = $rows->slice(1)->pluck('id')->all();
            foreach ($mergeIds as $oldId) {
                $scopes = DB::table('role_scopes')->where('role_id', $oldId)->get();
                foreach ($scopes as $s) {
                    DB::table('role_scopes')->insertOrIgnore([
                        'role_id' => $keepId,
                        'scope_type' => $s->scope_type,
                        'scope_id' => $s->scope_id,
                        'created_at' => $s->created_at,
                    ]);
                }
                DB::table('role_scopes')->where('role_id', $oldId)->delete();
                DB::table('user_roles')->where('role_id', $oldId)->update(['role_id' => $keepId]);
                DB::table('role_permissions')->where('role_id', $oldId)->update(['role_id' => $keepId]);
                DB::table('role_workflows')->where('role_id', $oldId)->update(['role_id' => $keepId]);
            }
            DB::table('roles')->whereIn('id', $mergeIds)->delete();
        }

        Schema::table('roles', function (Blueprint $table) {
            $table->dropUnique(['key', 'scope_type', 'scope_id']);
            $table->dropIndex(['scope_type', 'scope_id']);
            $table->dropColumn(['scope_type', 'scope_id']);
            $table->unique('key');
        });
    }

    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->string('scope_type', 32)->nullable()->after('is_system');
            $table->unsignedBigInteger('scope_id')->nullable()->after('scope_type');
            $table->index(['scope_type', 'scope_id']);
        });

        foreach (DB::table('role_scopes')->orderBy('role_id')->get() as $row) {
            DB::table('roles')->where('id', $row->role_id)->update([
                'scope_type' => $row->scope_type,
                'scope_id' => $row->scope_id,
            ]);
        }

        Schema::table('roles', function (Blueprint $table) {
            $table->dropUnique(['key']);
            $table->unique(['key', 'scope_type', 'scope_id']);
        });

        Schema::dropIfExists('role_scopes');
    }
};
