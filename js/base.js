class Base {

    getTranslation(messageName, placeholders = {}) {
        let message = chrome.i18n.getMessage(messageName) || '';
        Object.keys(placeholders).forEach(key => {
            message = message.replace(`$${key}$`, placeholders[key]);
        });
        return message;
    }
    sendMessageToServiceWorker(data) {
        chrome.runtime.sendMessage(data);
        return this;
    }
}
Base.prototype.eventEmitter = new EventEmitter();