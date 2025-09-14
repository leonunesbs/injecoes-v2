# Sistema de Priorização

## Visão Geral

O sistema de priorização é baseado **exclusivamente** na classificação SWALIS, seguida pela data de indicação do paciente.

## Regras de Priorização

### 1. Critério Principal: Classificação SWALIS

A priorização segue a ordem crescente do campo `priority` na tabela `SwalisClassification`:

| Código | Nome | Prioridade | Descrição                                                     |
| ------ | ---- | ---------- | ------------------------------------------------------------- |
| A1     | A1   | 1          | Paciente com risco de deterioração clínica iminente           |
| A2     | A2   | 2          | Paciente com as atividades diárias completamente prejudicadas |
| B      | B    | 3          | Paciente com prejuízo acentuado das atividades diárias        |
| C      | C    | 4          | Paciente com prejuízo mínimo das atividades diárias           |
| D      | D    | 5          | Não há prejuízo para as atividades diárias                    |

### 2. Critério Secundário: Data de Indicação

Quando dois pacientes têm a mesma classificação SWALIS, a prioridade é determinada pela data de indicação (campo `createdAt` do paciente):

- **Pacientes mais antigos** têm prioridade sobre pacientes mais recentes
- Ordenação: `createdAt ASC` (menor data = maior prioridade)

## Implementação

### Ordenação no Banco de Dados

```sql
ORDER BY
  swalis.priority ASC,  -- 1º critério: SWALIS
  patient.createdAt ASC -- 2º critério: Data de indicação
```

### Exemplo de Ordenação

1. **Paciente A**: SWALIS A1, indicado em 01/01/2024
2. **Paciente B**: SWALIS A1, indicado em 15/01/2024
3. **Paciente C**: SWALIS A2, indicado em 01/01/2024
4. **Paciente D**: SWALIS B, indicado em 01/01/2024

**Ordem de prioridade**: A → B → C → D

## APIs Disponíveis

### Listar Pacientes Ordenados

```typescript
// GET /api/trpc/patient.getAll
{
  limit: 50,
  cursor?: string,
  search?: string,
  swalisFilter?: string,
  indicationFilter?: string,
  medicationFilter?: string
}
```

### Pacientes Urgentes

```typescript
// GET /api/trpc/patient.getUrgent
// Retorna apenas pacientes com SWALIS A1 e A2
{
  limit: 20;
}
```

### Estatísticas por SWALIS

```typescript
// GET /api/trpc/patient.getStatsBySwalis
// Retorna contagem de pacientes por classificação SWALIS
```

## Mudanças Implementadas

### ✅ Removido

- Campo `priority` da tabela `Prescription`
- Índice `priority` da tabela `Prescription`
- Sistema de priorização múltipla

### ✅ Mantido

- Campo `priority` da tabela `SwalisClassification`
- Ordenação por data de indicação (`createdAt`)

### ✅ Adicionado

- Router `patient` com ordenação correta
- Endpoints para listagem ordenada
- Filtros por classificação SWALIS
- Estatísticas de pacientes por prioridade

## Benefícios

1. **Simplicidade**: Apenas um critério de priorização
2. **Consistência**: Ordenação sempre previsível
3. **Eficiência**: Índices otimizados para a ordenação
4. **Flexibilidade**: Filtros mantêm a ordenação correta
5. **Transparência**: Critérios claros e documentados

## Monitoramento

### Métricas Importantes

- Distribuição de pacientes por classificação SWALIS
- Tempo médio de espera por classificação
- Pacientes urgentes (A1/A2) em fila
- Eficiência do atendimento por prioridade

### Alertas Recomendados

- Mais de 10 pacientes A1 em espera
- Pacientes A1 aguardando há mais de 24h
- Desequilíbrio na distribuição de classificações
