<?php

namespace App\Imports\Concerns;

use App\Models\Session;
use App\Models\Stream;
use App\Models\User;
use App\Services\GuardianService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

/**
 * Shared helpers for student import classes.
 *
 * Requires the using class to declare:
 *   protected int $institutionId;
 *   protected array $usedEmails, $usedMobiles, $streamCache, $sessionCache, $classAliases;
 *   protected int $importedCount, $skippedCount;
 *   protected array $rowErrors;
 */
trait StudentImportHelpers
{
    // ── Contact uniqueness ──────────────────────────────────────────

    /**
     * Resolve unique email: returns null if already taken (same institution or same batch).
     */
    protected function resolveUniqueEmail(string $email): ?string
    {
        if (in_array($email, $this->usedEmails)) {
            return null;
        }
        if (User::where('email', $email)->where('institution_id', $this->institutionId)->exists()) {
            return null;
        }
        $this->usedEmails[] = $email;
        return $email;
    }

    /**
     * Resolve unique mobile: returns null if already taken (same institution or same batch).
     */
    protected function resolveUniqueMobile(string $mobile): ?string
    {
        if (in_array($mobile, $this->usedMobiles)) {
            return null;
        }
        if (User::where('mobile', $mobile)->where('institution_id', $this->institutionId)->exists()) {
            return null;
        }
        $this->usedMobiles[] = $mobile;
        return $mobile;
    }

    // ── User creation ───────────────────────────────────────────────

    /** Pre-hashed default password — bcrypt is ~100ms per call, cache avoids repeating for 'password123' */
    private ?string $cachedDefaultPasswordHash = null;

    /**
     * Create a User record with a default password and mark as verified.
     *
     * Default password priority: mobile number → 'password123'
     * Returns [User, plainPassword] so the notification can include credentials.
     */
    protected function createUserForImport(string $name, ?string $email, ?string $mobile): array
    {
        $plainPassword = !empty($mobile) ? $mobile : 'password123';

        // Cache hash for 'password123' — mobile-based passwords are unique per user
        if ($plainPassword === 'password123') {
            $this->cachedDefaultPasswordHash ??= Hash::make('password123');
            $hashedPassword = $this->cachedDefaultPasswordHash;
        } else {
            $hashedPassword = Hash::make($plainPassword);
        }

        $user = User::create([
            'name'                      => $name,
            'email'                     => $email,
            'mobile'                    => $mobile,
            'institution_id'            => $this->institutionId,
            'password'                  => $hashedPassword,
            'system_generated_password' => true,
            'email_verified_at'         => !empty($email) ? now() : null,
            'status'                    => 1,
        ]);

        return [$user, $plainPassword];
    }

    // ── Student profile data builder ────────────────────────────────

    /**
     * Build the base StudentProfile column array from a CSV row.
     *
     * Callers may add extra keys (reg_no, roll_no, stream_id) before creating.
     */
    protected function buildProfileData(array $row, User $user, ?Stream $stream, ?int $sessionId, string $rawMobile): array
    {
        $data = [
            'user_id'              => $user->id,
            'institution_id'       => $this->institutionId,
            'session_id'           => $sessionId,
            'mobile'               => !empty($rawMobile) ? (string) $rawMobile : null,
            'gender'               => $row['gender'] ?? null,
            'dob'                  => $this->parseDate($row['dob'] ?? null),
            'father_name'          => $row['father_name'] ?? null,
            'father_mobile'        => isset($row['father_mobile']) ? (string) $row['father_mobile'] : null,
            'mother_name'          => $row['mother_name'] ?? null,
            'category'             => $row['category'] ?? null,
            'religion'             => $row['religion'] ?? null,
            'aadhar_no'            => isset($row['aadhar_no']) ? (string) $row['aadhar_no'] : null,
            'blood_group'          => $row['blood_group'] ?? null,
            'nationality'          => $row['nationality'] ?? null,
            'address'              => $row['address'] ?? null,
            'city'                 => $row['city'] ?? null,
            'state'                => $row['state'] ?? null,
            'pincode'              => isset($row['pincode']) ? (string) $row['pincode'] : null,
            'admission_date'       => $this->parseDate($row['admission_date'] ?? null) ?? now()->toDateString(),
            'abc_no'               => isset($row['abc_id']) ? (string) $row['abc_id'] : null,
        ];

        if ($stream) {
            $data['stream_id'] = $stream->id;
        }

        return $data;
    }

