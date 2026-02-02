<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Caminho relativo para: /home/usuario/zedecks-core/backend
// Estrutura:
// __DIR__ = .../public_html/training/api
// ../     = .../public_html/training
// ../../  = .../public_html
// ../../../ = /home/usuario

require __DIR__.'/../../../zedecks-core/backend/vendor/autoload.php';

(require_once __DIR__.'/../../../zedecks-core/backend/bootstrap/app.php')
    ->handleRequest(Request::capture());
