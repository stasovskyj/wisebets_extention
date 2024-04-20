chrome.storage.sync.get().then((config) => {
    if (Object.keys(config).length !== 0) {

        config.currentTabAccountId = findId(config.accounts)

        if (config.currentTabAccountId != null) {
            setInterval(() => {
                sendToRemoteServer(config.currentTabAccountId, config.apiKey);
            }, 60000);
        } else {
            sendMessageToServiceWorker({ action: "notification", message: "Акаунт до сайту " + window.location.hostname + " не знайдено. Виконайте синхронізацію акаунтів та оновіть сторінку" });
        }
    } else {
        sendMessageToServiceWorker({ action: "notification", message: "Акаунти та опції відсутні. Отримайте API ключ на сайті та збережіть налаштування" })
    }
});
function findId(data) {
    // Отримати домен поточної сторінки користувача
    let currentDomain = window.location.hostname;

    for (let i = 0; i < data.length; i++) {
        try {
            let domains = JSON.parse(data[i].domains);

            if (domains.includes(currentDomain)) {
                return data[i].id;
            }
        } catch (error) {
            sendMessageToServiceWorker({ action: "notification", message: error })
        }

    }

    return null;
}
function sendToRemoteServer(id, apiKey) {
    fetch( API_ROOT + IPTRACKER_URI + '?api-key=' + apiKey + '&id=' + id)
        .then(response => {
            if (!response.ok) {
                sendMessageToServiceWorker({ action: "notification", message: "Помилка під час відправки даних на сервер" })
            } else {
                console.log("Дані успішно відправлено")
            }
        })
        .catch(error => {
            console.error('Помилка під час відправки даних на сервер:', error);
        });
};

// повідомлення в service worker
function sendMessageToServiceWorker(data) {
    chrome.runtime.sendMessage(data);
}