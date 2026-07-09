<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TestSeriesTest extends Model
{
    protected $table = 'test_series_tests';

    protected $fillable = [
        'test_series_id',
        'lms_test_id',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function testSeries(): BelongsTo
    {
        return $this->belongsTo(TestSeries::class);
    }

    public function lmsTest(): BelongsTo
    {
        return $this->belongsTo(LmsTest::class);
    }
}
