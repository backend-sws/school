<?php

namespace Tests\Feature\Security;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\SeedRbacAndActAsRole;
use Tests\TestCase;

class R2UploadSecurityTest extends TestCase
{
    use RefreshDatabase;
    use SeedRbacAndActAsRole;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRbac();
        $this->user = $this->createUserWithRole('institution_admin');
    }

    #[Test]
    public function upload_url_rejects_path_traversal_in_filename()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/r2/upload-url', [
                'file_name' => '../../../etc/passwd',
                'content_type' => 'text/plain'
            ]);

        $response->assertStatus(422);
        $response->assertJsonFragment(['message' => 'Invalid file type. Allowed: jpg, jpeg, png, gif, webp, pdf, doc, docx, xls, xlsx, ppt, pptx, txt, csv']);
    }

    #[Test]
    public function upload_url_rejects_invalid_file_extension()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/r2/upload-url', [
                'file_name' => 'malware.php',
                'content_type' => 'application/x-php'
            ]);

        $response->assertStatus(422);
    }

    #[Test]
    public function upload_url_rejects_unauthorized_content_type()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/r2/upload-url', [
                'file_name' => 'test.txt',
                'content_type' => 'application/x-sh'
            ]);

        $response->assertStatus(422);
        $response->assertJsonFragment(['message' => 'Invalid content type.']);
    }

    #[Test]
    public function upload_url_allows_valid_request()
    {
        // Mocking the R2Service would be better, but for now we check the controller logic
        // We might need to mock R2Service if it tries to hit actual Cloudflare APIs
        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/r2/upload-url', [
                'file_name' => 'document.pdf',
                'content_type' => 'application/pdf'
            ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['upload_url', 'path']);
        $this->assertStringContainsString('document.pdf', $response->json('path'));
    }
}
