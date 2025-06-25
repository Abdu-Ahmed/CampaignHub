<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Campaign;

class CampaignTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Force this test to use our in‑memory connection:
     */
    protected $connection = 'sqlite_testing';

    /** @test */
    public function factory_creates_campaign_record()
    {
        $campaign = Campaign::factory()->create();

        $this->assertDatabaseHas('campaigns', [
            'id'    => $campaign->id,
            'title' => $campaign->title,
        ]);

        $this->assertIsString($campaign->title);
        $this->assertIsInt($campaign->user_id);
    }
}
