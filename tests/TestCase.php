<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Create a default institution and ensure the config matches its ID
        // This prevents FK violations and visibility issues in multi-institution mode
        $college = \App\Models\Institution::factory()->create();
        config(['ems.default_institution_id' => $college->id]);
    }
}
