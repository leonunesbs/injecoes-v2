# API Documentation

Documentação completa da API do sistema de injeções oftalmológicas.

## 📋 Conteúdo

- **[Endpoints](./endpoints.md)** - Lista completa de endpoints disponíveis
- **[Authentication](./authentication.md)** - Sistema de autenticação
- **[Validation](./validation.md)** - Validações de dados
- **[Error Handling](./error-handling.md)** - Tratamento de erros

## 🔌 Tecnologia

O sistema utiliza **tRPC** para comunicação entre frontend e backend, garantindo type safety end-to-end.

### Vantagens do tRPC

- **Type Safety**: Tipos compartilhados entre frontend e backend
- **Auto-complete**: IntelliSense completo no IDE
- **Validação Automática**: Validação de dados com Zod
- **Performance**: Menos overhead que REST APIs

## 📡 Estrutura da API

### Routers Principais

- **Patient Router** - Operações com pacientes
- **Consultation Router** - Operações com consultas
- **Injection Router** - Operações com injeções
- **Report Router** - Relatórios e dashboards

### Padrões de Resposta

```typescript
// Sucesso
{
  success: true,
  data: T,
  message?: string
}

// Erro
{
  success: false,
  error: string,
  code?: string
}
```

## 🔐 Autenticação

### Fluxo de Autenticação

1. Login via NextAuth.js
2. Geração de session token
3. Validação em cada requisição
4. Controle de acesso por role

### Middleware

- Validação de sessão
- Rate limiting
- Logging de requisições

## 📊 Validação de Dados

### Schemas Zod

- Validação de entrada
- Transformação de dados
- Mensagens de erro personalizadas

### Exemplo

```typescript
const createPatientSchema = z.object({
  name: z.string().min(1),
  refId: z.string().min(1),
  indicationId: z.string(),
  // ...
});
```

## 🚨 Tratamento de Erros

### Tipos de Erro

- **ValidationError** - Dados inválidos
- **NotFoundError** - Recurso não encontrado
- **UnauthorizedError** - Acesso negado
- **InternalError** - Erro interno do servidor

### Logging

- Logs estruturados
- Rastreamento de erros
- Monitoramento de performance