    // ── Guardian creation ───────────────────────────────────────────

    /**
     * Create or link a guardian using father info, falling back to the student's own mobile.
     */
    protected function createGuardianIfAvailable(array $row, User $user, string $rawEmail, string $rawMobile): void
    {
        $fatherName   = $row['father_name'] ?? null;
        $fatherMobile = !empty($row['father_mobile']) ? (string) $row['father_mobile'] : null;
        // Fallback chain: father_mobile → student's own mobile
        $guardianContact = $fatherMobile ?? (!empty($rawMobile) ? (string) $rawMobile : null);

        if (!empty($fatherName) || !empty($guardianContact)) {
            app(GuardianService::class)->resolveOrCreateAndLinkToStudent(
                $this->institutionId,
                !empty($rawEmail) ? $rawEmail : null,
                $guardianContact,
                $fatherName ?? 'Guardian of ' . $user->name,
                $user->id,
                'father'
            );
        }
    }

    // ── Stream resolution ───────────────────────────────────────────

    /**
     * Resolve stream from alias map → code → DB. Returns null for NC, false on error.
     *
     * @return Stream|null|false
     */
    protected function resolveStreamFromRow(array $row, string $studentName): Stream|null|false
    {
        $className  = strtoupper(trim($row['class'] ?? ''));
        $streamCode = null;

        if (!empty($className)) {
            if (array_key_exists($className, $this->classAliases)) {
                $streamCode = $this->classAliases[$className];
            } else {
                $streamCode = trim($row['stream_code'] ?? '') ?: null;
            }

            // NC = non-class student OR empty alias
            if ((empty($streamCode) && $streamCode !== '0') && $className !== 'NC') {
                $this->rowErrors[] = "Student '{$studentName}': class '{$className}' not found in alias map";
                return false;
            }

            if (!empty($streamCode)) {
                return $this->findStreamByCode($streamCode, $studentName, $className);
            }

            return null; // NC student
        }

        // No class column — try stream_code directly
        $directCode = trim($row['stream_code'] ?? '');
        if (!empty($directCode)) {
            return $this->findStreamByCode($directCode, $studentName, $directCode);
        }

        return null; // No class info at all
    }

    /**
     * Find stream by code (cached), with name-fallback.
     */
    protected function findStreamByCode(string $code, string $studentName, string $originalValue): Stream|false
    {
        if (!isset($this->streamCache[$code])) {
            $this->streamCache[$code] = Stream::where('institution_id', $this->institutionId)
                ->where('code', $code)
                ->first();

            // Fallback: try stream name match
            if (!$this->streamCache[$code]) {
                $this->streamCache[$code] = Stream::where('institution_id', $this->institutionId)
                    ->where('name', 'LIKE', "%{$code}%")
                    ->first();
            }
        }

        $stream = $this->streamCache[$code];
        if (!$stream) {
            $this->rowErrors[] = "Student '{$studentName}': stream '{$originalValue}' (code: {$code}) not found";
            return false;
        }
        return $stream;
    }

    // ── Session resolution ──────────────────────────────────────────

