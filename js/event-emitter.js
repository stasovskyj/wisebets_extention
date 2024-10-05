class EventEmitter {

    constructor() {
        this.events = {};
    }

    on(eventName, callback) {
        !this.events[eventName] && (this.events[eventName] = []);
        this.events[eventName].push(callback);
    }

    off(eventName, callback) {
        this.events[eventName] = this.events[eventName].filter(eventCallback => callback !== eventCallback);
    }

    emit(eventName, ...args) {
        const event = this.events[eventName];
        event && event.forEach(callback => callback(...args));
    }
}