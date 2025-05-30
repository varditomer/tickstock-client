import { io, Socket } from "socket.io-client";

const isProd = import.meta.env.PROD;
const baseUrl = isProd
  ? window.location.origin
  : import.meta.env.VITE_SOCKET_URL;

console.log("🔌 Connecting to socket server at:", baseUrl);

let socket: Socket;

export const socketService = {
  setup() {
    socket = io(baseUrl);
  },

  on<T = any>(eventName: string, cb: (data: T) => void) {
    socket.on(eventName, cb);
  },

  off(eventName: string, cb?: Function) {
    if (!socket) return;
    if (!cb) socket.removeAllListeners(eventName);
    else socket.off(eventName, cb as (...args: any[]) => void);
  },

  emit<T = any>(eventName: string, data?: T) {
    socket.emit(eventName, data);
  },

  disconnect() {
    socket.disconnect();
  },

  getSocket() {
    return socket;
  },
};

// Setup immediately on import
socketService.setup();
