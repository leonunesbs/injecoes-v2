# Prisma Schema - Sistema de Injeções v2.0

## Visão Geral

Este diretório contém o schema Prisma para o sistema de gerenciamento de injeções oftalmológicas versão 2.0. O schema foi projetado para ser mais abrangente e flexível que a versão anterior, permitindo melhor rastreamento e visualização de dados.

## Estrutura do Schema

### Modelos de Autenticação (NextAuth.js)

- **User**: Usuários do sistema com campos de auditoria
- **Account**: Contas vinculadas aos usuários
- **Session**: Sessões ativas
- **VerificationToken**: Tokens de verificação

### Modelos do Sistema de Injeções

#### 1. Indication (Indicações Médicas)

- **Campos**: `id`, `code`, `name`, `description`, `isActive`
- **Propósito**: Categorizar tipos de indicações (RD/EMD, RD/HV, DMRI, OV, MNVSR, Outros)
- **Índices**: `code`, `isActive`

#### 2. Medication (Medicamentos)

- **Campos**: `id`, `code`, `name`, `activeSubstance`, `isActive`
- **Propósito**: Gerenciar medicamentos disponíveis (Lucentis, Avastin, Eylia, Outros)
- **Índices**: `code`, `isActive`

#### 3. SwalisClassification (Classificação Swalis)

- **Campos**: `id`, `code`, `name`, `description`, `priority`, `isActive`
- **Propósito**: Classificar urgência (A1, A2, B, C, D)
- **Índices**: `code`, `priority`, `isActive`

#### 4. Patient (Pacientes)

- **Campos principais**:
  - Identificação: `refId`, `name`, `birthDate`, `phone`, `email`
  - Relacionamentos: `indicationId`, `medicationId`, `swalisId`
  - Campos específicos: `indicationOther`, `medicationOther`
  - Sistema de saldo: `balanceOD`, `balanceOS`, `totalPrescribedOD`, `totalPrescribedOS`, `totalAppliedOD`, `totalAppliedOS`
  - Configurações: `startWithOD`, `isActive`
  - Auditoria: `createdById`, `createdAt`, `updatedAt`

#### 5. Consultation (Consultas Médicas)

- **Campos principais**:
  - Data: `consultationDate`, `nextVisit`
  - Observações: `notes`
  - Status: `status` (enum: SCHEDULED, COMPLETED, CANCELLED, NO_SHOW)
  - Auditoria: `doctorId`, `createdAt`, `updatedAt`

#### 6. Prescription (Prescrições)

- **Campos principais**:
  - Quantidade: `prescribedOD`, `prescribedOS`
  - Observações: `notes`, `priority`
  - Status: `status` (enum: ACTIVE, COMPLETED, CANCELLED, EXPIRED)
  - Auditoria: `createdAt`, `updatedAt`

#### 7. Injection (Injeções)

- **Campos principais**:
  - Datas: `scheduledDate`, `appliedDate`, `appliedAt`
  - Quantidades: `injectionOD`, `injectionOS`
  - Status: `status` (enum: SCHEDULED, APPLIED, CANCELLED, RESCHEDULED, MISSED)
  - Observações: `observations`, `sideEffects`
  - Auditoria: `appliedById`, `createdAt`, `updatedAt`

## Melhorias da Versão 2.0

### 1. Normalização de Dados

- Separação de indicações, medicamentos e classificações em tabelas próprias
- Eliminação de campos de texto livre para categorias padronizadas
- Possibilidade de "Outros" com campos específicos

### 2. Sistema de Saldo de Injeções

- Saldo atual de injeções por olho (OD/OS)
- Histórico de prescrições e aplicações
- Recarga de saldo a cada consulta médica
- Rastreamento completo de movimentações

### 3. Rastreamento Avançado

- Status detalhado das injeções
- Rastreamento de quem aplicou cada injeção
- Timestamps precisos para agendamento e aplicação

### 4. Otimização para Dashboard

- Índices estratégicos para consultas rápidas
- Relacionamentos otimizados para visualizações
- Campos calculados para estatísticas

### 5. Flexibilidade

- Suporte a indicações e medicamentos customizados
- Sistema de prioridades para classificação Swalis
- Campos de observações e efeitos colaterais

## Próximos Passos

### TODOs Implementados ✅

- [x] Schema Prisma otimizado
- [x] Modelos normalizados
- [x] Índices para performance
- [x] Relacionamentos bem definidos
- [x] Campos de auditoria

### TODOs Pendentes

- [ ] Seed data para indicações, medicamentos e classificações
- [ ] Migrations do banco de dados
- [ ] Validações de dados
- [ ] Testes de integração
- [ ] Documentação da API

## Comandos Úteis

```bash
# Gerar cliente Prisma
npx prisma generate

# Aplicar migrations
npx prisma migrate dev

# Visualizar banco de dados
npx prisma studio

# Reset do banco (desenvolvimento)
npx prisma migrate reset
```

## Considerações de Performance

- Índices criados para consultas frequentes do dashboard
- Relacionamentos otimizados para evitar N+1 queries
- Campos de auditoria para rastreamento completo
- Soft delete com campo `isActive` para preservar histórico

## Segurança

- Relacionamentos com cascade delete apropriados
- Campos de auditoria para compliance
- Validação de dados no nível do schema
- Suporte a autenticação via NextAuth.js
