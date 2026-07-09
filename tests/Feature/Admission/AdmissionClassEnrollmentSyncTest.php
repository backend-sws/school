<?php

namespace Tests\Feature\Admission;

use App\Models\AdmissionApplication;
use App\Models\AdmissionHead;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Models\Session;
use App\Models\Stream;
use App\Models\User;
use App\Services\AdmissionToStudentSyncService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\SeedRbacAndActAsRole;
use Tests\TestCase;

class AdmissionClassEnrollmentSyncTest extends TestCase
{
    use RefreshDatabase;
    use SeedRbacAndActAsRole;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRbac();
        Notification::fake();
    }

    #[Test]
    public function approval_sync_enrolls_student_when_class_id_is_stream_id(): void
    {
        $institutionId = (int) config('ems.default_institution_id');
        $session = Session::factory()->create(['institution_id' => $institutionId]);
        $stream = Stream::factory()->create(['institution_id' => $institutionId]);

        $sectionA = LmsClass::create([
            'institution_id' => $institutionId,
            'stream_id' => $stream->id,
            'session_id' => $session->id,
            'section' => 'A',
            'name' => 'Section A',
            'status' => 1,
        ]);

        $sectionB = LmsClass::create([
            'institution_id' => $institutionId,
            'stream_id' => $stream->id,
            'session_id' => $session->id,
            'section' => 'B',
            'name' => 'Section B',
            'status' => 1,
        ]);

        LmsClassEnrollment::create([
            'lms_class_id' => $sectionA->id,
            'user_id' => User::factory()->create()->id,
            'role' => 'student',
            'status' => 'active',
            'enrolled_at' => now(),
        ]);

        $student = User::factory()->create(['institution_id' => $institutionId]);
        $head = AdmissionHead::factory()->published()->create([
            'institution_id' => $institutionId,
            'stream_id' => $stream->id,
            'session_id' => $session->id,
        ]);

        $application = AdmissionApplication::factory()->create([
            'institution_id' => $institutionId,
            'user_id' => $student->id,
            'admission_head_id' => $head->id,
            'session_id' => $session->id,
            'class_id' => $stream->id,
            'process_status' => 'approved',
        ]);

        app(AdmissionToStudentSyncService::class)->syncFromApplication($application->fresh(['admissionHead.stream', 'user']));

        $this->assertDatabaseHas('lms_class_enrollments', [
            'user_id' => $student->id,
            'lms_class_id' => $sectionB->id,
            'role' => 'student',
            'status' => 'active',
        ]);
    }

    #[Test]
    public function approval_sync_enrolls_student_when_class_id_is_lms_class_id(): void
    {
        $institutionId = (int) config('ems.default_institution_id');
        $session = Session::factory()->create(['institution_id' => $institutionId]);
        $stream = Stream::factory()->create(['institution_id' => $institutionId]);

        $section = LmsClass::create([
            'institution_id' => $institutionId,
            'stream_id' => $stream->id,
            'session_id' => $session->id,
            'section' => 'A',
            'name' => 'Section A',
            'status' => 1,
        ]);

        $student = User::factory()->create(['institution_id' => $institutionId]);
        $head = AdmissionHead::factory()->published()->create([
            'institution_id' => $institutionId,
            'stream_id' => $stream->id,
            'session_id' => $session->id,
        ]);

        $application = AdmissionApplication::factory()->create([
            'institution_id' => $institutionId,
            'user_id' => $student->id,
            'admission_head_id' => $head->id,
            'session_id' => $session->id,
            'class_id' => $section->id,
            'process_status' => 'approved',
        ]);

        app(AdmissionToStudentSyncService::class)->syncFromApplication($application->fresh(['admissionHead.stream', 'user']));

        $this->assertDatabaseHas('lms_class_enrollments', [
            'user_id' => $student->id,
            'lms_class_id' => $section->id,
            'role' => 'student',
            'status' => 'active',
        ]);
    }
}
