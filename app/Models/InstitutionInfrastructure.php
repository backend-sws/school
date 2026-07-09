<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstitutionInfrastructure extends Model
{
    use BelongsToDefaultInstitution;

    protected $table = 'institution_infrastructure';

    protected $fillable = [
        'institution_id',
        'session_id',

        // Building
        'building_status',
        'total_classrooms',
        'classrooms_good_condition',
        'classrooms_need_repair',

        // Toilets
        'toilets_boys',
        'toilets_girls',
        'toilets_cwsn',
        'toilets_functional',

        // Facilities
        'has_drinking_water',
        'drinking_water_source',
        'has_electricity',
        'has_library',
        'library_books_count',
        'has_playground',
        'playground_area_sqm',
        'has_boundary_wall',
        'has_ramp',
        'has_kitchen_shed',

        // Labs
        'has_science_lab',
        'has_computer_lab',
        'has_integrated_lab',

        // ICT
        'computers_count',
        'has_smart_classroom',
        'smart_classroom_count',
        'has_internet',
        'internet_type',

        // Safety
        'has_fire_extinguisher',
        'has_cctv',
        'has_first_aid',
        'has_rainwater_harvesting',
        'has_solar_panel',

        // Meta
        'updated_by',
    ];

    protected $casts = [
        'total_classrooms' => 'integer',
        'classrooms_good_condition' => 'integer',
        'classrooms_need_repair' => 'integer',
        'toilets_boys' => 'integer',
        'toilets_girls' => 'integer',
        'toilets_cwsn' => 'integer',
        'toilets_functional' => 'integer',
        'has_drinking_water' => 'boolean',
        'has_electricity' => 'boolean',
        'has_library' => 'boolean',
        'library_books_count' => 'integer',
        'has_playground' => 'boolean',
        'playground_area_sqm' => 'integer',
        'has_boundary_wall' => 'boolean',
        'has_ramp' => 'boolean',
        'has_kitchen_shed' => 'boolean',
        'has_science_lab' => 'boolean',
        'has_computer_lab' => 'boolean',
        'has_integrated_lab' => 'boolean',
        'computers_count' => 'integer',
        'has_smart_classroom' => 'boolean',
        'smart_classroom_count' => 'integer',
        'has_internet' => 'boolean',
        'has_fire_extinguisher' => 'boolean',
        'has_cctv' => 'boolean',
        'has_first_aid' => 'boolean',
        'has_rainwater_harvesting' => 'boolean',
        'has_solar_panel' => 'boolean',
    ];

    // ─── Relationships ──────────────────────────────────────────────

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class);
    }

    public function updatedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
