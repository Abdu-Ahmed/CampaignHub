<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Campaign;
use App\Models\User;

class CampaignFactory extends Factory
{
    // The name of the factory’s corresponding model.
    protected $model = Campaign::class;

    public function definition()
    {
        return [
            'user_id'       => User::factory(),           // create a test user
            'title'         => $this->faker->sentence(3),
            'description'   => $this->faker->paragraph(),
            'start_date'    => now()->subDays(rand(1,10))->toDateString(),
            'end_date'      => now()->addDays(rand(1,10))->toDateString(),
            'schedule_time' => now()->addHour()->toDateTimeString(),
            'status'        => $this->faker->randomElement(['draft','scheduled','active']),
        ];
    }
}
