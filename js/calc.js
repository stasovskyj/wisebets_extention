let calc = document.createElement('div');

calc.innerHTML = CALC_CONTENT;

document.body.append(calc);

const calcContainer = document.getElementById('calc-container');
const calcForm = document.getElementById('calc-form');

const calcstakeAElement = document.getElementById('stakeA');
const calcstakeBElement = document.getElementById('stakeB');
const calcOddsAElement = document.getElementById('oddsA');
const calcOddsBElement = document.getElementById('oddsB');

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
// прорахунок закриття вилки
function AmountCalc(stakeA, oddsA, oddsB) {

    let data = Array();

    //stakeB
    data.push(stakeA * oddsA / oddsB);

    //Profit
    data.push((stakeA * oddsA) - (stakeA + data[0])).toFixed(2);

    // ROI
    data.push(((((stakeA * oddsA) - (data[0] + stakeA))) / (data[0] + stakeA)) * 100).toFixed(2);

    return data;

}
// Прорахунок недозакритої суми
function RemainAmountCalc(stakeA, oddsA, oddsB, factAmount) {

    let data = Array()

    let stakeAClosed = AmountCalc(factAmount, oddsB, oddsA)
    //сума недозакритої ставки
    data.push(stakeA - stakeAClosed[0])
    //маржа
    data.push(stakeAClosed[1])

    return data


}
// Прорахунок переставленої суми
function OverAmount(factAmount, stakeB) {
    return factAmount - stakeB
}
function MoveRemainAmount(mode) {

    if (mode == 1) {
        let a = $('input[name="remainAmount"]').val()
        $('input[name="stakeA"]').val(a)
        $('input[name="remainAmount"]').val('')
        $('input[name="factAmount"]').val('')
        $('input[name="profit"]').val('')
        $('input[name="stakeB"]').val('')
    }
    if (mode == 2) {
        let d = $('input[name="remainAmount"]').val()
        let c = $('input[name="oddsB"]').val()
        $('input[name="stakeA"]').val(d)
        $('input[name="oddsA"]').val(c)
        $('input[name="stakeB"]').val('')
        $('input[name="oddsB"]').val('')
        $('input[name="remainAmount"]').val('')
        $('input[name="factAmount"]').val('')
        $('input[name="profit"]').val('')
        $('input[name="oddsB"]').focus()

    }

}
// зберегти вилку
// function saveProfitOrLoss(a) {
//     if (isNaN(parseFloat(a)) || parseFloat(a) == 0) {
//         return false
//     } else {
//         $.ajax({
//             type: "POST",
//             url: 'http://localhost:8080/',
//             data: { 'data': a.toFixed(2) },

//         });

//     }

// }
$('#calc').on("keyup", function (e) {
    // Shift+Enter щоб перенести не закриту сумму
    if (e.shiftKey && e.which == 90) {

        let a = parseFloat($('input[name="stakeA"]').val())
        let b = parseFloat($('input[name="oddsA"]').val())
        let c = parseFloat($('input[name="oddsB"]').val())
        let fact = parseFloat($('input[name="factAmount"]').val())
        let stakeB = parseFloat($('input[name="stakeB"]').val())
        let profit = parseFloat($('input[name="profit"]').val())

        if (fact < stakeB) {
            MoveRemainAmount(1)

            let r = RemainAmountCalc(a, stakeB, b, c, fact)
            saveProfitOrLoss(r[1])
        } else {
            MoveRemainAmount(2)
            saveProfitOrLoss(profit)
        }
    }

    // SHIFT+ENTER: зберегти поставлену вилку
    if (e.shiftKey && e.which == 13) {

        let b = parseFloat($('input[name="profit"]').val())

        $('input[name="profit"]').val('')

        saveProfitOrLoss(b)

    }
});
$("form").on("keyup", (event) => {
    event.preventDefault();
    if (event.which > 47 && event.which < 58 || event.which > 95 && event.which < 106 || event.which == 8) {

        let a = parseFloat($('input[name="stakeA"]').val());
        let b = parseFloat($('input[name="oddsA"]').val());
        let c = parseFloat($('input[name="oddsB"]').val());
        let e = parseFloat($('input[name="factAmount"]').val());

        if (isNaN(a) || isNaN(b) || isNaN(c)) {
            return false;
        }

        let f = AmountCalc(a, b, c)

        $('input[name="stakeB"]').val(f[0].toFixed(2));
        $('input[name="profit"]').val(f[1].toFixed(2));

        if (isNaN(e) || isNaN(f[0])) {
            return false
        }

        if (e == f[0]) {

            let r = 0

            $('input[name="remainAmount"]').val(r);

        } else if (e < f[0]) {

            let r = RemainAmountCalc(a, b, c, e, f[0])
            $('input[name="remainAmount"]').val(r[0].toFixed(2));

        } else if (e > f[0]) {

            let r = OverAmount(e, f[0])
            $('input[name="remainAmount"]').val(r.toFixed(2));
        }

    }
});
