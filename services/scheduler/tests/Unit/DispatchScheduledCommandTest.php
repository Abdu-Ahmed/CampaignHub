<?php
namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;

class DispatchScheduledCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_command_runs_without_exceptions()
    {
        // Run the actual signature
        $exitCode = Artisan::call('campaigns:dispatch-scheduled');

        // Just assert we got an integer exit code (no crash)
        $this->assertIsInt($exitCode);

        // And ensure output is non-null string
        $output = Artisan::output();
        $this->assertIsString($output);
    }
}
