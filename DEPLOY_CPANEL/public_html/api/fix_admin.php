<?php
// fix_admin.php - Reset de Senha e Diagnóstico de Dados
// Acesse via: https://training.zedecks.com/api/fix_admin.php

ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h1>Ferramenta de Correção Zedeck's</h1>";
echo "<pre>";

require __DIR__.'/../../../zedecks-core/backend/vendor/autoload.php';
$app = require_once __DIR__.'/../../../zedecks-core/backend/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(\Illuminate\Http\Request::capture());

// 0. Limpar Caches (CRITICO para o CORS funcionar)
echo "--- 0. Limpando Caches ---\n";
try {
    \Illuminate\Support\Facades\Artisan::call('config:clear');
    echo "Config Cache Limpo: " . \Illuminate\Support\Facades\Artisan::output() . "\n";
    \Illuminate\Support\Facades\Artisan::call('route:clear');
    echo "Route Cache Limpo: " . \Illuminate\Support\Facades\Artisan::output() . "\n";
} catch (Exception $e) {
    echo "Aviso ao limpar cache: " . $e->getMessage() . "\n";
}

echo "Conectado ao DB: " . config('database.default') . "\n\n";

// 1. Resetar Admin
echo "--- 1. Resetando Admin ---\n";
$email = 'admin@zedecks.com';
$user = \App\Models\User::where('email', $email)->first();

if ($user) {
    echo "Usuário encontrado: {$user->name} (ID: {$user->id})\n";
    
    // IMPORTANTE: O modelo User tem cast 'hashed', então NÃO use Hash::make aqui se usar Eloquent
    $newPassword = 'password';
    $user->password = $newPassword; // O Laravel faz o hash automaticamente
    $user->role = 'admin';
    $user->save();
    
    echo "SENHA REDEFINIDA COM SUCESSO! ✅\n";
    echo "Nova senha: $newPassword\n";
    echo "Login deve funcionar agora.\n";
} else {
    echo "ERRO: Usuário $email não encontrado! Criando...\n";
    // Para criar, o cast também funciona
    $user = \App\Models\User::create([
        'name' => 'Admin Emergency',
        'email' => $email,
        'password' => 'password', // Cast automático
        'role' => 'admin'
    ]);
    echo "Usuário Criado! Senha: password\n";
}

// 2. Checar Cursos
echo "\n--- 2. Verificando Cursos ---\n";
// Forçar publicação de todos os cursos
\App\Models\Course::query()->update(['is_published' => true]);
echo "Todos os cursos foram marcados como PUBLICADOS (is_published = 1).\n";

$courses = \App\Models\Course::where('is_published', true)->get();
echo "Total de cursos VISÍVEIS: " . $courses->count() . "\n";

if ($courses->count() > 0) {
    foreach ($courses->take(3) as $c) {
        echo "- [{$c->id}] {$c->title} (Publicado)\n";
    }
}

echo "\n--- FIM ---\n";
echo "Tente fazer login agora.\n";
echo "</pre>";
