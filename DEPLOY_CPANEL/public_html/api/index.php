<?php
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Bridge para o Backend
// Ajustado para estrutura: public_html/training/api -> home/zedecks/zedecks-core/backend
// --- DEBUG START ---
try {
    $logMsg = date('[Y-m-d H:i:s] ') . $_SERVER['REQUEST_METHOD'] . ' ' . $_SERVER['REQUEST_URI'] . "\n";
    file_put_contents(__DIR__ . '/request_log.txt', $logMsg, FILE_APPEND);
} catch (Exception $e) {}

// Rota de Health Check (Bypass Laravel)
if (strpos($_SERVER['REQUEST_URI'], '/api/health') !== false) {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    echo json_encode(['status' => 'alive', 'timestamp' => time()]);
    exit;
}

// --- CORS BRUTE FORCE (Nuclear Fix) ---
// Se o Laravel falhar, nós garantimos o header aqui
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With");

// Opção rápida para Preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}
// --------------------------------------

require __DIR__.'/../../../zedecks-core/backend/vendor/autoload.php';

// --- PATH FIX (Subdirectory Issue) ---
// O Laravel vê que estamos na pasta "api" e remove "api" da URL.
// Mas nossas rotas esperam "api".
// Solução: Fingimos que o script está na raiz, assim o "api" conta como rota.
$_SERVER['SCRIPT_NAME'] = '/index.php';
// -------------------------------------

try {
    $app = require_once __DIR__.'/../../../zedecks-core/backend/bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    $response = $kernel->handle(
        $request = Illuminate\Http\Request::capture()
    );

    // --- DEBUG PATH MATCHING ---
    $debugMsg = "Laravel Path: " . $request->path() . " | Full URL: " . $request->url() . "\n";
    file_put_contents(__DIR__ . '/request_log.txt', $debugMsg, FILE_APPEND);
    // ---------------------------

    $response->send();
    $kernel->terminate($request, $response);
} catch (Throwable $e) {
    http_response_code(500);
    echo "SERVER ERROR: " . $e->getMessage();
    file_put_contents(__DIR__ . '/error_log.txt', $e->getMessage(), FILE_APPEND);
}
