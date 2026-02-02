<?php
// check_requirements.php - Auditoria de Servidor para ZTS
header('Content-Type: text/html; charset=utf-8');

$requirements = [
    'PHP Version >= 8.2' => version_compare(PHP_VERSION, '8.2.0', '>='),
    'BCMath Extension' => extension_loaded('bcmath'),
    'Ctype Extension' => extension_loaded('ctype'),
    'JSON Extension' => extension_loaded('json'),
    'Mbstring Extension' => extension_loaded('mbstring'),
    'OpenSSL Extension' => extension_loaded('openssl'),
    'PDO Extension' => extension_loaded('pdo'),
    'PDO MySQL Extension' => extension_loaded('pdo_mysql'),
    'Tokenizer Extension' => extension_loaded('tokenizer'),
    'XML Extension' => extension_loaded('xml'),
    'Fileinfo Extension' => extension_loaded('fileinfo'),
];

$all_passed = !in_array(false, $requirements);
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <title>ZTS - Server Check</title>
    <style>
        body { font-family: sans-serif; max-width: 800px; margin: 2rem auto; padding: 1rem; background: #f8fafc; color: #0f172a; }
        .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        h1 { color: #1f4ed8; }
        .item { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #e2e8f0; }
        .pass { color: green; font-weight: bold; }
        .fail { color: red; font-weight: bold; }
        .summary { margin-top: 1.5rem; font-weight: bold; text-align: center; padding: 1rem; border-radius: 4px; }
        .success { background: #dcfce7; color: #166534; }
        .error { background: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <div class="card">
        <h1>🔍 ZTS - Verificação de Servidor</h1>
        <p>Verificando compatibilidade com Zedeck Training System v1.2.1</p>
        
        <?php foreach ($requirements as $label => $passed): ?>
            <div class="item">
                <span><?php echo $label; ?></span>
                <span class="<?php echo $passed ? 'pass' : 'fail'; ?>">
                    <?php echo $passed ? 'OK' : 'FALHA'; ?>
                </span>
            </div>
        <?php endforeach; ?>

        <div class="summary <?php echo $all_passed ? 'success' : 'error'; ?>">
            <?php if ($all_passed): ?>
                ✅ Servidor Compatível! Pode prosseguir com a instalação.
            <?php else: ?>
                ❌ Servidor Incompatível. Corrija os itens acima.
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
