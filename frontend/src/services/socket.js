import config from '../config';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  initSocket() {
    // Only attempt to connect if WebSocket is enabled
    if (!config.features.enableWebSocket) {
      console.log('WebSocket feature is disabled');
      return;
    }

    if (this.socket) {
      return;
    }

    try {
      this.socket = new WebSocket(config.wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.reconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
    }
  }

  reconnect() {
    if (!config.features.enableWebSocket) {
      return;
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.initSocket(), 5000);
    } else {
      console.log('Max reconnection attempts reached');
    }
  }

  sendMessage(message) {
    if (!this.isConnected || !this.socket) {
      console.log('WebSocket is not connected');
      return;
    }
    this.socket.send(JSON.stringify(message));
  }

  close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

const socketService = new WebSocketService();
export default socketService; 