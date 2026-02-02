# Notas de Lançamento

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
