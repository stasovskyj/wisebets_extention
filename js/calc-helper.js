let mode = 1;
function setupBetslipTracking() {
    const betslipConfig = setupSiteConfig();

    const observer = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
            const betSlipElement = document.querySelector(betslipConfig.rootElement);

            if ((mutation.type === 'attributes' || mutation.type === 'childList') && betSlipElement) {
                const odds = betSlipElement.querySelector(betslipConfig.oddsElement)?.innerText;
                const stake = betSlipElement.querySelector(betslipConfig.amountInputElement)?.value;
                //console.log (mutation)
                if (stake || fixOdds(odds)) {
                    
                    updateCalcContent(stake, odds, mode);

                  //  let confirmBetButton = document.querySelector(betslipConfig.placeBetElement);
                    if (mode == 1) {
                   //     confirmBetButton.addEventListener("click", () => {
                            
                           // перевірка чи прийнята ставка
                          
                                        console.log('Ставку прийнято')
                                        console.log (mutation)
                                        sendDataViaWebSocket(odds, stake, mode);
                                        
                                        mode = 2;
                        
                           
                            //confirmBetButton.removeEventListener("click", () => {});

                            //sendDataViaWebSocket(odds, stake, mode);
                           // mode = 2;
                           //sendCommandViaWebSocket(2)
                           // confirmBetButton.removeEventListener("click", () => {});
                            
                       // });
                    } else if (mode == 2) {
                       //betSlipElement.querySelector(betslipConfig.amountInputElement).value = updateSiteAmountBInput();
                       
                    //  sendCommandViaWebSocket(1)
                    //  mode = 1
                     // calcForm.reset()
                      // confirmBetButton.removeEventListener("click", () => {});
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
    const oddsAInput = document.getElementById('oddsA');
    const oddsBInput = document.getElementById('oddsB');
    const stakeAInput = document.getElementById('stakeA');

    if (mode == 1) {
        oddsAInput.value = odds.replace(',', '.');
        stakeAInput.value = stake.replace(',', '.');
    } else if (mode == 2) {
        oddsBInput.value = odds.replace(',', '.');
    }


}
function updateSiteAmountBInput() {
    let stakeBInput = document.getElementById('stakeB');
    return stakeBInput.value;
}

// Отримуємо назву для поточного сайту
function getCurrentSite() {
    const hostname = window.location.hostname;
    for (const site in SITES_CONFIG) {
        if (hostname.indexOf(site) !== -1) {
            return site;
        }
    }
    return null;
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
function fixOdds(v) {
    
    return (!isNaN(v)) ? (Number.isInteger(v) ? parseInt(v) : parseFloat(v)) : false;
}
setupBetslipTracking()