<?php

echo "<pre>";
echo "--- Zedeck's Training Server Setup ---\n";

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

function run_command($cmd) {
    echo "Running: {$cmd}\n";
    try {
        Artisan::call($cmd);
        echo Artisan::output() . "\n";
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
    echo "---------------------------------\n";
}

use Illuminate\Support\Facades\Artisan;

// 1. Clear Caches
run_command('optimize:clear');
run_command('config:clear');
run_command('cache:clear');
run_command('route:clear');
run_command('view:clear');

// 2. Storage Link
run_command('storage:link');

// 3. Permissions Check (Simple)
$storage_path = storage_path();
if (is_writable($storage_path)) {
    echo "Storage is writable ✅\n";
} else {
    echo "WARNING: Storage is NOT writable ❌. chmod -R 775 {$storage_path}\n";
}

echo "Setup Finished.\n";
echo "</pre>";
