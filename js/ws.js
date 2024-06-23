class WebSocketClient extends Base {
    constructor() {
        super();
        this.WSS = WSS;
        this.reconnectInterval = 5000; // 5 seconds
        this.connect();
    }
    connect() {
        this.socket = new WebSocket(this.WSS);
        this.socket.onopen = () => {
            console.log(`%c${this.getTranslation("websocket_ok")}`, "background: green; color: white; display: block;")
        };

        this.socket.onmessage = (e) => {
            this.actionOnDataReceived(e);
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
    sendDataViaWebSocket(odds, stake) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ action: "updateCalc", odds, stake }));
        } else {
            console.log(`%c${this.getTranslation("websocket_not_open")}`, "background: red; color: white; display: block;");
        }
    }
    sendCommandViaWebSocket(mode) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ action: "switchMode", mode }));
        } else {
            console.log(`%c${this.getTranslation("websocket_not_open")}`, "background: red; color: white; display: block;");
        }
    }
    actionOnDataReceived(e) {
        const data = JSON.parse(e.data);

        switch (data.action) {
            case "updateCalc":
                this.updateCalc(data.stake, data.odds, data.currency);
                break;
            case "switchMode":
                this.mode = data.mode;
                console.log("switched_mode", "", { mode: data.mode });
                break;
            default:
                console.log(`%c${this.getTranslation("unknown_data")}`, "background: red; color: white; display: block;", { data: e.data });
        }
    }
    
}