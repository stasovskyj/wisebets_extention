let mode = 1;
function setupBetslipTracking() {
    const betslipConfig = setupSiteConfig();

    const observer = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
            const betSlipElement = document.querySelector(betslipConfig.rootElement);

            if ((mutation.type === 'attributes' || mutation.type === 'childList') && betSlipElement) {
                const odds = betSlipElement.querySelector(betslipConfig.oddsElement)?.innerText;
                const stake = betSlipElement.querySelector(betslipConfig.amountInputElement)?.value;

                if (stake || odds) {
                    updateCalcContent(stake, odds, mode);

                    let confirmBetButton = document.querySelector(betslipConfig.betSlipElement);
                    //let confirmBetButton = document.querySelector(betslipConfig.placeBetElement);
                    if (mode == 1) {
                        confirmBetButton.addEventListener('dblclick', () => {
                            sendDataViaWebSocket(odds, stake, mode);
                            mode = 2;
                            //sendCommandViaWebSocket(2)
                            console.log("Імітація ставки")
                        });
                    } else {
                        sendCommandViaWebSocket(1)
                    }

                }

            }
        }
    });

    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
}

// Функція для обробки контенту betslip
// mode 1 = відкриття, mode 2 = закриття
function updateCalcContent(stake = '', odds = '', mode = 1) {
    const oddsAInput = document.getElementById('coefficientA');
    const oddsBInput = document.getElementById('coefficientB');
    const amountAInput = document.getElementById('amountA');

    if (mode == 1) {
        oddsAInput.value = odds.replace(',', '.');
        amountAInput.value = stake.replace(',', '.');
    } else if (mode == 2) {
        oddsBInput.value = odds.replace(',', '.');
    }


}
function updateSiteAmountBInput() {

}

// Отримуємо назву для поточного сайту
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