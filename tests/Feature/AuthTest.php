<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use App\Models\School;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class AuthTest extends TestCase
{
    public function test_user_can_login_with_valid_credentials()
    {
        $school = School::create([
            'name' => 'SMA Cipta Bangsa',
            'npsn' => '20108920',
        ]);

        $role = Role::create(['name' => 'SUPER ADMIN / OPS', 'label' => 'OPS']);

        $user = User::create([
            'school_id' => $school->id,
            'name' => 'Bagas Pratama',
            'email' => 'bagas@smaciptabangsa.sch.id',
            'password' => Hash::make('password123'),
            'is_active' => true,
        ]);
        $user->roles()->attach($role);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'bagas@smaciptabangsa.sch.id',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email', 'roles']]);
    }

    public function test_user_cannot_login_with_invalid_password()
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'nonexistent@smaciptabangsa.sch.id',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_deactivated_user_is_forbidden_from_login()
    {
        $user = User::create([
            'name' => 'Inactive User',
            'email' => 'inactive@smaciptabangsa.sch.id',
            'password' => Hash::make('password123'),
            'is_active' => false,
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'inactive@smaciptabangsa.sch.id',
            'password' => 'password123',
        ]);

        $response->assertStatus(403);
    }
}

