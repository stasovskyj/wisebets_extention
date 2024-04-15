const configURL = chrome.runtime.getURL("config.json");
fetch(configURL)
    .then(response => response.json())
    .then(config => {
        configData = config;
    });
// chrome.contextMenus.create(
//     {
//         "id": "send",
//         "title": "Відправити баланс",
//         "contexts": ["selection"]
//     }
// );
chrome.contextMenus.onClicked.addListener(function (clickData) {

    let data = [clickData.selectionText];

    let response = fetch(configData.masterServer + "api/account/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    if (!response.ok) {
       
        chrome.notifications.create('errorNotification', {
            type: 'basic',
            iconUrl: '/images/icon.png',
            title: 'Помилка в запиті',
            message: 'Помилка HTTP.' + response.status,
        })
    }
})

// chrome.commands.onCommand.addListener(function (command) {
//     if (command === "send_balance") {

//         chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//             const tab = tabs[0];
//             const hostname = new URL(tab.url).hostname;
//             

//             fetch(configUrl)
//                 .then(response => response.json())
//                 .then(config => {
//                     const siteConfig = config.sites[hostname];

//                     if (siteConfig) {
//                         chrome.scripting.executeScript(
//                             {
//                                 target: { tabId: tab.id },
//                                 function: parseBalance,
//                                 args: [siteConfig.balanceSelector, siteConfig.currencySelector],
//                             },
//                             function (result) {
//                                 const [balance, currency] = result;
//                                 const data = {
//                                     site: hostname,
//                                     balance: balance,
//                                     currency: currency,
//                                 };
//                                 console.log(data)
// fetch("https://forkmaster.pp.ua/api/account/", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
// })
//     .then(response => console.log(response))
//     .catch(error => console.error(error));
// }
//                         );
//                     }
//                 })
//                 .catch(error => console.error(error));
//         });
//     }
// });
// function parseBalance(balanceSelector, currencySelector) {
//     const balance = document.querySelector(balanceSelector).textContent.trim();
//     const currency = document.querySelector(currencySelector).textContent;
//     return [balance, currency];
// }
chrome.runtime.onInstalled.addListener(({reason}) => {
    if (reason === 'install') {
      chrome.tabs.create({
        url: "ui/options.html"
      });
    }
  });