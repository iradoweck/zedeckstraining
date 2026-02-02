# Guia de Deploy Manual no cPanel

Este guia descreve como subir os arquivos da pasta `DEPLOY_CPANEL` para o seu servidor cPanel.

## 1. Preparação (Local)
A pasta `DEPLOY_CPANEL` já contém:
- **public_html**: O build do frontend (Site/React).
- **backend**: O código do Laravel (API).

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

## 4. Criar Usuário Admin
Para acessar o painel, você precisa criar o primeiro usuário.
1.  **Via Terminal (SSH)**:
    Na pasta do backend, rode:
    ```bash
    php create_test_users.php
    ```
    Isso vai criar o usuário `admin@zedecks.com` com senha `password`.

2.  **Via Banco de Dados (Se não tiver Terminal)**:
    - Vá no PHPMyAdmin.
    - Abra a tabela `users`.
    - Insira um usuário manualmente com:
        - name: Admin
        - email: admin@zedecks.com
        - password: A senha precisa ser "Hashada". Use este hash para a senha 'password': `$2y$12$K.l.Pqq.m.d.Q.u.o.t.e.d.h.a.s.h` (ou use um gerador de Bcrypt online).
        - role: admin

## 5. Configuração do Frontend e API
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
