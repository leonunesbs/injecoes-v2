# Seed Data

Dados iniciais e scripts de população do banco de dados.

## 🌱 Dados Iniciais Necessários

### Indicações Médicas

```typescript
const indications = [
  { code: "RD_EMD", name: "Retinopatia Diabética com Edema Macular Diabético" },
  { code: "RD_HV", name: "Retinopatia Diabética com Hemorragia Vítrea" },
  { code: "DMRI", name: "Degeneração Macular Relacionada à Idade" },
  { code: "OV", name: "Oclusão Venosa" },
  { code: "MNVSR", name: "Membrana Neovascular Sub-Retiniana" },
  { code: "OUTROS", name: "Outros" },
];
```

### Medicamentos

```typescript
const medications = [
  { code: "LUCENTIS", name: "Lucentis", activeSubstance: "Ranibizumab" },
  { code: "AVASTIN", name: "Avastin", activeSubstance: "Bevacizumab" },
  { code: "EYLIA", name: "Eylia", activeSubstance: "Aflibercept" },
  { code: "OUTRO", name: "Outro", activeSubstance: "Personalizado" },
];
```

### Classificação Swalis

```typescript
const swalisClassifications = [
  {
    code: "A1",
    name: "A1",
    description: "Paciente com risco de deterioração clínica iminente",
    priority: 1,
  },
  {
    code: "A2",
    name: "A2",
    description:
      "Paciente com as atividades diárias completamente prejudicadas",
    priority: 2,
  },
  {
    code: "B",
    name: "B",
    description: "Paciente com prejuízo acentuado das atividades diárias",
    priority: 3,
  },
  {
    code: "C",
    name: "C",
    description: "Paciente com prejuízo mínimo das atividades diárias",
    priority: 4,
  },
  {
    code: "D",
    name: "D",
    description: "Não há prejuízo para as atividades diárias",
    priority: 5,
  },
];
```

## 🚀 Script de Seed

### Criar arquivo de seed

```bash
# Criar arquivo de seed
touch prisma/seed.ts
```

### Implementação básica

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Indications
  for (const indication of indications) {
    await prisma.indication.upsert({
      where: { code: indication.code },
      update: {},
      create: indication,
    });
  }

  // Seed Medications
  for (const medication of medications) {
    await prisma.medication.upsert({
      where: { code: medication.code },
      update: {},
      create: medication,
    });
  }

  // Seed Swalis Classifications
  for (const swalis of swalisClassifications) {
    await prisma.swalisClassification.upsert({
      where: { code: swalis.code },
      update: {},
      create: swalis,
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Configurar package.json

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

## 🔄 Executar Seed

### Desenvolvimento

```bash
# Executar seed
npx prisma db seed

# Ou executar diretamente
npx tsx prisma/seed.ts
```

### Produção

```bash
# Aplicar migrations primeiro
npx prisma migrate deploy

# Executar seed
npx prisma db seed
```

## 📊 Dados de Teste

### Usuários de Teste

```typescript
const testUsers = [
  {
    name: "Dr. João Silva",
    email: "joao@clinica.com",
    role: "DOCTOR",
  },
  {
    name: "Enfermeira Maria",
    email: "maria@clinica.com",
    role: "NURSE",
  },
];
```

### Pacientes de Teste

```typescript
const testPatients = [
  {
    refId: "P001",
    name: "Paciente Teste 1",
    indicationId: "indication_id",
    medicationId: "medication_id",
    swalisId: "swalis_id",
  },
];
```

## 🧹 Limpeza de Dados

### Reset completo

```bash
# Reset do banco (CUIDADO!)
npx prisma migrate reset
```

### Limpeza seletiva

```typescript
// Limpar apenas dados de teste
await prisma.injection.deleteMany();
await prisma.prescription.deleteMany();
await prisma.consultation.deleteMany();
await prisma.patient.deleteMany();
```

## ⚠️ Cuidados

### Dados Sensíveis

- Não inclua dados reais de pacientes
- Use dados anonimizados para testes
- Respeite LGPD e regulamentações

### Performance

- Seed pode ser lento com muitos dados
- Use transações para operações em lote
- Monitore uso de memória

### Versionamento

- Mantenha seed data versionado
- Documente mudanças nos dados
- Teste seed em diferentes ambientes
