<?php

namespace Tests\Feature\Notifications;

use App\Models\AdmissionApplication;
use App\Models\User;
use App\Notifications\AdmissionStatusChangedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\SeedRbacAndActAsRole;
use Tests\TestCase;

class NotificationApiTest extends TestCase
{
    use RefreshDatabase;
    use SeedRbacAndActAsRole;

    private const API_PREFIX = '/api/v1';

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRbac();
    }

    #[Test]
    public function guest_cannot_access_unread_notifications(): void
    {
        $response = $this->getJson(self::API_PREFIX . '/notifications/unread');
        $response->assertStatus(401);
    }

    #[Test]
    public function authenticated_user_can_list_unread_notifications(): void
    {
        $user = $this->createUserWithRole('institution_admin');
        $application = AdmissionApplication::factory()->create(['user_id' => $user->id]);
        $user->notify(new AdmissionStatusChangedNotification($application, 'approved'));

        $response = $this->actingAs($user)->getJson(self::API_PREFIX . '/notifications/unread');
        $response->assertStatus(200);
        $response->assertJsonStructure(['data' => ['data', 'unread_count', 'meta']]);
        $this->assertGreaterThanOrEqual(1, count($response->json('data.data')));
    }

    #[Test]
    public function authenticated_user_can_mark_notification_as_read(): void
    {
        $user = $this->createUserWithRole('student');
        $application = AdmissionApplication::factory()->create(['user_id' => $user->id]);
        $user->notify(new AdmissionStatusChangedNotification($application, 'approved'));
        $notification = $user->unreadNotifications()->first();
        $this->assertNotNull($notification);

        $response = $this->actingAs($user)->postJson(
            self::API_PREFIX . '/notifications/' . $notification->id . '/read'
        );
        $response->assertStatus(200);

        $notification->refresh();
        $this->assertNotNull($notification->read_at);
    }

    #[Test]
    public function authenticated_user_can_mark_all_as_read(): void
    {
        $user = $this->createUserWithRole('institution_admin');
        $application = AdmissionApplication::factory()->create(['user_id' => $user->id]);
        $user->notify(new AdmissionStatusChangedNotification($application, 'approved'));
        $this->assertGreaterThan(0, $user->unreadNotifications()->count());

        $response = $this->actingAs($user)->postJson(self::API_PREFIX . '/notifications/read-all');
        $response->assertStatus(200);

        $this->assertEquals(0, $user->fresh()->unreadNotifications()->count());
    }

    #[Test]
    public function push_subscribe_requires_authenticated_user(): void
    {
        $response = $this->postJson(self::API_PREFIX . '/notifications/push/subscribe', [
            'endpoint' => 'https://fcm.googleapis.com/fcm/send/test',
        ]);
        $response->assertStatus(401);
    }

    #[Test]
    public function push_subscribe_validates_endpoint(): void
    {
        $user = $this->createUserWithRole('student');
        $response = $this->actingAs($user)->postJson(self::API_PREFIX . '/notifications/push/subscribe', []);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['endpoint']);
    }
}
