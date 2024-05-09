<<<<<<< HEAD
<<<<<<< HEAD
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
            
            if (betSlipElement) {
                
                switch(mutation.type) {
                    case 'childList':
                      //  console.log('================================')
                    console.log(mutation);
                   
                        for (const node of mutation.addedNodes) {
                            //console.log(node)
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // Якщо доданий елемент є елементом з атрибутом data-cy="stake-input"
                                console.log(node)
                                if (node.matches(betslipConfig.betSlipDataElement)) {
                                    // Викликаємо вашу функцію або виконуємо потрібні дії
                                    a.setOddsA(fixValue(betSlipElement.querySelector(betslipConfig.oddsElement)?.innerText))
            
                                }
                            }
                        }
                        // Перевірка чи прийнята ставка
                        if(betSlipElement.querySelector(betslipConfig.betAcceptedElement)){
                            if(mode == 1){
                             sendDataViaWebSocket(a.oddsA, a.stakeA, mode);
                             mode = 2;
                             
                             observer.disconnect();
                            }else if(mode == 2){
                             sendCommandViaWebSocket(1)
                             console.log('Ставка закрита')
                             //console.log(mutationList);
                             observer.disconnect();
                            }
                        // Отримання коефіцієнту під час відкриття купону
                        
                       
                        
                       }
                    break;
                   case 'attributes':

                    break;
                    case 'characterData':

                    break;
                }
                if(betSlipElement.querySelector(betslipConfig.betAcceptedElement)){
                    if(mode == 1){
                     sendDataViaWebSocket(a.oddsA, a.stakeA, mode);
                     mode = 2;
                    // console.log('Ставка відкрита')
                    // observer.disconnect();
                    }else if(mode == 2){
                     sendCommandViaWebSocket(1)
                     console.log('Ставка закрита')
                    //console.log(mutationList);
                    // observer.disconnect();
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
       // updateSiteStakeInput();
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
=======
=======
let mode = 1;
>>>>>>> 04d41e1 (Прикрутив Websocket)
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
>>>>>>> 43f80e6 (Зібрав селектори з основних сайтів)
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
function fixValue(v) {
    return (!isNaN(v)) ? (Number.isInteger(v) ? parseInt(v) : parseFloat(v)) : false;
}
setupBetslipTracking()
let a = new Calculator();
=======
setupBetslipTracking()
>>>>>>> 43f80e6 (Зібрав селектори з основних сайтів)
=======
setupBetslipTracking()
>>>>>>> bf011ae (Відслідковуються зміни в купоні)
=======
setupBetslipTracking()
>>>>>>> 04d41e1 (Прикрутив Websocket)
