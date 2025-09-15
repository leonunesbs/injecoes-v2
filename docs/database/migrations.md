# Database Migrations

Guia completo para migrações do banco de dados.

## 🚀 Comandos Básicos

### Desenvolvimento

```bash
# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations pendentes
npx prisma migrate dev

# Reset do banco (CUIDADO!)
npx prisma migrate reset
```

### Produção

```bash
# Aplicar migrations em produção
npx prisma migrate deploy

# Verificar status das migrations
npx prisma migrate status
```

## 📋 Migrations Disponíveis

### 1. Initial Schema (v1.0)

- Criação das tabelas básicas
- Modelos de autenticação
- Estrutura inicial do sistema

### 2. Injection System v2.0

- Adição do sistema de restante
- Modelos de consulta e prescrição
- Otimizações para dashboard

## 🔄 Fluxo de Migração

### 1. Desenvolvimento

1. Modifique o schema em `prisma/schema.prisma`
2. Execute `npx prisma migrate dev`
3. Teste as mudanças localmente
4. Commit das mudanças

### 2. Staging

1. Aplique migrations: `npx prisma migrate deploy`
2. Execute testes de integração
3. Valide dados existentes
4. Aprove para produção

### 3. Produção

1. Backup do banco de dados
2. Aplique migrations: `npx prisma migrate deploy`
3. Verifique integridade dos dados
4. Monitore performance

## ⚠️ Cuidados Importantes

### Backup

- Sempre faça backup antes de migrations em produção
- Teste migrations em ambiente de staging
- Tenha um plano de rollback

### Dados Existentes

- Migrations podem ser destrutivas
- Valide dados antes e depois
- Considere migração de dados customizada

### Performance

- Migrations grandes podem causar locks
- Execute em horários de baixo tráfego
- Monitore logs de performance

## 🛠️ Troubleshooting

### Migration Falhou

1. Verifique logs de erro
2. Valide schema syntax
3. Confirme conectividade com banco
4. Execute rollback se necessário

### Dados Inconsistentes

1. Pare a aplicação
2. Execute validação manual
3. Corrija dados se necessário
4. Reinicie aplicação

### Performance Lenta

1. Analise query execution plan
2. Adicione índices se necessário
3. Considere migration em lotes
4. Monitore recursos do servidor
