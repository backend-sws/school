<?php

namespace App\Models;

use App\Enums\AffiliationBoard;
use App\Enums\InstitutionType;
use App\Enums\LocationType;
use App\Enums\ManagementType;
use App\Enums\MediumOfInstruction;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Institution extends Model
{
    use Auditable, HasFactory;

    public $timestamps = false;

    protected $table = 'institutions';

    protected $fillable = [
        'organization_id',
        'type',
        'name',
        'code',
        'udise_code',
        'address',
        'city',
        'state',
        'pincode',
        'phone',
        'email',
        'website',
        'logo_url',
        'established_year',
        'medium_of_instruction',
        'affiliation_board',
        'location_type',
        'management_type',
        'status',
    ];

    protected $casts = [
        'status' => 'integer',
        'established_year' => 'integer',
        'type' => InstitutionType::class,
        'medium_of_instruction' => MediumOfInstruction::class,
        'affiliation_board' => AffiliationBoard::class,
        'location_type' => LocationType::class,
        'management_type' => ManagementType::class,
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function domains(): HasMany
    {
        return $this->hasMany(InstitutionDomain::class);
    }

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function streams(): HasMany
    {
        return $this->hasMany(Stream::class);
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(Session::class);
    }

    public function studentProfiles(): HasMany
    {
        return $this->hasMany(StudentProfile::class);
    }

    public function staffProfiles(): HasMany
    {
        return $this->hasMany(StaffProfile::class);
    }

    /** Alias for staffProfiles. */
    public function staff(): HasMany
    {
        return $this->staffProfiles();
    }

    /** Alias for studentProfiles (backward compatibility). */
    public function students(): HasMany
    {
        return $this->studentProfiles();
    }

    public function infrastructure(): HasMany
    {
        return $this->hasMany(InstitutionInfrastructure::class);
    }

    /**
     * Get the primary domain slug for this institution (first from institution_domains).
     */
    public function primaryDomain(): ?string
    {
        if (config('app.env') === 'local') {
            // In local development, prefer domain without dot (subdomain slug like 'school')
            // so that it works with local wildcard DNS/localhost routing.
            $localDomain = $this->domains()
                ->where('domain', 'not like', '%.%')
                ->value('domain');
            
            if ($localDomain) {
                return $localDomain;
            }
        }
        return $this->domains()->value('domain');
    }

    /**
     * Accessor: $institution->domain → primaryDomain().
     * Backward-compatible after institutions.domain column was migrated to institution_domains.
     */
    public function getDomainAttribute(): ?string
    {
        return $this->primaryDomain();
    }

    /**
     * Get the full domain (slug + APP_URL host) for this institution.
     * E.g., domain="dikshaorg" → "dikshaorg.lvh.me"
     */
    public function getFullDomainAttribute(): ?string
    {
        $slug = $this->primaryDomain();
        if (!$slug) {
            return null;
        }
        return static::buildFullDomain($slug);
    }

    /**
     * Build full domain from a slug and the current APP_URL host.
     */
    public static function buildFullDomain(string $slug): string
    {
        if (str_contains($slug, '.')) {
            return $slug;
        }
        $appHost = parse_url(config('app.url'), PHP_URL_HOST);
        
        // If app host is 127.0.0.1, use localhost for subdomain routing to allow browser resolution
        if ($appHost === '127.0.0.1') {
            $appHost = 'localhost';
        }
        
        return $slug . '.' . $appHost;
    }

    /**
     * Build a full URL for this institution's subdomain.
     * E.g., "/dashboard" → "http://slug.lvh.me:18088/dashboard"
     *
     * Single source of truth for cross-domain URL construction.
     */
    public function buildSubdomainUrl(string $path, \Illuminate\Http\Request $request): ?string
    {
        if (!$this->full_domain) {
            return null;
        }

        $port = $request->getPort();
        $portSuffix = in_array($port, [80, 443], true) ? '' : ':' . $port;

        return $request->getScheme() . '://' . $this->full_domain . $portSuffix . $path;
    }

    /**
     * Extract the institution slug from a request host.
     * E.g., "dikshaorg.lvh.me" → "dikshaorg", "lvh.me" → null
     */
    public static function extractSlugFromHost(string $host, ?string $appHost = null): ?string
    {
        $appHost = $appHost ?? parse_url(config('app.url'), PHP_URL_HOST);
        if ($host === $appHost) {
            return null; // Brand domain, no slug
        }
        
        // Check standard suffix
        $suffix = '.' . $appHost;
        if (str_ends_with($host, $suffix)) {
            return substr($host, 0, -strlen($suffix));
        }
        
        // Also support localhost suffix if appHost is 127.0.0.1
        if ($appHost === '127.0.0.1' && str_ends_with($host, '.localhost')) {
            return substr($host, 0, -strlen('.localhost'));
        }
        
        return null;
    }

    // ─── Type Helpers ───────────────────────────────────────────────────

    public function isSchool(): bool { return $this->type === InstitutionType::SCHOOL || $this->type?->value === 'school'; }

    public function isCollege(): bool { return $this->type === InstitutionType::COLLEGE || $this->type?->value === 'college'; }

    public function isCoaching(): bool { return $this->type === InstitutionType::COACHING || $this->type?->value === 'coaching'; }

    public function isUniversity(): bool { return $this->type === InstitutionType::UNIVERSITY || $this->type?->value === 'university'; }

    public function isActive(): bool { return (int) $this->status === 1; }

    // ─── Scopes ─────────────────────────────────────────────────────────

    public function scopeActive($query) { return $query->where('status', 1); }

    public function scopeOfType($query, string|InstitutionType $type)
    {
        $value = $type instanceof InstitutionType ? $type->value : $type;
        return $query->where('type', $value);
    }
}

