<?php

namespace App\Support {
    class AwsClockSkewPatch {
        private static ?int $offset = null;

        /**
         * Get the difference (offset) between the real world time and the local system time.
         */
        public static function getOffset(): int
        {
            if (self::$offset !== null) {
                return self::$offset;
            }

            self::$offset = 0;

            try {
                $ctx = stream_context_create([
                    'http' => [
                        'method' => 'HEAD',
                        'timeout' => 1.5,
                        'follow_location' => false,
                        'ignore_errors' => true,
                    ]
                ]);
                
                // Fetch current time from Cloudflare's server (fast, reliable DNS endpoint)
                $headers = @get_headers('https://1.1.1.1', true, $ctx);
                $dateStr = null;
                if (isset($headers['Date'])) {
                    $dateStr = is_array($headers['Date']) ? end($headers['Date']) : $headers['Date'];
                } elseif (isset($headers['date'])) {
                    $dateStr = is_array($headers['date']) ? end($headers['date']) : $headers['date'];
                }

                if ($dateStr) {
                    $serverTime = strtotime($dateStr);
                    if ($serverTime > 0) {
                        $localTime = time();
                        $diff = $serverTime - $localTime;
                        // Only apply correction if clock skew is more than 10 seconds
                        if (abs($diff) > 10) {
                            self::$offset = $diff;
                        }
                    }
                }
            } catch (\Throwable $e) {
                // Fallback to 0 offset in case of connection failure
            }

            return self::$offset;
        }
    }
}

namespace Aws\Signature {
    /**
     * Override gmdate in Aws\Signature namespace to offset system clock skew.
     */
    function gmdate($format, $timestamp = null) {
        if ($timestamp === null) {
            $timestamp = \time() + \App\Support\AwsClockSkewPatch::getOffset();
        }
        return \gmdate($format, $timestamp);
    }

    /**
     * Override time in Aws\Signature namespace to offset system clock skew.
     */
    function time() {
        return \time() + \App\Support\AwsClockSkewPatch::getOffset();
    }
}
