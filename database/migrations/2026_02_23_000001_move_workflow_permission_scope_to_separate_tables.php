<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Move scope_type and scope_id from workflows and permissions into separate tables
 * so the same workflow or permission can exist in multiple scopes (scope_type + scope_id).
 */
return new class extends Migration {
    public function up(): void
    {
        // ── Workflow scopes ─────────────────────────────────────────────
        Schema::create('workflow_scopes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workflow_id')->constrained()->cascadeOnDelete();
            $table->string('scope_type', 32)->nullable();
            $table->unsignedBigInteger('scope_id')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['workflow_id', 'scope_type', 'scope_id'], 'workflow_scopes_workflow_scope_unique');
            $table->index(['scope_type', 'scope_id']);
        });

        // Copy existing workflow scope into workflow_scopes (one row per workflow)
        foreach (DB::table('workflows')->orderBy('id')->get() as $row) {
            DB::table('workflow_scopes')->insert([
                'workflow_id' => $row->id,
                'scope_type' => $row->scope_type,
                'scope_id' => $row->scope_id,
                'created_at' => $row->created_at ?? now(),
            ]);
        }

        // Merge duplicate workflow keys: keep one workflow per key, add all scopes, update FKs
        $keyToIds = DB::table('workflows')->orderBy('id')->get()->groupBy('key');
        foreach ($keyToIds as $key => $rows) {
            $rows = $rows->values();
            if ($rows->count() <= 1) {
                continue;
            }
            $keepId = $rows[0]->id;
            $mergeIds = $rows->slice(1)->pluck('id')->all();
            foreach ($mergeIds as $oldId) {
                $scopes = DB::table('workflow_scopes')->where('workflow_id', $oldId)->get();
                foreach ($scopes as $s) {
                    DB::table('workflow_scopes')->insertOrIgnore([
                        'workflow_id' => $keepId,
                        'scope_type' => $s->scope_type,
                        'scope_id' => $s->scope_id,
                        'created_at' => $s->created_at,
                    ]);
                }
                DB::table('workflow_scopes')->where('workflow_id', $oldId)->delete();
                DB::table('workflow_permissions')->where('workflow_id', $oldId)->update(['workflow_id' => $keepId]);
                DB::table('role_workflows')->where('workflow_id', $oldId)->update(['workflow_id' => $keepId]);
                DB::table('user_workflows')->where('workflow_id', $oldId)->update(['workflow_id' => $keepId]);
            }
            DB::table('workflows')->whereIn('id', $mergeIds)->delete();
        }

        Schema::table('workflows', function (Blueprint $table) {
            $table->dropUnique(['key', 'scope_type', 'scope_id']);
            $table->dropIndex(['scope_type', 'scope_id']);
            $table->dropColumn(['scope_type', 'scope_id']);
            $table->unique('key');
        });

        // ── Permission scopes ───────────────────────────────────────────
        Schema::create('permission_scopes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
            $table->string('scope_type', 32)->nullable();
            $table->unsignedBigInteger('scope_id')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['permission_id', 'scope_type', 'scope_id'], 'permission_scopes_permission_scope_unique');
            $table->index(['scope_type', 'scope_id']);
        });

        foreach (DB::table('permissions')->orderBy('id')->get() as $row) {
            DB::table('permission_scopes')->insert([
                'permission_id' => $row->id,
                'scope_type' => $row->scope_type ?? null,
                'scope_id' => $row->scope_id ?? null,
                'created_at' => $row->created_at ?? now(),
            ]);
        }

        $permKeyToIds = DB::table('permissions')->orderBy('id')->get()->groupBy('key');
        foreach ($permKeyToIds as $key => $rows) {
            $rows = $rows->values();
            if ($rows->count() <= 1) {
                continue;
            }
            $keepId = $rows[0]->id;
            $mergeIds = $rows->slice(1)->pluck('id')->all();
            foreach ($mergeIds as $oldId) {
                $scopes = DB::table('permission_scopes')->where('permission_id', $oldId)->get();
                foreach ($scopes as $s) {
                    DB::table('permission_scopes')->insertOrIgnore([
                        'permission_id' => $keepId,
                        'scope_type' => $s->scope_type,
                        'scope_id' => $s->scope_id,
                        'created_at' => $s->created_at,
                    ]);
                }
                DB::table('permission_scopes')->where('permission_id', $oldId)->delete();
                DB::table('role_permissions')->where('permission_id', $oldId)->update(['permission_id' => $keepId]);
                DB::table('workflow_permissions')->where('permission_id', $oldId)->update(['permission_id' => $keepId]);
                DB::table('user_permissions')->where('permission_id', $oldId)->update(['permission_id' => $keepId]);
            }
            DB::table('permissions')->whereIn('id', $mergeIds)->delete();
        }

        Schema::table('permissions', function (Blueprint $table) {
            $table->dropIndex(['scope_type', 'scope_id']);
            $table->dropColumn(['scope_type', 'scope_id']);
            $table->unique('key');
        });
    }

    public function down(): void
    {
        Schema::table('workflows', function (Blueprint $table) {
            $table->string('scope_type', 32)->nullable()->after('description');
            $table->unsignedBigInteger('scope_id')->nullable()->after('scope_type');
            $table->index(['scope_type', 'scope_id']);
        });

        foreach (DB::table('workflow_scopes')->orderBy('workflow_id')->get() as $row) {
            DB::table('workflows')->where('id', $row->workflow_id)->update([
                'scope_type' => $row->scope_type,
                'scope_id' => $row->scope_id,
            ]);
        }

        Schema::table('workflows', function (Blueprint $table) {
            $table->dropUnique(['key']);
            $table->unique(['key', 'scope_type', 'scope_id']);
        });

        Schema::table('permissions', function (Blueprint $table) {
            $table->string('scope_type', 32)->nullable()->after('description');
            $table->unsignedBigInteger('scope_id')->nullable()->after('scope_type');
            $table->index(['scope_type', 'scope_id']);
        });

        foreach (DB::table('permission_scopes')->orderBy('permission_id')->get() as $row) {
            DB::table('permissions')->where('id', $row->permission_id)->update([
                'scope_type' => $row->scope_type,
                'scope_id' => $row->scope_id,
            ]);
        }

        Schema::table('permissions', function (Blueprint $table) {
            $table->dropUnique(['key']);
        });

        Schema::dropIfExists('workflow_scopes');
        Schema::dropIfExists('permission_scopes');
    }
};
