<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "--- Admin Password Reset Tool ---\n";

$email = 'admin@zedecks.com';
$password = 'password';

$user = User::where('email', $email)->first();

if (!$user) {
    echo "User {$email} not found. Creating...\n";
    $user = new User();
    $user->email = $email;
    $user->name = 'Admin User';
    $user->role = 'admin';
}

$user->password = Hash::make($password);
$user->save();

echo "User: {$email}\n";
echo "New Password: {$password}\n";
echo "Hash: " . $user->password . "\n"; // Print hash to verify manually if needed
echo "---------------------------------\n";
echo "Done. Try logging in now.\n";
