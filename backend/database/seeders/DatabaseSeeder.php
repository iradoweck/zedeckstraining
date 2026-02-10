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
        // User::factory(10)->create();

        // Check if admin exists to prevent duplicate entry errors during updates
        $admin = User::firstOrCreate(
            ['email' => 'admin@zedecks.com'],
            [
                'name' => 'Administrator',
                'password' => 'password', // Will be hashed by model cast
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Create Test Student
        $student = User::firstOrCreate(
            ['email' => 'aluno@zedecks.com'],
            [
                'name' => 'Abel J. Simal',
                'password' => 'password',
                'role' => 'student',
                'email_verified_at' => now(),
            ]
        );

        // Seed courses
        $this->call([
            CourseSeeder::class,
            FinancialSeeder::class, // Ensure Financials are seeded for the student
        ]);

        // Optional: Seed courses if needed
        $this->call(CourseSeeder::class);
    }
}
