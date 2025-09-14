# Deployment Documentation

Documentação completa de deploy e configuração do sistema.

## 📋 Conteúdo

- **[Environment Setup](./environment-setup.md)** - Configuração de ambiente
- **[Production Deploy](./production-deploy.md)** - Deploy em produção
- **[Docker](./docker.md)** - Configuração com Docker
- **[Monitoring](./monitoring.md)** - Monitoramento e logs

## 🚀 Deploy Rápido

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- pnpm (recomendado)

### Passos Básicos

1. Clone o repositório
2. Instale dependências: `pnpm install`
3. Configure variáveis de ambiente
4. Execute migrations: `npx prisma migrate dev`
5. Inicie o servidor: `pnpm dev`

## 🌍 Ambientes

### Desenvolvimento

- Banco local (PostgreSQL)
- Hot reload ativado
- Logs detalhados
- Debug mode

### Staging

- Banco de teste
- Dados de exemplo
- Testes automatizados
- Preview de features

### Produção

- Banco otimizado
- Cache ativado
- Monitoramento completo
- Backup automático

## 🐳 Docker

### Containerização

- Multi-stage builds
- Otimização de imagens
- Health checks
- Volume persistence

### Docker Compose

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://...

  postgres:
    image: postgres:14
    environment:
      - POSTGRES_DB=injections
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=password
```

## 📊 Monitoramento

### Métricas Importantes

- Uptime do sistema
- Performance de queries
- Uso de memória
- Erros e exceções

### Ferramentas

- **Logs**: Winston + ELK Stack
- **Métricas**: Prometheus + Grafana
- **Alertas**: Slack/Email notifications
- **APM**: New Relic ou similar

## 🔒 Segurança

### Configurações

- HTTPS obrigatório
- Headers de segurança
- Rate limiting
- CORS configurado

### Backup

- Backup diário do banco
- Versionamento de código
- Rollback automático
- Disaster recovery

## 🚨 Troubleshooting

### Problemas Comuns

- Erro de conexão com banco
- Migrations falhando
- Performance lenta
- Erros de autenticação

### Logs Importantes

- Application logs
- Database logs
- Nginx/Apache logs
- System logs
