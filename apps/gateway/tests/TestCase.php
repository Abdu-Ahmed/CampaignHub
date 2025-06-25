<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Schema;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, RefreshDatabase;

    protected function setUp(): void
    {
        // Initialize Laravel first
        parent::setUp();
        
        // Now facades are available - drop Sanctum's table if it exists
        Schema::dropIfExists('personal_access_tokens');
    }
}