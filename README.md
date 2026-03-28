# Q7Gov — Plataforma Municipal de Gestão Digital

**Versão:** 2.4 Enterprise (React 19 + TypeScript + Tailwind 4 + tRPC + WhatsApp + Métricas)

Plataforma enterprise de gestão municipal com **integração WhatsApp Business API**, **IA para triagem automática**, **fila de mensagens com Redis**, **webhooks seguros com HMAC**, **notificações em tempo real com WebSockets** e **relatórios exportáveis em PDF/Excel**. Pronta para venda para prefeituras.

---

## 🎯 Visão Geral

O Q7Gov é uma solução completa de transformação digital para municípios. Gerencia **22+ secretarias**, cidadãos, processos e documentos com **IA assistiva**, **transparência total**, **atendimento 24/7 via WhatsApp** e **zero burocracia**.

### Diferenciais

- **Dashboard Inteligente** — KPIs em tempo real, alertas preditivos, análise de tendências
- **WhatsApp Business API** — Atendimento automático com IA e triagem inteligente
- **Fila de Mensagens** — Processamento assincronamente com Bull + Redis
- **Webhooks Seguros** — Validação HMAC para requisições WhatsApp
- **Notificações em Tempo Real** — WebSockets para atualizações instantâneas
- **Relatórios Exportáveis** — PDF e Excel com gráficos e métricas
- **Métricas Avançadas** — Análise de atendimento, satisfação, escalações
- **IA Assistiva** — Triagem automática, respostas a dúvidas, busca em documentos
- **Portal do Cidadão** — Protocolo digital, acompanhamento 24/7, notificações
- **Compliance Total** — LGPD, LAI, LRF automatizados
- **Multi-Canal** — WhatsApp, App, Balcão, Site, E-mail integrados
- **Mobile First** — 100% responsivo, funciona em qualquer dispositivo

---

## 🚀 Começar Rápido

### Pré-requisitos

- **Node.js** 18+ e **pnpm** 10+
- **MySQL** 8+ ou **TiDB**
- **Redis** (para fila de mensagens)

### Instalação

```bash
# 1. Clonar repositório
git clone https://github.com/framil09/Q7-Plataforma-municipal-.git
cd Q7-Plataforma-municipal-

# 2. Instalar dependências
pnpm install

# 3. Configurar variáveis de ambiente (ver seção abaixo)
# Criar arquivo .env.local

# 4. Configurar banco de dados
pnpm db:push

# 5. Iniciar Redis (em outro terminal)
redis-server

# 6. Rodar em desenvolvimento
pnpm dev

# 7. Build para produção
pnpm build
pnpm start
```

O servidor estará disponível em `http://localhost:3000`

### Acesso

- **Landing Page:** `http://localhost:3000/`
- **Dashboard:** `http://localhost:3000/app`
- **WhatsApp:** `http://localhost:3000/app/whatsapp`
- **IA Insights:** `http://localhost:3000/app/ai`
- **Métricas:** `http://localhost:3000/app/metrics`

---

## 🔧 Configuração de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# ========== BANCO DE DADOS ==========
DATABASE_URL="mysql://user:password@localhost:3306/q7gov"

# ========== OAUTH (MANUS) ==========
VITE_APP_ID="seu-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://login.manus.im"
JWT_SECRET="seu-jwt-secret-aleatorio-32-caracteres"

# ========== WHATSAPP BUSINESS API ==========
WHATSAPP_PHONE_NUMBER_ID="seu-phone-number-id"
WHATSAPP_ACCESS_TOKEN="seu-access-token"
WHATSAPP_WEBHOOK_SECRET="seu-webhook-secret"

# ========== REDIS ==========
REDIS_URL="redis://localhost:6379"

# ========== OWNER ==========
OWNER_OPEN_ID="seu-owner-id"
OWNER_NAME="Seu Nome"

