import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: string;
  action: () => void;
}

const COMMANDS: CommandItem[] = [
  { id: '1', title: 'Dashboard', category: 'Navegação', icon: '📊', action: () => {} },
  { id: '2', title: 'Saúde', category: 'Secretarias', icon: '🏥', action: () => {} },
  { id: '3', title: 'Obras', category: 'Secretarias', icon: '🔧', action: () => {} },
  { id: '4', title: 'Educação', category: 'Secretarias', icon: '🎓', action: () => {} },
  { id: '5', title: 'Protocolo #PRO-5891', category: 'Protocolos', icon: '📋', action: () => {} },
  { id: '6', title: 'Protocolo #PRO-5890', category: 'Protocolos', icon: '📋', action: () => {} },
  { id: '7', title: 'Exportar Relatório', category: 'Ações', icon: '📥', action: () => {} },
  { id: '8', title: 'Configurações', category: 'Sistema', icon: '⚙️', action: () => {} },
];

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CommandPalette({ open = false, onOpenChange }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(open);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = COMMANDS.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(search.toLowerCase()) ||
      cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (isOpen && e.key === 'Escape') {
        setIsOpen(false);
      }
      if (isOpen && e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filtered.length);
      }
      if (isOpen && e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
      }
      if (isOpen && e.key === 'Enter') {
        e.preventDefault();
        filtered[selectedIndex]?.action();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex]);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-muted hover:text-foreground transition-colors"
      >
        <Search size={16} />
        <span>Buscar...</span>
        <kbd className="ml-auto text-xs bg-background px-2 py-1 rounded">⌘K</kbd>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
        <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search size={18} className="text-muted flex-shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Buscar protocolos, secretarias, ações..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-secondary rounded transition-colors"
            >
              <X size={18} className="text-muted" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted">
                Nenhum resultado encontrado
              </div>
            ) : (
              <div className="py-2">
                {filtered.map((cmd, idx) => (
                  <div key={cmd.id}>
                    {idx === 0 || filtered[idx - 1].category !== cmd.category ? (
                      <div className="px-4 py-2 text-xs font-bold uppercase letter-spacing text-muted/50">
                        {cmd.category}
                      </div>
                    ) : null}
                    <button
                      onClick={() => {
                        cmd.action();
                        setIsOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 transition-colors',
                        selectedIndex === idx
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-secondary text-foreground'
                      )}
                    >
                      <span className="text-lg flex-shrink-0">{cmd.icon}</span>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{cmd.title}</p>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border bg-secondary text-xs text-muted flex items-center justify-between">
            <span>Use ↑↓ para navegar, Enter para selecionar</span>
            <span>ESC para fechar</span>
          </div>
        </div>
      </div>
    </>
  );
}
