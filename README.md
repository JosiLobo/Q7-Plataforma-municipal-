# Q7Gov — Plataforma Municipal de Gestão Digital

**Versão:** 2.1 Moderna (React 19 + TypeScript + Tailwind 4)

Plataforma enterprise de gestão municipal com inteligência artificial, dashboard inteligente e portal do cidadão. Pronta para venda para prefeituras.

---

## 🎯 Visão Geral

O Q7Gov é uma solução completa de transformação digital para municípios. Gerencia **22+ secretarias**, cidadãos, processos e documentos com **IA assistiva**, **transparência total** e **zero burocracia**.

### Diferenciais

- **Dashboard Inteligente** — KPIs em tempo real, alertas preditivos, análise de tendências
- **IA Assistiva** — Triagem automática, respostas a dúvidas, busca em documentos
- **Portal do Cidadão** — Protocolo digital, acompanhamento 24/7, notificações
- **Compliance Total** — LGPD, LAI, LRF automatizados
- **Multi-Canal** — WhatsApp, App, Balcão, Site, E-mail integrados
- **Mobile First** — 100% responsivo, funciona em qualquer dispositivo

---

## 🚀 Começar Rápido

### Instalação

```bash
# Clonar repositório
git clone https://github.com/framil09/Q7-Plataforma-municipal-.git
cd q7gov-modern

# Instalar dependências
pnpm install

# Rodar em desenvolvimento
pnpm dev

# Build para produção
pnpm build
```

O servidor estará disponível em `http://localhost:3000`

### Acesso

- **Landing Page:** `http://localhost:3000/`
- **Dashboard:** `http://localhost:3000/app`
- **IA Insights:** `http://localhost:3000/app/ai`

---

## 📁 Estrutura do Projeto

```
client/
  public/              ← Favicon, manifest, robots.txt
  src/
    components/        ← Componentes reutilizáveis
      Sidebar.tsx      ← Navegação por secretarias
      Topbar.tsx       ← Header com notificações
      StatCard.tsx     ← Cards de KPIs
      AlertCard.tsx    ← Alertas críticos
      CommandPalette.tsx ← Busca global (⌘K)
      MapView.tsx      ← Mapa de obras
      ExportButton.tsx ← Exportação CSV/JSON/PDF
      ExecutiveSummary.tsx ← Resumo executivo com IA
      PredictiveAlerts.tsx  ← Alertas preditivos
    pages/
      Landing.tsx      ← Landing page de vendas
      Home.tsx         ← Dashboard principal
      AIInsights.tsx   ← Página de IA
    contexts/
      ThemeContext.tsx ← Tema claro/escuro
    lib/
      utils.ts         ← Utilitários (cn, etc)
    App.tsx            ← Roteamento
    main.tsx           ← Entry point
    index.css          ← Design system (cores, tipografia)
  index.html           ← Template HTML
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

### Componentes

Todos os componentes usam **Tailwind 4** + **shadcn/ui** para consistência.

---

## 🔧 Funcionalidades

### Dashboard Principal (`/app`)

- **4 KPIs** — Protocolos abertos, concluídos, tempo médio, alertas críticos
- **Alertas Críticos** — 4 cards com ações rápidas
- **Gráficos Interativos** — Tendência semanal (Recharts)
- **Mapa de Obras** — Visualização geográfica com status
- **Tabelas** — Alertas e protocolos recentes
- **Exportação** — CSV, JSON, PDF

### Navegação

- **Sidebar Fixa** — 22 secretarias + badges de alertas
- **Topbar Sticky** — Breadcrumbs, busca, notificações, tema, usuário
- **Command Palette** — Busca global com ⌘K

### IA Insights (`/app/ai`)

- **Resumo Executivo** — Análise automática da situação
- **Alertas Preditivos** — Previsão de gargalos e oportunidades
- **Recomendações** — Próximas ações sugeridas

### Landing Page (`/`)

- **Hero Section** — Proposta de valor
- **Stats** — 22+ secretarias, 90% redução burocracia
- **Features** — 6 principais recursos
- **Módulos** — 22 secretarias suportadas
- **Pricing** — 3 planos (Starter, Professional, Enterprise)
- **CTA** — Solicitar demo

---

## 🎯 Secretarias Suportadas (22)

🏥 Saúde · 🔧 Obras · 🎓 Educação · 🤝 Assistência Social · 💰 Tributos · ⚖️ Jurídico · 👥 RH · 🛒 Compras · 📣 Ouvidoria · 🌱 Agricultura · 🎭 Cultura · ⚽ Esporte · ✈️ Turismo · 🌿 Meio Ambiente · 🚌 Mobilidade · 🏠 Habitação · 🛡️ Defesa Civil · 🔩 Autarquias · 📡 Comunicação · 📐 Planejamento · 📈 Des. Econômico · 🏛️ Gabinete

---

## 📊 Stack Técnico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19, TypeScript, Tailwind 4 |
| **Componentes** | shadcn/ui, Lucide Icons |
| **Gráficos** | Recharts |
| **Roteamento** | Wouter |
| **Tema** | Context API + CSS Variables |
| **Build** | Vite |
| **Deploy** | AWS Amplify |

---

## 🔒 Segurança & Compliance

- ✅ **LGPD** — Política de privacidade integrada
- ✅ **LAI** — Transparência pública automatizada
- ✅ **LRF** — Relatórios de receita/despesa
- ✅ **WCAG 2.1** — Acessibilidade total
- ✅ **SSL/HTTPS** — Criptografia automática

---

## 📱 Responsividade

- ✅ **Mobile First** — Otimizado para celular
- ✅ **Tablet** — Layout adaptativo
- ✅ **Desktop** — Experiência completa
- ✅ **Offline** — PWA com manifest.json

---

## 🚢 Deploy

### AWS Amplify (Recomendado)

```bash
# 1. Push para GitHub
git push origin main

# 2. Conectar no Amplify Console
# https://console.aws.amazon.com/amplify

# 3. Amplify detecta automaticamente
# - Build: pnpm build
# - Deploy: dist/public

# 4. Domínio personalizado (opcional)
# Domain Management → Add Domain
```

### Variáveis de Ambiente

```env
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-id
VITE_APP_ID=q7gov
VITE_APP_TITLE=Q7Gov
```

---

## 📈 Roadmap

### v2.2 (Próximo)
- [ ] Integração com WhatsApp Business API
- [ ] Exportação de relatórios em PDF com gráficos
- [ ] Dashboard personalizável (drag-and-drop)
- [ ] Autenticação OAuth com prefeituras

### v3.0
- [ ] Backend Node.js com banco de dados
- [ ] API REST completa
- [ ] Webhooks para integrações
- [ ] Machine Learning para previsões

---

## 💼 Preços (Exemplo)

| Plano | Preço | Secretarias | Recursos |
|-------|-------|------------|----------|
| **Starter** | R$ 2.990/mês | Até 5 | Dashboard básico, Portal |
| **Professional** | R$ 8.990/mês | Até 15 | IA, Alertas, Exportação |
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

