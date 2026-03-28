import { ArrowRight, Check, Users, BarChart3, Zap, Shield, Smartphone, Globe } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-xl font-bold text-primary">Q7</span>
            <span className="text-xs text-muted font-medium">Gov</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Recursos
            </button>
            <button className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Preços
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Solicitar Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Plataforma Municipal Inteligente
          </h1>
          <p className="text-xl text-muted mb-8">
            Gerencie 22+ secretarias, cidadãos e processos com IA assistiva, transparência total e zero burocracia.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
              Iniciar Teste Gratuito <ArrowRight size={18} />
            </button>
            <button className="px-6 py-3 border border-border text-foreground rounded-lg font-semibold hover:bg-secondary transition-colors">
              Ver Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-secondary">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary mb-2">22+</p>
            <p className="text-muted">Secretarias Cobertas</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary mb-2">90%</p>
            <p className="text-muted">Redução de Burocracia</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary mb-2">24/7</p>
            <p className="text-muted">Portal do Cidadão</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Recursos Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: <BarChart3 size={24} />,
                title: 'Dashboard Inteligente',
                description: 'KPIs em tempo real, alertas preditivos e análise de tendências com IA.',
              },
              {
                icon: <Users size={24} />,
                title: 'Portal do Cidadão',
                description: 'Protocolo digital, acompanhamento em tempo real e notificações automáticas.',
              },
              {
                icon: <Zap size={24} />,
                title: 'Triagem Assistida por IA',
                description: 'Classifica pedidos automaticamente, responde dúvidas repetidas, busca em documentos.',
              },
              {
                icon: <Shield size={24} />,
                title: 'Compliance Total',
                description: 'LGPD, LAI, LRF e transparência pública automatizadas.',
              },
              {
                icon: <Smartphone size={24} />,
                title: 'Mobile First',
                description: '100% responsivo. Funciona em qualquer dispositivo e conexão.',
              },
              {
                icon: <Globe size={24} />,
                title: 'Multi-Canal',
                description: 'WhatsApp, App, Balcão, Site e E-mail integrados em um único sistema.',
              },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 border border-border rounded-lg hover:shadow-md transition-shadow">
                <div className="text-primary mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Secretarias Suportadas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              '🏥 Saúde',
              '🔧 Obras',
              '🎓 Educação',
              '🤝 Assistência Social',
              '💰 Tributos',
              '⚖️ Jurídico',
              '👥 RH / Admin',
              '🛒 Compras',
              '📣 Ouvidoria',
              '🌱 Agricultura',
              '🎭 Cultura',
              '⚽ Esporte',
              '✈️ Turismo',
              '🌿 Meio Ambiente',
              '🚌 Mobilidade',
              '🏠 Habitação',
              '🛡️ Defesa Civil',
              '🔩 Autarquias',
              '📡 Comunicação',
              '📐 Planejamento',
              '📈 Des. Econômico',
              '🏛️ Gabinete',
            ].map((module, idx) => (
              <div
                key={idx}
                className="p-4 bg-card border border-border rounded-lg text-center font-medium text-foreground hover:border-primary transition-colors"
              >
                {module}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Planos Simples e Transparentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: 'R$ 2.990',
                period: '/mês',
                features: [
                  'Até 5 secretarias',
                  'Dashboard básico',
                  'Portal do cidadão',
                  'Suporte por email',
                ],
              },
              {
                name: 'Professional',
                price: 'R$ 8.990',
                period: '/mês',
                features: [
                  'Até 15 secretarias',
                  'IA Assistiva',
                  'Alertas preditivos',
                  'Exportação de relatórios',
                  'Suporte prioritário',
                ],
                featured: true,
              },
              {
                name: 'Enterprise',
                price: 'Customizado',
                period: '',
                features: [
                  '22+ secretarias',
                  'Integração com sistemas legados',
                  'Consultoria de implantação',
                  'SLA 99.9%',
                  'Suporte 24/7',
                ],
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-lg border transition-all ${
                  plan.featured
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-border hover:shadow-md'
                }`}
              >
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2 text-muted">
                      <Check size={16} className="text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                    plan.featured
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-border text-foreground hover:bg-secondary'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Solicitar Proposta' : 'Começar Agora'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Transforme a Gestão Municipal
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Junte-se a prefeituras que já economizam 90% em burocracia e aumentam satisfação do cidadão.
          </p>
          <button className="px-8 py-3 bg-primary-foreground text-primary rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Solicitar Demonstração Gratuita
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted">
          <p>© 2026 Q7Gov. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacidade
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Termos
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contato
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
