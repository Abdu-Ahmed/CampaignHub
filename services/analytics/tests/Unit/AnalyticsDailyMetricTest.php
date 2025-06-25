<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\AnalyticsDailyMetric;

class AnalyticsDailyMetricTest extends TestCase
{
    use RefreshDatabase;

    public function test_factory_creates_daily_metric()
    {
        // Create with explicit numbers so we know impressions/clicks/conversions
        $metric = AnalyticsDailyMetric::factory()->create([
            'impressions' => 100,
            'clicks'      => 10,
            'conversions' => 2,
        ]);

        // The record should exist
        $this->assertDatabaseHas('analytics_daily_metrics', [
            'id'          => $metric->id,
            'impressions' => 100,
            'clicks'      => 10,
            'conversions' => 2,
        ]);

        // CTR and conversion_rate should be floats between 0 and 1
        $this->assertIsFloat($metric->ctr);
        $this->assertIsFloat($metric->conversion_rate);

        $this->assertGreaterThanOrEqual(0.0, $metric->ctr);
        $this->assertLessThanOrEqual(1.0, $metric->ctr);

        $this->assertGreaterThanOrEqual(0.0, $metric->conversion_rate);
        $this->assertLessThanOrEqual(1.0, $metric->conversion_rate);
    }
}
