class WebSocketClient extends Base {
    constructor() {
        super();
        this.WSS = WSS;
        this.reconnectInterval = 1000;
        this.connect();
    }
    connect() {
        this.socket = new WebSocket(this.WSS);
        this.socket.onopen = () => {
            console.log(`%c${this.getTranslation("websocket_ok")}`, "background: green; color: white; display: block;")
        };

        this.socket.onclose = (e) => {
            if (e.wasClean) {
                console.log(`%c${this.getTranslation("websocket_disconnected_clean")}`, "background: red; color: white; display: block;", { reason: e.reason });
            } else {
                console.log(`%c${this.getTranslation("websocket_disconnected_unclean")}`, "background: red; color: white; display: block;");
            }
            this.reconnect();
        };

        this.socket.onerror = () => {
            console.log(`%c${this.getTranslation("websocket_error")}`, "background: red; color: white; display: block;");
            this.reconnect();
        };
    }

    reconnect() {
        setTimeout(() => {
            console.log(`%c${this.getTranslation("websocket_reconnect")}`, "background: orange; color: white; display: block;");
            this.connect();
        }, this.reconnectInterval);
    }
    sendDataViaWebSocket(odds, stake, currency) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ "action": "updateCalc", odds, stake, currency }));
        } else {
            console.log(`%c${this.getTranslation("websocket_not_open")}`, "background: red; color: white; display: block;");
        }
    }
    sendCommandViaWebSocket(state) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ action: "switchState", state }));
        } else {
            console.log(`%c${this.getTranslation("websocket_not_open")}`, "background: red; color: white; display: block;");
        }
    }
}