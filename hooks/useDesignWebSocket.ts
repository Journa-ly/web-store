import useSWRSubscription, { SWRSubscriptionOptions } from 'swr/subscription';
import { WEBSOCKET_URL } from 'lib/constants';
import { UserDesign } from 'types/design';
import { useEffect, useRef } from 'react';

interface WebSocketMessage {
  type: 'image_data' | 'error';
  data: UserDesign[] | { error: string };
}

// Singleton instance to manage WebSocket connection
class WebSocketManager {
  private static instance: WebSocketManager;
  private socket: WebSocket | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private subscribers: Set<(message: WebSocketMessage) => void> = new Set();
  private errorHandlers: Set<(error: Error) => void> = new Set();

  private constructor() {}

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  connect(url: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    // Clean up existing connection if any
    this.disconnect();

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.cleanup();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.errorHandlers.forEach((handler) => handler(new Error('WebSocket connection error')));
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        this.subscribers.forEach((subscriber) => subscriber(message));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        this.errorHandlers.forEach((handler) =>
          handler(new Error('Failed to parse WebSocket message'))
        );
      }
    };

    // Start heartbeat
    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'heartbeat' }));
      }
    }, 30000);
  }

  subscribe(onMessage: (message: WebSocketMessage) => void, onError: (error: Error) => void) {
    this.subscribers.add(onMessage);
    this.errorHandlers.add(onError);
    return () => {
      this.subscribers.delete(onMessage);
      this.errorHandlers.delete(onError);
    };
  }

  disconnect() {
    this.cleanup();
  }

  private cleanup() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
    this.socket = null;
  }

  // Getters for private properties
  getSubscriberCount(): number {
    return this.subscribers.size;
  }

  hasActiveConnection(): boolean {
    return this.socket !== null;
  }
}

/**
 * Hook for WebSocket connection that receives design updates
 */
export function useDesignWebSocket(liveStreamUuid: string | null = null) {
  const key = `/ws/images/${liveStreamUuid ? `?stream_id=${liveStreamUuid}` : ''}`;
  const wsManager = useRef(WebSocketManager.getInstance());

  const { data, error } = useSWRSubscription<WebSocketMessage>(
    key,
    (key: string, { next }: SWRSubscriptionOptions<WebSocketMessage, Error>) => {
      const url = `${WEBSOCKET_URL}${key}`;
      wsManager.current.connect(url);

      const unsubscribe = wsManager.current.subscribe(
        (message) => {
          if (message.type === 'image_data') {
            next(null, message);
          } else if (message.type === 'error') {
            next(new Error((message.data as { error: string }).error));
          }
        },
        (error) => next(error)
      );

      return () => {
        unsubscribe();
        // Only disconnect if there are no more subscribers
        if (wsManager.current.getSubscriberCount() === 0) {
          wsManager.current.disconnect();
        }
      };
    }
  );

  // Handle visibility change to reconnect when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !wsManager.current.hasActiveConnection()) {
        wsManager.current.connect(`${WEBSOCKET_URL}${key}`);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [key]);

  return { data, error };
}

// Example usage:
// const { data, error } = useDesignWebSocket();
// if (data?.type === 'image_data') {
//   const designs = data.data as Design[];
//   // Handle designs update
// } else if (data?.type === 'error') {
//   const errorData = data.data as { error: string };
//   // Handle error
// }
