# Architecture Documentation

Documentação da arquitetura e design do sistema de injeções oftalmológicas.

## 📋 Conteúdo

- **[Sistema de Saldo](./balance-system.md)** - Fluxo completo do sistema de saldo de injeções
- **[Design Patterns](./design-patterns.md)** - Padrões de design utilizados
- **[Data Flow](./data-flow.md)** - Fluxo de dados no sistema

## 🏗️ Arquitetura Geral

### Stack Tecnológico

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: tRPC, Prisma ORM
- **Banco de Dados**: PostgreSQL
- **Autenticação**: NextAuth.js
- **Estilização**: Tailwind CSS

### Princípios Arquiteturais

- **Separação de Responsabilidades**: Cada camada tem responsabilidades bem definidas
- **Type Safety**: TypeScript em todo o stack
- **Performance**: Otimizações para consultas rápidas
- **Escalabilidade**: Arquitetura preparada para crescimento

## 🔄 Fluxos Principais

### 1. Cadastro de Paciente

```
Frontend → tRPC → Prisma → PostgreSQL
```

### 2. Prescrição de Injeções

```
Consulta → Prescrição → Atualização de Saldo
```

### 3. Aplicação de Injeções

```
Agendamento → Aplicação → Decremento de Saldo
```

## 📊 Padrões de Dados

### Normalização

- Dados normalizados para evitar redundância
- Relacionamentos bem definidos
- Índices estratégicos para performance

### Auditoria

- Rastreamento completo de alterações
- Timestamps em todos os modelos
- Identificação de responsáveis

## 🔒 Segurança

### Autenticação

- NextAuth.js para autenticação
- Sessões seguras
- Controle de acesso por usuário

### Validação

- Validação no frontend e backend
- Sanitização de dados
- Prevenção de SQL injection via Prisma
