function setupBetslipTracking() {
    const betslipConfig = setupSiteConfig();
    //console.log(betslipConfig)
  
// Створюємо MutationObserver для спостереження за змінами контенту betslip
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
           console.log(mutation);
            if (mutation.type === 'childList' && mutation.target.matches(betslipConfig.betSlipElement)) {
                // Викликаємо функцію обробки при зміні контенту betslip
               
                processBetslipContent(mutation.target, betslipConfig);
            } 
          
        }
    });

    // Запускаємо спостереження за змінами тільки в елементі betslip
    observer.observe(betslipConfig.rootElement, { childList: true, subtree: true, attributes: true, attributeFilter:[], characterData: true });
}

// Функція для обробки контенту betslip
function processBetslipContent(betslipNode, betslipConfig) {
    const amountInput = betslipNode.querySelector(betslipConfig.amountInputElement);
    const amount = amountInput ? amountInput.value : 'Невідомо';

    const oddsElement = betslipNode.querySelector(betslipConfig.oddsElement);
    const odds = oddsElement ? oddsElement.textContent : 'Невідомо';

    console.log('Amount:', amount);
    console.log('Odds:', odds);
}

// Встановлюємо відслідковування елементів для кожного сайту
function getCurrentSite() {
    const hostname = window.location.hostname;
    let cleanURL = hostname.replace('www.', '');
    let parts = cleanURL.split('.');
    if (parts.length == 3) {
        return parts[1];
    } else {
        return parts[0];
    }
}

function setupSiteConfig() {
    const currentSite = getCurrentSite();

    // Перевіряємо, чи є конфігурація для поточного сайту
    if (currentSite in SITES_CONFIG) {
        return SITES_CONFIG[currentSite].betslip;
    } else {
        return false;
    }
}
setupBetslipTracking()