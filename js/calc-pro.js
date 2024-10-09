class Calculator extends Base {
    constructor() {
        super();
        this.stakeA = null;
        this.stakeACurrency = null;
        this.stakeB = null;
        this.stakeBCurrency = null;
        this.oddsA = null;
        this.oddsB = null;
        this.profit = null;
        this.incorrectStake = null;
        this.stakeOnRisk = null;
        this.stakeOnRiskCurrency = null;
        this.conversionRates = {
            'USD': {
                'EUR': 0.9,
                'UAH': 42
            },
            'EUR': {
                'USD': 1.1,
                'UAH': 45
            },
            'UAH': {
                'USD': 0.0238,
                'EUR': 0.0222
            }
        };
        this.eventEmitter.on("formUpdated", this.updateData.bind(this))
        this.eventEmitter.on("moveStakeOnRisk", this.moveStakeOnRisk.bind(this))
        this.eventEmitter.on("reset", this.moveStakeOnRisk.bind(this))
    }
    setStakeA(v) {
        this.stakeA = parseFloat(v) || null;
        this.eventEmitter.emit('calcUpdated', 'stakeA', v);
    }
    setStakeB(v) {
        this.stakeB = parseFloat(v) || null;
        this.eventEmitter.emit('calcUpdated', 'stakeB', v);
    }
    setStakeBCurrency(v) {
        this.stakeBCurrency = v;
        this.eventEmitter.emit('calcUpdated', 'stakeBCurrency', v);
    }
    setStakeOnRiskCurrency(v) {
        this.stakeOnRiskCurrency = v;
        this.eventEmitter.emit('calcUpdated', 'stakeOnRiskCurrency', v);
    }
    setStakeACurrency(v) {
        this.stakeACurrency = v;
        this.eventEmitter.emit('calcUpdated', 'stakeACurrency', v);
    }
    setOddsA(v) {
        this.oddsA = parseFloat(v) || null;
        this.eventEmitter.emit('calcUpdated', 'oddsA', v);
        this.checkCalculation()
    }
    setOddsB(v) {
        this.oddsB = parseFloat(v) || null;
        this.eventEmitter.emit('calcUpdated', 'oddsB', v);
        this.checkCalculation()
    }
    setProfit(v) {
        this.profit = parseFloat(v);
        this.eventEmitter.emit('calcUpdated', 'profit', v);
    }
    setIncorrectStake(v) {
        this.incorrectStake = parseFloat(v) || null;
        this.eventEmitter.emit('calcUpdated', 'incorrectStake', v);
    }
    setStakeOnRisk(v) {
        this.stakeOnRisk = parseFloat(v) || null;
        this.setStakeOnRiskCurrency(this.getStakeOnRiskCurrency());
        this.eventEmitter.emit('calcUpdated', 'stakeOnRisk', v);
    }
    stakeBCalc(stakeA, oddsA, oddsB) {
        return (stakeA * oddsA / oddsB).toFixed(2);
    }
    profitCalc(stakeA, oddsA, oddsB) {
        const stakeB = parseFloat(this.stakeBCalc(stakeA, oddsA, oddsB));
        return ((stakeA * oddsA) - (stakeA + stakeB)).toFixed(2);
    }

    // Розрахунок відкритої суми ставки
    stakeOnRiskCalc(stakeA, stakeB, oddsA, oddsB, incorrectStake) {
        let incorrectStakeInStakeACurrency = this.isSameCurrency() ? incorrectStake : this.currencyConvert(incorrectStake, this.stakeBCurrency, this.stakeACurrency)
        if (stakeB > incorrectStake) {
            let stakeAClosed = this.stakeBCalc(incorrectStakeInStakeACurrency, oddsB, oddsA);
            return (stakeA - stakeAClosed).toFixed(2)
        } else {
            return (incorrectStake - this.stakeB).toFixed(2);
        }
    }
    getStakeOnRiskCurrency() {
        return this.incorrectStake && this.stakeB > this.incorrectStake ? this.stakeACurrency : this.stakeBCurrency;
    }
    currencyConvert(amount, fromCurrency, toCurrency) {
        if (fromCurrency && toCurrency && fromCurrency !== toCurrency) {
            const conversionRate = this.conversionRates[fromCurrency][toCurrency];
            if (conversionRate) {
                return (amount * conversionRate).toFixed(2);
            }
        }
        return amount;
    }
    isSameCurrency() {
        return this.stakeACurrency == this.stakeBCurrency;
    }
    checkCalculation() {
        if (this.oddsA !== null && this.oddsB !== null && this.stakeA !== null) {

            let stakeB = this.stakeBCalc(this.stakeA, this.oddsA, this.oddsB);
            // конвертація якщо різні валюти
            if (this.stakeACurrency && this.stakeBCurrency && !this.isSameCurrency()) {
                stakeB = this.currencyConvert(stakeB, this.stakeACurrency, this.stakeBCurrency);
            }
            this.setStakeB(stakeB);
            this.setProfit(this.profitCalc(this.stakeA, this.oddsA, this.oddsB))

            if (this.incorrectStake !== null) {
                this.setStakeOnRisk(this.stakeOnRiskCalc(this.stakeA, this.stakeB, this.oddsA, this.oddsB, this.incorrectStake))
            } else {
                this.setStakeOnRisk(null);
            }
        } else {
            this.setProfit(null)
            this.setStakeB(null)
        }
    }
    //Оновлення властивостей обєкта з форми
    updateData(propertyName, value) {
        if (propertyName in this) {
            this[propertyName] = value;
            this.checkCalculation();
        }
    }
    moveStakeOnRisk() {
        if (this.incorrectStake < this.stakeB) {
            this.setStakeA(this.stakeOnRisk)
            this.setStakeB(null)
            this.setProfit(null);
            this.setIncorrectStake(null);
            this.setStakeOnRisk(null);
        } else {
            this.setStakeBCurrency(this.stakeACurrency);
            this.setStakeACurrency(this.stakeOnRiskCurrency);
            this.setStakeOnRiskCurrency(null);
            this.setStakeA(this.stakeOnRisk);
            this.setOddsA(this.oddsB);
            this.setProfit(null);
            this.setIncorrectStake(null);
            this.setStakeOnRisk(null);
            this.setStakeB(null)
            this.setOddsB(null);
        }
        this.checkCalculation();
    }
    reset() {
        for (let key of Object.keys(this)) {
            if (key === 'conversionRates') continue;
            this[key] = null;
        }
    }
}