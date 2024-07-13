class CalcHelper extends Base {
    constructor(InitInstanse) {
        super();
        this.InitInstanse = InitInstanse;
        this.WSClient = new WebSocketClient();
        this.calcUI = new CalcUI();
        this.calc = new Calculator();
        this.observer = this.setupBetslipTracking(this.InitInstanse);
        this.WSClient.socket.onmessage = (e) => this.actionOnDataReceived(e);
        this.bindEvents();
        this.setState(1);

    }

    actionOnDataReceived(e) {
        try {
            const data = JSON.parse(e.data);
            console.log(data);
            switch (data.action) {
                case "updateCalc":
                    this.calc.setStakeBCurrency(this.calc.stakeACurrency);
                    this.updateCalc(data.currency, data.odds, data.stake);
                    this.setState(2);
                    break;
                case "switchState":
                    this.setState(data.state);
                    break;
                default:
                    console.log(`%c${this.getTranslation("unknown_data")}`, "background: red; color: white; display: block;", { data: e.data });
            }
        } catch (error) {
            console.error("Failed to parse JSON:", e.data, error);
        }
    }

    setState(state) {
        this.state = state;
        const stateCheckbox = document.getElementById('state');
        stateCheckbox.checked = this.state === 1 ? true : false;

    }

    updateCalc(currency = null, odds = null, stake = null) {
        if (this.state == 1) {
            currency && this.calc.setStakeACurrency(currency);
            odds && odds != this.calc.oddsA && this.calc.setOddsA(odds);
            stake && stake != this.calc.stakeA && this.calc.setStakeA(stake);
        } else if (this.state == 2) {
            currency && currency != this.calc.stakeBCurrency && this.calc.setStakeBCurrency(currency);
            odds && odds != this.calc.oddsB && this.calc.setOddsB(odds);
            this.updateSiteStakeBInput();
        }
    }

    // Автозаповнення суми ставки розрахованої калькулятором
    updateSiteStakeBInput() {
        const nodeElement = document.querySelector(this.InitInstanse.nodeElements.betslip.amountInputElement);
        if (!nodeElement) {
            return
        }
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        nativeInputValueSetter?.call(nodeElement, this.calc.stakeB);
        const ev2 = new Event('change', { bubbles: true });
        nodeElement.dispatchEvent(ev2);
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

        this.observer = new MutationObserver((mutationList) => {
            for (const mutation of mutationList) {
                const betSlipElement = document.querySelector(betslipConfig.betSlipElement);
                if (betSlipElement) {
                    this.calcUI.setCalcVisibility(true);

                    switch (mutation.type) {
                        case 'childList':
                            for (const node of mutation.addedNodes) {
                                if (node.nodeType === Node.ELEMENT_NODE) {

                                    // Дії коли ставка прийнята
                                    if (node.querySelector(betslipConfig.betAcceptedElement)) {
                                        if (this.state === 1) {
                                            this.WSClient.sendDataViaWebSocket(this.calc.oddsA, this.calc.stakeA, this.calc.stakeACurrency);
                                            this.setState(2);
                                            this.stopObserver();
                                        } else if (this.state === 2) {
                                            this.WSClient.sendCommandViaWebSocket(1);
                                            this.stopObserver();
                                            this.setState(1);
                                            this.calc.setStakeACurrency(this.InitInstanse.currentSiteData?.currency);
                                            console.log('Ставка закрита');
                                        }
                                    }
                                    // Відкриття купону
                                    if (node.querySelector(betslipConfig.betSlipElement)) {
                                        const currency = this.InitInstanse.currentSiteData?.currency;
                                        const odds = this.fixValue(betSlipElement.querySelector(betslipConfig.oddsElement)?.innerText);
                                        this.updateCalc(currency, odds);
                                    }
                                }
                            }
                            break;

                        case 'attributes':
                            if (this.state == 1) {
                                const stake = betSlipElement.querySelector(betslipConfig.amountInputElement)?.value;
                                this.updateCalc(null, null, stake);
                            }
                            break;

                        case 'characterData':
                            const odds = this.fixValue(betSlipElement.querySelector(betslipConfig.oddsElement)?.innerText);

                            this.updateCalc(null, odds, betSlipElement.querySelector(betslipConfig.amountInputElement)?.value);
                            break;
                    }
                } else {
                    this.calcUI.setCalcVisibility(false);
                }
            }
        });
        this.startObserver();
        return this.observer;
    }

    bindEvents() {
        const observe = document.getElementById('observe');
        //const ws = document.getElementById('ws');
        const state = document.getElementById('state');
        const incorrectStake = document.getElementById('incorrectStake');

        observe.addEventListener('change', () => observe.checked ? this.startObserver() : this.stopObserver());
        //ws.addEventListener('change', () => ws.checked ? this.enableWebSocket() : this.disableWebSocket());
        state.addEventListener('change', () => this.setState(state.checked ? 1 : 2));
        incorrectStake.addEventListener('input', () => this.stopObserver());
    }

    startObserver() {
        if (!this.observer) {
            this.setupBetslipTracking();
        }
        this.observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["value"],
            characterData: true,
            childList: true,
            subtree: true
        });
        const observeCheckbox = document.getElementById('observe');
        observeCheckbox.checked = true;
    }

    stopObserver() {
        this.observer && this.observer.disconnect();
        const observeCheckbox = document.getElementById('observe');
        observeCheckbox.checked = false;
    }
}