# ========== ANALYTICS (OPCIONAL) ==========
VITE_ANALYTICS_ENDPOINT="https://analytics.example.com"
VITE_ANALYTICS_WEBSITE_ID="your-id"
```

### Obter Credenciais WhatsApp

1. Acesse [Meta Developers](https://developers.facebook.com)
2. Crie uma aplicação
3. Configure **WhatsApp Business Platform**
4. Obtenha:
   - **Phone Number ID** — ID do número de telefone
   - **Access Token** — Token de acesso da API
   - **Webhook Secret** — Chave para validar webhooks

---

## 📁 Estrutura do Projeto

```
q7gov-modern/
├── client/                           # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx             # Dashboard principal
│   │   │   ├── WhatsAppDashboard.tsx # Gerenciador WhatsApp
│   │   │   ├── MetricsDashboard.tsx  # Painel de métricas
│   │   │   ├── AIInsights.tsx        # IA e resumos
│   │   │   └── Landing.tsx           # Landing page
│   │   ├── components/
│   │   │   ├── Sidebar.tsx           # Navegação
│   │   │   ├── Topbar.tsx            # Header
│   │   │   ├── ReportExporter.tsx    # Exportação de relatórios
│   │   │   └── ...outros componentes
│   │   ├── lib/trpc.ts               # Cliente tRPC
│   │   └── App.tsx                   # Roteamento
│   └── index.html
├── server/                           # Backend Express + tRPC
│   ├── routers.ts                    # Rotas principais
│   ├── whatsapp-router.ts            # Rotas WhatsApp
│   ├── metrics-router.ts             # Rotas de Métricas
│   ├── reports-router.ts             # Rotas de Relatórios
│   ├── whatsapp-api.ts               # Integração WhatsApp
│   ├── whatsapp-ai.ts                # IA para triagem
│   ├── message-queue.ts              # Fila de mensagens (Bull)
│   ├── webhook-security.ts           # Validação HMAC
│   ├── websocket-server.ts           # WebSockets
│   ├── reports.ts                    # Geração de relatórios
│   ├── metrics-db.ts                 # Helpers de métricas
│   └── db.ts                         # Helpers de banco de dados
├── drizzle/                          # Migrações e schema
│   ├── schema.ts                     # Definição de tabelas
│   ├── schema-metrics.ts             # Tabelas de métricas
│   └── migrations/                   # Arquivos de migração
└── package.json
```

---

## 🎯 Funcionalidades Principais

### 1. Dashboard Principal (`/app`)

- **4 KPIs** — Protocolos abertos, concluídos, tempo médio, alertas críticos
- **Alertas Críticos** — 4 cards com ações rápidas
- **Gráficos Interativos** — Tendência semanal (Recharts)
- **Mapa de Obras** — Visualização geográfica com status
- **Tabelas** — Alertas e protocolos recentes
- **Exportação** — CSV, JSON, PDF

### 2. WhatsApp Business API (`/app/whatsapp`)

- **Receber Mensagens** — Webhook automático
- **Triagem com IA** — Classificação automática por secretaria
- **Respostas Automáticas** — Geradas por IA com fallback humano
- **Histórico de Conversas** — Rastreamento completo
- **Status de Entrega** — Confirmação de leitura

**Endpoints:**
- `POST /api/trpc/whatsapp.webhook` — Receber mensagens
- `POST /api/trpc/whatsapp.sendMessage` — Enviar mensagem
- `GET /api/trpc/whatsapp.getConversations` — Listar conversas
- `GET /api/trpc/whatsapp.getHistory` — Histórico de conversa

### 3. Fila de Mensagens (Bull + Redis)

Processamento assincronamente com 3 filas:

- **message-queue** — Receber e processar mensagens
- **response-queue** — Gerar e enviar respostas
- **metrics-queue** — Calcular e armazenar métricas

**Benefícios:**
- Processamento não-bloqueante
- Retry automático em caso de falha
- Escalabilidade horizontal
- Monitoramento de jobs

### 4. Webhooks Seguros (HMAC)

Validação de assinatura em todas as requisições WhatsApp:

```typescript
// Header: X-Hub-Signature-256: sha256=<hash>
validateWebhookSignature(payload, signature);
```

**Segurança:**
- HMAC-SHA256
- Timing-safe comparison
- Proteção contra replay attacks

### 5. Notificações em Tempo Real (WebSockets)

Atualizações instantâneas com Socket.io:

- **Novas mensagens** — Atualização em tempo real
- **Mudanças de status** — Conversa atualizada
- **Métricas** — Dashboard atualizado
- **Notificações** — Alertas para o usuário

**Eventos:**
- `new-message` — Nova mensagem recebida
- `status-update` — Status da conversa alterado
- `metric-update` — Métrica calculada
- `dashboard-update` — Dashboard atualizado
- `notification` — Notificação geral

### 6. Painel de Métricas (`/app/metrics`)

Análise completa de atendimento:

- **KPIs do Dia** — Mensagens, respostas, tempo médio, escalações
- **Gráficos de Tendência** — Últimos 7 dias
- **Taxa de Resposta** — Percentual de mensagens respondidas
- **Satisfação Média** — Avaliação dos cidadãos (0-5)
- **Exportação** — PDF, Excel, ambos

**Endpoints:**
- `GET /api/trpc/metrics.getDashboard` — Dashboard resumido
- `GET /api/trpc/metrics.getLast7Days` — Últimos 7 dias
- `GET /api/trpc/metrics.getMonth` — Estatísticas do mês
- `GET /api/trpc/metrics.getByUrgency` — Métricas por urgência

### 7. Relatórios Exportáveis

Gere relatórios em PDF e Excel com um clique:

**PDF:**
- Cabeçalho com período
- Resumo executivo
- Estatísticas diárias
- Rodapé com data de geração

**Excel:**
- Aba "Resumo" com KPIs
- Aba "Estatísticas Diárias" com dados tabulados
- Formatação profissional
- Pronto para análise

**Endpoints:**
- `POST /api/trpc/reports.generatePDF` — Gerar PDF
- `POST /api/trpc/reports.generateExcel` — Gerar Excel
- `POST /api/trpc/reports.generateComplete` — Gerar ambos

---

## 🎨 Design System

### Cores (Minimalismo Corporativo)

- **Primário:** Teal `#1dc9a4` — Confiança, inovação
- **Semântica:**
  - Verde `#22c55e` — Sucesso
  - Âmbar `#f59e0b` — Atenção
  - Vermelho `#ef4444` — Crítico
  - Azul `#3b82f6` — Informação

