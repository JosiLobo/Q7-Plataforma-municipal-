# 🔐 Credenciais de Teste — Q7Gov v2.5

## Usuário Admin

**Criado para testes e desenvolvimento da plataforma Q7Gov**

### Dados de Acesso

| Campo | Valor |
|-------|-------|
| **Email** | kenenaraujo@gmail.com |
| **Nome** | Kener Araújo |
| **Role** | Admin |
| **OpenID** | kenenaraujo-admin-001 |
| **Status** | Ativo |

---

## 🚀 Como Acessar

### 1. Iniciar o Servidor

```bash
cd /home/ubuntu/q7gov-modern
pnpm dev
```

O servidor estará disponível em: `http://localhost:3000`

### 2. Acessar a Plataforma

- **Landing Page:** http://localhost:3000/
- **Dashboard:** http://localhost:3000/app
- **WhatsApp:** http://localhost:3000/app/whatsapp
- **Sentimentos:** http://localhost:3000/app/sentiment
- **Métricas:** http://localhost:3000/app/metrics
- **IA Insights:** http://localhost:3000/app/ai

### 3. Fazer Login

O sistema usa **OAuth (Manus)** para autenticação. O usuário admin foi criado no banco de dados e pode fazer login através do portal OAuth.

---

## 📊 Funcionalidades Disponíveis para Teste

### Dashboard Principal (`/app`)
- ✅ 4 KPIs em tempo real
- ✅ Alertas críticos
- ✅ Gráficos interativos
- ✅ Mapa de obras
- ✅ Tabelas de dados
- ✅ Exportação de relatórios

### WhatsApp (`/app/whatsapp`)
- ✅ Gerenciador de conversas
- ✅ Triagem com IA
- ✅ Histórico de mensagens
- ✅ Status de entrega

### Análise de Sentimentos (`/app/sentiment`)
- ✅ Classificação automática (Positivo/Neutro/Negativo)
- ✅ Distribuição de sentimentos
- ✅ Tendência de satisfação (7 dias)
- ✅ Alertas de insatisfação
- ✅ Score médio de sentimento

### Métricas (`/app/metrics`)
- ✅ KPIs do dia
- ✅ Gráficos de tendência
- ✅ Taxa de resposta
- ✅ Satisfação média
- ✅ Exportação de relatórios

### IA Insights (`/app/ai`)
- ✅ Resumo executivo automático
- ✅ Alertas preditivos
- ✅ Recomendações

---

## 🔧 Dados de Teste

O script `server/seed-db.mjs` cria:

1. **Usuário Admin** — kenenaraujo@gmail.com
2. **Conversas de Teste** — 3 conversas WhatsApp de exemplo
3. **Dados Iniciais** — Estrutura pronta para testes

---

## 📝 Como Executar o Seed

Se precisar recriar os dados de teste:

```bash
cd /home/ubuntu/q7gov-modern
npx tsx server/seed-db.mjs
```

---

## 🧪 Cenários de Teste Recomendados

### 1. Dashboard
- [ ] Verificar se KPIs carregam corretamente
- [ ] Testar filtros de data
- [ ] Exportar relatório em PDF
- [ ] Exportar relatório em Excel

### 2. WhatsApp
- [ ] Visualizar conversas
- [ ] Verificar triagem de IA
- [ ] Testar busca de conversas
- [ ] Verificar histórico de mensagens

### 3. Sentimentos
- [ ] Visualizar distribuição de sentimentos
- [ ] Testar filtros de data
- [ ] Revisar alertas de insatisfação
- [ ] Resolver alertas

### 4. Métricas
- [ ] Verificar KPIs do dia
- [ ] Testar gráficos de tendência
- [ ] Exportar relatório completo
- [ ] Verificar cálculos de satisfação

### 5. IA Insights
- [ ] Ler resumo executivo
- [ ] Verificar alertas preditivos
- [ ] Testar recomendações

---

## 🐛 Troubleshooting

### Erro: "User not found"
- Executar o seed script novamente
- Verificar se o banco de dados está rodando
- Verificar se as migrações foram aplicadas (`pnpm db:push`)

### Erro: "Database connection failed"
- Verificar se MySQL está rodando
- Verificar `DATABASE_URL` no `.env.local`
- Executar `pnpm db:push` para aplicar migrações

### Erro: "Redis connection refused"
- Iniciar Redis: `redis-server`
- Ou com Docker: `docker run -d -p 6379:6379 redis:latest`

---

## 📞 Suporte

Para dúvidas sobre o setup ou testes:
- Consulte o README.md
- Verifique os logs do servidor (`pnpm dev`)
- Abra uma issue no GitHub

---

## 🔒 Segurança

⚠️ **IMPORTANTE:** Estas credenciais são apenas para **desenvolvimento e testes locais**.

Para produção:
- ✅ Use OAuth real com Manus
- ✅ Altere todas as senhas
- ✅ Configure HTTPS
- ✅ Use variáveis de ambiente seguras
- ✅ Ative autenticação de dois fatores

---

**Criado em:** 28 de Março de 2026  
**Versão:** Q7Gov v2.5 Enterprise
