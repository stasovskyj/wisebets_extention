class Calculator {
    constructor() {
        this.stakeA;
        this.stakeB;
        this.oddsA;
        this.oddsB;
        this.profit;
        this.incorrectStake;
        this.stakeOnRisk;
    }

    setStakeA(v) {
        this.stakeA = v;
        this.updateForm();
    }

    setStakeB(v) {
        this.stakeB = v;
        this.updateForm();
    }
    setOddsA(v) {
        this.oddsA = v;
        this.updateForm();
    }
    setOddsB(v) {
        this.oddsB = v;
        this.updateForm();
    }
    
    stakeBCalc(stakeA, oddsA, oddsB) {

        return (stakeA * oddsA / oddsB);
    }

    profitCalc(stakeA, oddsA, oddsB){

        return (stakeA * oddsA) - (stakeA + stakeBCalc(stakeA, oddsA, oddsB)).toFixed(2);
    }
    // Розрахунок недозакритої суми ставка А
    StakeOnRiskCalc(stakeA, oddsA, oddsB, incorrectStake) {

        let stakeAClosed = stakeBCalc(incorrectStake, oddsB, oddsA)
        //сума недозакритої ставки
        data.push(stakeA - stakeAClosed[0])
        //маржа
        data.push(stakeAClosed[1])
    
        return data
    
    
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
}