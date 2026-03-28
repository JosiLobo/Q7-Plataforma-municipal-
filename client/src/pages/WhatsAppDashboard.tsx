import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { MessageCircle, Send, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface Conversation {
  id: number;
  phoneNumber: string;
  citizenName: string | null;
  department: string | null;
  status: string;
  lastMessageAt: Date;
}

interface Message {
  id: number;
  conversationId: number;
  sender: 'citizen' | 'ai' | 'agent';
  content: string;
  messageType: string;
  timestamp: Date;
}

export default function WhatsAppDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch conversations
  const { data: conversations = [] } = trpc.whatsapp.listConversations.useQuery();

  // Fetch messages when conversation changes
  const { data: historyMessages = [] } = trpc.whatsapp.getHistory.useQuery(
    { conversationId: selectedConversation?.id || 0 },
    { enabled: !!selectedConversation }
  );

  useEffect(() => {
    if (historyMessages) {
      setMessages(historyMessages);
    }
  }, [historyMessages]);

  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;

    // Simular envio
    console.log('Enviando:', newMessage);
    setNewMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'escalated':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolved':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <MessageCircle size={16} />;
      case 'escalated':
        return <AlertCircle size={16} />;
      case 'resolved':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      default:
        return <MessageCircle size={16} />;
    }
  };

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="flex-1 md:ml-64 pt-14">
        <Topbar
          title="WhatsApp — Atendimento"
          subtitle="Gerenciar conversas com cidadãos"
        />

        <div className="flex h-[calc(100vh-56px)]">
          {/* Lista de Conversas */}
          <div className="w-80 border-r border-border bg-card overflow-y-auto">
            <div className="p-4 border-b border-border">
              <h2 className="font-bold text-foreground mb-4">Conversas Ativas</h2>
              <div className="space-y-2">
                {conversations.map((conv: Conversation) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedConversation?.id === conv.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold text-sm">{conv.citizenName || 'Cidadão'}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(conv.status)}`}>
                        {getStatusIcon(conv.status)}
                      </span>
                    </div>
                    <p className="text-xs opacity-75">{conv.phoneNumber}</p>
                    <p className="text-xs opacity-75 mt-1">{conv.department || 'Sem departamento'}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header da Conversa */}
                <div className="p-4 border-b border-border bg-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-foreground">{selectedConversation.citizenName || 'Cidadão'}</h3>
                      <p className="text-sm text-muted">{selectedConversation.phoneNumber}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                        <Zap size={20} className="text-primary" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted">
                      <p>Nenhuma mensagem ainda</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'citizen' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.sender === 'citizen'
                              ? 'bg-secondary text-foreground'
                              : msg.sender === 'ai'
                              ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-75 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border bg-card">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Digite sua resposta..."
                      className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted">
                <p>Selecione uma conversa para começar</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
