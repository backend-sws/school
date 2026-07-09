<?php

namespace App\Exceptions;

use RuntimeException;

class SmsQuotaExceededException extends RuntimeException
{
    public function __construct(string $message = 'SMS quota exceeded.')
    {
        parent::__construct($message);
    }
}