    /**
     * Resolve session ID from CSV row. Supports "2025-26", "2025-2026" formats.
     * Falls back to current session. Auto-creates session if not found.
     *
     * @return int|false Session ID, or false on failure
     */
    protected function resolveSessionFromRow(array $row, string $studentName, bool $autoCreate = false): int|false
    {
        $sessionName = trim($row['session_name'] ?? '');

        if (!empty($sessionName)) {
            if (preg_match('/^(\d{4})-(\d{2,4})$/', $sessionName, $matches)) {
                $startYear = (int) $matches[1];
                $endPart   = $matches[2];
                $endYear   = strlen($endPart) === 2
                    ? (int) (substr((string) $startYear, 0, 2) . $endPart)
                    : (int) $endPart;

                $cacheKey = "{$startYear}-{$endYear}";
                if (!isset($this->sessionCache[$cacheKey])) {
                    $session = Session::withoutGlobalScopes()
                        ->where('institution_id', $this->institutionId)
                        ->where('start_year', $startYear)
                        ->where('end_year', $endYear)
                        ->first();

                    // Auto-create if allowed and not found
                    if (!$session && $autoCreate) {
                        $hasCurrent = Session::withoutGlobalScopes()
                            ->where('institution_id', $this->institutionId)
                            ->where('is_current', true)
                            ->exists();

                        $session = Session::create([
                            'institution_id'  => $this->institutionId,
                            'name'            => "{$startYear}-{$endYear}",
                            'start_year'      => $startYear,
                            'end_year'        => $endYear,
                            'duration_months' => ($endYear - $startYear) * 12,
                            'is_current'      => !$hasCurrent,
                            'status'          => 1,
                        ]);
                        Log::info("Import: auto-created session '{$startYear}-{$endYear}' for institution {$this->institutionId}");
                    }

                    $this->sessionCache[$cacheKey] = $session;
                }

                if ($this->sessionCache[$cacheKey]) {
                    return $this->sessionCache[$cacheKey]->id;
                }
            }

            // Try exact name match
            if (!isset($this->sessionCache[$sessionName])) {
                $this->sessionCache[$sessionName] = Session::where('institution_id', $this->institutionId)
                    ->where('name', $sessionName)
                    ->first();
            }
            if ($this->sessionCache[$sessionName]) {
                return $this->sessionCache[$sessionName]->id;
            }

            $this->rowErrors[] = "Student '{$studentName}': session '{$sessionName}' not found";
            return false;
        }

        // Fallback to calendar-resolved current session, then manual is_current flag
        $calendarSession = app(\App\Services\AcademicCalendarService::class)
            ->resolveCurrentSession($this->institutionId);

        if ($calendarSession) {
            return $calendarSession->id;
        }

        $currentId = Session::where('institution_id', $this->institutionId)
            ->where('is_current', true)
            ->value('id');

        if (!$currentId) {
            $this->rowErrors[] = "Student '{$studentName}': no current session found";
            return false;
        }

        return $currentId;
    }

    // ── Utilities ───────────────────────────────────────────────────

