# Notas de Lançamento

## v1.2.3 - Base da Dashboard do Estudante (2026-02-06)
**Foco:** Infraestrutura Base, Navegação e Segurança.

### 🚀 Novidades
- **Nova Estrutura de Pastas:** Dashboard organizada em `src/app/dashboard/estudante`.
- **Navegação Reformulada:**
  - Sidebar com links específicos para o estudante (Visão Geral, Financeiro, etc.).
  - Indicação clara da versão v1.2.3 no rodapé do menu.
- **Página Overview:**
  - Cards de resumo financeiro e aulas ativas.
  - Alertas prioritários.
- **UX Aprimorada & Feedback Imersivo:**
  - **Notificações Globais:** Sistema de *Toasts* (Notificações) integrado ao `main.jsx` para feedback visual em toda a aplicação.
  - **Login:** Mensagem de sucesso ("Login realizado Com sucesso" / "Login successful") com fundo **Verde Esmeralda**.
  - **Logout:** Mensagem de despedida ("Saiu com Sucesso, Até breve!" / "Logged out successfully...") com fundo **Dark Mode**.
  - **Internacionalização (i18n):** Todo o ciclo de entrada e saída traduzido (PT/EN).
  - Tratamento de erro 404 para rotas inexistentes.

### 🛠️ Técnico
- Implementação de `StudentLayout` com proteção RBAC.
- Refatoração do `Router.jsx` para suportar rotas aninhadas.
- **Correção de Arquitetura:** Movido `<Toaster />` para `main.jsx` corrigindo visibilidade de notificações pós-redirect.
- Persistência de estado de UI usando flags temporárias em `localStorage`.

---

# Notas de Lançamento (Anteriores)

## v1.2.3 - Dashboard Financeiro & Mock Data
**Data**: 06/02/2026

A versão **v1.2.3** introduz o **Painel do Estudante (Dashboard)** recriado com foco em métricas e status financeiro. Para permitir o desenvolvimento ágil da interface, utilizamos simuladores de dados (Mock Data) para o módulo financeiro.

### ✨ Novidades
- **Dashboard em Grid**: Nova organização visual com cards de estatísticas (Aulas, Frequência, Tarefas).
- **Módulo Financeiro (Frontend)**:
    - Card de destaque com **Saldo em Dívida** e **Total Pago**.
    - Botão visual "Pagar Agora".
    - Dados simulados para validar a experiência de usuário antes da integração backend.
- **Seção de Documentos**: Acesso rápido ao ID de Estudante e Declarações (Placeholder).

### 🛠️ Técnico
- **Mock Service**: Criado `mockFinancials.js` para simular latência de rede e respostas da API financeira.
- **Componentização**: Novo componente `FinancialCard.jsx` e `StudentDashboard.jsx` refatorado.
- **Backend**: Rotas `/financials` preparadas (comentadas) no `api.php`.

### 📦 Arquivos Modificados
- `src/pages/Dashboard.jsx`
- `src/components/student/StudentDashboard.jsx` (Novo)
- `src/components/dashboard/FinancialCard.jsx` (Novo)
- `src/services/mockFinancials.js` (Novo)
- `src/i18n.js` (Novas chaves financeiras)

---

## v1.2.2 - Estabilidade & Polimento Final
**Data**: 05/02/2026

A versão **v1.2.2** foca na estabilidade do fluxo de entrada do aluno. Corrigimos falhas críticas no registro, refinamos a experiência de sucesso e garantimos que a versão do sistema seja refletida automaticamente em toda a aplicação.

### ✨ Novidades
- **Tela de Sucesso Personalizada**: Substituímos o redirecionamento abrupto por uma tela de confirmação ("Inscrição Concluída") que orienta o aluno a fazer login.
- **Validação Inteligente**:
    - Campos de telefone bloqueiam letras automaticamente.
    - Campos de documento transformam texto em MAIÚSCULAS em tempo real.
- **Automação de Versão**: O rodapé de todas as páginas agora exibe a versão definida globalmente, eliminando inconsistências.

### 🎨 Refinamento de UI & Internacionalização
- **Auth Premium**: As telas de `Recuperar Senha` e `Redefinir Senha` foram redesenhadas para se igualar à tela de Login (Split Screen).
- **Tradução Completa**: Adicionado suporte total (PT/EN) para mensagens de erro, sucesso e medidores de senha.
- **UX**: Feedback visual aprimorado em botões e inputs de senha.

### 🐛 Correções (Bug Fixes)
- **[CRÍTICO] Registro Falho**: Corrigido erro onde o passo 5 travava silenciosamente devido a migrações pendentes no backend.
- **Loop de Cursos**: Resolvido problema de renderização que causava múltiplas requisições ao buscar cursos.
- **UI Glitch**: Corrigida a duplicação do medidor de senha no formulário.

### 📦 Arquivos Modificados
- `src/pages/Register.jsx` (Lógica de Steps + Validação)
- `src/pages/Login.jsx` (Footer Dinâmico + Lint Fix)
- `src/components/layout/PublicLayout.jsx` (Footer Dinâmico)
- `src/i18n.js` (Novas traduções de Sucesos)

---

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

## v1.2.0 - Deploy Stability & cPanel Support
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
