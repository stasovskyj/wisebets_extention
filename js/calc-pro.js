class Calculator {
    constructor() {
        this.stakeA = null;
        this.stakeB = null;
        this.oddsA = null;
        this.oddsB = null;
        this.profit = null;
        this.incorrectStake = null;
        this.stakeOnRisk = null;
        this.bindEvents();
    }
    setStakeA(v) {
        this.stakeA = v;
        this.updateForm();
        this.checkCalculation()
    }
    setStakeB(v) {
        this.stakeB = v;
        this.updateForm();
    }
    setOddsA(v) {
        this.oddsA = v;
        this.updateForm();
        this.checkCalculation()
    }
    setOddsB(v) {
        this.oddsB = v;
        this.updateForm();
        this.checkCalculation()
    }
    setProfit(v) {
        this.profit = v;
        this.updateForm();
    }
    setIncorrectStake(v) {
        this.incorrectStake = v;
    }
    setStakeOnRisk(v) {
        this.stakeOnRisk = v;
        this.updateForm();
    }
    stakeBCalc(stakeA, oddsA, oddsB) {
        return (stakeA * oddsA / oddsB).toFixed(2);
    }

    profitCalc(stakeA, oddsA, oddsB) {
        const stakeB = parseFloat(this.stakeBCalc(stakeA, oddsA, oddsB));
        return ((stakeA * oddsA) - (stakeA + stakeB)).toFixed(2);
    }

    // Розрахунок недозакритої суми ставка А
    stakeOnRiskCalc(stakeA, stakeB, oddsA, oddsB, incorrectStake) {
        if (stakeB > incorrectStake) {
            let stakeAClosed = this.stakeBCalc(incorrectStake, oddsB, oddsA);
            return ((stakeA - stakeAClosed)).toFixed(2)
        } else {
            return (this.incorrectStake - this.stakeB).toFixed(2);
        }
    }

    // Якщо є мінімальна кількість даних викликати методи розрахунків
    checkCalculation() {
        if (this.oddsA !== null && this.oddsB !== null && this.stakeA !== null) {

            this.setStakeB(this.stakeBCalc(this.stakeA, this.oddsA, this.oddsB))

            this.setProfit(this.profitCalc(this.stakeA, this.oddsA, this.oddsB))

            if (this.incorrectStake !== null) {
                this.setStakeOnRisk(this.stakeOnRiskCalc(this.stakeA, this.stakeB, this.oddsA, this.oddsB, this.incorrectStake))
            } else {
                this.setStakeOnRisk(null);
            }
        }
    }

    moveStakeOnRisk(m) {
        if (m == 1) {
            this.setStakeA(this.stakeOnRisk)
            this.setStakeB(null)
            this.setOddsB(null)
            this.setOddsA(null);
            this.setProfit(null);
            this.setIncorrectStake(null);
            this.setStakeOnRisk(null);
        }else{
            this.setStakeA(this.stakeOnRisk)
            this.setOddsA(this.oddsA);
            this.setStakeB(null)
            this.setOddsB(null)
            this.setProfit(null);
            this.setIncorrectStake(null);
            this.setStakeOnRisk(null);
        }
    }
    
    reset() {
        this.stakeA = null;
        this.stakeB = null;
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
        // Оновлення значень полів відповідно до властивостей калькулятора
        formFields.forEach(field => {
            if (this.hasOwnProperty(field.id)) {
                field.value = this[field.id];
            }
        });
    }

    // Відслідковування вводу даних в форму
    bindEvents() {
        const form = document.getElementById('calc-form');
        form.addEventListener('input', (e) => {
            const { id, value } = e.target;
            if (id in this) {
                this[id] = parseFloat(value) || null;
                this.checkCalculation();
            }
        });
    }
}