import type { WsMessage, WsEvent } from '../models';

export class SignalingClient {
  private url: string
  private socket: WebSocket | undefined;
  private handlers: Map<WsEvent, ((data: any) => void)[]> = new Map();

  constructor(url: string) {
    this.url = url
  }

  public async start()  {
    this.socket = new WebSocket(this.url);
    this.setupListeners();
  }
  private setupListeners(): void {
    this.socket?.addEventListener('open', () => {
      console.log('WebSocket подключен');
    });

    this.socket?.addEventListener('message', (event) => {
      try {
        //console.log(event.data.toString())
        const message: WsMessage = JSON.parse(event.data.toString());
        
        const listeners = this.handlers.get(message.event);
        if (listeners) {
          listeners.forEach((handler) => handler(message.data));
        }
      } catch (err) {
        console.error('Ошибка парсинга сообщения:', err);
      }
    });

    this.socket?.addEventListener('close', () => {
      console.log('WebSocket закрыт');
    });
  }

  public on(event: WsEvent, handler: (data: any) => void): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)?.push(handler);
  }

  public send<T>(event: WsEvent, data: T): void {
    const message = { event, data };
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket?.send(JSON.stringify(message));
    } else {
      console.warn('Сокет не открыт:', event);
    }
  }

  public close(): void {
    this.socket?.close();
  }
}