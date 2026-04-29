<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash; // ← ajouter cet import

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Utilisateur normal (pour les tests)
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Compte administrateur ← ajouter ce bloc
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@adminclick.ma',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);
    }
}