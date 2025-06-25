<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\MetricsEvent;

class MetricsEventTest extends TestCase
{
    use RefreshDatabase;

    public function test_factory_creates_metrics_event()
    {
        $event = MetricsEvent::factory()->create([
            'metric' => 'clicks',
            'count'  => 42,
        ]);

        $this->assertDatabaseHas('metrics', [
    'id'       => $event->id,
    'metric'   => 'clicks',
    'count'    => 42,
]);


        $this->assertInstanceOf(\Carbon\Carbon::class, $event->recorded_at);
    }
}
