<?php

namespace App\Services;

use Aws\S3\S3Client;
use RuntimeException;

class R2Service
{
    private S3Client $client;

    public function __construct()
    {
        $key = config('filesystems.disks.r2.key');
        $secret = config('filesystems.disks.r2.secret');
        $endpoint = config('filesystems.disks.r2.endpoint');
        $bucket = config('filesystems.disks.r2.bucket');

        if (empty($key) || empty($secret)) {
            throw new RuntimeException(
                'Cloudflare R2 credentials are not configured. Add R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, and R2_BUCKET to your .env file. See .env.example for reference.'
            );
        }

        if (empty($endpoint) || empty($bucket)) {
            throw new RuntimeException(
                'Cloudflare R2 endpoint or bucket is not configured. Add R2_ENDPOINT and R2_BUCKET to your .env file.'
            );
        }

        $endpoint = rtrim((string) $endpoint, '/');
        if (!empty($bucket) && str_ends_with($endpoint, '/' . $bucket)) {
            $endpoint = substr($endpoint, 0, -strlen('/' . $bucket));
        }

        $options = [
            'version' => 'latest',
            'region' => config('filesystems.disks.r2.region') ?? 'auto',
            'endpoint' => $endpoint,
            'use_path_style_endpoint' => config('filesystems.disks.r2.use_path_style_endpoint', true),
            'credentials' => [
                'key' => $key,
                'secret' => $secret,
            ],
        ];

        // Ensure SSL verification works in all environments (including Windows local dev)
        $caBundle = ini_get('curl.cainfo') ?: ini_get('openssl.cafile');
        if (!empty($caBundle) && file_exists($caBundle)) {
            $options['http'] = ['verify' => $caBundle];
        } elseif (app()->environment('local', 'development', 'testing') || config('app.debug')) {
            $options['http'] = ['verify' => false];
        }

        $this->client = new S3Client($options);
    }

    // Upload URL
    public function uploadUrl(string $path, string $type, int $minutes = 5): string
    {
        $cmd = $this->client->getCommand('PutObject', [
            'Bucket' => config('filesystems.disks.r2.bucket'),
            'Key' => $path,
            'ContentType' => $type,
        ]);

        // Force Content-Type into signed headers so R2 accepts browser PUTs
        $cmd['@http'] = ['headers' => ['Content-Type' => $type]];

        return (string) $this->client
            ->createPresignedRequest($cmd, "+{$minutes} minutes")
            ->getUri();
    }

    /**
     * Upload a file to R2 (server-side). No CORS - use when frontend posts to your API.
     */
    public function put(string $path, $body, string $contentType): void
    {
        $this->client->putObject([
            'Bucket' => config('filesystems.disks.r2.bucket'),
            'Key' => $path,
            'Body' => $body,
            'ContentType' => $contentType,
        ]);
    }

    //  View URL
    public function viewUrl(string $path, int $minutes = 1440): string
    {
        $cmd = $this->client->getCommand('GetObject', [
            'Bucket' => config('filesystems.disks.r2.bucket'),
            'Key' => $path,
        ]);

        return (string) $this->client
            ->createPresignedRequest($cmd, "+{$minutes} minutes")
            ->getUri();
    }

    /**
     * Get object from R2 as a stream (for proxying to client, e.g. college logo).
     *
     * @return array{Body: \Psr\Http\Message\StreamInterface, ContentType?: string}|null
     */
    public function getObject(string $path): ?array
    {
        $result = $this->client->getObject([
            'Bucket' => config('filesystems.disks.r2.bucket'),
            'Key' => $path,
        ]);

        return [
            'Body' => $result['Body'],
            'ContentType' => $result['ContentType'] ?? 'application/octet-stream',
        ];
    }
}
