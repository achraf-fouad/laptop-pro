<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
        ]);

        if (!\App\Models\User::where('email', 'admin@antigravity.fr')->exists()) {
            \App\Models\User::create([
                'name' => 'Admin',
                'email' => 'admin@antigravity.fr',
                'password' => \Illuminate\Support\Facades\Hash::make('secret123'),
            ]);
        }
    }
}
