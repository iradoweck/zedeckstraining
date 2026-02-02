<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "--- Login Check ---\n";

$email = 'admin@zedecks.com';
$password = 'password';

$user = User::where('email', $email)->first();

if (!$user) {
    echo "User not found!\n";
    exit(1);
}

echo "User found: {$user->email}\n";
echo "Stored Hash: {$user->password}\n";

if (Hash::check($password, $user->password)) {
    echo "SUCCESS: Password matches!\n";
} else {
    echo "FAILED: Password does NOT match.\n";
    echo "Re-hashing password...\n";
    $user->password = Hash::make($password);
    $user->save();
    echo "Password updated. Try again.\n";
}
