<?php
namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

class AnalyticsApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function can_manage_dashboards()
    {
        // ← THIS WILL SURFACE the actual exception instead of a 500
        $this->withoutExceptionHandling();

        Sanctum::actingAs(User::factory()->create(), ['*']);

        $configArray = [
            'layout' => [
                ['type'=>'daily-chart','campaignId'=>14,'x'=>0,'y'=>0,'w'=>6,'h'=>4]
            ]
        ];

        // Create
        $create = $this->postJson('/api/analytics/dashboards', [
            'name'   => 'Dash',
            'config' => $configArray,
        ]);

        $create->assertCreated();

        $id = $create->json('id');


          // List
          $response = $this->getJson('/api/analytics/dashboards');


           $response
               ->assertOk()
               ->assertJsonFragment(['id'   => $id])
               ->assertJsonFragment(['name' => 'Dash']);
    }
}
