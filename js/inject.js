var calc = document.createElement('div');
calc.innerHTML = `<div id="calc-container" class="calc-container">
        <div class="card">
            <div class="card-body">
                <form class="calc">
                    <div class="form-row">
                        <label for="amountA">Сума:</label>
                        <input type="number" id="amountA" name="amountA" class="form-control" step="0.01"
                            inputmode="decimal">
                    </div>
                    <div class="form-row">
                        <label for="coefficientA">Коефіцієнт A:</label>
                        <input type="number" id="coefficientA" name="coefficientA" class="form-control" step="0.001"
                            inputmode="decimal">
                    </div>
                    <div class="form-row">
                        <label for="coefficientB">Коефіцієнт B:</label>
                        <input type="number" id="coefficientB" name="coefficientB" class="form-control" step="0.001"
                            inputmode="decimal">
                    </div>
                    <div class="form-row">
                        <label for="factAmount">Фактична сума:</label>
                        <input type="number" id="factAmount" name="factAmount" class="form-control" step="0.01"
                            inputmode="decimal">
                    </div>
                    <div class="form-row">
                        <label for="amountB">Сума B:</label>
                        <input type="decimal" id="amountB" step="0.01" class="form-control" name="amountB" readonly>
                    </div>
                    <div class="form-row">
                        <label for="remainAmount">Відкрито</label>
                        <input type="decimal" id="remainAmount" step="0.01" class="form-control" name="remainAmount"
                            readonly>
                    </div>
                    <div class="form-row">
                        <label for="profit">Прибуток:</label>
                        <input type="decimal" id="profit" step="0.01" class="form-control" name="profit" readonly>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
document.body.append(calc);
//
const calcForm = document.getElementById('calc-container');

// Відключення перетягування, коли клікнуто на поле вводу
calcForm.addEventListener('mousedown', function (event) {
    if (event.target.tagName === 'INPUT') {
        isDragging = false;
    }
});

// Увімкнення перетягування, коли клікнуто поза полями вводу
calcForm.addEventListener('mouseup', function (event) {
    isDragging = true;
});

let isDragging = true;
let offsetX, offsetY;

calcForm.addEventListener('mousedown', function (e) {
    if (!isDragging) return;
    e.preventDefault();
    offsetX = e.clientX - calcForm.getBoundingClientRect().left;
    offsetY = e.clientY - calcForm.getBoundingClientRect().top;
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', cleanup);
});

function moveHandler(e) {
    calcForm.style.left = e.clientX - offsetX + 'px';
    calcForm.style.top = e.clientY - offsetY + 'px';
}

function cleanup() {
    window.removeEventListener('mousemove', moveHandler);
    window.removeEventListener('mouseup', cleanup);
}
//
chrome.storage.sync.get().then((config) => {
    if (Object.keys(config).length !== 0) {
        
        config.currentTabAccountId = findId(config.accounts)

        if (config.currentTabAccountId != null) {
            setInterval(() => {
                sendToRemoteServer(config.currentTabAccountId, config.apiKey);
                }, 60000);
        } else {
            sendMessageToServiceWorker({action: "notification", message:"Акаунт до сайту "+ window.location.hostname +" не знайдено. Виконайте синхронізацію акаунтів та оновіть сторінку"});
        }
    } else {
        sendMessageToServiceWorker({action: "notification", message:"Акаунти та опції відсутні. Отримайте API ключ на сайті та збережіть налаштування"})
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
            sendMessageToServiceWorker({action: "notification", message:error})
        }

    }

    return null;
}
function sendToRemoteServer(id, apiKey) {
    fetch('https://forkmaster.pp.ua/api/iptracker/track/?api-key=' + apiKey + '&id=' + id)
        .then(response => {
            if (!response.ok) {
                sendMessageToServiceWorker({action: "notification", message:"Помилка під час відправки даних на сервер"})
            }else{
                console.log("Дані успішно відправлено")
            }
        })
        .catch(error => {
            console.error('Помилка під час відправки даних на сервер:', error);
        });
};

// повідомлення в service worker
function sendMessageToServiceWorker(data){
    chrome.runtime.sendMessage(data);
}