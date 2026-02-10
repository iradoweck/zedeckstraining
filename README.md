# ZTS – Zedeck’s Training System

![ZTS Version](https://img.shields.io/badge/version-v1.2.5-blue?style=for-the-badge&logo=appveyor) ![Status](https://img.shields.io/badge/status-active-success?style=for-the-badge) ![Stack](https://img.shields.io/badge/stack-TALL+React-orange?style=for-the-badge)

> **Plataforma Integrada de Gestão Académica e Financeira**

O **Zedeck's Training System (ZTS)** é um LMS (Learning Management System) moderno e robusto, desenhado para gerir todo o ciclo de vida do estudante, desde a inscrição e pagamentos até ao acesso às aulas e certificação.

---

## 🚀 Visão Geral do Projeto

O sistema elimina a burocracia manual, centrando-se na **autonomia do estudante** e no **controlo institucional**.

### 🌟 Pilares do Sistema
1.  **Zero Atrito Financeiro**: Bloqueios e libertações de acesso são automáticos baseados no estado do pagamento.
2.  **Transparência Total**: O estudante sabe sempre quanto deve, quando vence e por que razão o acesso está bloqueado.
3.  **Documentos Oficiais**: Geração automática de Faturas, Guias e Recibos em PDF.
4.  **Segurança e Auditoria**: Logs imutáveis de todas as transações e alterações de perfil.

---

## 🧩 Módulos Principais

### 🎓 Painel do Estudante (Foco Atual)
O centro de comando para o aluno.
- **Visão Geral (Overview)**: Resumo inteligente da saúde académica e financeira.
- **Financeiro**: Gestão de mensalidades, multas automáticas (15%) e histórico.
- **Documentos**: Central de downloads (Cartões, Certificados, Declarações).
- **Aulas**: Acesso a conteúdos presenciais/online condicionado ao pagamento.

### 🏛️ Painel Administrativo (Backoffice)
Focado na gestão e fiscalização.
- Validação de pagamentos manuais.
- Gestão de turmas e formadores.
- Relatórios globais de inadimplência e receitas.

### 👩‍🏫 Painel do Formador
Ferramentas de sala de aula.
- Diários de classe e presenças.
- Lançamento de notas e avaliações.

---

## 🛠 Tech Stack

Uma arquitetura híbrida focada em performance e segurança.

| Camada | Tecnologias | Detalhes |
| :--- | :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white) ![Tailwind](https://img.shields.io/badge/-Tailwind-38B2AC?logo=tailwind-css&logoColor=white) | Vite, Shadcn UI, Lucide Icons, Axios. |
| **Backend** | ![Laravel](https://img.shields.io/badge/-Laravel_11-FF2D20?logo=laravel&logoColor=white) | API REST, Sanctum (Auth), Eloquent ORM. |
| **Database** | ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?logo=mysql&logoColor=white) | UTF8mb4, Relational Schema. |
| **Infra** | ![cPanel](https://img.shields.io/badge/-cPanel-FF6C2C?logo=cpanel&logoColor=white) | Deploy automatizado em hospedagem partilhada. |

---

## 📂 Estrutura do Repositório

```bash
/
├── backend/          # API Laravel, Regras de Negócio, Migrations
├── frontend/         # Interface React (SPA)
│   ├── src/
│   │   ├── app/      # Rotas e Páginas (Dashboard, Auth)
│   │   ├── components/ # UI Reutilizável (Shadcn)
│   │   └── services/ # Integração com API
├── DEPLOY_CPANEL/    # Artifacts de build prontos para produção
└── README.md         # Este arquivo
```

---

## 🚦 Status de Desenvolvimento

| Versão | Módulo | Progresso |
| :--- | :--- | :--- |
| **v1.2.3** | **Base Dashboard (Layout, i18n)** | ✅ Concluído |
| **v1.2.4** | **Visão Geral (Student Overview)** | ✅ Concluído |
| **v1.2.5** | **Motor Financeiro (Lógica)** | ✅ Concluído |
| **v1.2.6** | **Faturas & PDF** | 📅 Planeado (Próximo) |

---

## 📦 Instalação e Deploy

Para rodar localmente:
1.  **Backend**: `cd backend && composer install && php artisan serve`
2.  **Frontend**: `cd frontend && npm install && npm run dev`

Para produção, consulte `DEPLOY_CPANEL/INSTRUÇÕES.md`.

---
© 2026 **Zedeck's Training System**. Todos os direitos reservados.
