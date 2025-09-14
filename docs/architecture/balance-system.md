# Sistema de Saldo de Injeções - Fluxo Completo

## Visão Geral

O sistema de saldo de injeções funciona como um "crédito" que o paciente possui para receber injeções. Este saldo é recarregado a cada consulta médica através de prescrições.

## Fluxo do Sistema

### 1. Cadastro Inicial do Paciente

```
Paciente → Indicação + Medicação + Classificação Swalis
- Saldo inicial: 0 injeções OD/OS
- Total prescrito: 0
- Total aplicado: 0
```

### 2. Consulta Médica

```
Médico → Consulta → Prescrição de Injeções
- Prescreve X injeções para OD
- Prescreve Y injeções para OS
- Atualiza saldo do paciente
```

### 3. Aplicação de Injeções

```
Enfermeiro → Aplica Injeção → Decrementa Saldo
- Aplica 1 injeção OD → Saldo OD -1
- Aplica 1 injeção OS → Saldo OS -1
- Atualiza total aplicado
```

## Modelos de Dados

### Patient (Paciente)

- `balanceOD`: Saldo atual de injeções no olho direito
- `balanceOS`: Saldo atual de injeções no olho esquerdo
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
- Prioridade (normal, alta, urgente)
- Status da prescrição

### Injection (Injeção)

- Data agendada vs aplicada
- Quantidade aplicada por olho
- Status da injeção
- Observações e efeitos colaterais

## Regras de Negócio

### 1. Prescrição de Injeções

- A cada consulta, o médico pode prescrever novas injeções
- As prescrições são adicionadas ao saldo do paciente
- O saldo é incrementado: `balanceOD += prescribedOD`

### 2. Aplicação de Injeções

- Só é possível aplicar injeções se houver saldo disponível
- A cada aplicação, o saldo é decrementado: `balanceOD -= appliedOD`
- O total aplicado é incrementado: `totalAppliedOD += appliedOD`

### 3. Validações

- Saldo não pode ser negativo
- Prescrições ativas não podem ser canceladas se já houver aplicações
- Injeções só podem ser aplicadas por usuários autorizados

## Exemplo Prático

### Cenário: Paciente João Silva

1. **Cadastro Inicial**
   - Indicação: DMRI
   - Medicação: Lucentis
   - Classificação: B
   - Saldo: 0 OD, 0 OS

2. **Primeira Consulta (01/01/2024)**
   - Médico prescreve: 3 injeções OD, 2 injeções OS
   - Saldo atualizado: 3 OD, 2 OS
   - Total prescrito: 3 OD, 2 OS

3. **Aplicação de Injeções**
   - 15/01/2024: Aplica 1 OD → Saldo: 2 OD, 2 OS
   - 29/01/2024: Aplica 1 OD → Saldo: 1 OD, 2 OS
   - 12/02/2024: Aplica 1 OS → Saldo: 1 OD, 1 OS

4. **Segunda Consulta (01/03/2024)**
   - Médico prescreve: 2 injeções OD, 1 injeção OS
   - Saldo atualizado: 3 OD, 2 OS (1+2, 1+1)
   - Total prescrito: 5 OD, 3 OS

## Dashboard e Relatórios

### Métricas Importantes

- Pacientes com saldo baixo (< 2 injeções)
- Taxa de adesão ao tratamento
- Eficácia por medicamento
- Distribuição por classificação Swalis

### Alertas

- Saldo zerado
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
