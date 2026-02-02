# Guia de Instalação Limpa (Clean Install)

Este pacote contém TODOS os arquivos necessários para uma instalação do zero.

## 1. Limpeza do Servidor (Começando do Zero)
Antes de subir qualquer coisa:
1.  **Arquivos**: Apague TUDO da pasta `/public_html/training` e `/home/usuario/zedecks-core/backend` (se existirem).
2.  **Banco de Dados**: Apague TODAS as tabelas do seu banco de dados atual.

## 2. Upload de Arquivos
A pasta `DEPLOY_CPANEL` está organizada assim:
1.  `public_html`: Conteúdo do Site (Frontend).
2.  `backend`: Código do Sistema (API).
3.  `install.sql`: Banco de dados pronto.
4.  `db_import.php`: Script auxiliar de importação.
5.  `setup_server.php`: Script de configuração.

**Onde colocar cada coisa:**
- Conteúdo de `public_html` -> Na pasta `/public_html/training`.
- Conteúdo de `backend` -> Na pasta `/home/usuario/zedecks-core/backend`.
- Arquivos `install.sql` e `db_import.php` -> Coloque na raiz (`/public_html/training`) TEMPORARIAMENTE para importar o banco.

## 3. Importando o Banco de Dados (Método Infalível)
Como você teve problemas com upload no PHPMyAdmin:

1.  Edite o arquivo `db_import.php` (pode ser antes de subir ou no gerenciador de arquivos do cPanel).
2.  Coloque seus dados:
    ```php
    define('DB_USER', 'seu_usuario_cpanel');
    define('DB_PASS', 'sua_senha_banco');
    define('DB_NAME', 'seu_nome_banco');
    ```
3.  Acesse no navegador: `https://training.zedecks.com/db_import.php`
    - Ele vai ler o `install.sql` e criar tudo para você.
    - Se der sucesso, DELETE os arquivos `db_import.php` e `install.sql` do servidor imediatamente por segurança.

## 4. Configuração Final
1.  **Env**: Vá na pasta do backend, renomeie `.env.example` para `.env` e configure o banco de dados.
2.  **Setup**: Se tiver acesso SSH, vá na pasta backend e rode:
    ```bash
    php setup_server.php
    ```
    Isso vai limpar caches e criar os links.

## 5. Login
- **URL**: `https://training.zedecks.com/login`
- **Email**: `admin@zedecks.com`
- **Senha**: `password`
