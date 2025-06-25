<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\AnalyticsDailyMetric;

class AnalyticsDailyMetricFactory extends Factory
{
    protected $model = AnalyticsDailyMetric::class;

    public function definition()
    {
        return [
            'campaign_id'     => $this->faker->randomDigitNotNull(),
            'date'            => now()->subDay(),
            'impressions'     => $this->faker->numberBetween(0,1000),
            'clicks'          => $this->faker->numberBetween(0,500),
            'conversions'     => $this->faker->numberBetween(0,100),
            'ctr'             => $this->faker->randomFloat(2, 0, 1),
            'conversion_rate' => $this->faker->randomFloat(2, 0, 1),
        ];
    }
}
