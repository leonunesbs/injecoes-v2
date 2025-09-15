# Architecture Documentation

Documentação da arquitetura e design do sistema de injeções oftalmológicas.

## 📋 Conteúdo

- **[Sistema de Restante](./balance-system.md)** - Fluxo completo do sistema de restante de injeções
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

### 2. Configurações do Sistema

```
/settings → Layout com Tabs → Subrotas Específicas
```

**Estrutura de Rotas de Configurações:**

- `/settings` - Página principal (redireciona para indications)
- `/settings/indications` - Gestão de indicações médicas
- `/settings/medications` - Gestão de medicamentos
- `/settings/swalis` - Gestão de classificação Swalis

### 3. Prescrição de Injeções

```
Consulta → Prescrição → Atualização de Restante
```

### 4. Aplicação de Injeções

```
Agendamento → Aplicação → Decremento de Restante
```

## 🎯 Estrutura de Navegação

### Layout de Configurações

O sistema utiliza um layout compartilhado para todas as páginas de configurações:

- **Header**: Título e descrição das configurações
- **Tabs**: Navegação entre seções (indicações, medicamentos, swalis)
- **Content**: Área dinâmica que renderiza a página específica

### Padrão de Páginas

Cada página de configuração segue o mesmo padrão:

1. **Cabeçalho**: Título e descrição da seção
2. **Tabela**: Para visualização e edição dos dados existentes (quando há dados)
3. **Formulário**: Para criação de novos registros
4. **Validação**: Feedback em tempo real
5. **Notificações**: Toast para ações do usuário

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
