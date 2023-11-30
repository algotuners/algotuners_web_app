// WebSocketService.ts
import {getCookie} from "./utils";


class CustomWebSocket extends WebSocket {
    constructor(url: string, headers: Record<string, string>) {
        super(url, Object.keys(headers).map(key => `${key}: ${headers[key]}`).join('\r\n'));
    }
}

class WebSocketService {
    public socket: WebSocket | null = null;

    connect(url: string, onMessage: (event: MessageEvent<any>) => void): void {
        const headers: Record<string, string> = {
            Authorization: getCookie('auth_token'),
        };
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
            console.log('WebSocket connected');
            this.sendMessage({
                indexes_config: {
                    CRUDE_OIL: {
                        index_name: 'CRUDE_OIL',
                        min_order_size: 1,
                        min_order_quantity: 1,
                        option_chain_breadth: 1,
                    },
                },
            });
        };

        this.socket.onmessage = onMessage

        this.socket.onclose = (event) => {
            console.log('WebSocket closed:', event);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    sendMessage(message: Record<string, any>): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not open');
        }
    }

    close(): void {
        if (this.socket) {
            this.socket.close();
        }
    }
}

export default WebSocketService;
