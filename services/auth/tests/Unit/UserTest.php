<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_factory_creates_user_with_hashed_password()
    {
        $user = User::factory()->create([
            'password' => bcrypt('secret'),
        ]);

        $this->assertDatabaseHas('users', ['id' => $user->id]);
        $this->assertTrue(Hash::check('secret', $user->password));
    }
}
