class CalcHelper extends Base {
    constructor(InitInstanse) {
        super();
        this.state = 1;
        this.InitInstanse = InitInstanse;
        this.WSClient = new WebSocketClient();
        this.calc = new Calculator();
        this.setupBetslipTracking(this.InitInstanse);
    }
    // Оновлення даних в калькуляторі
    updateCalc(currency = null, odds, stake = null) {

        if (this.state == 1) {
            if (currency !== null) {
                this.calc.setStakeACurrency(currency);
            }
            if (odds !== null) {
                this.calc.setOddsA(odds);
            }
            if (stake !== null) {
                this.calc.setStakeA(stake);
            }
        } else if (this.state == 2) {
            this.calc.SetStakeBCurrency()
            this.calc.setOddsB(odds);
            this.updateSiteStakeBInput();
        }
    }
    // Автозаповнення поля суми ставки до закриття
    updateSiteStakeBInput(stakeElement) {
        let StakeBSiteInput = document.getElementById(stakeElement);
        StakeBSiteInput.value = this.calc.stakeB;
    }

    fixValue(v) {
        if (v) {
            v = v.replace(',', '.');
        }


        return (!isNaN(v)) ? (Number.isInteger(v) ? parseInt(v) : parseFloat(v)) : null;
    }

    // Відслідковування змін в купоні та синхронізація даних купону та калькулятора
    setupBetslipTracking() {
        const betslipConfig = this.InitInstanse.nodeElements.betslip
        const observer = new MutationObserver((mutationList) => {
            for (const mutation of mutationList) {
                const betSlipElement = document.querySelector(betslipConfig.betSlipElement);
                if (betSlipElement) {
                    //відображаємо калькулятор при відкритті купону
                    calcContainer.style.display = 'block';
                    switch (mutation.type) {
                        case 'childList':

                            for (const node of mutation.addedNodes) {
                                if (node.nodeType === Node.ELEMENT_NODE) {
                                    // Оновлення калькулятора під час відкриття купону

                                    if (node.querySelector(betslipConfig.betSlipElement)) {
                                        //console.log(node)
                                        let currency = this.InitInstanse.currentSiteData.currency;
                                        let odds = this.fixValue(betSlipElement.querySelector(betslipConfig.oddsElement)?.innerText);

                                        this.updateCalc(currency, odds);
                                        console.log('спрацював childlist')
                                    }
                                    // Перевірка чи прийнята ставка
                                    if (node.querySelector(betslipConfig.betAcceptedElement)) {
                                        if (this.state == 1) {
                                            this.WSClient.sendDataViaWebSocket(this.calc.oddsA, this.calc.stakeA, this.state);
                                            this.state = 2;
                                            observer.disconnect();
                                        } else if (this.state == 2) {
                                            sendCommandViaWebSocket(1)
                                            console.log('Ставка закрита')
                                            observer.disconnect();
                                        }
                                    }
                                }
                            }

                            break;
                        case 'attributes':

                            let stake = betSlipElement.querySelector(betslipConfig.amountInputElement)?.value;
                            this.updateCalc(null, null, stake);
                            console.log('спрацював attributes')
                            break;
                        case 'characterData':
                            // let c = document.createElement('div');
                            //c.appendChild(mutation.target.parentNode)

                            // if (c.querySelector(betslipConfig.oddsElement)) {
                            console.log(mutation)
                            let odds = this.fixValue(betSlipElement.querySelector(betslipConfig.oddsElement)?.innerText);

                            this.updateCalc(null, odds, betSlipElement.querySelector(betslipConfig.amountInputElement)?.value);
                            //}
                            break;
                    }


                } else {
                    calcContainer.style.display = 'none';
                }
            }
        });

        observer.observe(document.body, { attributes: true, attributeFilter: ["value"], characterData: true, childList: true, subtree: true });
    }


}