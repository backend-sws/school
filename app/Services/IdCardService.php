<?php

namespace App\Services;

use App\Models\IdCard;
use App\Models\IdCardTemplate;
use App\Models\Institution;
use App\Models\User;
use App\Models\Session;
use App\Http\Controllers\Api\V1\Organization\InstitutionProfileController;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

class IdCardService
{
    protected RegistrationNumberService $regNoService;

    public function __construct(RegistrationNumberService $regNoService)
    {
        $this->regNoService = $regNoService;
    }

    /**
     * List generated cards with filters.
     */
    public function getAll(array $filters): LengthAwarePaginator
    {
        $query = IdCard::with(['user', 'template', 'session']);

        if (!empty($filters['search'])) {
            $searchBy = $filters['search_by'] ?? 'name';
            $search = $filters['search'];
            if ($searchBy === 'reg_no') {
                $query->whereHas('user', fn ($q) => $q->where('reg_no', 'like', "%{$search}%"));
            } else {
                $query->whereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            }
        }

        if (!empty($filters['session_id'])) {
            $query->where('session_id', $filters['session_id']);
        }

        if (!empty($filters['card_type'])) {
            $query->where('card_type', $filters['card_type']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['stream_id'])) {
            $query->whereHas('user', fn ($q) => $q->whereHas('studentProfile', fn ($sp) => $sp->where('stream_id', $filters['stream_id'])));
        }

        return $query->orderByDesc('generated_at')->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Get a single card with relations and a merged display snapshot.
     */
    public function getById(int $id): IdCard
    {
        $card = IdCard::with([
            'user.studentProfile.stream.mainStream',
            'user.studentProfile.permanentAddress',
            'user.staffProfile',
            'template',
            'session',
            'institution',
        ])->findOrFail($id);

        $card->setAttribute('display_snapshot', $this->resolveDisplaySnapshot($card));

        return $card;
    }

    /**
     * Bulk generate ID cards for students matching the filters.
     *
     * @return array{count: int, cards: \Illuminate\Support\Collection}
     */
    public function generate(int $templateId, array $filters): array
    {
        $template = IdCardTemplate::findOrFail($templateId);
        $session  = Session::findOrFail($filters['session_id']);

        // Build query for students to generate cards for
        $userQuery = User::whereHas('studentProfile', function ($q) use ($filters, $session) {
            $q->where('session_id', $session->id);
            if (!empty($filters['stream_id'])) {
                $q->where('stream_id', $filters['stream_id']);
            }
        })->when(!empty($filters['student_ids']), function ($q) use ($filters) {
            $q->whereIn('id', $filters['student_ids']);
        })->whereDoesntHave('idCards', function ($q) use ($session, $template) {
            $q->where('session_id', $session->id)
              ->where('template_id', $template->id)
              ->whereIn('status', ['generated', 'printed']);
        });

        $users = $userQuery->with(['studentProfile', 'studentProfile.stream'])->get();

        $cards = collect();
        $institutionId = $template->institution_id;

        foreach ($users as $user) {
            // Ensure reg_no exists
            if (empty($user->reg_no)) {
                $user->reg_no = $this->regNoService->generate($institutionId, 'student');
                $user->save();
            }

            $snapshotData = $this->buildSnapshot($user, $template->card_type);
            $snapshotData = $this->enrichSnapshotWithBranding($snapshotData, $template);

            $card = IdCard::create([
                'institution_id'     => $institutionId,
                'template_id'        => $template->id,
                'user_id'            => $user->id,
                'session_id'         => $session->id,
                'card_type'          => $template->card_type,
                'verification_token' => Str::uuid()->toString(),
                'snapshot_data'      => $snapshotData,
                'photo_url'          => $user->photo_url,
                'status'             => 'generated',
                'valid_from'         => now(),
                'valid_until'        => $session->end_date ?? now()->addYear(),
                'generated_at'       => now(),
            ]);

            $cards->push($card);
        }

        return ['count' => $cards->count(), 'cards' => $cards];
    }

    /**
     * Generate a single ID card from manual snapshot data (student, staff, or visitor).
     */
    public function generateFromSnapshot(int $templateId, array $payload): IdCard
    {
        $template = IdCardTemplate::findOrFail($templateId);
        $session  = Session::findOrFail($payload['session_id']);
        $institutionId = $template->institution_id;
        $cardType = $template->card_type;

        $snapshot = $payload['snapshot_data'];

        if (!empty($payload['user_id'])) {
            $user = User::with(['studentProfile.stream', 'staffProfile'])->findOrFail($payload['user_id']);
            $baseSnapshot = $this->buildSnapshot($user, $cardType);
            $snapshot = array_merge($baseSnapshot, array_filter($snapshot, fn ($v) => $v !== null && $v !== ''));
        } else {
            if (empty($snapshot['reg_no'])) {
                $roleKey = match ($cardType) {
                    'staff' => 'staff',
                    'temporary' => 'temporary',
                    default => 'student',
                };
                $snapshot['reg_no'] = $this->regNoService->generate($institutionId, $roleKey);
            }
            if (empty($snapshot['name'])) {
                throw new \InvalidArgumentException('Name is required in snapshot data.');
            }
        }

        $snapshot = $this->enrichSnapshotWithBranding($snapshot, $template);

        $validUntil = !empty($snapshot['valid_until'])
            ? \Carbon\Carbon::parse($snapshot['valid_until'])
            : ($session->end_date ?? now()->addYear());

        return IdCard::create([
            'institution_id'     => $institutionId,
            'template_id'        => $template->id,
            'user_id'            => $payload['user_id'] ?? null,
            'session_id'         => $session->id,
            'card_type'          => $cardType,
            'verification_token' => Str::uuid()->toString(),
            'snapshot_data'      => $snapshot,
            'photo_url'          => $payload['photo_url'] ?? ($snapshot['photo_url'] ?? null),
            'status'             => 'generated',
            'valid_from'         => now(),
            'valid_until'        => $validUntil,
            'generated_at'       => now(),
        ]);
    }

    /**
     * Generate a QR code as base64-encoded SVG using bacon/bacon-qr-code.
     */
    protected function generateQrBase64(string $data, int $size = 200): string
    {
        $renderer = new ImageRenderer(
            new RendererStyle($size),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);

        return base64_encode($writer->writeString($data));
    }

    /**
     * Generate PDF for a single card.
     */
    public function generatePdf(int $idCardId): string
    {
        $card     = IdCard::with(['template', 'institution'])->findOrFail($idCardId);
        $template = $card->template;

        $qrCodeBase64 = $this->generateQrBase64($card->verification_url);

        $photoDataUri = $this->getPhotoDataUri($card->photo_url);

        $pdf = Pdf::loadView('pdf.id-card-front', [ 
            'card'             => $card,
            'template'         => $template,
            'snapshot'         => $card->snapshot_data,
            'qrCodeBase64'     => $qrCodeBase64,
            'photoDataUri'     => $photoDataUri,
            'institutionName'  => $card->institution?->name ?? ($card->snapshot_data['institution_name'] ?? ''),
            'institutionLogo'  => $this->getInstitutionLogoDataUri($card->institution_id),
            'showInstitutionLogo' => in_array('institution_logo', $template->front_layout ?? [], true),
            'showInstitutionName' => in_array('institution_name', $template->front_layout ?? [], true),
        ])->setPaper([0, 0, 153.01, 242.65], 'portrait'); // CR80 in points (53.98mm x 85.6mm portrait)

        $path = "id-cards/{$card->institution_id}/{$card->id}.pdf";
        \Storage::disk('local')->put($path, $pdf->output());

        $card->update(['pdf_path' => $path]);

        return $path;
    }

    /**
     * Bulk download: combine multiple cards into a paginated A4 PDF.
     */
    public function bulkDownload(array $filters): string
    {
        $cards = IdCard::with(['template', 'institution'])
            ->when(!empty($filters['session_id']), fn ($q) => $q->where('session_id', $filters['session_id']))
            ->when(!empty($filters['stream_id']), fn ($q) => $q->whereHas('user', fn ($uq) => $uq->whereHas('studentProfile', fn ($sp) => $sp->where('stream_id', $filters['stream_id']))))
            ->where('status', 'generated')
            ->get();

        $qrCodes = [];
        $photosDataUris = [];
        foreach ($cards as $card) {
            $qrCodes[$card->id] = $this->generateQrBase64($card->verification_url, 150);
            $photosDataUris[$card->id] = $this->getPhotoDataUri($card->photo_url);
        }

        $pdf = Pdf::loadView('pdf.id-card-bulk', [
            'cards'          => $cards,
            'qrCodes'        => $qrCodes,
            'photosDataUris' => $photosDataUris,
        ])->setPaper('a4', 'portrait');

        $path = 'id-cards/bulk/' . now()->format('Y-m-d_His') . '.pdf';
        \Storage::disk('local')->put($path, $pdf->output());

        return $path;
    }

    /**
     * Revoke a card.
     */
    public function revoke(int $id): IdCard
    {
        $card = IdCard::findOrFail($id);
        $card->update(['status' => 'revoked']);
        return $card;
    }

    /**
     * Regenerate a card: re-snapshot data and re-render PDF.
     */
    public function regenerate(int $id): IdCard
    {
        $card = IdCard::with([
            'user.studentProfile.stream.mainStream',
            'user.studentProfile.permanentAddress',
            'user.staffProfile',
            'template',
        ])->findOrFail($id);

        if ($card->user) {
            $card->update([
                'snapshot_data' => $this->enrichSnapshotWithBranding(
                    $this->buildSnapshot($card->user, $card->card_type),
                    $card->template ?? IdCardTemplate::findOrFail($card->template_id),
                ),
                'photo_url'     => $card->user->photo_url,
                'generated_at'  => now(),
                'status'        => 'generated',
            ]);
        } else {
            $template = $card->template ?? IdCardTemplate::findOrFail($card->template_id);
            $card->update([
                'snapshot_data' => $this->enrichSnapshotWithBranding($card->snapshot_data ?? [], $template),
                'generated_at' => now(),
                'status'       => 'generated',
            ]);
        }

        $this->generatePdf($id);

        return $card->fresh();
    }

    /**
     * Get student's card for the active session (student portal).
     */
    public function getStudentCard(int $userId, ?int $sessionId = null): ?IdCard
    {
        $query = IdCard::with(['template', 'institution', 'session'])
            ->where('user_id', $userId)
            ->whereIn('status', ['generated', 'printed']);

        if ($sessionId) {
            $query->where('session_id', $sessionId);
        }

        return $query->orderByDesc('generated_at')->first();
    }

    /**
     * Public verification: lookup card by token.
     */
    public function verifyByToken(string $token): ?IdCard
    {
        return IdCard::with(['institution', 'session'])
            ->where('verification_token', $token)
            ->first();
    }

    /**
     * Build a snapshot of user data for the ID card.
     */
    protected function buildSnapshot(User $user, string $cardType): array
    {
        $snapshot = [
            'reg_no' => $user->reg_no,
            'name'   => $user->name,
            'email'  => $user->primary_email,
            'mobile' => $user->mobile,
        ];

        if ($cardType === 'student' && $user->studentProfile) {
            $profile = $user->studentProfile;
            $snapshot = array_merge($snapshot, [
                'reg_no'       => $profile->reg_no ?? $user->reg_no,
                'roll_no'      => $profile->roll_no ?? null,
                'stream'       => $profile->stream?->name ?? null,
                'stream_id'    => $profile->stream_id ?? null,
                'department'   => $profile->stream?->mainStream?->name ?? null,
                'dob'          => $profile->dob?->format('d M Y') ?? null,
                'blood_group'  => $profile->blood_group ?? null,
                'father_name'  => $profile->father_name ?? null,
                'mother_name'  => $profile->mother_name ?? null,
                'address'      => $this->formatStudentAddress($profile),
            ]);
        }

        if ($cardType === 'staff' && $user->staffProfile) {
            $profile = $user->staffProfile;
            $snapshot = array_merge($snapshot, [
                'employee_id'  => $profile->employee_id ?? null,
                'designation'  => $profile->designation ?? null,
                'category'     => $profile->category ?? null,
                'joining_date' => $profile->joining_date?->format('d M Y') ?? null,
                'dob'          => $profile->dob?->format('d M Y') ?? null,
            ]);
        }

        return $snapshot;
    }

    /**
     * Merge stored snapshot with live user data for detail views.
     */
    public function resolveDisplaySnapshot(IdCard $card): array
    {
        $stored = $card->snapshot_data;
        if (is_string($stored)) {
            $decoded = json_decode($stored, true);
            $stored = is_array($decoded) ? $decoded : [];
        }
        if (! is_array($stored)) {
            $stored = [];
        }

        $base = [];
        if ($card->user) {
            $base = $this->buildSnapshot($card->user, $card->card_type);
        }

        $merged = array_merge(
            array_filter($base, fn ($v) => $v !== null && $v !== ''),
            array_filter($stored, fn ($v) => $v !== null && $v !== '')
        );

        if ($card->session && empty($merged['session'])) {
            $merged['session'] = $card->session->name;
        }

        if ($card->valid_until && empty($merged['valid_until'])) {
            $merged['valid_until'] = $card->valid_until->format('d M Y');
        }

        if ($card->institution && empty($merged['institution_name'])) {
            $merged['institution_name'] = $card->institution->name;
        }

        if (! empty($merged['institution_logo'])
            && is_string($merged['institution_logo'])
            && str_starts_with($merged['institution_logo'], 'data:')) {
            $merged['institution_logo'] = 'Included on card';
        }

        return $merged;
    }

    protected function formatStudentAddress($profile): ?string
    {
        $perm = $profile->permanentAddress;
        if ($perm && ! empty($perm->village_mohalla)) {
            return trim(implode(', ', array_filter([
                $perm->village_mohalla,
                $perm->district ?? null,
                $perm->state ?? null,
                $perm->pincode ?? null,
            ])));
        }

        if (! empty($profile->address)) {
            return trim(implode(', ', array_filter([
                $profile->address,
                $profile->city ?? null,
                $profile->state ?? null,
                $profile->pincode ?? null,
            ])));
        }

        return null;
    }

    /**
     * Inject institution branding fields selected in the template layout.
     */
    protected function enrichSnapshotWithBranding(array $snapshot, IdCardTemplate $template): array
    {
        $layoutFields = array_merge($template->front_layout ?? [], $template->back_layout ?? []);
        $institution = Institution::find($template->institution_id);

        if (! $institution) {
            return $snapshot;
        }

        if (in_array('institution_name', $layoutFields, true)) {
            $snapshot['institution_name'] = $institution->name;
        }

        if (in_array('institution_logo', $layoutFields, true)) {
            $logoUri = $this->getInstitutionLogoDataUri($template->institution_id);
            if ($logoUri) {
                $snapshot['institution_logo'] = $logoUri;
            }
        }

        return $snapshot;
    }

    /**
     * Resolve image URL or path to a base64 Data URI for reliable PDF embedding.
     */
    public static function getPhotoDataUri(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }
        $path = trim($path);

        if (str_starts_with($path, 'blob:')) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            $parsedUrl = parse_url($path);
            $urlPath = $parsedUrl['path'] ?? '';
            
            if (str_starts_with($urlPath, '/storage/')) {
                $relativePath = substr($urlPath, 1);
                $absolute = public_path($relativePath);
                if (is_file($absolute)) {
                    $mime = mime_content_type($absolute) ?: 'image/jpeg';
                    return 'data:' . $mime . ';base64,' . base64_encode((string) file_get_contents($absolute));
                }
            }

            try {
                $contents = @file_get_contents($path);
                if ($contents !== false) {
                    $mime = 'image/jpeg';
                    return 'data:' . $mime . ';base64,' . base64_encode($contents);
                }
            } catch (\Throwable) {
                // ignore
            }
        }

