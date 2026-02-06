# Zedeck's Training System

![Version](https://img.shields.io/badge/version-v1.2.3-green)

Este é o sistema oficial de gestão acadêmica e treinamentos da Zedeck's.

## 🚀 Sobre o Projeto
O sistema é uma plataforma completa (LMS) que gerencia:
- **Painel do Estudante (v1.2.3)**:
  - Visão Geral Acadêmica e Financeira.
  - Acesso a Salas de Aula Virtuais.
  - Alertas inteligentes de pagamentos e aulas.
- Inscrições de Alunos e Matrículas.
- Diários de Classe e Presença (Formadores).
- Gestão Financeira (Pagamentos, Faturas, Recibos).

## 🛠 Tecnologia
- **Backend**: Laravel 11 (API REST)
- **Frontend**: React (Vite) + Tailwind CSS + Shadcn UI
- **Banco de Dados**: MySQL (utf8mb4)
- **Autenticação**: Laravel Sanctum (RBAC)

## 📂 Estrutura de Pastas
- `/backend`: Código fonte da API e regras de negócio.
- `/frontend`: Interface do usuário (React).
- `/DEPLOY_CPANEL`: (Gerado automaticamente) Pacote pronto para subir no servidor.

## 📦 Como Deployar
Consulte o arquivo `DEPLOY_CPANEL/INSTRUÇÕES.md` para o guia passo-a-passo de como colocar em produção.
