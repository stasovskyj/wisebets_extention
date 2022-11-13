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


    let amountAClosed = AmountCalc(factAmount, coefficientB, coefficientA)

    return amountA - amountAClosed[0]


}
// Прорахунок переставленої суми
function OverAmount(factAmount, amountB) {
    return factAmount - amountB
}
// Гарячі клавіші щоб перенести не закриту сумму
$('input').on("keypress", function (e) {

    console.log(e);

});
$("form").on("keyup", function (event) {
    event.preventDefault();
    if (event.which > 47 && event.which < 58 || event.which > 95 && event.which < 106 || event.which == 8) {

        let a = parseFloat($('input[name="amountA"]').val());
        let b = parseFloat($('input[name="coefficientA"]').val());
        let c = parseFloat($('input[name="coefficientB"]').val());
        let d = parseFloat($('input[name="amountB"]').val());
        let e = parseFloat($('input[name="factAmount"]').val());

        if (isNaN(a) || isNaN(b) || isNaN(c)) {
            return false;
        }

        let f = AmountCalc(a, b, c)

        $('input[name="amountB"]').val(f[0].toFixed(2));

        if (isNaN(e) || isNaN(f[0])) {
            return false
        }

        if (e == f[0]) {

            let r = 0

            $('input[name="remainAmount"]').val(r);

        } else if (e < f[0]) {

            let r = RemainAmountCalc(a, f[0], b, c, e)
            $('input[name="remainAmount"]').val(r);

        } else if (e > f[0]) {

            let r = OverAmount(e, f[0])
            $('input[name="remainAmount"]').val(r);
        }







    }
});