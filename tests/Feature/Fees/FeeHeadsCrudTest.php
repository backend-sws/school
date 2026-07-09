<?php

namespace Tests\Feature\Fees;

use App\Models\FeeHead;
use App\Models\FeeParticular;
use App\Models\MainStream;
use App\Models\Session;
use App\Models\Stream;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\SeedRbacAndActAsRole;
use Tests\TestCase;

class FeeHeadsCrudTest extends TestCase
{
    use RefreshDatabase;
    use SeedRbacAndActAsRole;

    private const API_PREFIX = '/api/v1';

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRbac();
    }

    private function createFeeHeadDependencies(): array
    {
        $mainStream = MainStream::factory()->create();
        $stream = Stream::factory()->create(['main_stream_id' => $mainStream->id]);
        $session = Session::factory()->create();
        $particular = FeeParticular::factory()->create();

        return [
            'main_stream_id' => $mainStream->id,
            'stream_id' => $stream->id,
            'session_id' => $session->id,
            'fee_particular_id' => $particular->id,
        ];
    }

    #[Test]
    public function authorized_user_can_list_fee_heads()
    {
        $user = $this->createUserWithRole('institution_admin');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/fee-heads');
        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'data']);
    }

    #[Test]
    public function authorized_user_can_create_fee_head_with_custom_fee_allowed()
    {
        $user = $this->createUserWithRole('institution_admin');
        $deps = $this->createFeeHeadDependencies();
        $payload = [
            'title' => 'Test Fee Head',
            'description' => 'Test description',
            'main_stream_id' => $deps['main_stream_id'],
            'stream_id' => $deps['stream_id'],
            'session_id' => $deps['session_id'],
            'semester' => 1,
            'allow_custom_fee' => true,
            'min_allowed_fee' => 100,
            'status' => 1,
        ];
        $response = $this->postJsonAs($user, self::API_PREFIX . '/fee-heads', $payload);
        $response->assertStatus(201);
        $response->assertJsonPath('data.title', 'Test Fee Head');
        $this->assertDatabaseHas('fee_heads', ['title' => 'Test Fee Head']);
    }

    #[Test]
    public function authorized_user_can_create_fee_head_with_structures()
    {
        $user = $this->createUserWithRole('institution_admin');
        $deps = $this->createFeeHeadDependencies();
        $payload = [
            'title' => 'Structured Fee Head',
            'main_stream_id' => $deps['main_stream_id'],
            'stream_id' => $deps['stream_id'],
            'session_id' => $deps['session_id'],
            'allow_custom_fee' => false,
            'status' => 1,
            'structures' => [
                ['fee_particular_id' => $deps['fee_particular_id'], 'amount' => 500],
            ],
        ];
        $response = $this->postJsonAs($user, self::API_PREFIX . '/fee-heads', $payload);
        $response->assertStatus(201);
        $this->assertDatabaseHas('fee_heads', ['title' => 'Structured Fee Head']);
    }

    #[Test]
    public function authorized_user_can_show_fee_head()
    {
        $user = $this->createUserWithRole('institution_admin');
        $deps = $this->createFeeHeadDependencies();
        $feeHead = FeeHead::withoutGlobalScope('institution_scope')->create([
            'institution_id' => $this->defaultInstitutionId(),
            'title' => 'Show Test Fee Head',
            'main_stream_id' => $deps['main_stream_id'],
            'stream_id' => $deps['stream_id'],
            'session_id' => $deps['session_id'],
            'semester' => 1,
            'status' => 1,
        ]);
        $response = $this->getJsonAs($user, self::API_PREFIX . '/fee-heads/' . $feeHead->id);
        $response->assertStatus(200);
        $response->assertJsonPath('data.title', 'Show Test Fee Head');
    }

    #[Test]
    public function authorized_user_can_update_fee_head()
    {
        $user = $this->createUserWithRole('institution_admin');
        $deps = $this->createFeeHeadDependencies();
        $feeHead = FeeHead::withoutGlobalScope('institution_scope')->create([
            'institution_id' => $this->defaultInstitutionId(),
            'title' => 'Update Test Fee Head',
            'main_stream_id' => $deps['main_stream_id'],
            'stream_id' => $deps['stream_id'],
            'session_id' => $deps['session_id'],
            'semester' => 1,
            'status' => 1,
        ]);
        $response = $this->putJsonAs($user, self::API_PREFIX . '/fee-heads/' . $feeHead->id, [
            'title' => 'Updated Fee Head Title',
            'description' => $feeHead->description,
            'main_stream_id' => $deps['main_stream_id'],
            'stream_id' => $deps['stream_id'],
            'session_id' => $deps['session_id'],
            'semester' => 1,
            'allow_custom_fee' => true,
            'status' => 1,
        ]);
        $response->assertStatus(200);
        $this->assertDatabaseHas('fee_heads', ['id' => $feeHead->id, 'title' => 'Updated Fee Head Title']);
    }

    #[Test]
    public function unauthorized_user_cannot_list_fee_heads()
    {
        $user = $this->createUserWithRole('student');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/fee-heads');
        $response->assertStatus(403);
    }

    #[Test]
    public function unauthorized_user_cannot_create_fee_head()
    {
        $user = $this->createUserWithRole('student');
        $deps = $this->createFeeHeadDependencies();
        $response = $this->postJsonAs($user, self::API_PREFIX . '/fee-heads', [
            'title' => 'Forbidden Fee Head',
            'main_stream_id' => $deps['main_stream_id'],
            'stream_id' => $deps['stream_id'],
            'session_id' => $deps['session_id'],
            'allow_custom_fee' => true,
            'min_allowed_fee' => 100,
            'status' => 1,
        ]);
        $response->assertStatus(403);
        $this->assertDatabaseMissing('fee_heads', ['title' => 'Forbidden Fee Head']);
    }

    #[Test]
    public function unauthorized_user_cannot_show_fee_head()
    {
        $user = $this->createUserWithRole('student');
        $deps = $this->createFeeHeadDependencies();
        $feeHead = FeeHead::withoutGlobalScope('institution_scope')->create([
            'institution_id' => $this->defaultInstitutionId(),
            'title' => 'Forbidden Show',
            'main_stream_id' => $deps['main_stream_id'],
            'stream_id' => $deps['stream_id'],
            'session_id' => $deps['session_id'],
            'semester' => 1,
            'status' => 1,
        ]);
        $response = $this->getJsonAs($user, self::API_PREFIX . '/fee-heads/' . $feeHead->id);
        $response->assertStatus(403);
    }
}
