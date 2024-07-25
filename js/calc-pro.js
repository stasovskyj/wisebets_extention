class Calculator {
    constructor() {
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
                'EUR': 0.92,
                'UAH': 42
            },
            'EUR': {
                'USD': 1.08,
                'UAH': 45
            },
            'UAH': {
                'USD': 0.0238,
                'EUR': 0.0222
            }

        };
        this.bindEvents();
    }
    setStakeA(v) {
        this.stakeA = parseFloat(v) || null;
        this.updateForm();
    }
    setStakeB(v) {
        this.stakeB = parseFloat(v) || null;
    }
    setStakeBCurrency(v) {
        this.stakeBCurrency = v;
        this.showCurrency();
    }
    setStakeOnRiskCurrency(v) {
        this.stakeOnRiskCurrency = v;
        this.showCurrency();
    }
    setStakeACurrency(v) {
        this.stakeACurrency = v;
        this.showCurrency();
    }
    setOddsA(v) {
        this.oddsA = parseFloat(v) || null;
        this.updateForm();
        this.checkCalculation()
    }
    setOddsB(v) {
        this.oddsB = parseFloat(v) || null;
        this.updateForm();
        this.checkCalculation()
    }
    setProfit(v) {
        this.profit = parseFloat(v);
        this.updateForm();
    }
    setIncorrectStake(v) {
        this.incorrectStake = parseFloat(v) || null;
        this.updateForm();
    }
    setStakeOnRisk(v) {
        this.stakeOnRisk = parseFloat(v) || null;
        this.setStakeOnRiskCurrency(this.getStakeOnRiskCurrency());
        this.updateForm();
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
            this.profit = null
            this.stakeB = null
        }
    }
    moveStakeOnRisk() {
        if (this.incorrectStake < this.stakeB) {
            this.setStakeA(this.stakeOnRisk)
            this.stakeB = null
            this.profit = null;
            this.incorrectStake = null;
            this.stakeOnRisk = null;
            this.checkCalculation()
        } else {
            this.setStakeBCurrency(this.stakeACurrency);
            this.setStakeACurrency(this.stakeOnRiskCurrency);
            this.setStakeOnRiskCurrency(null);
            this.stakeA = this.stakeOnRisk;
            this.oddsA = this.oddsB;
            this.profit = null;
            this.incorrectStake = null;
            this.stakeOnRisk = null;
            this.stakeB = null;
            this.oddsB = null;
            this.updateForm();
            this.checkCalculation()
        }

    }
    reset() {
        for (let key of Object.keys(this)) {
            if (key === 'conversionRates') continue;
            this[key] = null;
            this.showCurrency()
        }
        this.updateForm();
    }
    // Оновлення веб-форми на основі властивостей калькулятора
    updateForm() {
        const form = document.getElementById('calc-form');
        const formFields = form.querySelectorAll('input');
        formFields.forEach(field => {
            if (this.hasOwnProperty(field.id)) {
                field.value = this[field.id];
            }
        });
    }

    bindEvents() {
        const moveStakeOnRiskButton = document.getElementById('move-stake-on-risk');
        const resetButton = document.getElementById('reset-calc');
        const form = document.getElementById('calc-form');
        // Відслідковування вводу даних в форму
        form.addEventListener('input', (e) => {
            const { id, value } = e.target;
            const numericValue = parseFloat(value) || null;
            const regex = /^(?:\d+\.(?:0)?)$/
            if (!regex.test(value)) {
                if (id in this) {

                    this[id] = numericValue;
                    this.checkCalculation();
                }
            }
        });
        
        // Дії для кнопок управління
        moveStakeOnRiskButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.moveStakeOnRisk();
        });
        resetButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.reset();
        });
    }
    showCurrency() {
        const stakeACurrencyElement = document.getElementById('stake-a-currency');
        const stakeBCurrencyElement = document.getElementById('stake-b-currency');
        const stakeOnRiskCurrencyElement = document.getElementById('stake-on-risk-currency');
        stakeACurrencyElement.innerText = this.stakeACurrency ?? "";
        stakeBCurrencyElement.innerText = this.stakeBCurrency ?? "";
        stakeOnRiskCurrencyElement.innerText = this.stakeOnRiskCurrency ?? "";
    }
}