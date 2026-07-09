<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

/**
 * Drop legacy fee tables after all consumers have been updated to use fee_types and fee_structures.
 * Set DROP_LEGACY_FEE_TABLES=true in .env and run migrate to execute.
 * Requires: AdmissionHeadService, FeeHeadController, and frontend to use fee_type_id and FeeStructureRule.
 */
return new class extends Migration {
    public function up(): void
    {
        if (! config('ems.drop_legacy_fee_tables', false)) {
            return;
        }
        if (Schema::hasTable('class_fee_structures')) {
            Schema::dropIfExists('class_fee_structures');
        }
        if (Schema::hasTable('fee_structures_legacy')) {
            Schema::dropIfExists('fee_structures_legacy');
        }
        if (Schema::hasTable('fee_particulars')) {
            Schema::dropIfExists('fee_particulars');
        }
    }

    public function down(): void
    {
        // Restore from backup or re-run original migrations; not recreated here.
    }
};
