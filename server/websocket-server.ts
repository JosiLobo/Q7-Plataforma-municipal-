import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

/**
 * Inicializar servidor WebSocket
 */
export function initializeWebSocket(httpServer: HTTPServer) {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`[WebSocket] Cliente conectado: ${socket.id}`);

    // Juntar-se a uma sala de conversa
    socket.on('join-conversation', (conversationId: number) => {
      socket.join(`conversation-${conversationId}`);
      console.log(`[WebSocket] Cliente ${socket.id} entrou na conversa ${conversationId}`);
    });

    // Sair de uma sala de conversa
    socket.on('leave-conversation', (conversationId: number) => {
      socket.leave(`conversation-${conversationId}`);
      console.log(`[WebSocket] Cliente ${socket.id} saiu da conversa ${conversationId}`);
    });

    // Juntar-se à sala de métricas
    socket.on('join-metrics', () => {
      socket.join('metrics');
      console.log(`[WebSocket] Cliente ${socket.id} entrou na sala de métricas`);
    });

    // Desconexão
    socket.on('disconnect', () => {
      console.log(`[WebSocket] Cliente desconectado: ${socket.id}`);
    });
  });

  return io;
}

/**
 * Obter instância do WebSocket
 */
export function getWebSocket(): SocketIOServer | null {
  return io;
}

/**
 * Emitir nova mensagem para conversa
 */
export function emitNewMessage(conversationId: number, message: any) {
  if (!io) return;
  io.to(`conversation-${conversationId}`).emit('new-message', message);
  console.log(`[WebSocket] Mensagem emitida para conversa ${conversationId}`);
}

/**
 * Emitir atualização de status da conversa
 */
export function emitConversationStatusUpdate(conversationId: number, status: string) {
  if (!io) return;
  io.to(`conversation-${conversationId}`).emit('status-update', { conversationId, status });
  console.log(`[WebSocket] Status atualizado para conversa ${conversationId}: ${status}`);
}

/**
 * Emitir nova métrica
 */
export function emitMetricUpdate(metric: any) {
  if (!io) return;
  io.to('metrics').emit('metric-update', metric);
  console.log(`[WebSocket] Métrica emitida`);
}

/**
 * Emitir atualização de dashboard
 */
export function emitDashboardUpdate(dashboardData: any) {
  if (!io) return;
  io.to('metrics').emit('dashboard-update', dashboardData);
  console.log(`[WebSocket] Dashboard atualizado`);
}

/**
 * Emitir notificação para todos os clientes
 */
export function emitNotification(title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
  if (!io) return;
  io.emit('notification', { title, message, type, timestamp: new Date() });
  console.log(`[WebSocket] Notificação emitida: ${title}`);
}

/**
 * Emitir atualização de lista de conversas
 */
export function emitConversationListUpdate(conversations: any[]) {
  if (!io) return;
  io.emit('conversation-list-update', conversations);
  console.log(`[WebSocket] Lista de conversas atualizada`);
}
