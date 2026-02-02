<?php
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Bridge para o Backend
// Ajustado para estrutura: public_html/training/api -> home/zedecks/zedecks-core/backend
require __DIR__.'/../../../zedecks-core/backend/vendor/autoload.php';

(require_once __DIR__.'/../../../zedecks-core/backend/bootstrap/app.php')
    ->handleRequest(Request::capture());