        if (str_starts_with($path, '/')) {
            $absolute = public_path($path);
            if (is_file($absolute)) {
                $mime = mime_content_type($absolute) ?: 'image/jpeg';
                return 'data:' . $mime . ';base64,' . base64_encode((string) file_get_contents($absolute));
            }
        } else {
            $absolute = public_path($path);
            if (is_file($absolute)) {
                $mime = mime_content_type($absolute) ?: 'image/jpeg';
                return 'data:' . $mime . ';base64,' . base64_encode((string) file_get_contents($absolute));
            }
        }

        return null;
    }

    /**
     * Resolve institution logo path or URL to a base64 Data URI.
     */
    public function getInstitutionLogoDataUri(int $institutionId): ?string
    {
        $institution = \App\Models\Institution::find($institutionId);
        $path = $institution?->logo_url;
        
        if (empty($path)) {
            // Check general settings as fallback
            $settings = \App\Models\Setting::where('institution_id', $institutionId)
                ->where('setting_group', 'general')
                ->pluck('setting_value', 'setting_key')
                ->all();
            $path = $settings['college_logo'] ?? null;
        }

        if (empty($path) || ! is_string($path)) {
            return null;
        }
        $path = trim($path);

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            try {
                $contents = @file_get_contents($path);
                if ($contents !== false) {
                    $mime = 'image/png';
                    return 'data:' . $mime . ';base64,' . base64_encode($contents);
                }
            } catch (\Throwable) {
                // ignore
            }
        }

        // Try direct R2 fetch
        try {
            $r2 = app(\App\Services\R2Service::class);
            $obj = $r2->getObject($path);
            if ($obj && isset($obj['Body'])) {
                $contents = (string) $obj['Body'];
                $mime = $obj['ContentType'] ?? 'image/png';
                return 'data:' . $mime . ';base64,' . base64_encode($contents);
            }
        } catch (\Throwable) {
            // ignore
        }

        if (str_starts_with($path, '/')) {
            $absolute = public_path($path);
            if (is_file($absolute)) {
                $mime = mime_content_type($absolute) ?: 'image/png';
                return 'data:' . $mime . ';base64,' . base64_encode((string) file_get_contents($absolute));
            }
        }

        return null;
    }
}
