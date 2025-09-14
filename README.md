# Sistema de Injeções Oftalmológicas v2.0

## Visão Geral

Sistema moderno para gerenciamento de injeções oftalmológicas, desenvolvido com Next.js 14, Prisma, tRPC e NextAuth.js. A versão 2.0 representa uma evolução significativa do sistema anterior, oferecendo maior flexibilidade, melhor rastreamento e otimizações para visualização em dashboard.

## 🚀 Tecnologias

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: tRPC, Prisma ORM
- **Banco de Dados**: PostgreSQL
- **Autenticação**: NextAuth.js
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: TanStack Query

## 📋 Funcionalidades Principais

### 1. Gestão de Pacientes

- Cadastro completo com dados pessoais
- Sistema de referência único (refId)
- Vinculação com indicações médicas específicas
- Classificação Swalis como único critério de priorização (seguida pela data de indicação)
- Rastreamento de injeções por olho (OD/OE)

### 2. Sistema de Indicações

- **RD/EMD**: Retinopatia Diabética com Edema Macular Diabético
- **RD/HV**: Retinopatia Diabética com Hemorragia Vítrea
- **DMRI**: Degeneração Macular Relacionada à Idade
- **OV**: Oclusão Venosa
- **MNVSR**: Membrana Neovascular Sub-Retiniana
- **Outros**: Campo personalizável

### 3. Medicamentos Suportados

- **Lucentis**: Ranibizumab
- **Avastin**: Bevacizumab
- **Eylia**: Aflibercept
- **Outros**: Medicamentos personalizados

### 4. Classificação Swalis

- **A1**: Risco de deterioração clínica iminente
- **A2**: Atividades diárias completamente prejudicadas
- **B**: Prejuízo acentuado das atividades diárias
- **C**: Prejuízo mínimo das atividades diárias
- **D**: Sem prejuízo para as atividades diárias

### 5. Controle de Injeções

- Agendamento com data e horário
- Controle por olho (direito/esquerdo)
- Status detalhado (Agendada, Aplicada, Cancelada, etc.)
- Observações e efeitos colaterais
- Rastreamento de quem aplicou

## 🏗️ Arquitetura

### Estrutura de Diretórios

```
src/
├── app/                    # App Router do Next.js
│   ├── _components/        # Componentes reutilizáveis
│   ├── api/               # API Routes
│   └── page.tsx           # Página principal
├── server/                # Lógica do servidor
│   ├── api/               # tRPC routers
│   └── auth/              # Configuração NextAuth
├── trpc/                  # Cliente tRPC
└── styles/                # Estilos globais

prisma/
├── schema.prisma          # Schema do banco de dados
└── README.md             # Documentação do schema
```

### Modelos de Dados

- **User**: Usuários do sistema
- **Patient**: Pacientes com indicações e medicamentos
- **Injection**: Injeções aplicadas/agendadas
- **Indication**: Tipos de indicações médicas
- **Medication**: Medicamentos disponíveis
- **SwalisClassification**: Classificação de urgência

## 📚 Documentação

A documentação completa está organizada na pasta `docs/`:

- **[📁 Documentação Principal](./docs/README.md)** - Índice geral da documentação
- **[🗄️ Database](./docs/database/)** - Schema e banco de dados
- **[🏗️ Architecture](./docs/architecture/)** - Arquitetura e design
- **[🔌 API](./docs/api/)** - Documentação da API
- **[🚀 Deployment](./docs/deployment/)** - Deploy e configuração
- **[👥 User Guide](./docs/user-guide/)** - Guias para usuários

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- pnpm (recomendado)

### Passos

1. Clone o repositório
2. Instale as dependências:
   ```bash
   pnpm install
   ```
3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
4. Configure o banco de dados no `.env`
5. Execute as migrations:
   ```bash
   npx prisma migrate dev
   ```
6. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm dev
   ```

## 📊 Dashboard e Visualizações

### Cards Informativos

- Total de pacientes ativos
- Injeções aplicadas hoje/semana/mês
- Pacientes por classificação Swalis
- Medicamentos mais utilizados

### Tabelas de Dados

- Lista de pacientes com filtros
- Histórico de injeções
- Relatórios por período
- Estatísticas de adesão ao tratamento

### Gráficos e Métricas

- Evolução temporal das injeções
- Distribuição por indicação
- Eficácia por medicamento
- Taxa de comparecimento

## 🔧 Desenvolvimento

### TODOs Implementados ✅

- [x] Schema Prisma otimizado v2.0
- [x] Modelos normalizados e relacionamentos
- [x] Índices para performance do dashboard
- [x] Sistema de auditoria completo
- [x] Documentação do schema

### TODOs em Andamento

- [ ] Interface de usuário moderna
- [ ] Formulários de cadastro otimizados
- [ ] Dashboard com métricas em tempo real
- [ ] Sistema de relatórios
- [ ] Notificações e lembretes

### TODOs Futuros

- [ ] App mobile (React Native)
- [ ] Integração com sistemas hospitalares
- [ ] IA para previsão de agendamentos
- [ ] Telemedicina integrada
- [ ] Backup automático e sincronização

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através das issues do GitHub.

---

**Versão**: 2.0.0  
**Última atualização**: Dezembro 2024  
**Status**: Em desenvolvimento ativo
