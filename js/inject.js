
chrome.storage.sync.get().then((config) => {
    if (config) {
        let id = findId(config.accounts)
        //console.log(config.accounts)
        //console.log(id)
        setInterval(() => {
            sendToRemoteServer(id, config.apiKey);
        }, 60000); 
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
            // Робота з jsonData
            if (domains.includes(currentDomain)) {
                // Якщо так, повернути id поточного об'єкта
                return data[i].id;
            }
        } catch (error) {
            console.error('Помилка розпарсингу JSON:', error);
        }
       
    }

    return null;
}
function sendToRemoteServer(id, apiKey) {
fetch('https://forkmaster.pp.ua/api/iptracker/track/', {
        method: 'POST',
        // dataType: 'json',
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        // body: JSON.stringify(dataToSend)
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Задаємо Content-Type для 
            "api-key": apiKey,
            "id": id
        },
        body: ''
        
    })
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