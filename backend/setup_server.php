<?php
// setup_server.php - Instalação e Atualização ZTS
// Coloque na pasta raiz do backend (onde está o artisan)

echo "<pre>";
echo "<h1>🛠️ ZTS - Setup Tool (v1.2.1)</h1>";

if (!file_exists('artisan')) {
    die("ERRO: Execute este script na pasta raiz do backend (onde está o arquivo artisan).");
}

function run_command($cmd) {
    echo "Running: <strong>{$cmd}</strong>... ";
    flush();
    
    // Tenta rodar via exec() se disponível
    if (function_exists('exec')) {
        $output = [];
        $return_var = 0;
        exec("php artisan {$cmd} 2>&1", $output, $return_var);
        
        if ($return_var === 0) {
            echo "<span style='color:green'>OK</span>\n";
            // Opcional: mostrar output
            // echo implode("\n", $output) . "\n";
        } else {
            echo "<span style='color:red'>ERRO</span>\n";
            echo implode("\n", $output) . "\n";
        }
    } else {
        echo "<span style='color:orange'>SKIP (exec() desabilitado)</span>\n";
    }
}

// 1. Limpeza de Caches (Crítico após update de .env)
echo "--- 1. Limpeza de Ambiente ---\n";
run_command('optimize:clear');
run_command('config:clear');

// 2. Banco de Dados (Atualização Segura)
echo "\n--- 2. Banco de Dados ---\n";
echo "Aplicando migrações (modo force - não apaga dados, apenas atualiza estrutura)...\n";
run_command('migrate --force');

// 3. Storage Link
echo "\n--- 3. Arquivos Públicos ---\n";
run_command('storage:link');

// 4. Verificação de Permissões
echo "\n--- 4. Permissões de Pasta ---\n";
$dirs = ['storage', 'bootstrap/cache'];
foreach ($dirs as $dir) {
    echo "Checando {$dir}... ";
    if (is_writable(__DIR__ . '/' . $dir)) {
        echo "<span style='color:green'>Escrita OK</span>\n";
    } else {
        echo "<span style='color:red'>SEM PERMISSÃO (chmod 775 necessario)</span>\n";
    }
}

echo "\n---------------------------------\n";
echo "<strong>Processo Finalizado.</strong>\n";
echo "Se houve erros de 'migrate', verifique as credenciais no arquivo .env.\n";
echo "</pre>";
