<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Migrate institutions.domain → institution_domains table rows, then drop the column.
     * institution_domains supports multi-domain per institution.
     */
    public function up(): void
    {
        // Migrate existing institutions.domain values into institution_domains
        $institutions = DB::table('institutions')
            ->whereNotNull('domain')
            ->where('domain', '!=', '')
            ->get(['id', 'domain']);

        foreach ($institutions as $inst) {
            $exists = DB::table('institution_domains')
                ->where('institution_id', $inst->id)
                ->where('domain', $inst->domain)
                ->exists();

            if (!$exists) {
                DB::table('institution_domains')->insert([
                    'institution_id' => $inst->id,
                    'domain' => $inst->domain,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Drop the column from institutions
        Schema::table('institutions', function (Blueprint $table) {
            $table->dropColumn('domain');
        });
    }

    public function down(): void
    {
        // Re-add the column
        Schema::table('institutions', function (Blueprint $table) {
            $table->string('domain', 255)->nullable()->after('website');
        });

        // Restore first domain from institution_domains back to institutions.domain
        $domains = DB::table('institution_domains')
            ->select('institution_id', DB::raw('MIN(domain) as domain'))
            ->groupBy('institution_id')
            ->get();

        foreach ($domains as $row) {
            DB::table('institutions')
                ->where('id', $row->institution_id)
                ->update(['domain' => $row->domain]);
        }
    }
};
