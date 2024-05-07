function setupBetslipTracking() {
    const betslipConfig = setupSiteConfig();
  
// Створюємо MutationObserver для спостереження за змінами контенту betslip
const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      const betSlipElement = document.querySelector(betslipConfig.rootElement);
  
      if ((mutation.type === 'attributes' || mutation.type === 'childList') && betSlipElement) {
        const odds = betSlipElement.querySelector(betslipConfig.oddsElement)?.innerText;
        const stake = betSlipElement.querySelector(betslipConfig.amountInputElement)?.value;
        if (stake || odds) {
            updateCalcContent(stake, odds, betslipConfig);
        }
      }
    }
  });
  
  observer.observe(document.body, { attributes: true, childList: true, subtree: true });
}

// Функція для обробки контенту betslip
// mode 1 = відкриття, mode 2 = закриття
function updateCalcContent(stake = '', odds = '', betslipConfig, mode = 2) {
    const oddsAInput = document.getElementById('coefficientA');
    const oddsBInput = document.getElementById('coefficientB');
    const amountAInput = document.getElementById('amountA');
    const amountBInput = document.getElementById('amountB');

    if(mode == 1){
        oddsAInput.value = odds;
        amountAInput.value = stake;
    }else if (mode == 2){
        oddsBInput.value = odds;
    }


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
