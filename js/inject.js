
chrome.storage.sync.get().then((config) => {
    if (config) {
        config.currentTabAccountId = findId(config.accounts)
        //console.log(config)
        //console.log(id)
        if (config.currentTabAccountId != null) {
            setInterval(() => {
                sendToRemoteServer(config.currentTabAccountId, config.apiKey);
            }, 30000);
        } else {
            console.log("Акаунт не знайдено");
        }
    } else {
        console.log("Відсутні опції");
    }
});
function findId(data) {
    // Отримати домен поточної сторінки користувача
    let currentDomain = window.location.hostname;

    for (let i = 0; i < data.length; i++) {
        try {
            var domains = JSON.parse(data[i].domains);

            if (domains.includes(currentDomain)) {
                // Якщо так, повернути id поточного об'єкта
                return data[i].id;
            }
        } catch (error) {
            console.error('Помилка парсингу JSON:', error);
        }

    }

    return null;
}
function sendToRemoteServer(id, apiKey) {
    fetch('https://forkmaster.pp.ua/api/iptracker/track/?id=' + id + '&api-key=' + apiKey
        //, {
        //method: 'POST',
        // dataType: 'json',
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        // body: JSON.stringify(dataToSend)
        // headers: {
        //     "X-API-KEY": apiKey,
        //     "id": id
        //    },
        //body: ''}
    )
        .then(response => {
            if (response.ok) {
                console.log('Дані успішно відправлені на сервер');
            } else {
                console.error('Помилка під час відправки даних на сервер');
            }
        })
        .catch(error => {
            console.error('Помилка під час відправки даних на сервер:', error);
        });
};