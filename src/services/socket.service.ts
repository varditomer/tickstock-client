import { io, Socket } from "socket.io-client";

const isProd = import.meta.env.PROD;
const baseUrl = isProd
  ? window.location.origin
  : import.meta.env.VITE_SOCKET_URL;

console.log("🔌 Connecting to socket server at:", baseUrl);

let socket: Socket;

type SocketEventCallback<T = unknown> = (data: T) => void;

export const socketService = {
  setup() {
    socket = io(baseUrl, {
      autoConnect: true,
      reconnection: true,
    });
  },

  on<T>(eventName: string, cb: SocketEventCallback<T>) {
    socket.on(eventName, cb);
  },

  off<T>(eventName: string, cb?: SocketEventCallback<T>) {
    if (!socket) return;
    if (!cb) socket.removeAllListeners(eventName);
    else socket.off(eventName, cb);
  },

  emit<T>(eventName: string, data?: T) {
    socket.emit(eventName, data);
  },

  disconnect() {
    socket.disconnect();
  },

  getSocket() {
    return socket;
  },
};

socketService.setup();
