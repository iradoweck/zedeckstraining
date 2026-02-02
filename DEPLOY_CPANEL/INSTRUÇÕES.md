# Guia Completo de Instalação (v1.2.0)

Este pacote contém **tudo** o que você precisa para colocar o sistema no ar.
Siga os passos na ordem exata para evitar erros.

## O Que Tem no Pacote?
- `zedecks-core/` → Contém o Backend (Laravel) completo.
- `public_html/` → Contém o Frontend (Site) e ferramentas.
- `install.sql` → Arquivo para criar o Banco de Dados.

---

## Passo 1: Limpeza (Opcional, mas Recomendado)
Se já tiver uma instalação antiga, **apague** para não misturar arquivos.
1. Apague a pasta `/public_html/training` do servidor.
2. Apague a pasta `/home/seuusuario/zedecks-core/backend` do servidor.

---

## Passo 2: Upload de Arquivos
O pacote já está na estrutura correta do cPanel.

1.  **Backend**:
    - Pegue a pasta `zedecks-core` deste pacote.
    - Arraste para a **raiz** do seu usuário no Gerenciador de Arquivos (`/home/seuusuario/`).
    - *Nota: Fica no mesmo nível de `public_html`, não dentro dela.*

2.  **Frontend**:
    - Pegue a pasta `public_html` deste pacote.
    - Arraste para a **raiz** do seu usuário.
    - O cPanel vai perguntar se quer mesclar/substituir. Diga **SIM**.
    - Isso vai criar/atualizar a pasta `/public_html/training`.

---

## Passo 3: Configuração do Banco de Dados ⚠️
Este é o passo mais importante.

1.  **Criar o Banco (No cPanel)**:
    - Vá em "Bancos de Dados MySQL".
    - Crie um banco (ex: `seuusuario_zedecks`).
    - Crie um usuário (ex: `seuusuario_admin`).
    - Adicione o usuário ao banco com **TODOS OS PRIVILÉGIOS**.
    - **Anote a senha!**

2.  **Importar as Tabelas**:
    - Vá no "PHPMyAdmin".
    - Selecione o banco que criou.
    - Clique em "Importar" e escolha o arquivo `install.sql` (está na raiz deste pacote).
    - *Se der erro no PHPMyAdmin, use nossa ferramenta: acesse `https://seudominio.com/db_import.php` após o passo 4.*

---

## Passo 4: Conectar o Backend ao Banco 🔌
Agora vamos dizer ao Laravel qual é o banco.

1.  No Gerenciador de Arquivos, vá em: `/home/seuusuario/zedecks-core/backend`.
2.  Procure o arquivo `.env.example`.
3.  **Renomeie** ele para `.env` (apague o final .example).
4.  Clique com botão direito -> **Edit** (Editar).
5.  Procure estas linhas e mude para os seus dados:

    ```ini
    APP_NAME="Zedeck's Training"
    APP_ENV=production
    APP_DEBUG=false
    APP_URL=https://seudominio.com

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=nome_do_seu_banco_aqui
    DB_USERNAME=usuario_do_banco_aqui
    DB_PASSWORD=senha_do_banco_aqui
    ```
6.  Salve o arquivo.

---

## Passo 5: Finalização e Limpeza 🧹
Para garantir que tudo funcione, vamos limpar os caches e configurar o servidor.

1.  Ainda na pasta do backend (`zedecks-core/backend`), procure o arquivo `setup_server.php`.
2.  Se tiver terminal SSH, rode: `php setup_server.php`.
3.  Se não tiver SSH, não tem problema. O sistema deve funcionar mesmo assim.
    - *Apenas garanta que as pastas `storage` e `bootstrap/cache` tenham permissão 775*.

---

## Passo 6: Login e Teste ✅
1.  Acesse: `https://seudominio.com`
2.  Tente fazer login com as **Credenciais Padrão**:
    - **Email**: `admin@zedecks.com` (Não altere este email no login, pois ele é o padrão do banco)
    - **Senha**: `password`

### Solução de Problemas
Se der erro no login ("Network Error" ou "Invalid Credentials"):
1.  Acesse `https://seudominio.com/api/fix_admin.php`
2.  Essa ferramenta vai:
    - Limpar os caches de configuração (importante se você editou o .env).
    - Garantir que a senha do usuário `admin@zedecks.com` seja `password`.
    - Garantir que os cursos estejam publicados.

**Depois que tudo funcionar, APAGUE os arquivos:**
- `public_html/training/db_import.php`
- `public_html/training/api/fix_admin.php`
- `public_html/training/api/debug.php`
- `public_html/training/api/request_log.txt`
