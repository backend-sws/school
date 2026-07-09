<?php

namespace App\Support;

use App\Traits\BelongsToDefaultInstitution;

/**
 * Facade for resolving the active institution context.
 * All logic lives in BelongsToDefaultInstitution; this class provides a single call point.
 */
class InstitutionContext
{
    use BelongsToDefaultInstitution;
}
