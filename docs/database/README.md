# Database Documentation

Documentação completa do banco de dados e schema do sistema.

## 📋 Conteúdo

- **[Schema](./schema.md)** - Documentação detalhada do schema Prisma
- **[Migrations](./migrations.md)** - Guia de migrações e versionamento
- **[Seed Data](./seed-data.md)** - Dados iniciais e scripts de população

## 🚀 Comandos Úteis

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

## 📊 Modelos Principais

- **Patient** - Pacientes do sistema
- **Consultation** - Consultas médicas
- **Prescription** - Prescrições de injeções
- **Injection** - Injeções aplicadas
- **Indication** - Tipos de indicações
- **Medication** - Medicamentos disponíveis
- **SwalisClassification** - Classificação de urgência

## 🔗 Relacionamentos

O sistema utiliza relacionamentos bem definidos para garantir integridade referencial e facilitar consultas complexas no dashboard.
