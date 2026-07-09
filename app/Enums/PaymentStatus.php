<?php
namespace App\Enums;

enum PaymentStatus: string
{
    case PENDING = 'pending';
    case SUCCESS = 'success';
    case FAILED = 'failed';
    case NOT_APPLICABLE = 'not_applicable';
    case PARTIAL = 'partial';
    case REFUNDED = 'refunded';
}