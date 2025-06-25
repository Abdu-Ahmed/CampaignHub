<?php
namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Campaign;
use Laravel\Sanctum\Sanctum;

class CampaignApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);
    }

    /** @test */
    public function can_list_campaigns()
    {
        Campaign::factory()->count(3)->create(['user_id' => auth()->id()]);

        $response = $this->getJson('/api/campaigns');
        $response
            ->assertOk()
            ->assertJsonCount(3);          // raw array of 3 campaigns
    }

    /** @test */
    public function can_create_and_fetch_campaign()
    {
        $payload = [
            'title'      => 'Test',
            'description'=> 'Desc',
            'start_date' => now()->toDateString(),
            'status'     => 'draft',
        ];

        // CREATE
        $create = $this->postJson('/api/campaigns', $payload);
        $create
            ->assertStatus(201)
            ->assertJsonFragment(['title' => 'Test']);

        $id = $create->json('id');        // top-level id

        // FETCH
        $fetch = $this->getJson("/api/campaigns/{$id}");
        $fetch
            ->assertOk()
            ->assertJsonFragment([
                'id'    => $id,
                'title' => 'Test',
            ]);
    }
}
