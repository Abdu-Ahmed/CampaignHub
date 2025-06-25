<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

class MetricsApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);
    }

    /** @test */
    public function can_store_and_retrieve_events()
    {
        // Store
        $post = $this->postJson('/api/metrics', [
            'campaign_id' => 1,
            'metric'      => 'clicks',
            'count'       => 5,
            'timestamp'   => now()->toISOString(),
        ]);
        $post->assertCreated()
             ->assertJson(['success' => true]);

        // Retrieve
        $get = $this->getJson('/api/campaigns/1/metrics');
        $get->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['metric' => 'clicks', 'count' => 5]);
    }
}
