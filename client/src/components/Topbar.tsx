import { Bell, Search, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export default function Topbar({ title = 'Dashboard', subtitle }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Estoque crítico', message: 'Amoxicilina 500mg com 12 un.', time: '5 min' },
    { id: 2, title: 'Prazo vencido', message: 'Obra #OBR-889 vencida em 24/03', time: '2h' },
    { id: 3, title: 'Nova solicitação', message: 'Protocolo #PRO-5892 recebido', time: '1h' },
  ];

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-14 bg-card border-b border-border flex items-center justify-between px-6 z-30 transition-all duration-300">
      {/* Left Section */}
      <div className="flex flex-col">
        <h1 className="text-sm font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg border border-border">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Buscar protocolos..."
            className="bg-transparent text-sm outline-none w-48 placeholder:text-muted"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Bell size={18} className="text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Notificações</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="px-4 py-3 border-b border-border hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <p className="text-sm font-medium text-foreground">{notif.title}</p>
                    <p className="text-xs text-muted mt-1">{notif.message}</p>
                    <p className="text-xs text-muted/60 mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border text-center">
                <button className="text-xs font-medium text-primary hover:text-primary/80">
                  Ver todas as notificações
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          title={`Mudar para ${theme === 'light' ? 'modo escuro' : 'modo claro'}`}
        >
          {theme === 'light' ? (
            <Moon size={18} className="text-foreground" />
          ) : (
            <Sun size={18} className="text-foreground" />
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              AD
            </div>
            <span className="hidden sm:inline text-sm font-medium text-foreground">Admin</span>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
              <div className="p-4 border-b border-border">
                <p className="text-sm font-medium text-foreground">Admin User</p>
                <p className="text-xs text-muted">Gestor Municipal</p>
              </div>
              <div className="p-2 space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors">
                  <Settings size={16} />
                  Configurações
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors">
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
