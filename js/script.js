const coinNames = [
    // Change
    "nickels",
    "dimes",
    "quarters",
    "loonies",
    "toonies",

    // Bills
    "fives",
    "tens",
    "twenties",
    "fifties",
    "hundreds"
];

const coinValues = [
    // Change
    0.05,
    0.10,
    0.25,
    1.00,
    2.00,

    // Bills
    5,
    10,
    20,
    50,
    100
];

function calculate(){
    clearCashLines();

    let sales = getValue('sales');
    let rcpts = calculateReceipts();
    let tips  = calculateTipPool();

    let cash = sales - rcpts + 51 + tips;
    cash = Math.round(cash * 100) / 100;

    element = document.getElementById('calculation');
    element.innerHTML = `${sales} - ${rcpts} + 51 + ${tips} = ${cash}`;

    if (cash > 0){
        element = document.getElementById('total-cash');
        element.innerHTML = cash;

        element = document.getElementById('cash-amount');
        element.value = cash;
    }
}

function calculateReceipts(){
    let total = 0;

    total += getValue('visa');
    total += getValue('visa-wireless');

    total += getValue('debit');
    total += getValue('debit-wireless');

    total += getValue('mc');
    total += getValue('mc-wireless');

    total += getValue('amex');
    total += getValue('amex-wireless');

    total += getValue('gift-card');
    total += getValue('other-1');

    total += getValue('receivable');
    total += getValue('other-2');

    total = Math.round(total * 100) / 100;

    element = document.getElementById('total-receipts');
    element.innerHTML = total;

    return total;
}

function calculateTipPool(){
    let total = 0;

    // Kitchen
    tips = Math.round(getValue('food-sales') * 5 / 100);
    total += tips;

    element = document.getElementById('kitchen-tips');
    element.innerHTML = tips;

    // Bar
    tips =  getValue('liquor-sales');
    tips += getValue('wine-sales');
    tips += getValue('beer-sales');
    tips += getValue('premium-beer-sales');
    tips += getValue('wholesale-beer-sales');
    tips += getValue('beverage-sales');
    
    tips = Math.round(tips * 3.5 / 100);
    total += tips;

    element = document.getElementById('bar-tips');
    element.innerHTML = tips;
    
    // Host/Buss
    tips = Math.round(getValue('sales') / 100);
    total += tips;

    element = document.getElementById('host-buss-tips');
    element.innerHTML = tips;

    // Total
    element = document.getElementById('total-tips');
    element.innerHTML = total;

    return total;
}

function getValue(id){
    element = document.getElementById(id);
    let value = parseFloat(element.value);

    if (!value) return 0;
    else return value;
}

function calculateCoins(){
    const target = getValue('cash-amount');

    const cashBag = {
        // Change
        0.05: 0,
        0.10: 0,
        0.25: 0,
        1.00: 0,
        2.00: 0,

        // Bills
        5:  0,
        10: 0,
        20: 0,
        50: 0,
        100: 0
    };
    
    const total = parseInput(cashBag);
    element = document.getElementById('total');
    element.innerHTML = `TOTAL: $${total.toFixed(2)}<br><br>`;

    takeFromBag(cashBag, total - target);
    updateCashLines(cashBag);
}

function parseInput(cashBag){
    let sum = 0;

    for (i = 0; i < coinValues.length; i++) {
        const coinName  = coinNames [i];
        const coinValue = coinValues[i];

        const quantity = getValue(coinName);

        cashBag[coinValue] = quantity;
        sum += coinValue * quantity;
    }

    return sum;
}

function takeFromBag(cashBag, amount){
    amount = Math.round(amount * 100) / 100;

    for (i = coinValues.length - 1; i >= 0; i--) {
        const coinValue = coinValues[i];
        const quantity  = cashBag[coinValue];

        for (q = 0; q < quantity; q++){
            if (amount < coinValue) break;
            amount = Math.round((amount - coinValue) * 100) / 100;
            cashBag [coinValue] -= 1;
        }
    }
}

function updateCashLines(cashBag){
    let totalCoin = 0;
    let totalCash = 0;

    for (i = 0; i < coinValues.length; i++) {
        const coinName  = coinNames [i];
        const coinValue = coinValues[i];

        const quantity = cashBag[coinValue];
        if (quantity == 0) continue;

        totalCash += quantity * coinValue;

        if (coinValue >= 2){
            element = document.getElementById('num-'+coinName);
            element.innerHTML = quantity;

            element = document.getElementById('sum-'+coinName);
            element.innerHTML = quantity * coinValue;
        }else{
            totalCoin += quantity * coinValue;
        }
    }

    if (totalCoin > 0){
        element = document.getElementById('sum-coin');
        element.innerHTML = totalCoin.toFixed(2);
    }

    if (totalCash > 0){
        element = document.getElementById('total-cash');
        element.innerHTML = totalCash.toFixed(2);
    }
}

function clearCashLines(){
    for (i = 0; i < coinValues.length; i++) {
        const coinName  = coinNames [i];
        const coinValue = coinValues[i];

        element = document.getElementById(coinName);
        element.value = '';

        if (coinValue >= 2){
            element = document.getElementById('num-'+coinName);
            element.innerHTML = '&nbsp';

            element = document.getElementById('sum-'+coinName);
            element.innerHTML = '&nbsp';
        }
    }

    element = document.getElementById('sum-coin');
    element.innerHTML = '&nbsp';
}
