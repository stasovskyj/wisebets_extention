// прорахунок закриття вилки
function AmountCalc(amountA, coefficientA, coefficientB) {

    let data = Array();

    //AmountB
    data.push(amountA * coefficientA / coefficientB);

    //Profit
    data.push((amountA * coefficientA) - (amountA + data[0])).toFixed(2);

    // ROI
    data.push(((((amountA * coefficientA) - (data[0] + amountA))) / (data[0] + amountA)) * 100).toFixed(2);

    return data;

}
// Прорахунок недозакритої суми
function RemainAmountCalc(amountA, amountB, coefficientA, coefficientB, factAmount) {

    let data = Array()

    let amountAClosed = AmountCalc(factAmount, coefficientB, coefficientA)

    data.push(amountA - amountAClosed[0])

    data.push(amountAClosed[1])

    return data


}
// Прорахунок переставленої суми
function OverAmount(factAmount, amountB) {
    return factAmount - amountB
}
function MoveRemainAmount(mode) {

    if (mode == 1) {
        let a = $('input[name="remainAmount"]').val()
        $('input[name="amountA"]').val(a)
        $('input[name="remainAmount"]').val('')
        $('input[name="factAmount"]').val('')
        $('input[name="profit"]').val('')
    }
    if (mode == 2) {
        let d = $('input[name="remainAmount"]').val()
        let c = $('input[name="coefficientB"]').val()
        $('input[name="amountA"]').val(d)
        $('input[name="coefficientA"]').val(c)
        $('input[name="coefficientB"]').val('')
        $('input[name="remainAmount"]').val('')
        $('input[name="factAmount"]').val('')
        $('input[name="profit"]').val('')
        $('input[name="coefficientB"]').focus()

    }

}
// зберегти вилку
function saveProfitOrLoss(a) {
    if (isNaN(parseFloat(a))) {
        return false
    } else {
        alert(a + ' saved')
    }

}
$(document).on("keypress", function (e) {

    // Ctrl+Enter щоб перенести не закриту сумму
    if (e.ctrlKey && e.key == 'Enter') {

        let a = parseFloat($('input[name="amountA"]').val())
        let b = parseFloat($('input[name="coefficientA"]').val());
        let c = parseFloat($('input[name="coefficientB"]').val());
        let fact = parseFloat($('input[name="factAmount"]').val())
        let amountB = parseFloat($('input[name="amountB"]').val())
        let profit = parseFloat($('input[name="profit"]').val())

        if (fact < amountB) {
            MoveRemainAmount(1)

            let r = RemainAmountCalc(a, amountB, b, c, fact)
            saveProfitOrLoss(r[1])
        } else {
            MoveRemainAmount(2)
            saveProfitOrLoss(profit)
        }
    }

    // shift+Enter: зберегти поставлену вилку
    if (e.shiftKey && e.key == 'Enter') {

        let b = parseFloat($('input[name="profit"]').val())

        $('input[name="profit"]').val('')

        saveProfitOrLoss(b)

    }
});
$("form").on("keyup", function (event) {
    event.preventDefault();
    if (event.which > 47 && event.which < 58 || event.which > 95 && event.which < 106 || event.which == 8) {

        let a = parseFloat($('input[name="amountA"]').val());
        let b = parseFloat($('input[name="coefficientA"]').val());
        let c = parseFloat($('input[name="coefficientB"]').val());
        let e = parseFloat($('input[name="factAmount"]').val());

        if (isNaN(a) || isNaN(b) || isNaN(c)) {
            return false;
        }

        let f = AmountCalc(a, b, c)

        $('input[name="amountB"]').val(f[0].toFixed(2));
        $('input[name="profit"]').val(f[1].toFixed(2));

        if (isNaN(e) || isNaN(f[0])) {
            return false
        }

        if (e == f[0]) {

            let r = 0

            $('input[name="remainAmount"]').val(r);

        } else if (e < f[0]) {

            let r = RemainAmountCalc(a, f[0], b, c, e)
            $('input[name="remainAmount"]').val(r[0].toFixed(2));

        } else if (e > f[0]) {

            let r = OverAmount(e, f[0])
            $('input[name="remainAmount"]').val(r.toFixed(2));
        }

    }
});