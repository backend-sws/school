<?php

namespace App\Imports\Concerns;

use App\Exports\ImportTemplateExport;

/**
 * Trait for importers that use templates with instruction rows at the top.
 *
 * Automatically tells Maatwebsite Excel to skip the instruction rows
 * and start reading from the correct heading row.
 *
 * Usage:
 *   class MyImport implements ToModel, WithHeadingRow {
 *       use SkipsInstructionRows;
 *       protected string $importModule = 'existing_students';
 *   }
 *
 * Software Factory: the heading row is computed from the VALIDATION_NOTES
 * count in ImportTemplateExport — no hardcoded row numbers.
 */
trait SkipsInstructionRows
{
    /**
     * Override the default heading row (1) to skip instruction rows.
     *
     * Called by Maatwebsite Excel's WithHeadingRow concern.
     */
    public function headingRow(): int
    {
        if (property_exists($this, 'importModule')) {
            return ImportTemplateExport::getHeadingRow($this->importModule);
        }

        // Fallback: no instruction rows
        return 1;
    }
}