### Tipografia

- **Corpo:** DM Sans (300-700)
- **Dados:** Space Mono (monospace)
- **Hierarquia:** H1 (28px), H2 (18px), Body (13px), Label (11px)

### Componentes

Todos os componentes usam **Tailwind 4** + **shadcn/ui** para consistência.

---

## 📊 Stack Técnico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19, TypeScript, Tailwind 4 |
| **Componentes** | shadcn/ui, Lucide Icons |
| **Gráficos** | Recharts |
| **Roteamento** | Wouter |
| **Tema** | Context API + CSS Variables |
| **Backend** | Express.js, tRPC, Node.js |
| **Banco de Dados** | MySQL/TiDB + Drizzle ORM |
| **Fila de Mensagens** | Bull + Redis |
| **WebSockets** | Socket.io |
| **Relatórios** | PDFKit + ExcelJS |
| **Build** | Vite |
| **Deploy** | Manus, AWS, Railway, Render |

---

## 🔐 Segurança & Compliance

- ✅ **LGPD** — Política de privacidade integrada
- ✅ **LAI** — Transparência pública automatizada
- ✅ **LRF** — Relatórios de receita/despesa
- ✅ **WCAG 2.1** — Acessibilidade total
- ✅ **SSL/HTTPS** — Criptografia automática
- ✅ **HMAC-SHA256** — Validação de webhooks
- ✅ **JWT** — Autenticação segura
- ✅ **OAuth 2.0** — Integração com Manus

