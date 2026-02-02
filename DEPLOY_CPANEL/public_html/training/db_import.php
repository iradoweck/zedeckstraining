<?php
// db_import.php - Script para importar install.sql via PHP
// Coloque este arquivo e o install.sql na MESMA PASTA do seu servidor.

define('DB_HOST', 'localhost');
define('DB_USER', 'SEU_USUARIO_DO_BANCO');
define('DB_PASS', 'SUA_SENHA_DO_BANCO');
define('DB_NAME', 'SEU_NOME_DO_BANCO');

ini_set('max_execution_time', 3000);
ini_set('memory_limit', '256M');

echo "<h1>Importador de Banco de Dados</h1>";
echo "<pre>";

if (!file_exists('install.sql')) {
    // Tenta achar na raiz se estivermos na pasta public_html
    if (file_exists('../../install.sql')) {
        copy('../../install.sql', 'install.sql');
    } else {
        die("ERRO: Arquivo 'install.sql' não encontrado.\n");
    }
}

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Conectado ao banco: " . DB_NAME . "\n";
    echo "Lendo install.sql...\n";
    
    $sql = file_get_contents('install.sql');
    
    // 1. Detectar e remover BOM
    $bom = pack('H*','EFBBBF');
    if (preg_match("/^$bom/", $sql)) {
        $sql = preg_replace("/^$bom/", '', $sql);
    }

    // 2. Converter UTF-16LE
    if (substr($sql, 0, 2) === "\xFF\xFE") {
        $sql = mb_convert_encoding($sql, 'UTF-8', 'UTF-16LE');
    }

    // 3. Fix Collation
    if (strpos($sql, 'utf8mb4_0900_ai_ci') !== false) {
        $sql = str_replace('utf8mb4_0900_ai_ci', 'utf8mb4_unicode_ci', $sql);
        echo "Aviso: Collation corrigida.\n";
    }
    
    echo "Executando queries...\n";
    $pdo->exec($sql);
    
    echo "SUCESSO! Banco de dados importado.\n";
    
} catch (PDOException $e) {
    echo "ERRO DE CONEXÃO/IMPORTAÇÃO:\n";
    echo $e->getMessage();
}
echo "</pre>";
