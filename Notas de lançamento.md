# Notas de Lançamento

## v1.2.1 - UI/UX Polish & Internacionalização
**Data**: 03/02/2026

A versão **v1.2.1** é uma atualização focada em **Refinamento de UI/UX** e **Internacionalização (i18n)**. Todas as arestas da v1.2.0 foram polidas para oferecer uma experiência "Premium" e totalmente bilíngue.

### ✨ Novidades
- **Rebranding Completo**: Mudança oficial para "Zedeck Training System" (ZTS).
- **Dark Mode Nativo**: Suporte completo a tema escuro/claro com detecção de sistema.
- **Títulos Dinâmicos**: O nome da aba do navegador muda conforme o contexto (Visitante vs Académico).
- **Interface de Login/Registro Renovada**:
    - Novos botões com feedback visual (hover glide).
    - Proteção de privacidade em placeholders.
    - Navegação intuitiva com botão "Voltar" flutuante.

### 🌍 Internacionalização
- **Suporte Multi-Idioma**: PT-MZ (Padrão) e EN-UK.
- **Seletor de Idioma**: Novo design minimalista com bandeiras (🇲🇿 / 🇬🇧).
- **Tradução Completa**: Landing Page, Dashboards, Menus e Mensagens de Erro traduzidos.

### 🛠️ Correções Técnicas
- **Corrigido**: Duplicação de elementos no layout de Login.
- **Corrigido**: Lógica de registro agora força o cargo "student" e bloqueia registros duplicados.
- **Corrigido**: Responsividade do menu mobile e posicionamento de toggles.

---


## v1.2.0 (Versão Atual) - Build de Produção e Clean Install
**Data**: 02/02/2026

Esta versão foca na estabilidade do deploy em servidores compartilhados (cPanel) e corrige problemas críticos de autenticação.

### ✨ Novidades
- **Pacote "Zero Config"**: Nova estrutura de pastas `DEPLOY_CPANEL` que espelha exatamente o servidor (`boot/backend` e `public_html/training`).
- **Instalador de Banco**: Script `db_import.php` para importar SQL gigante sem timeout.
- **Reset de Admin**: Ferramenta `fix_admin.php` para resetar senha e caches via navegador.

### 🐛 Correções (Bug Fixes)
- **[CRÍTICO] Login**: Resolvido problema de `Network Error` causado por falta de CORS (`cors.php`).
- **[CRÍTICO] Rotas 404**: Corrigido `index.php` da API para funcionar dentro da subpasta `/api` usando `SCRIPT_NAME override`.
- **Database**: Collation do banco ajustada para `utf8mb4_unicode_ci` (compatibilidade total).
- **Frontend**: `VITE_API_URL` apontado corretamente para `https://seudominio.com/api/v1`.

### 📦 Arquivos Modificados
- `backend/config/cors.php` (Adicionado)
- `public_html/api/index.php` (Patch de Rota + CORS)
- `INSTRUÇÕES.md` (Atualizado para guia drag-and-drop)

---
