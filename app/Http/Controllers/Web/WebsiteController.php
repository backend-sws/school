<?php

namespace App\Http\Controllers\Web;

use App\Enums\PublishStatus;
use App\Models\Institution;
use App\Models\News;
use App\Models\Ticker;
use App\Models\Setting;
use App\Models\HomeSlider;
use App\Models\Gallery;
use App\Services\R2Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;
use App\Http\Controllers\Controller;

class WebsiteController extends Controller
{
    protected R2Service $r2;
    protected \App\Services\WebsiteBuilderService $builder;

    public function __construct(R2Service $r2, \App\Services\WebsiteBuilderService $builder)
    {
        $this->r2 = $r2;
        $this->builder = $builder;
    }

    /**
     * Home (welcome) page with CMS data as Inertia props.
     */
    public function index(Request $request): Response
    {
        $sliders = HomeSlider::query()
            ->where('status', PublishStatus::PUBLISHED)
            ->orderBy('sort_order')
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'title' => $s->title,
                'description' => $s->description,
                'image_url' => $this->getSignedUrl($s->image_url),
                'button_caption' => $s->button_caption,
                'button_url' => $s->button_url,
                'sort_order' => $s->sort_order,
            ]);

        $tickers = Ticker::query()
            ->where('status', PublishStatus::PUBLISHED)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'content' => $t->content,
                'tags' => $t->tags ?? [],
            ]);

        $newsPreview = News::query()
            ->where('status', PublishStatus::PUBLISHED)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($n) => [
                'id' => $n->id,
                'title' => $n->title,
                'content' => $n->content,
                'news_for' => $n->news_for,
                'news_types' => $n->news_types ?? [],
                'created_at' => $n->created_at instanceof \DateTimeInterface
                    ? $n->created_at->format('c')
                    : $n->created_at,
            ]);

        // Upcoming events: News items with news_types containing "event" (or "Event")
        $upcomingEvents = News::query()
            ->where('status', PublishStatus::PUBLISHED)
            ->where(function ($q) {
                $q->whereJsonContains('news_types', 'event')
                    ->orWhereJsonContains('news_types', 'Event');
            })
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($n) => [
                'id' => $n->id,
                'title' => $n->title,
                'content' => $n->content,
                'news_for' => $n->news_for,
                'news_types' => $n->news_types ?? [],
                'created_at' => $n->created_at instanceof \DateTimeInterface
                    ? $n->created_at->format('c')
                    : $n->created_at,
                'event_date' => $n->event_date instanceof \DateTimeInterface
                    ? $n->event_date->format('Y-m-d')
                    : $n->event_date,
                'event_location' => $n->event_location,
            ]);

        $landingSettings = Setting::query()
            ->where('setting_group', 'landing_page')
            ->get()
            ->pluck('setting_value', 'setting_key')
            ->all();

        // Process dynamic stats JSON if it exists
        $stats = [];
        if (isset($landingSettings['stats'])) {
            $stats = is_array($landingSettings['stats'])
                ? $landingSettings['stats']
                : json_decode($landingSettings['stats'], true);
        }

        $galleryPreview = Gallery::query()
            ->where('status', PublishStatus::PUBLISHED)
            ->with(['images' => fn($q) => $q->orderBy('sort_order')->limit(6)])
            ->orderBy('created_at', 'desc')
            ->first();

        $galleryPreviewPayload = null;
        if ($galleryPreview) {
            $galleryPreviewPayload = [
                'id' => $galleryPreview->id,
                'title' => $galleryPreview->title,
                'description' => $galleryPreview->description,
                'images' => $galleryPreview->images->map(fn($img) => [
                    'id' => $img->id,
                    'image_url' => $this->getSignedUrl($img->image_url),
                    'caption' => $img->caption,
                    'media_type' => $img->media_type,
                ])->all(),
            ];
        }

        // ── Website Builder Data ─────────────────────────────────
        // Theme is applied via data-theme attribute on <html> (set by Branding middleware).
        // Section order drives homepage section visibility and ordering.
        $sectionOrder = $this->builder->getSectionOrder('home');

        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'sliders' => $sliders,
            'tickers' => $tickers,
            'newsPreview' => $newsPreview,
            'upcomingEvents' => $upcomingEvents,
            'landingSettings' => $landingSettings,
            'stats' => $stats,
            'galleryPreview' => $galleryPreviewPayload,
            'sectionOrder' => $sectionOrder,
        ]);
    }

    /**
     * Gallery page with all published galleries and images.
     */
    public function gallery(): Response
    {
        $galleries = Gallery::query()
            ->where('status', PublishStatus::PUBLISHED)
            ->with(['images' => fn($q) => $q->orderBy('sort_order')])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($g) => [
                'id' => $g->id,
                'title' => $g->title,
                'description' => $g->description,
                'images' => $g->images->map(fn($img) => [
                    'id' => $img->id,
                    'image_url' => $this->getSignedUrl($img->image_url),
                    'caption' => $img->caption,
                    'media_type' => $img->media_type,
                    'sort_order' => $img->sort_order,
                ])->values()->all(),
            ])
            ->values()
            ->all();

        return Inertia::render('gallery/index', [
            'galleries' => $galleries,
        ]);
    }

    public function aboutUs(): Response
    {
        $aboutSettings = $this->getSettingsByGroup('about_us');
        $landingSettings = $this->getSettingsByGroup('landing_page');
        $generalSettings = $this->getSettingsByGroup('general');
        $collegeDetails = $this->getCollegeDetails();

        // College Logo
        if (!empty($generalSettings['college_logo'])) {
            $aboutSettings['college_logo'] = $this->getSignedUrl($generalSettings['college_logo']);
        }

        // Use principal_photo from landing_page if about_principal_image is empty
        if (empty($aboutSettings['about_principal_image']) && !empty($landingSettings['principal_photo'])) {
            $aboutSettings['about_principal_image'] = $this->getSignedUrl($landingSettings['principal_photo']);
        } elseif (!empty($aboutSettings['about_principal_image'])) {
            $aboutSettings['about_principal_image'] = $this->getSignedUrl($aboutSettings['about_principal_image']);
        }

        // History Image
        if (!empty($aboutSettings['about_history_image'])) {
            $aboutSettings['about_history_image'] = $this->getSignedUrl($aboutSettings['about_history_image']);
        }

        // University Logo
        if (!empty($aboutSettings['about_university_logo'])) {
            $aboutSettings['about_university_logo'] = $this->getSignedUrl($aboutSettings['about_university_logo']);
        }

        return Inertia::render('about-us', [
            'collegeDetails' => $collegeDetails,
            'aboutSettings' => $aboutSettings,
        ]);
    }

    /**
     * Get a signed URL for an R2 path.
     */
    private function getSignedUrl(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }

        // If it's already a full URL and not an R2 internal path that looks like a URL, return it
        if (filter_var($path, FILTER_VALIDATE_URL) && !str_contains($path, '.r2.dev') && !str_contains($path, '.r2.cloudflarestorage.com')) {
            return $path;
        }

        // If it's an R2 URL that was previously generated incorrectly, extract the path
        if (str_contains($path, '.r2.dev') || str_contains($path, '.r2.cloudflarestorage.com')) {
            $path = parse_url($path, PHP_URL_PATH);
            $path = ltrim($path, '/');
            // If the path starts with the bucket name, remove it (depends on how it was stored/generated)
            if (str_starts_with($path, 'collegemanagement/')) {
                $path = substr($path, strlen('collegemanagement/'));
            }
        }

        try {
            return $this->r2->viewUrl(rawurldecode($path)); // Decode before signing to ensure correct key
        } catch (\Exception $e) {
            \Log::error("Failed to generate signed URL for path: {$path}. Error: " . $e->getMessage());
            return $path;
        }
    }

    public function contact(): Response
    {
        $collegeDetails = $this->getCollegeDetails();

        return Inertia::render('contact', [
            'collegeDetails' => $collegeDetails,
        ]);
    }

    public function approval(): Response
    {
        $approvalsData = Setting::where('setting_key', 'approvals_data')->first();
        $approvalSections = $approvalsData ? json_decode($approvalsData->setting_value, true) : [];

        return Inertia::render('approval', [
            'approvalSections' => $approvalSections,
        ]);
    }

    public function academics(): Response
    {
        $collegeDetails = $this->getCollegeDetails();
        $academicsSettings = [
            'admission_steps' => json_decode($this->getSettingValue('academics_admission', 'admission_steps'), true),
            'admission_dates' => json_decode($this->getSettingValue('academics_admission', 'admission_dates'), true),
            'admission_downloads' => json_decode($this->getSettingValue('academics_admission', 'admission_downloads'), true),
            'academic_events' => json_decode($this->getSettingValue('academics_calendar', 'academic_events'), true),
            'teaching_staff' => json_decode($this->getSettingValue('academics_staff', 'teaching_staff'), true),
            'non_teaching_staff' => json_decode($this->getSettingValue('academics_staff', 'non_teaching_staff'), true),
            'disciplinary_rules' => json_decode($this->getSettingValue('academics_policies', 'disciplinary_rules'), true),
            'anti_ragging_policies' => json_decode($this->getSettingValue('academics_policies', 'anti_ragging_policies'), true),
            'anti_ragging_helpline' => $this->getSettingValue('academics_policies', 'anti_ragging_helpline'),
            'attendance_policies' => json_decode($this->getSettingValue('academics_policies', 'attendance_policies'), true),
            'syllabus_departments' => json_decode($this->getSettingValue('academics_syllabus', 'syllabus_departments'), true),
            'courses_list' => json_decode($this->getSettingValue('academics_courses', 'courses_list'), true),
        ];

        return Inertia::render('academics/index', [
            'collegeDetails' => $collegeDetails,
            'academicsSettings' => $academicsSettings,
        ]);
    }

    public function departments(): Response
    {
        $departmentCategories = json_decode($this->getSettingValue('departments_page', 'department_categories'), true) ?: [];
        $departments = json_decode($this->getSettingValue('departments_page', 'departments_list'), true) ?: [];

        return Inertia::render('departments/index', [
            'departmentCategories' => $departmentCategories,
            'departments' => $departments,
        ]);
    }

    public function facilities(): Response
    {
        $facilitiesJson = $this->getSettingValue('facilities_page', 'facilities_list');
        $facilities = json_decode($facilitiesJson, true) ?: [];

        return Inertia::render('facilities/index', [
            'facilities' => $facilities,
        ]);
    }

    public function trainingPlacement(): Response
    {
        $placementSettings = $this->getSettingsByGroup('placement');

        // Parse JSON fields
        $stats = isset($placementSettings['placement_stats'])
            ? json_decode($placementSettings['placement_stats'], true)
            : [];
        $services = isset($placementSettings['placement_services'])
            ? json_decode($placementSettings['placement_services'], true)
            : [];
        $officer = isset($placementSettings['placement_officer'])
            ? json_decode($placementSettings['placement_officer'], true)
            : [];
        $about = isset($placementSettings['placement_about'])
            ? json_decode($placementSettings['placement_about'], true)
            : [];

        return Inertia::render('training-placement/index', [
            'placementAbout' => $about,
            'placementStats' => $stats,
            'placementServices' => $services,
            'placementOfficer' => $officer,
        ]);
    }

    /**
     * Helper: Get settings by group as key-value array.
     */
    private function getSettingsByGroup(string $group): array
    {
        return Setting::where('setting_group', $group)
            ->get()
            ->pluck('setting_value', 'setting_key')
            ->all();
    }

    /**
     * Helper: Get single setting value.
     */
    private function getSettingValue(string $group, string $key): ?string
    {
        return Setting::where('setting_group', $group)
            ->where('setting_key', $key)
            ->value('setting_value');
    }

    /**
     * Helper: Get college details.
     * Primary source: institutions table. Extra fields: settings table.
     */
    private function getCollegeDetails(): array
    {
        $collegeId = config('ems.default_institution_id');
        $college = Institution::find($collegeId);

        // Extra fields only in settings
        $general = $this->getSettingsByGroup('general');
        $social = $this->getSettingsByGroup('social');

        return [
            'name' => $college?->name ?? config('app.name'),
            'code' => $college?->code ?? '',
            'address' => $college?->address ?? '',
            'city' => $college?->city ?? '',
            'state' => $college?->state ?? '',
            'pincode' => $college?->pincode ?? '',
            'phone' => $college?->phone ?? '',
            'email' => $college?->email ?? '',
            'website' => $college?->website ?? '',
            'logo_url' => $college?->logo_url ?? $general['college_logo'] ?? null,
            'short_name' => $general['college_short_name'] ?? '',
            'motto' => $general['college_motto'] ?? '',
            'established' => $general['established_year'] ?? '',
            'affiliation' => $general['college_affiliation'] ?? '',
            'contact' => [
                'phone' => $college?->phone ?? '',
                'email' => $college?->email ?? '',
                'address' => $college?->address ?? '',
            ],
            'social' => [
                'facebook' => $social['facebook_url'] ?? '#',
                'twitter' => $social['twitter_url'] ?? '#',
                'youtube' => $social['youtube_url'] ?? '#',
                'whatsapp' => $social['whatsapp_number'] ?? '',
            ],
        ];
    }
}

