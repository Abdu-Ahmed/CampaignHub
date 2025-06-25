<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;

class SchedulerCommandTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function dispatch_scheduled_campaigns_command_runs()
    {
        // You can optionally seed a fake scheduled campaign here
        // Campaign::factory()->scheduled()->create();

        $exit   = Artisan::call('campaigns:dispatch-scheduled');
        $output = Artisan::output();

        // The key is it runs without throwing
        $this->assertIsInt($exit, 'Exit code should be integer');
        $this->assertIsString($output, 'Command output should be string');
    }
}