    /**
     * Smart class name normalizer — auto-fixes messy Excel values at runtime.
     *
     * Handles: KG-1, KG-II, CLASS 1, CLASS-I, 1ST, 2ND, GRADE 5, STD-3,
     *          NURSERY, KINDERGARTEN, PLAY, PREP, LOWER KG, UPPER KG, etc.
     *
     * Returns a canonical alias key (NUR, LKG, UKG, I-XII, NC) that
     * matches `config/class_aliases.php`, or the original value if unrecognised.
     */
    protected function normalizeClassName(?string $raw): ?string
    {
        if (is_null($raw) || trim($raw) === '') {
            return $raw;
        }

        $v = strtoupper(trim((string) $raw));

        // Already a known alias key — fast path
        if (array_key_exists($v, $this->classAliases)) {
            return $v;
        }

        // ── Pre-primary patterns ─────────────────────────────────
        $prePrimaryMap = [
            // Nursery variants
            'NURSERY'       => 'NUR',
            'NUR'           => 'NUR',
            'PLAY'          => 'NUR',
            'PLAY GROUP'    => 'NUR',
            'PLAYGROUP'     => 'NUR',
            'PG'            => 'NUR',
            'PREP'          => 'NUR',
            'PREPRIMARY'    => 'NUR',
            'PRE-PRIMARY'   => 'NUR',
            'PRE PRIMARY'   => 'NUR',
            'KIDS'          => 'NUR',
            'KINDERGARTEN'  => 'NUR',
            'KG'            => 'NUR',
            'PP1'           => 'NUR',
            'PRE-NUR'       => 'NUR',
            'PRE NUR'       => 'NUR',

            // LKG variants
            'LKG'           => 'LKG',
            'L.K.G'         => 'LKG',
            'L.K.G.'        => 'LKG',
            'LOWER KG'      => 'LKG',
            'LOWER-KG'      => 'LKG',
            'KG-1'          => 'LKG',
            'KG-I'          => 'LKG',
            'KG1'           => 'LKG',
            'KG 1'          => 'LKG',
            'KG I'          => 'LKG',
            'JR.KG'         => 'LKG',
            'JR KG'         => 'LKG',
            'JUNIOR KG'     => 'LKG',
            'PP2'           => 'LKG',

            // UKG variants
            'UKG'           => 'UKG',
            'U.K.G'         => 'UKG',
            'U.K.G.'        => 'UKG',
            'UPPER KG'      => 'UKG',
            'UPPER-KG'      => 'UKG',
            'KG-2'          => 'UKG',
            'KG-II'         => 'UKG',
            'KG2'           => 'UKG',
            'KG 2'          => 'UKG',
            'KG II'         => 'UKG',
            'SR.KG'         => 'UKG',
            'SR KG'         => 'UKG',
            'SENIOR KG'     => 'UKG',
            'PP3'           => 'UKG',
        ];

        if (isset($prePrimaryMap[$v])) {
            return $prePrimaryMap[$v];
        }

        // ── Non-class ────────────────────────────────────────────
        $ncVariants = ['NC', 'NON-CLASS', 'NON CLASS', 'NONCLASS', 'N/A', 'NA', 'NONE'];
        if (in_array($v, $ncVariants)) {
            return 'NC';
        }

        // ── Roman numeral map ────────────────────────────────────
        $romanToInt = [
            'I' => 1, 'II' => 2, 'III' => 3, 'IV' => 4, 'V' => 5,
            'VI' => 6, 'VII' => 7, 'VIII' => 8, 'IX' => 9, 'X' => 10,
            'XI' => 11, 'XII' => 12,
        ];
        $intToRoman = array_flip($romanToInt);

        // ── Ordinal suffixes: 1ST, 2ND, 3RD, 4TH..12TH ─────────
        if (preg_match('/^(\d{1,2})\s*(ST|ND|RD|TH)$/i', $v, $m)) {
            $num = (int) $m[1];
            if ($num >= 1 && $num <= 12 && isset($intToRoman[$num])) {
                return $intToRoman[$num];
            }
        }

        // ── Word ordinals: FIRST, SECOND..TWELFTH ────────────────
        $wordOrdinals = [
            'FIRST' => 'I', 'SECOND' => 'II', 'THIRD' => 'III', 'FOURTH' => 'IV',
            'FIFTH' => 'V', 'SIXTH' => 'VI', 'SEVENTH' => 'VII', 'EIGHTH' => 'VIII',
            'NINTH' => 'IX', 'TENTH' => 'X', 'ELEVENTH' => 'XI', 'TWELFTH' => 'XII',
        ];
        if (isset($wordOrdinals[$v])) {
            return $wordOrdinals[$v];
        }

        // ── "CLASS/STD/GRADE/CLS" prefix + number or roman ──────
        //    Matches: "CLASS 1", "CLASS-I", "CLS-1", "STD 3", "GRADE-5", "CLASS IV", etc.
        if (preg_match('/^(?:CLASS|CLS|STD|GRADE|STANDARD)[.\-\s]*(\w+)$/i', $v, $m)) {
            $part = strtoupper(trim($m[1]));

            // Roman numeral
            if (isset($romanToInt[$part])) {
                return $part;
            }

            // Numeric
            if (is_numeric($part)) {
                $num = (int) $part;
                if ($num >= 1 && $num <= 12 && isset($intToRoman[$num])) {
                    return $intToRoman[$num];
                }
            }
        }

        // ── Bare numeric: "1".."12" → roman ──────────────────────
        if (is_numeric($v)) {
            $num = (int) $v;
            if ($num >= 1 && $num <= 12 && isset($intToRoman[$num])) {
                return $intToRoman[$num];
            }
        }

        // ── Bare roman: already a valid key ──────────────────────
        if (isset($romanToInt[$v])) {
            return $v;
        }

        // ── Unrecognised — return original (validation will flag it) ─
        return $v;
    }

    /**
     * Normalize a person's name — collapse whitespace, title-case, strip junk.
     */
    protected function normalizeName(?string $raw): ?string
    {
        if (is_null($raw) || trim($raw) === '') {
            return $raw;
        }
        // Strip non-printable characters, collapse spaces
        $name = preg_replace('/\s+/', ' ', trim($raw));
        // Remove leading/trailing punctuation (sometimes Excel has stray dots/commas)
        $name = trim($name, '.,;:!?-_');
        return mb_convert_case($name, MB_CASE_TITLE, 'UTF-8');
    }

