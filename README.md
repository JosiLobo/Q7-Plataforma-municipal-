# Q7Gov — Plataforma Municipal de Gestão Digital

**Versão:** 2.5 Enterprise (React 19 + TypeScript + Tailwind 4 + tRPC + WhatsApp + Sentimentos + Métricas)

Plataforma enterprise de gestão municipal com **integração WhatsApp Business API**, **IA para triagem automática**, **análise de sentimento com IA**, **fila de mensagens com Redis**, **webhooks seguros com HMAC**, **notificações em tempo real com WebSockets** e **relatórios exportáveis em PDF/Excel**. Pronta para venda para prefeituras.

---

## 🎯 Visão Geral

O Q7Gov é uma solução completa de transformação digital para municípios. Gerencia **22+ secretarias**, cidadãos, processos e documentos com **IA assistiva**, **transparência total**, **atendimento 24/7 via WhatsApp** e **monitoramento de satisfação em tempo real**.

### Diferenciais

- **Dashboard Inteligente** — KPIs em tempo real, alertas preditivos, análise de tendências
- **WhatsApp Business API** — Atendimento automático com IA e triagem inteligente
- **Análise de Sentimento com IA** — Monitoramento de satisfação do cidadão em tempo real
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

## 🚀 Começar Rápido (Setup Local)

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18+ — [Download](https://nodejs.org/)
- **pnpm** 10+ — `npm install -g pnpm`
- **MySQL** 8+ — [Download](https://www.mysql.com/downloads/)
- **Redis** — [Download](https://redis.io/download) ou use Docker

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/framil09/Q7-Plataforma-municipal-.git
cd Q7-Plataforma-municipal-
```

### 2️⃣ Instalar Dependências

```bash
pnpm install
```

### 3️⃣ Criar Banco de Dados MySQL

```bash
# Conectar ao MySQL
mysql -u root -p

# Executar no MySQL
CREATE DATABASE q7gov CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 4️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# ========== BANCO DE DADOS ==========
DATABASE_URL="mysql://root:sua_senha@localhost:3306/q7gov"

# ========== OAUTH (MANUS) ==========
VITE_APP_ID="seu-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://login.manus.im"
JWT_SECRET="seu-jwt-secret-aleatorio-32-caracteres-minimo"

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

**Nota:** Para desenvolvimento local, você pode usar valores fictícios para as credenciais do WhatsApp. Elas serão necessárias apenas em produção.

### 5️⃣ Iniciar Redis

Em um terminal separado:

```bash
# Opção 1: Se instalado localmente
redis-server

# Opção 2: Com Docker
docker run -d -p 6379:6379 --name redis redis:latest
```

### 6️⃣ Aplicar Migrações do Banco de Dados

```bash
pnpm db:push
```

### 7️⃣ Iniciar o Servidor de Desenvolvimento

```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`

---

## 📍 Acessar a Aplicação

| Página | URL |
|--------|-----|
| **Landing Page** | http://localhost:3000/ |
| **Dashboard** | http://localhost:3000/app |
| **WhatsApp** | http://localhost:3000/app/whatsapp |
| **Sentimentos** | http://localhost:3000/app/sentiment |
| **IA Insights** | http://localhost:3000/app/ai |
| **Métricas** | http://localhost:3000/app/metrics |

---

## 📁 Estrutura do Projeto

```
q7gov-modern/
├── client/                           # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx             # Dashboard principal
│   │   │   ├── WhatsAppDashboard.tsx # Gerenciador WhatsApp
│   │   │   ├── SentimentDashboard.tsx # Análise de sentimentos
│   │   │   ├── MetricsDashboard.tsx  # Painel de métricas
│   │   │   ├── AIInsights.tsx        # IA e resumos
│   │   │   └── Landing.tsx           # Landing page
│   │   ├── components/
│   │   │   ├── Sidebar.tsx           # Navegação
│   │   │   ├── Topbar.tsx            # Header
│   │   │   ├── ReportExporter.tsx    # Exportação de relatórios
│   │   │   ├── NegativeSentimentAlert.tsx # Alertas interativos
│   │   │   └── ...outros componentes
│   │   ├── lib/trpc.ts               # Cliente tRPC
│   │   └── App.tsx                   # Roteamento
│   └── index.html
├── server/                           # Backend Express + tRPC
│   ├── routers.ts                    # Rotas principais
│   ├── whatsapp-router.ts            # Rotas WhatsApp
│   ├── sentiment-router.ts           # Rotas de sentimentos
│   ├── metrics-router.ts             # Rotas de Métricas
│   ├── reports-router.ts             # Rotas de Relatórios
│   ├── whatsapp-api.ts               # Integração WhatsApp
│   ├── whatsapp-ai.ts                # IA para triagem
│   ├── sentiment-analysis.ts         # Análise de sentimento com IA
│   ├── message-queue.ts              # Fila de mensagens (Bull)
│   ├── webhook-security.ts           # Validação HMAC
│   ├── websocket-server.ts           # WebSockets
│   ├── reports.ts                    # Geração de relatórios
│   ├── sentiment-db.ts               # Helpers de sentimentos
│   ├── metrics-db.ts                 # Helpers de métricas
│   └── db.ts                         # Helpers de banco de dados
├── drizzle/                          # Migrações e schema
│   ├── schema.ts                     # Definição de tabelas
│   ├── schema-metrics.ts             # Tabelas de métricas
│   ├── schema-sentiment.ts           # Tabelas de sentimentos
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

### 3. Análise de Sentimentos (`/app/sentiment`)

- **Classificação Automática** — Positivo, Neutro, Negativo
- **Emoções Detectadas** — Joy, Sadness, Anger, Fear, Surprise, Disgust
- **Keywords Extraídas** — Palavras-chave indicadoras de sentimento
- **Distribuição de Sentimentos** — Gráfico pizza com percentuais
- **Tendência de Satisfação** — Gráfico linha dos últimos 7 dias
- **Alertas Interativos** — Revisar/Resolver mensagens insatisfeitas
- **Taxa de Satisfação** — Percentual de mensagens positivas

### 4. Painel de Métricas (`/app/metrics`)

- **KPIs do Dia** — Mensagens, respostas, tempo médio, escalações
- **Gráficos de Tendência** — Últimos 7 dias
- **Taxa de Resposta** — Percentual de mensagens respondidas
- **Satisfação Média** — Avaliação dos cidadãos (0-5)
- **Exportação** — PDF, Excel, ambos

### 5. IA Insights (`/app/ai`)

- **Resumo Executivo** — Análise automática da situação
- **Alertas Preditivos** — Previsão de gargalos e oportunidades
- **Recomendações** — Próximas ações sugeridas

---

## 🔌 API Endpoints (tRPC)

### WhatsApp
```
POST   /api/trpc/whatsapp.webhook          # Receber mensagens
POST   /api/trpc/whatsapp.sendMessage      # Enviar mensagem
GET    /api/trpc/whatsapp.getConversations # Listar conversas
GET    /api/trpc/whatsapp.getHistory       # Histórico de conversa
```

### Sentimentos
```
GET    /api/trpc/sentiment.getDashboard    # Dashboard resumido
GET    /api/trpc/sentiment.getLast7Days    # Últimos 7 dias
GET    /api/trpc/sentiment.getMonth        # Estatísticas do mês
GET    /api/trpc/sentiment.getDistribution # Distribuição de sentimentos
GET    /api/trpc/sentiment.getPendingAlerts # Alertas pendentes
POST   /api/trpc/sentiment.markAlertAsReviewed # Marcar como revisado
POST   /api/trpc/sentiment.resolveAlert    # Resolver alerta
```

### Métricas
```
GET    /api/trpc/metrics.getDashboard      # Dashboard resumido
GET    /api/trpc/metrics.getLast7Days      # Últimos 7 dias
GET    /api/trpc/metrics.getMonth          # Estatísticas do mês
GET    /api/trpc/metrics.getByUrgency      # Métricas por urgência
```

### Relatórios
```
POST   /api/trpc/reports.generatePDF       # Gerar PDF
POST   /api/trpc/reports.generateExcel     # Gerar Excel
POST   /api/trpc/reports.generateComplete  # Gerar ambos
```

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
| **IA** | LLM API (Manus) |
| **Relatórios** | PDFKit + ExcelJS |
| **Build** | Vite |

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

## 🚢 Build para Produção

```bash
# Build frontend + backend
pnpm build

# Iniciar servidor de produção
pnpm start
```

---

## 🐛 Troubleshooting

### Erro: "Database connection failed"

```bash
# Verificar conexão MySQL
mysql -u root -p -h localhost

# Verificar se o banco existe
SHOW DATABASES;

# Criar banco se não existir
CREATE DATABASE q7gov CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Aplicar migrações
pnpm db:push
```

### Erro: "Redis connection refused"

```bash
# Verificar se Redis está rodando
redis-cli ping

# Iniciar Redis
redis-server

# Ou com Docker
docker run -d -p 6379:6379 --name redis redis:latest
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

# Reiniciar servidor
pnpm dev
```

### Erro: "Port 3000 already in use"

```bash
# Encontrar processo usando porta 3000
lsof -i :3000

# Matar processo
kill -9 <PID>

# Ou usar porta diferente
PORT=3001 pnpm dev
```

---

## 📈 Roadmap

### v2.6 (Próximo)
- [ ] Dashboard personalizável (drag-and-drop)
- [ ] Autenticação OAuth com prefeituras
- [ ] Integração com Google Maps

### v3.0
- [ ] Machine Learning para previsões
- [ ] Chatbot com GPT-4
- [ ] Integração com ERP municipal
- [ ] Mobile app nativo (React Native)

---

## 💼 Preços (Exemplo)

| Plano | Preço | Secretarias | Recursos |
|-------|-------|------------|----------|
| **Starter** | R$ 2.990/mês | Até 5 | Dashboard básico, Portal |
| **Professional** | R$ 8.990/mês | Até 15 | IA, Alertas, Exportação, WhatsApp, Sentimentos |
| **Enterprise** | Customizado | 22+ | Integração, SLA 99.9%, Suporte 24/7 |

---

## 📞 Suporte

- **Email:** support@q7gov.com
- **Chat:** Disponível no app
- **Documentação:** https://docs.q7gov.com
- **Status:** https://status.q7gov.com
- **GitHub Issues:** https://github.com/framil09/Q7-Plataforma-municipal-/issues

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

### v2.5 (Atual)
- ✅ Análise de Sentimento com IA (LLM)
- ✅ Dashboard de Sentimentos com gráficos
- ✅ Alertas Interativos de Insatisfação
- ✅ Integração automática no processamento de mensagens
- ✅ Métricas de satisfação por dia/mês

### v2.4
- ✅ Webhooks seguros com HMAC-SHA256
- ✅ Notificações em tempo real com WebSockets
- ✅ Relatórios exportáveis em PDF/Excel

### v2.3
- ✅ Integração WhatsApp Business API
- ✅ Fila de mensagens com Bull + Redis
- ✅ Painel de métricas avançado

### v2.1
- ✅ Dashboard inteligente
- ✅ IA para triagem automática
- ✅ Busca global com Command Palette
- ✅ Mapas interativos
- ✅ Modo escuro

---

## 🎓 Documentação Adicional

- [tRPC Docs](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [Bull Queue](https://github.com/OptimalBits/bull)
- [Socket.io](https://socket.io)
- [Recharts](https://recharts.org)

---

## ❓ FAQ

**P: Posso usar o Q7Gov sem WhatsApp?**
R: Sim! O WhatsApp é opcional. Você pode usar apenas o Dashboard e Portal do Cidadão.

**P: Qual é o limite de secretarias?**
R: O sistema suporta até 22+ secretarias. Você pode adicionar mais customizando o banco de dados.

**P: Como faço para integrar com meu ERP?**
R: O Q7Gov fornece APIs tRPC que podem ser consumidas por qualquer sistema. Consulte a documentação de API.

**P: O sistema é escalável?**
R: Sim! Usa Redis para cache, Bull para fila distribuída e MySQL com índices otimizados.

---

**Desenvolvido com ❤️ para prefeituras municipais**
