<?php
namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\DB;

class DebugDatabaseTest extends TestCase
{
    /** @test */
    public function it_outputs_the_current_database_connection()
    {
        // Dump to stdout so PHPUnit will show it
        fwrite(STDERR, "DB default connection: " . config('database.default') . "\\n");
        fwrite(STDERR, "Env DB_CONNECTION: " . env('DB_CONNECTION') . "\\n");
        fwrite(STDERR, "Running DB driver: " . DB::connection()->getDriverName() . "\\n");

        // A trivial assertion so the test passes
        $this->assertTrue(true);
    }
}
