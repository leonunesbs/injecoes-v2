# Sistema de Restante de Injeções - Fluxo Completo

## Visão Geral

O sistema de restante de injeções funciona como um "crédito" que o paciente possui para receber injeções. Este restante é recarregado a cada consulta médica através de prescrições.

## Fluxo do Sistema

### 1. Cadastro Inicial do Paciente

```
Paciente → Indicação + Medicação + Classificação Swalis
- Restante inicial: 0 injeções OD/OS
- Total prescrito: 0
- Total aplicado: 0
```

### 2. Consulta Médica

```
Médico → Consulta → Prescrição de Injeções
- Prescreve X injeções para OD
- Prescreve Y injeções para OS
- Atualiza restante do paciente
```

### 3. Aplicação de Injeções

```
Enfermeiro → Aplica Injeção → Decrementa Restante
- Aplica 1 injeção OD → Restante OD -1
- Aplica 1 injeção OS → Restante OS -1
- Atualiza total aplicado
```

## Modelos de Dados

### Patient (Paciente)

- `balanceOD`: Restante atual de injeções no olho direito
- `balanceOS`: Restante atual de injeções no olho esquerdo
- `totalPrescribedOD`: Total de injeções prescritas para OD (histórico)
- `totalPrescribedOS`: Total de injeções prescritas para OS (histórico)
- `totalAppliedOD`: Total de injeções aplicadas em OD (histórico)
- `totalAppliedOS`: Total de injeções aplicadas em OS (histórico)

### Consultation (Consulta)

- Data da consulta
- Observações médicas
- Próxima consulta agendada
- Status da consulta

### Prescription (Prescrição)

- Quantidade prescrita para OD
- Quantidade prescrita para OS
- Observações da prescrição
- Prioridade baseada exclusivamente na classificação SWALIS
- Status da prescrição

### Injection (Injeção)

- Data agendada vs aplicada
- Quantidade aplicada por olho
- Status da injeção
- Observações e efeitos colaterais

## Regras de Negócio

### 1. Prescrição de Injeções

- A cada consulta, o médico pode prescrever novas injeções
- As prescrições são adicionadas ao restante do paciente
- O restante é incrementado: `balanceOD += prescribedOD`

### 2. Aplicação de Injeções

- Só é possível aplicar injeções se houver restante disponível
- A cada aplicação, o restante é decrementado: `balanceOD -= appliedOD`
- O total aplicado é incrementado: `totalAppliedOD += appliedOD`

### 3. Validações

- Restante não pode ser negativo
- Prescrições ativas não podem ser canceladas se já houver aplicações
- Injeções só podem ser aplicadas por usuários autorizados

## Exemplo Prático

### Cenário: Paciente João Silva

1. **Cadastro Inicial**
   - Indicação: DMRI
   - Medicação: Lucentis
   - Classificação: B
   - Restante: 0 OD, 0 OS

2. **Primeira Consulta (01/01/2024)**
   - Médico prescreve: 3 injeções OD, 2 injeções OS
   - Restante atualizado: 3 OD, 2 OS
   - Total prescrito: 3 OD, 2 OS

3. **Aplicação de Injeções**
   - 15/01/2024: Aplica 1 OD → Restante: 2 OD, 2 OS
   - 29/01/2024: Aplica 1 OD → Restante: 1 OD, 2 OS
   - 12/02/2024: Aplica 1 OS → Restante: 1 OD, 1 OS

4. **Segunda Consulta (01/03/2024)**
   - Médico prescreve: 2 injeções OD, 1 injeção OS
   - Restante atualizado: 3 OD, 2 OS (1+2, 1+1)
   - Total prescrito: 5 OD, 3 OS

## Dashboard e Relatórios

### Métricas Importantes

- Pacientes com restante baixo (< 2 injeções)
- Taxa de adesão ao tratamento
- Eficácia por medicamento
- Distribuição por classificação Swalis

### Alertas

- Restante zerado
- Consulta em atraso
- Injeção não aplicada no prazo
- Paciente sem consulta há mais de 3 meses

## Vantagens do Sistema

1. **Controle Financeiro**: Evita aplicações não autorizadas
2. **Rastreamento**: Histórico completo de prescrições e aplicações
3. **Compliance**: Garante que apenas médicos prescrevam
4. **Auditoria**: Rastreamento de quem fez cada ação
5. **Flexibilidade**: Suporte a diferentes medicamentos e indicações

## Próximos Passos

1. Implementar validações de saldo
2. Criar interface de prescrição
3. Desenvolver dashboard de saldos
4. Implementar alertas automáticos
5. Criar relatórios de compliance
