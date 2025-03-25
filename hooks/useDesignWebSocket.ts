import useSWRSubscription, { SWRSubscriptionOptions } from 'swr/subscription';
import { WEBSOCKET_URL } from 'lib/constants';
import { UserDesign } from 'types/design';

interface WebSocketMessage {
  type: 'image_data' | 'error';
  data: UserDesign[] | { error: string };
}

/**
 * Hook for WebSocket connection that receives design updates
 */
export function useDesignWebSocket(liveStreamUuid: string | null = null) {
  return useSWRSubscription<WebSocketMessage>(
    `/ws/images/${liveStreamUuid ? `?stream_id=${liveStreamUuid}` : ''}`,
    (key: string, { next }: SWRSubscriptionOptions<WebSocketMessage, Error>) => {
      const socket = new WebSocket(`${WEBSOCKET_URL}${key}`);
      const heartbeatInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'heartbeat' }));
        }
      }, 30000);

      socket.onopen = () => {
        console.log('WebSocket connected');
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        clearInterval(heartbeatInterval);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        next(new Error('WebSocket connection error'));
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;

          if (message.type === 'image_data') {
            next(null, message);
          } else if (message.type === 'error') {
            next(new Error((message.data as { error: string }).error));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          next(new Error('Failed to parse WebSocket message'));
        }
      };

      return () => {
        clearInterval(heartbeatInterval);
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      };
    }
  );
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