    /**
     * Normalize mobile — strip country code (+91, 91, 0), spaces, dashes, brackets.
     * Returns a clean 10-digit string or the original if it doesn't look Indian.
     */
    protected function normalizeMobile(?string $raw): ?string
    {
        if (is_null($raw) || trim((string) $raw) === '') {
            return null;
        }
        // Cast to string (Excel might give float like 9.93E+9)
        $v = (string) $raw;

        // If it looks like scientific notation, convert it
        if (preg_match('/^\d+(\.\d+)?[eE]\+?\d+$/', $v)) {
            $v = number_format((float) $v, 0, '', '');
        }

        // Strip everything except digits and leading +
        $v = preg_replace('/[^\d+]/', '', $v);

        // Remove country code prefixes
        if (preg_match('/^\+?91(\d{10})$/', $v, $m)) {
            $v = $m[1];
        } elseif (preg_match('/^0(\d{10})$/', $v, $m)) {
            $v = $m[1];
        }

        return $v !== '' ? $v : null;
    }

    /**
     * Normalize email — lowercase, trim, strip spaces inside.
     */
    protected function normalizeEmail(?string $raw): ?string
    {
        if (is_null($raw) || trim($raw) === '') {
            return null;
        }
        // Remove any whitespace (sometimes people type "abc @gmail.com")
        return strtolower(preg_replace('/\s+/', '', trim($raw)));
    }

    /**
     * Normalize section — handles "Section A", "Sec-A", "sec a", "1" → "A", etc.
     */
    protected function normalizeSection(?string $raw): ?string
    {
        if (is_null($raw) || trim((string) $raw) === '') {
            return null;
        }
        $v = strtoupper(trim((string) $raw));

        // "SECTION A", "SEC-A", "SEC A", "SEC.A" → extract letter
        if (preg_match('/^(?:SECTION|SEC)[.\-\s]*([A-D])$/i', $v, $m)) {
            return strtoupper($m[1]);
        }

        // Numeric: 1→A, 2→B, 3→C, 4→D
        $numToSection = ['1' => 'A', '2' => 'B', '3' => 'C', '4' => 'D'];
        if (isset($numToSection[$v])) {
            return $numToSection[$v];
        }

        // Already a single letter A-D
        if (preg_match('/^[A-D]$/', $v)) {
            return $v;
        }

        return strtoupper($v);
    }

    /**
     * Normalize gender — handles every common variant.
     */
    protected function normalizeGender(?string $raw): ?string
    {
        if (is_null($raw) || trim((string) $raw) === '') {
            return null;
        }
        $v = strtolower(trim((string) $raw));
        $maleVariants = ['m', 'male', 'boy', 'b', 'man', 'gents', 'masculine', 'पुरुष', 'लड़का'];
        $femaleVariants = ['f', 'female', 'girl', 'g', 'woman', 'ladies', 'feminine', 'महिला', 'लड़की'];
        $otherVariants = ['o', 'other', 'others', 'transgender', 'trans', 'non-binary', 'nb'];

        if (in_array($v, $maleVariants)) {
            return 'Male';
        }
        if (in_array($v, $femaleVariants)) {
            return 'Female';
        }
        if (in_array($v, $otherVariants)) {
            return 'Other';
        }

        return ucfirst($v);
    }

    /**
     * Normalize Aadhar number — strip spaces, dashes, dots. Returns 12-digit string.
     */
    protected function normalizeAadhar(?string $raw): ?string
    {
        if (is_null($raw) || trim((string) $raw) === '') {
            return null;
        }
        $v = (string) $raw;

        // Handle scientific notation from Excel
        if (preg_match('/^\d+(\.\d+)?[eE]\+?\d+$/', $v)) {
            $v = number_format((float) $v, 0, '', '');
        }

        // Strip everything except digits
        $v = preg_replace('/[^\d]/', '', $v);

        return $v !== '' ? $v : null;
    }

