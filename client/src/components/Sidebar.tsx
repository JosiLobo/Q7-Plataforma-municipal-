import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
  active?: boolean;
}

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const SECRETARIAS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', active: true },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬', badge: 5 },
  { id: 'ai', label: 'IA Insights', icon: '🤖' },
  { id: 'metrics', label: 'Métricas', icon: '📈' },
  { id: 'saude', label: 'Saúde', icon: '🏥', badge: 3 },
  { id: 'obras', label: 'Obras', icon: '🔧', badge: 1 },
  { id: 'educacao', label: 'Educação', icon: '🎓' },
  { id: 'assistencia', label: 'Assistência Social', icon: '🤝' },
  { id: 'tributos', label: 'Tributos', icon: '💰' },
  { id: 'juridico', label: 'Jurídico', icon: '⚖️' },
  { id: 'rh', label: 'RH / Admin', icon: '👥' },
  { id: 'compras', label: 'Compras', icon: '🛒' },
  { id: 'ouvidoria', label: 'Ouvidoria', icon: '📣', badge: 2 },
  { id: 'agricultura', label: 'Agricultura', icon: '🌱' },
  { id: 'cultura', label: 'Cultura', icon: '🎭' },
  { id: 'esporte', label: 'Esporte', icon: '⚽' },
  { id: 'turismo', label: 'Turismo', icon: '✈️' },
  { id: 'ambiente', label: 'Meio Ambiente', icon: '🌿' },
  { id: 'mobilidade', label: 'Mobilidade', icon: '🚌' },
  { id: 'habitacao', label: 'Habitação', icon: '🏠' },
  { id: 'defesa', label: 'Defesa Civil', icon: '🛡️' },
  { id: 'autarquias', label: 'Autarquias', icon: '🔩' },
  { id: 'comunicacao', label: 'Comunicação', icon: '📡' },
  { id: 'planejamento', label: 'Planejamento', icon: '📐' },
  { id: 'desenvolvimento', label: 'Des. Econômico', icon: '📈' },
];

export default function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('dashboard');

  const handleToggle = () => {
    setCollapsed(!collapsed);
    onToggle?.();
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={handleToggle}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {collapsed ? <Menu size={20} /> : <X size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 z-40',
          collapsed ? 'w-20 md:w-64' : 'w-64',
          !isOpen && 'hidden md:flex'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-mono text-lg font-bold text-accent">Q7</span>
              <span className="text-xs text-sidebar-foreground/50 font-medium">Gov</span>
            </div>
          )}
          <button
            onClick={handleToggle}
            className="p-1.5 hover:bg-sidebar-accent/10 rounded-lg transition-colors hidden md:block"
          >
            <ChevronDown
              size={18}
              className={cn('transition-transform', collapsed && 'rotate-90')}
            />
          </button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="px-3 py-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full px-3 py-2 bg-sidebar-accent/10 border border-sidebar-border rounded-lg text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus:outline-none focus:border-accent transition-colors"
              />
              <span className="absolute right-3 top-2.5 text-sidebar-foreground/40">🔍</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {/* Main Section */}
          {!collapsed && (
            <div className="px-2 py-2 text-xs font-bold uppercase letter-spacing text-sidebar-foreground/30">
              Principal
            </div>
          )}

          {SECRETARIAS.slice(0, 1).map((item) => (
            <NavItem
              key={item.id}
              item={item}
              collapsed={collapsed}
              isActive={expandedSection === item.id}
              onClick={() => setExpandedSection(item.id)}
            />
          ))}

          {/* Secretarias Section */}
          {!collapsed && (
            <div className="px-2 py-3 mt-4 text-xs font-bold uppercase letter-spacing text-sidebar-foreground/30">
              Secretarias
            </div>
          )}

          {SECRETARIAS.slice(1).map((item) => (
            <NavItem
              key={item.id}
              item={item}
              collapsed={collapsed}
              isActive={expandedSection === item.id}
              onClick={() => setExpandedSection(item.id)}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-sidebar font-bold text-sm flex-shrink-0">
              AD
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Admin</p>
                <p className="text-xs text-sidebar-foreground/50 truncate">Gestor Municipal</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {collapsed && isOpen && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden z-30"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
}

interface NavItemProps {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ item, collapsed, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
        isActive
          ? 'bg-accent/15 text-accent border border-accent/20'
          : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground',
        collapsed && 'justify-center'
      )}
      title={collapsed ? item.label : undefined}
    >
      <span className="text-lg flex-shrink-0">{item.icon}</span>
      {!collapsed && (
        <>
          <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
          {item.badge && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-red-500 text-white flex-shrink-0">
              {item.badge}
            </span>
          )}
        </>
      )}
    </button>
  );
}
