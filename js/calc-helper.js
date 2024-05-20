let mode = 1;
let calc = document.createElement('div');

calc.innerHTML = CALC_CONTENT;

document.body.append(calc);

const calcContainer = document.getElementById('calc-container');
const calcForm = document.getElementById('calc-form');

// Відключення перетягування, коли клікнуто на поле вводу
calcContainer.addEventListener('mousedown', (event) => {
    if (event.target.tagName === 'INPUT') {
        isDragging = false;
    }
});

// Увімкнення перетягування, коли клікнуто поза полями вводу
calcContainer.addEventListener('mouseup', () => {
    isDragging = true;
});

let isDragging = true;
let offsetX, offsetY;

calcContainer.addEventListener('mousedown', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    offsetX = e.clientX - calcContainer.getBoundingClientRect().left;
    offsetY = e.clientY - calcContainer.getBoundingClientRect().top;
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', cleanup);
});

function moveHandler(e) {
    calcContainer.style.left = e.clientX - offsetX + 'px';
    calcContainer.style.top = e.clientY - offsetY + 'px';
}

function cleanup() {
    window.removeEventListener('mousemove', moveHandler);
    window.removeEventListener('mouseup', cleanup);
}
function setupBetslipTracking() {
    const betslipConfig = setupSiteConfig();

    const observer = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {

            const betSlipElement = document.querySelector(betslipConfig.rootElement);

            if ((mutation.type === 'attributes' || mutation.type === 'childList') && betSlipElement) {
                const odds = betSlipElement.querySelector(betslipConfig.oddsElement)?.innerText;
                const stake = betSlipElement.querySelector(betslipConfig.amountInputElement)?.value;
                // Перевірка чи прийнята ставка.
                if(betSlipElement.querySelector(betslipConfig.betAcceptedElement)){
                   if(mode == 1){
                    sendDataViaWebSocket(odds, stake, mode);
                    mode = 2;
                    console.log('Ставка відкрита')
                   }else{
                    sendCommandViaWebSocket(1)
                    console.log('Ставка закрита')
                   } 

                }
                if (stake || fixOdds(odds)) {
                 
                    if (mode == 1) {
                   //     confirmBetButton.addEventListener("click", () => {
                            
                   updateCalc(stake, odds, mode);
                            //confirmBetButton.removeEventListener("click", () => {});

                            //sendDataViaWebSocket(odds, stake, mode);
                           // mode = 2;
                           //sendCommandViaWebSocket(2)
                           // confirmBetButton.removeEventListener("click", () => {});
                            
                       // });
                    } else {
                       //betSlipElement.querySelector(betslipConfig.amountInputElement).value = updateSiteAmountBInput();
                       updateCalc(stake, odds, mode);
                    //  sendCommandViaWebSocket(1)
                    //  mode = 1
                     // calcForm.reset()
                      // confirmBetButton.removeEventListener("click", () => {});
                    }


                }
                // else if ((mutation.type === 'attributes' || mutation.type === 'characterData') && betSlipElement.querySelector(betslipConfig.oddsElement)) {
                //     const odds = fixValue(betSlipElement.querySelector(betslipConfig.oddsElement)?.innerText);
                //     const stake = fixValue(betSlipElement.querySelector(betslipConfig.amountInputElement)?.value);
                //     console.log(mutation.target);
                //         console.log(a);
                //     if (stake && odds) {

                //         if (mode == 1) {
                //     //     confirmBetButton.addEventListener("click", () => {
                //               //  a.setStakeA = stake !== '' ? this.stakeA : '';stake
                //     updateCalc(stake, odds, mode);
                //                 //confirmBetButton.removeEventListener("click", () => {});

                //                 //sendDataViaWebSocket(odds, stake, mode);
                //             // mode = 2;
                //             //sendCommandViaWebSocket(2)
                //             // confirmBetButton.removeEventListener("click", () => {});

                //         // });
                //         } else if(mode == 2) {
                //         //betSlipElement.querySelector(betslipConfig.amountInputElement).value = updateSiteAmountBInput();
                //         updateCalc(stake, odds, mode);
                //         //  sendCommandViaWebSocket(1)
                //         //  mode = 1
                //         // calcForm.reset()
                //         // confirmBetButton.removeEventListener("click", () => {});
                //         }

                //     }
                // }
            }
        }
    });

    observer.observe(document.body, { attributes: true, characterData: true, childList: true, subtree: true });
}

// Функція для оновлення калькулятора
// mode 1 = відкриття, mode 2 = закриття
function updateCalc(stake = '', odds = '', mode = 1) {

    if (mode == 1) {
        a.setOddsA(odds);
        a.setStakeA(stake);
    } else if (mode == 2) {
        a.setOddsB(odds);
    }


}
function updateSiteStakeInput() {
    let stakeBInput = document.getElementById('stakeB');
    stakeBInput.value = a.setOddsB(odds);
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
let a = new Calculator();