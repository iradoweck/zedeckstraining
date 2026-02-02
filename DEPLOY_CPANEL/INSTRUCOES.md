# Guia de Deploy Manual no cPanel (v1.2.0)

Este guia descreve como subir os arquivos da pasta `DEPLOY_CPANEL` para o seu servidor cPanel.
**Versão 1.2.0**: Inclui correção de login, rota de API segura e script de reset de admin.

## 1. Preparação (Local)
A pasta `DEPLOY_CPANEL` já contém:
- **public_html**: O build do frontend (Site/React) atualizado.
- **backend**: O código do Laravel (API) com correções de compatibilidade PHP 8.3.

> **Atenção**: Esta pasta **não** contém a pasta `vendor` (dependências do PHP) para economizar tempo de upload e evitar conflitos. Você precisará rodar o comando `composer install` no servidor ou fazer o upload da pasta `vendor` separadamente se não tiver acesso SSH/Terminal.

## 2. Upload para o cPanel
1. Comprima (Zip) o conteúdo da pasta `DEPLOY_CPANEL`.
2. Acesse o **Gerenciador de Arquivos** do cPanel.
3. Faça o upload do arquivo Zip.
4. Extraia os arquivos.

### Estrutura Sugerida no Servidor
Você pode colocar a pasta `backend` na raiz do seu usuário, fora da pasta pública.
Opções comuns:
- `/home/seuusuario/backend` (Mais simples)
- `/home/seuusuario/repositories/backend` (Mais organizado)

*O importante é NÃO colocar o backend dentro de `public_html`, para que ninguém baixe seu código fonte.*

## 3. Configuração do Backend
1. Navegue até a pasta do backend no gerenciador de arquivos.
2. Renomeie o arquivo `.env.example` para `.env` (se já não existir).
3. Edite o `.env` e configure:
   - `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` (Dados do banco de dados).
   - `APP_URL`: Insira a URL do seu site (ex: `https://training.zedecks.com`).
4. Se tiver acesso ao Terminal do cPanel, entre na pasta do backend e rode:
   ```bash
   composer install --optimize-autoloader --no-dev
   php artisan key:generate
   php artisan storage:link
   php artisan migrate
   ```

## 4. Garantir Acesso Admin (Script de Reset)
Se o login ainda falhar, use o script de emergência que criei.

1.  **Via Terminal (SSH)**:
    Na pasta do backend (`~/zedecks-core/backend`), rode:
    ```bash
    php reset_admin.php
    ```
    Isso vai recriar o usuário `admin@zedecks.com` e resetar a senha para `password` (garantido).

2.  **Via Navegador (Sem SSH)**:
    Se não tiver SSH, você pode tentar importar o arquivo SQL manualmente ou pedir suporte.
    Mas como você tem acesso aos arquivos, verifique se o arquivo `.env` no servidor está apontando para o banco de dados correto.

## 5. Configuração do Frontend e API (Personalizada)
A pasta `DEPLOY_CPANEL/public_html` agora contém:
1.  **O Site (React)**: Arquivos como `index.html`, `assets`, etc.
2.  **A Ponte da API**: Uma pasta chamada `api`.

**Passos:**
1.  Mova **todo** o conteúdo de `DEPLOY_CPANEL/public_html` para a pasta `public_html` do seu servidor (sobrescreva se necessário).
2.  **Crucial**: Certifique-se de que a pasta `backend` esteja em `/home/seuusuario/backend`.
    - A pasta `api` que enviei já está configurada para procurar o backend em `../../backend` (dois níveis acima).
    - Se você colocar o backend em outro lugar, precisará editar o arquivo `public_html/api/index.php`.

### Teste Final
- Acesse `https://training.zedecks.com` -> Deve carregar o site.
- Acesse `https://training.zedecks.com/api` -> Deve dar erro do Laravel ou página em branco (mas não erro 404 Apache).
- Acesse o Login -> Deve conectar sem erro de "Network Error".
