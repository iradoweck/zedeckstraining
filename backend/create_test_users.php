<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "Creating Test Users...\n";

// Create Admin
$admin = User::updateOrCreate(
    ['email' => 'admin@zedecks.com'],
    [
        'name' => 'Admin User',
        'password' => Hash::make('password'),
        'role' => 'admin'
    ]
);
echo "Admin created: admin@zedecks.com / password\n";

// Create Trainer
$trainer = User::updateOrCreate(
    ['email' => 'trainer@zedecks.com'],
    [
        'name' => 'Trainer User',
        'password' => Hash::make('password'),
        'role' => 'trainer'
    ]
);
echo "Trainer created: trainer@zedecks.com / password (ID: {$trainer->id})\n";

// Create Student
$student = User::updateOrCreate(
    ['email' => 'student@zedecks.com'],
    [
        'name' => 'Student User',
        'password' => Hash::make('password'),
        'role' => 'student'
    ]
);
echo "Student created: student@zedecks.com / password (ID: {$student->id})\n";

echo "Done.\n";
