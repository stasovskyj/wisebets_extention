class CalcHelper extends Base {
    constructor(InitInstanse) {
        super();
        this.state = 1;
        this.InitInstanse = InitInstanse;
        this.WSClient = new WebSocketClient();
        this.calc = new Calculator();
        this.setupBetslipTracking(this.InitInstanse);
        this.WSClient.socket.onmessage = (e) => this.actionOnDataReceived(e);
    }

    actionOnDataReceived(e) {
        try {
            const data = JSON.parse(e.data);
            console.log(data)
            switch (data.action) {
                case "updateCalc":
                    this.calc.setStakeBCurrency(this.calc.stakeACurrency);
                    this.updateCalc(data.currency, data.odds, data.stake);
                    this.state = 2;
                    break;
                case "switchState":
                    this.state = data.state;
                    break;
                default:
                    console.log(`%c${this.getTranslation("unknown_data")}`, "background: red; color: white; display: block;", { data: e.data });
            }
        } catch (error) {
            console.error("Failed to parse JSON:", e.data, error);
        }
    }
    updateCalc(currency = null, odds = null, stake = null) {
        if (this.state == 1) {
            currency && this.calc.setStakeACurrency(currency);
            odds && odds != this.calc.oddsA && this.calc.setOddsA(odds);
            stake && stake != this.calc.stakeA && this.calc.setStakeA(stake);
        } else if (this.state == 2) {
            currency && currency != this.calc.stakeBCurrency && this.calc.setStakeBCurrency(currency);
            odds && odds != this.calc.oddsB && this.calc.setOddsB(odds);
            stake && this.updateSiteStakeBInput(this.InitInstanse.nodeElements.betslip.amountInputElement);
        }
    }
    // Автозаповнення суми ставки розрахованої калькулятором
    updateSiteStakeBInput(stakeElement) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        nativeInputValueSetter?.call(stakeElement, this.calc.stakeB);

        const ev2 = new Event('change', { bubbles: true });
        el.dispatchEvent(ev2);
    }

    fixValue(v) {
        if (v) {
            v = v.replace(',', '.');
        }

        return (!isNaN(v)) ? (Number.isInteger(v) ? parseInt(v) : parseFloat(v)) : null;
    }

    setupBetslipTracking() {
        const betslipConfig = this.InitInstanse.nodeElements.betslip;

        if (!betslipConfig) {
            return;
        }

        const observer = new MutationObserver((mutationList) => {
            for (const mutation of mutationList) {
                const betSlipElement = document.querySelector(betslipConfig.betSlipElement);
                if (betSlipElement) {
                    calcContainer.style.display = 'block';

                    switch (mutation.type) {
                        case 'childList':
                            for (const node of mutation.addedNodes) {
                                if (node.nodeType === Node.ELEMENT_NODE) {
                                    // Відкриття купону
                                    if (node.querySelector(betslipConfig.betSlipElement)) {
                                        const currency = this.InitInstanse.currentSiteData.currency;
                                        const odds = this.fixValue(betSlipElement.querySelector(betslipConfig.oddsElement)?.innerText);
                                        this.updateCalc(currency, odds);
                                    }
                                    // Дії коли ставка прийнята
                                    if (node.querySelector(betslipConfig.betAcceptedElement)) {
                                        if (this.state === 1) {
                                            this.WSClient.sendDataViaWebSocket(this.calc.oddsA, this.calc.stakeA, this.calc.stakeACurrency);
                                            this.state = 2;
                                            observer.disconnect();
                                        } else if (this.state === 2) {
                                            this.WSClient.sendCommandViaWebSocket(1);
                                            this.state = 1;
                                            this.calc.setStakeACurrency(this.InitInstanse.currentSiteData.currency);
                                            console.log('Ставка закрита');
                                        }
                                    }
                                }
                            }
                            break;

                        case 'attributes':
                            const stake = betSlipElement.querySelector(betslipConfig.amountInputElement)?.value;
                            this.updateCalc(null, null, stake);
                            break;

                        case 'characterData':
                            const odds = this.fixValue(betSlipElement.querySelector(betslipConfig.oddsElement)?.innerText);
                            this.updateCalc(null, odds, betSlipElement.querySelector(betslipConfig.amountInputElement)?.value);
                            break;
                    }
                } else {
                    calcContainer.style.display = 'none';
                }
            }
        });

        //this.startObserve(betSlipElement);
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["value"],
            characterData: true,
            childList: true,
            subtree: true
        });
    }

    startObserve(betSlipElement) {
        targetElement = betSlipElement ?? document.body;
        observer.observe(targetElement, {
            attributes: true,
            attributeFilter: ["value"],
            characterData: true,
            childList: true,
            subtree: true
        });
    }
}