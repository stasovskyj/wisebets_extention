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
        this.conversionRates = {
            'USD': {
                'EUR': 0.92
            },
            'EUR': {
                'USD': 1.09
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
        if (stakeB > incorrectStake) {
            let stakeAClosed = this.stakeBCalc(incorrectStake, oddsB, oddsA);
            return ((stakeA - stakeAClosed)).toFixed(2)
        } else {
            return (this.incorrectStake - this.stakeB).toFixed(2);
        }
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
    checkCalculation() {
        if (this.oddsA !== null && this.oddsB !== null && this.stakeA !== null) {

            let stakeB = this.stakeBCalc(this.stakeA, this.oddsA, this.oddsB);
            // конвертація якщо різні валюти
            if (this.stakeACurrency && this.stakeBCurrency && this.stakeACurrency !== this.stakeBCurrency) {
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
            this.stakeA = this.stakeOnRisk
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
        this.stakeA = null;
        this.setStakeACurrency(null);
        this.stakeB = null;
        this.setStakeBCurrency(null);
        this.oddsA = null;
        this.oddsB = null;
        this.incorrectStake = null;
        this.stakeOnRisk = null;
        this.profit = null;
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
            if (id in this) {
                this[id] = numericValue;
                this.checkCalculation();
            }
        });
        // Дії для кнопок управління
        moveStakeOnRiskButton.addEventListener('click', () => {
            this.moveStakeOnRisk();
        });

        resetButton.addEventListener('click', () => {
            this.reset();
        });
    }
    showCurrency() {
        const stakeACurrencyElement = document.getElementById('stakeA-label');
        const stakeBCurrencyElement = document.getElementById('stakeB-label');
        stakeACurrencyElement.innerHTML = "Сума A: <b>" + (this.stakeACurrency ?? "") + "</b>";
        stakeBCurrencyElement.innerHTML = "Сума B: <b>" + (this.stakeBCurrency ?? "") + "</b>";

    }
}