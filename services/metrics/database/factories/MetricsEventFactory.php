<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\MetricsEvent;

class MetricsEventFactory extends Factory
{
    protected $model = MetricsEvent::class;

    public function definition()
    {
        return [
            'campaign_id' => $this->faker->randomDigitNotNull(),
            'metric'      => $this->faker->randomElement(['impressions','clicks','conversions']),
            'count'       => $this->faker->numberBetween(1, 100),
            'recorded_at' => now()->subDays(rand(0,5)),
        ];
    }
}