---

## 📱 Responsividade

- ✅ **Mobile First** — Otimizado para celular
- ✅ **Tablet** — Layout adaptativo
- ✅ **Desktop** — Experiência completa
- ✅ **Offline** — PWA com manifest.json

---

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Testes com cobertura
pnpm test:coverage

# Testes em modo watch
pnpm test:watch
```

---

## 🚢 Deploy

### Manus (Recomendado)

Clique em "Publish" no Management UI após criar um checkpoint.

### Alternativas

- **Railway** — `railway link`
- **Render** — Conectar repositório GitHub
- **Vercel** — Frontend apenas
- **Docker** — Criar imagem customizada

### Variáveis de Ambiente (Produção)

Adicionar ao seu provedor de hosting:

```env
DATABASE_URL=mysql://...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_WEBHOOK_SECRET=...
REDIS_URL=redis://...
JWT_SECRET=...
```

---

## 🐛 Troubleshooting

### Erro: "Database connection failed"

```bash
# Verificar conexão MySQL
mysql -u user -p -h localhost

# Criar banco se não existir
CREATE DATABASE q7gov;

# Aplicar migrações
pnpm db:push
```

### Erro: "Redis connection refused"

```bash
# Iniciar Redis
redis-server

# Ou com Docker
docker run -d -p 6379:6379 redis:latest
```

### Erro: "Webhook signature validation failed"

- Verificar `WHATSAPP_WEBHOOK_SECRET` no `.env.local`
- Garantir que o payload não foi modificado
- Verificar que o header `X-Hub-Signature-256` está presente

### Erro: "Cannot find module 'pdfkit'"

```bash
# Reinstalar dependências
pnpm install

# Limpar cache
pnpm store prune
```

---

## 📈 Roadmap

### v2.5 (Próximo)
- [ ] Dashboard personalizável (drag-and-drop)
- [ ] Autenticação OAuth com prefeituras
- [ ] Integração com Google Maps

### v3.0
- [ ] Machine Learning para previsões
- [ ] Análise de sentimento em mensagens
- [ ] Chatbot com GPT-4
- [ ] Integração com ERP municipal

---

## 💼 Preços (Exemplo)

| Plano | Preço | Secretarias | Recursos |
|-------|-------|------------|----------|
| **Starter** | R$ 2.990/mês | Até 5 | Dashboard básico, Portal |
| **Professional** | R$ 8.990/mês | Até 15 | IA, Alertas, Exportação, WhatsApp |
| **Enterprise** | Customizado | 22+ | Integração, SLA 99.9%, Suporte 24/7 |

---

## 📞 Suporte

- **Email:** support@q7gov.com
- **Chat:** Disponível no app
- **Documentação:** https://docs.q7gov.com
- **Status:** https://status.q7gov.com

---

## 📄 Licença

Proprietário — **QodeSeven** © 2026

---

## 🙏 Créditos

Desenvolvido com ❤️ pela **QodeSeven** para transformar a gestão pública municipal.

---

## 🔗 Links Úteis

- [Landing Page](https://q7gov.manus.space/)
- [Dashboard](https://q7gov.manus.space/app)
- [GitHub](https://github.com/framil09/Q7-Plataforma-municipal-)
- [Documentação](https://docs.q7gov.com)

---

## 📝 Changelog

### v2.4 (Atual)
- ✅ Integração WhatsApp Business API
- ✅ Fila de mensagens com Bull + Redis
- ✅ Webhooks seguros com HMAC
- ✅ Notificações em tempo real com WebSockets
- ✅ Painel de métricas avançado
- ✅ Relatórios exportáveis em PDF/Excel

### v2.3
- ✅ Dashboard inteligente
- ✅ IA para triagem automática
- ✅ Busca global com Command Palette
- ✅ Mapas interativos
- ✅ Modo escuro

### v2.1
- ✅ Landing page de vendas
- ✅ 22 secretarias suportadas
- ✅ Design system corporativo
- ✅ Mobile first
