<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Migrate fee_particulars → fee_types, class_fee_structures → fee_structures (class scope),
     * fee_structures_legacy → fee_structures (admission_head scope).
     */
    public function up(): void
    {
        if (! Schema::hasTable('fee_types') || ! Schema::hasTable('fee_structures')) {
            return;
        }

        $this->migrateFeeParticularsToFeeTypes();
        $this->migrateClassFeeStructuresToFeeStructures();
        $this->migrateLegacyFeeStructuresToFeeStructures();
    }

    protected function migrateFeeParticularsToFeeTypes(): void
    {
        if (! Schema::hasTable('fee_particulars')) {
            return;
        }

        $particulars = DB::table('fee_particulars')->orderBy('id')->get();
        $existingByKey = [];

        foreach ($particulars as $p) {
            $instId = $p->institution_id;
            $key = $instId . '|' . (string) $p->name;
            if (isset($existingByKey[$key])) {
                continue;
            }
            $category = in_array(strtolower($p->type ?? ''), ['variable', 'one_time', 'one-time'], true)
                ? ($p->type ?? 'recurring')
                : 'recurring';
            $id = DB::table('fee_types')->insertGetId([
                'institution_id' => $instId,
                'name' => $p->name,
                'category' => $category,
                'display_order' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $existingByKey[$key] = $id;
        }
    }

    protected function migrateClassFeeStructuresToFeeStructures(): void
    {
        if (! Schema::hasTable('class_fee_structures') || ! Schema::hasTable('fee_particulars')) {
            return;
        }

        $rows = DB::table('class_fee_structures')
            ->join('fee_particulars', 'fee_particulars.id', '=', 'class_fee_structures.fee_particular_id')
            ->join('fee_types', function ($j) {
                $j->on('fee_types.institution_id', '=', 'fee_particulars.institution_id')
                    ->on('fee_types.name', '=', 'fee_particulars.name');
            })
            ->select(
                'class_fee_structures.institution_id',
                'class_fee_structures.lms_class_id',
                'class_fee_structures.amount',
                'fee_types.id as fee_type_id'
            )
            ->get();

        $inserts = [];
        foreach ($rows as $row) {
            $inserts[] = [
                'institution_id' => $row->institution_id,
                'fee_type_id' => $row->fee_type_id,
                'amount' => $row->amount,
                'scope_type' => 'class',
                'scope_id' => $row->lms_class_id,
                'effective_from' => null,
                'effective_to' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        if (! empty($inserts)) {
            foreach (array_chunk($inserts, 100) as $chunk) {
                DB::table('fee_structures')->insert($chunk);
            }
        }
    }

    protected function migrateLegacyFeeStructuresToFeeStructures(): void
    {
        if (! Schema::hasTable('fee_structures_legacy')) {
            return;
        }

        $legacy = DB::table('fee_structures_legacy')
            ->join('admission_heads', 'admission_heads.id', '=', 'fee_structures_legacy.admission_head_id')
            ->select(
                'fee_structures_legacy.id',
                'fee_structures_legacy.admission_head_id',
                'fee_structures_legacy.fee_type',
                'fee_structures_legacy.amount',
                'admission_heads.institution_id'
            )
            ->get();

        foreach ($legacy as $row) {
            $name = $row->fee_type ?? 'Fee';
            $feeType = DB::table('fee_types')
                ->where('institution_id', $row->institution_id)
                ->where('name', $name)
                ->first();
            if (! $feeType) {
                $feeTypeId = DB::table('fee_types')->insertGetId([
                    'institution_id' => $row->institution_id,
                    'name' => $name,
                    'category' => 'one_time',
                    'display_order' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $feeTypeId = $feeType->id;
            }
            DB::table('fee_structures')->insert([
                'institution_id' => $row->institution_id,
                'fee_type_id' => $feeTypeId,
                'amount' => $row->amount,
                'scope_type' => 'admission_head',
                'scope_id' => $row->admission_head_id,
                'effective_from' => null,
                'effective_to' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        // Data migration only; reverse would require tracking inserted ids. No-op.
    }
};