    /**
     * Normalize category (caste category) — SC, ST, OBC, General, EWS, etc.
     */
    protected function normalizeCategory(?string $raw): ?string
    {
        if (is_null($raw) || trim($raw) === '') {
            return null;
        }
        $v = strtoupper(trim($raw));
        // Remove dots/spaces: S.C. → SC, O.B.C → OBC
        $clean = preg_replace('/[\.\s\-]/', '', $v);

        $map = [
            'SC'              => 'SC',
            'SCHEDULEDCASTE'  => 'SC',
            'ST'              => 'ST',
            'SCHEDULEDTRIBE'  => 'ST',
            'OBC'             => 'OBC',
            'OTHERBACKWARDCLASS' => 'OBC',
            'OTHERBACKWARDCLASSES' => 'OBC',
            'GEN'             => 'General',
            'GENERAL'         => 'General',
            'UNRESERVED'      => 'General',
            'UR'              => 'General',
            'EWS'             => 'EWS',
            'ECONOMICALLYWEAKERSECTION' => 'EWS',
            'ECONOMICALLYWEAKERSECTIONS' => 'EWS',
            'BCII'            => 'BC-II',
            'BCI'             => 'BC-I',
            'BC'              => 'BC',
            'MBC'             => 'MBC',
        ];

        return $map[$clean] ?? ucfirst(strtolower($raw));
    }

    /**
     * Normalize religion.
     */
    protected function normalizeReligion(?string $raw): ?string
    {
        if (is_null($raw) || trim($raw) === '') {
            return null;
        }
        $v = strtolower(trim($raw));
        $map = [
            'hindu'     => 'Hindu',   'hinduism'   => 'Hindu',   'h' => 'Hindu',
            'muslim'    => 'Muslim',  'islam'      => 'Muslim',  'm' => 'Muslim',  'mohammedan' => 'Muslim',
            'christian' => 'Christian', 'christianity' => 'Christian', 'c' => 'Christian', 'catholic' => 'Christian',
            'sikh'      => 'Sikh',    'sikhism'    => 'Sikh',    's' => 'Sikh',
            'buddhist'  => 'Buddhist','buddhism'   => 'Buddhist', 'b' => 'Buddhist',
            'jain'      => 'Jain',    'jainism'    => 'Jain',    'j' => 'Jain',
            'parsi'     => 'Parsi',   'zoroastrian' => 'Parsi',
            'other'     => 'Other',   'others'     => 'Other',
        ];
        return $map[$v] ?? ucfirst($v);
    }

    /**
     * Normalize fee payment mode.
     */
    protected function normalizePaymentMode(?string $raw): ?string
    {
        if (is_null($raw) || trim($raw) === '') {
            return null;
        }
        $v = strtolower(trim($raw));
        // Remove spaces/dashes
        $clean = preg_replace('/[\s\-_]/', '', $v);

        $map = [
            'cash'         => 'cash',
            'upi'          => 'upi',
            'gpay'         => 'upi',
            'googlepay'    => 'upi',
            'phonepe'      => 'upi',
            'paytm'        => 'upi',
            'bhim'         => 'upi',
            'banktransfer' => 'bank_transfer',
            'neft'         => 'bank_transfer',
            'rtgs'         => 'bank_transfer',
            'imps'         => 'bank_transfer',
            'bank'         => 'bank_transfer',
            'transfer'     => 'bank_transfer',
            'cheque'       => 'cheque',
            'check'        => 'cheque',
            'chq'          => 'cheque',
            'dd'           => 'cheque',
            'demandraft'   => 'cheque',
            'online'       => 'online',
            'onlinepayment' => 'online',
            'netbanking'   => 'online',
            'card'         => 'online',
            'creditcard'   => 'online',
            'debitcard'    => 'online',
        ];

        return $map[$clean] ?? strtolower($raw);
    }

    /**
     * Normalize pincode — strip non-digits, handle Excel quirks.
     */
    protected function normalizePincode(?string $raw): ?string
    {
        if (is_null($raw) || trim((string) $raw) === '') {
            return null;
        }
        $v = (string) $raw;
        // Handle scientific notation
        if (preg_match('/^\d+(\.\d+)?[eE]\+?\d+$/', $v)) {
            $v = number_format((float) $v, 0, '', '');
        }
        // Strip non-digits
        $v = preg_replace('/[^\d]/', '', $v);
        return $v !== '' ? $v : null;
    }

