class WebSocketClient extends Base {
    constructor() {
        super();
        this.WSS = WSS;
        this.reconnectInterval = 5000;
        this.connect();
        //this.eventEmitter.on("tab_focus", this.reconnect)
    }
    connect() {
        this.socket = new WebSocket(this.WSS);
        this.socket.onopen = () => {
            this.eventEmitter.emit("websocket", true)
            console.log(`%c${this.getTranslation("websocket_ok")} `, LOG_SUCCESS)
        };

        this.socket.onclose = (e) => {
            if (e.wasClean) {
                console.log(`%c${this.getTranslation("websocket_disconnected_clean")}`, LOG_ERROR, { reason: e.reason });
            } else {
                console.log(`%c${this.getTranslation("websocket_disconnected_unclean")}`, LOG_ERROR);
                this.eventEmitter.emit("websocket", false)
                this.reconnect();
            }
        };

        this.socket.onerror = () => {
            console.log(`%c${this.getTranslation("websocket_error")}`, LOG_ERROR);
            this.eventEmitter.emit("websocket", false)
            this.reconnect();
        };
    }

    reconnect() {
        setTimeout(() => {
            console.log(`%c${this.getTranslation("websocket_reconnecting")}`, LOG_WARNING);
            this.connect();
        }, this.reconnectInterval);
    }
    sendDataViaWebSocket(odds, stake, currency) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ "action": "updateCalc", odds, stake, currency }));
        } else {
            console.log(`%c${this.getTranslation("websocket_not_open")}`, LOG_ERROR);
        }
    }
    sendCommandViaWebSocket(state) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ action: "switchState", state }));
        } else {
            console.log(`%c${this.getTranslation("websocket_not_open")}`, LOG_ERROR);
        }
    }
}