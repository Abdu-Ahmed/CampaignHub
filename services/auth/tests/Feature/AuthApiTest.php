<?php
namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function can_register_a_new_user()
    {
        $payload = [
            'name'                  => 'Alice12',
            'email'                 => 'alice12@example.com',
            // satisfies your validator: uppercase, lowercase, number, special
            'password'              => 'Secret123!',
            'password_confirmation' => 'Secret123!',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(201)
                 ->assertJsonStructure(['token']);

        $this->assertDatabaseHas('users', [
            'email' => 'alice12@example.com',
            'name'  => 'Alice12',
        ]);
    }

    /** @test */
    public function can_login_and_retrieve_authenticated_user()
    {
        $user = User::factory()->create([
            'email'    => 'bob@example.com',
            'password' => bcrypt('Secret123!'),
        ]);

        $login = $this->postJson('/api/login', [
            'email'    => 'bob@example.com',
            'password' => 'Secret123!',
        ]);

        $login->assertOk()
              ->assertJsonStructure(['token']);

        $token = $login->json('token');

        $me = $this->withHeader('Authorization', "Bearer {$token}")
                   ->getJson('/api/debug/user');

        $me->assertOk()
           ->assertJson([
               'id'    => $user->id,
               'email' => 'bob@example.com',
               'name'  => $user->name,
           ]);
    }
}
