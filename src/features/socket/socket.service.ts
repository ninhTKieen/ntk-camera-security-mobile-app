import { APP_API_ENDPOINT } from '@src/configs/constant';
import { getAccessToken } from '@src/utils/token.util';
import { Socket, io } from 'socket.io-client';

class SocketService {
  private socket: Socket;
  private accessToken: string = getAccessToken() || '';

  constructor() {
    this.socket = io(APP_API_ENDPOINT, {
      extraHeaders: {
        access_token: this.accessToken,
      },
    });
  }

  public start() {
    const token = getAccessToken();
    this.socket = io(APP_API_ENDPOINT, {
      extraHeaders: {
        access_token: token || '',
      },
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.connected);
    });
  }

  public stop() {
    this.socket.on('disconnect', () => {
      console.log('Socket disconnected: ', this.socket.disconnected);
    });
  }

  public send(params: { channel: string; data: any }) {
    this.socket.emit(params.channel, params.data);
  }

  public received(params: { channel: string; callback: (data: any) => void }) {
    this.socket.on(params.channel, params.callback);
  }

  public on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  public off(event: string) {
    this.socket.off(event);
  }
}

const socketService = new SocketService();

export default socketService;
