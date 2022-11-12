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


$("form").on("keyup", function (event) {
    event.preventDefault();
    if (event.which > 47 && event.which < 58 || event.which > 95 && event.which < 106 || event.which == 8) {

        let a = parseFloat($('input[name="amountA"]').val());
        let b = parseFloat($('input[name="coefficientA"]').val());
        let c = parseFloat($('input[name="coefficientB"]').val());

        if (isNaN(a) || isNaN(b) || isNaN(c)) {
            return false;
        }

        let d = AmountCalc(a, b, c)

        $('input[name="amountB"]').val(d[0].toFixed(2));
        console.log(d[1])
        console.log(d[2] + '%')



    }
});