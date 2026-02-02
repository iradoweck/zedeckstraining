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

echo "Conectado ao DB: " . config('database.default') . "\n\n";

// 1. Resetar Admin
echo "--- 1. Resetando Admin ---\n";
$email = 'admin@zedecks.com';
$user = \App\Models\User::where('email', $email)->first();

if ($user) {
    echo "Usuário encontrado: {$user->name} (ID: {$user->id})\n";
    
    $newPassword = 'password';
    $user->password = \Illuminate\Support\Facades\Hash::make($newPassword);
    $user->role = 'admin'; // Garantir cargo
    $user->save();
    
    echo "SENHA REDEFINIDA COM SUCESSO! ✅\n";
    echo "Nova senha: $newPassword\n";
    echo "Hash gerado: " . $user->password . "\n";
} else {
    echo "ERRO: Usuário $email não encontrado! Criando agora...\n";
    $user = \App\Models\User::create([
        'name' => 'Admin Emergency',
        'email' => $email,
        'password' => \Illuminate\Support\Facades\Hash::make('password'),
        'role' => 'admin'
    ]);
    echo "Usuário Criado! Senha: password\n";
}

// 2. Checar Cursos
echo "\n--- 2. Verificando Cursos ---\n";
$courses = \App\Models\Course::all();
echo "Total de cursos no banco: " . $courses->count() . "\n";

if ($courses->count() > 0) {
    echo "Listando primeiros 3 cursos:\n";
    foreach ($courses->take(3) as $c) {
        echo "- [{$c->id}] {$c->title} ({$c->status})\n";
    }
} else {
    echo "⚠️ NENHUM CURSO ENCONTRADO via Eloquent.\n";
    echo "Verifique se a tabela 'courses' não está vazia no PHPMyAdmin.\n";
}

echo "\n--- FIM ---\n";
echo "Tente fazer login agora.\n";
echo "</pre>";
