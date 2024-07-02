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
        return (!isNaN(v)) ? (Number.isInteger(v) ? parseInt(v) : parseFloat(v)) : false;
    }

    // Відслідковування змін в купоні та синхронізація даних купону та калькулятора
    setupBetslipTracking() {
        let previousOdds = null;
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

                                        let odds = document.querySelector(betslipConfig.oddsElement)?.innerText;
                                        let currency = this.InitInstanse.currentSiteData.currency;
                                        this.updateCalc(currency, odds);
                                        // console.log('спрацював childlist')
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
                            //console.log(stake)

                            break;
                        case 'characterData':
                            let c = document.createElement('div');
                            c.appendChild(mutation.target.parentNode)

                            if (c.querySelector(betslipConfig.oddsElement)) {

                                let odds = this.fixValue(mutation.target.data);

                                this.updateCalc(null, odds);
                            }
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