<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Normalize scope_type values on pivot tables.
 *
 * BEFORE: user_roles.scope_type stored institution-type values (school, college, coaching, university)
 * AFTER:  user_roles.scope_type stores routing values (global, organization, institution)
 *
 * The institution type is already stored on institutions.type — no need to duplicate it on every pivot row.
 */
return new class extends Migration {
    /** Institution-type values that should be normalized to 'institution'. */
    private const INSTITUTION_TYPES = ['school', 'college', 'coaching', 'university'];

    /** Tables with scope_type + scope_id columns on pivots (assignment tables). */
    private const PIVOT_TABLES = ['user_roles', 'user_workflows', 'user_permissions'];

    public function up(): void
    {
        foreach (self::PIVOT_TABLES as $table) {
            DB::table($table)
                ->whereIn('scope_type', self::INSTITUTION_TYPES)
                ->update(['scope_type' => 'institution']);
        }
    }

    public function down(): void
    {
        // Reverse: set scope_type back to the institution's type value.
        // This is a best-effort reverse — it looks up the actual institution type.
        foreach (self::PIVOT_TABLES as $table) {
            DB::statement("
                UPDATE {$table}
                SET scope_type = COALESCE(
                    (SELECT i.type FROM institutions i WHERE i.id = {$table}.scope_id),
                    'institution'
                )
                WHERE scope_type = 'institution'
                  AND scope_id IS NOT NULL
            ");
        }
    }
};