    /**
     * Master normalizer — clean ALL fields in a row before validation.
     * Call this from prepareForValidation() in import classes.
     */
    protected function normalizeImportRow(array $data): array
    {
        // Name
        foreach (['students', 'name'] as $field) {
            if (isset($data[$field]) && !is_null($data[$field])) {
                $data[$field] = $this->normalizeName((string) $data[$field]);
            }
        }

        // Class
        if (isset($data['class']) && !is_null($data['class'])) {
            $data['class'] = $this->normalizeClassName((string) $data['class']);
        }

        // Section
        if (isset($data['section']) && !is_null($data['section'])) {
            $data['section'] = $this->normalizeSection((string) $data['section']);
        }

        // Gender
        if (isset($data['gender']) && !is_null($data['gender'])) {
            $data['gender'] = $this->normalizeGender((string) $data['gender']);
        }

        // Email
        if (isset($data['email']) && !is_null($data['email'])) {
            $data['email'] = $this->normalizeEmail((string) $data['email']);
        }

        // Mobile numbers
        foreach (['mobile', 'father_mobile'] as $field) {
            if (isset($data[$field]) && !is_null($data[$field])) {
                $data[$field] = $this->normalizeMobile($data[$field]);
            }
        }

        // Person names
        foreach (['father_name', 'mother_name'] as $field) {
            if (isset($data[$field]) && !is_null($data[$field])) {
                $data[$field] = $this->normalizeName((string) $data[$field]);
            }
        }

        // Aadhar
        if (isset($data['aadhar_no']) && !is_null($data['aadhar_no'])) {
            $data['aadhar_no'] = $this->normalizeAadhar($data['aadhar_no']);
        }

        // Category
        if (isset($data['category']) && !is_null($data['category'])) {
            $data['category'] = $this->normalizeCategory((string) $data['category']);
        }

        // Religion
        if (isset($data['religion']) && !is_null($data['religion'])) {
            $data['religion'] = $this->normalizeReligion((string) $data['religion']);
        }

        // Pincode
        if (isset($data['pincode']) && !is_null($data['pincode'])) {
            $data['pincode'] = $this->normalizePincode($data['pincode']);
        }

        // Fee amount
        if (isset($data['fee_paid_amount']) && !is_null($data['fee_paid_amount'])) {
            $fee = preg_replace('/[^0-9.]/', '', (string) $data['fee_paid_amount']);
            $data['fee_paid_amount'] = $fee !== '' ? (float) $fee : null;
        }

        // Fee payment mode
        if (isset($data['fee_payment_mode']) && !is_null($data['fee_payment_mode'])) {
            $data['fee_payment_mode'] = $this->normalizePaymentMode((string) $data['fee_payment_mode']);
        }

        // Fee receipt number (cast to string)
        if (isset($data['fee_receipt_no']) && !is_null($data['fee_receipt_no'])) {
            $data['fee_receipt_no'] = (string) $data['fee_receipt_no'];
        }

        // Session name (cast to string)
        if (isset($data['session_name']) && !is_null($data['session_name'])) {
            $data['session_name'] = (string) $data['session_name'];
        }

        // Roll number (cast to string)
        if (isset($data['roll_no']) && !is_null($data['roll_no'])) {
            $data['roll_no'] = (string) $data['roll_no'];
        }

        // Address fields — trim whitespace
        foreach (['address', 'city', 'state'] as $field) {
            if (isset($data[$field]) && !is_null($data[$field])) {
                $data[$field] = trim((string) $data[$field]);
            }
        }

        return $data;
    }

    /**
     * Parse date from Excel serial number or string.
     */
    protected function parseDate($value): ?string
    {
        if (empty($value)) {
            return null;
        }
        try {
            if (is_numeric($value)) {
                return Carbon::instance(\PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value))->format('Y-m-d');
            }
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }

    // ── Getters ─────────────────────────────────────────────────────

    public function getImportedCount(): int
    {
        return $this->importedCount;
    }

    public function getSkippedCount(): int
    {
        return $this->skippedCount;
    }

    public function getDedupSkipped(): int
    {
        return $this->dedupSkipped ?? 0;
    }

    public function getRowErrors(): array
    {
        return $this->rowErrors;
    }

    public function batchSize(): int
    {
        return 25;
    }

    public function chunkSize(): int
    {
        return 50;
    }
}
