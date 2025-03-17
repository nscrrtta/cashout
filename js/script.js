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

let cash = remaining = 0;

function calculate(){
    clearCashLines();

    sales = getValue('sales');
    rcpts = calculateReceipts();
    tips = calculateTipPool();

    cash = sales - rcpts + 51 + tips;
    cash = Math.round(cash * 100) / 100;

    element = document.getElementById('calculation');
    element.innerHTML = `$${sales.toFixed(2)} - $${rcpts.toFixed(2)} + $51 + $${tips} = $${cash.toFixed(2)}`;

    element = document.getElementById('total-cash');
    element.innerHTML = 'Total Cash: $' + cash.toFixed(2);

    element = document.getElementById('cash-amount');
    element.value = cash.toFixed(2);
}

function calculateReceipts(){
    total = 0;

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

    if (total > 0) string = '$' + total.toFixed(2);
    else string = '__________';

    element = document.getElementById('total-receipts');
    element.innerHTML = 'Total Receipts: ' + string;

    return total;
}

function calculateTipPool(){
    total = 0;

    // Kitchen
    tips = Math.ceil(getValue('food-sales') * 5 / 100);
    total += tips;

    if (tips > 0) string = '' + tips;
    else string = '__________';

    element = document.getElementById('kitchen-tips');
    element.innerHTML = '5% of food sales = $' + string;

    // Bar
    tips = getValue('beer-sales') + getValue('wine-sales') + getValue('liquor-sales');
    tips = Math.ceil(tips * 3.5 / 100);
    total += tips;
    
    if (tips > 0) string = '' + tips;
    else string = '__________';

    element = document.getElementById('bar-tips');
    element.innerHTML = '3.5% of liquor & beverage = $' + string;
    
    // Host/Buss
    tips = Math.ceil(getValue('sales') / 100);
    total += tips;

    if (tips > 0) string = '' + tips;
    else string = '__________';

    element = document.getElementById('host-buss-tips');
    element.innerHTML = '1% of total sales = $' + string;

    // Total
    element = document.getElementById('total-tips');

    if (total > 0) element.innerHTML = `TOTAL: $${total}`;
    else element.innerHTML = `TOTAL:`;

    return total;
}

function getValue(id){
    element = document.getElementById(id);
    value = parseFloat(element.value);

    if (!value) return 0;
    else return value;
}

function calculateCoins(){
    cash = remaining = getValue('cash-amount');

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
    
    const takeHome = {
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

    parseInput(takeHome);

    total = getSum(takeHome);
    element = document.getElementById('total');
    element.innerHTML = `TOTAL: $${total.toFixed(2)}<br><br>`;

    putInBag(takeHome, cashBag);
    if (remaining < 0) takeFromBag(takeHome, cashBag);
    if (remaining <= 0) updateCashLines(cashBag);
}

function parseInput(takeHome){
    for (i = 0; i < coinValues.length; i++) {
        const coinName  = coinNames [i];
        const coinValue = coinValues[i];
        takeHome[coinValue] = getValue(coinName);
    }
}

function putInBag(takeHome, cashBag){
    for (i = 0; i < coinValues.length; i++) {
        const coinValue = coinValues[i];
        const quantity  = takeHome[coinValue];

        for (q = 0; q < quantity; q++){
            if (remaining < 0) break;
            remaining = Math.round((remaining - coinValue) * 100) / 100;

            cashBag [coinValue] += 1;
            takeHome[coinValue] -= 1;
        }
    }
}

function takeFromBag(takeHome, cashBag){
    for (i = coinValues.length - 1; i >= 0; i--) {
        const coinValue = coinValues[i];
        const quantity  = cashBag[coinValue];

        for (q = 0; q < quantity; q++){
            if (-remaining < coinValue) break;
            remaining = Math.round((remaining + coinValue) * 100) / 100;

            cashBag [coinValue] -= 1;
            takeHome[coinValue] += 1;
        }
    }
}

function getSum(bag){
    let sum = 0;
  
    for (coinValue in bag) {
        const quantity = bag[coinValue];
        sum += coinValue * quantity;
    }
  
    return Math.round(sum * 100) / 100;
}

function underlineNumber(num, stringSize){
    if (num == 0) return '_'.repeat(stringSize);

    num = num.toString();
    string = num + '_'.repeat(stringSize - num.length);
    return `<span class="text-underline">${string}</span>`;
}

function updateCashLines(cashBag){
    coin = totalCash = 0;

    for (i = 0; i < coinValues.length; i++) {
        const coinName  = coinNames [i];
        const coinValue = coinValues[i];

        quantity = cashBag[coinValue];
        totalCash += quantity * coinValue;

        if (coinValue >= 2){
            element = document.getElementById('num-'+coinName);
            element.innerHTML = underlineNumber(quantity, 4) + `x${coinValue}`;

            element = document.getElementById('sum-'+coinName);
            element.innerHTML = '= ' + underlineNumber(quantity * coinValue, 10);
        }else{
            coin += quantity * coinValue;
        } 
    }

    element = document.getElementById('sum-coin');
    element.innerHTML = '= ' + underlineNumber(coin.toFixed(2), 11);

    if (totalCash > 0){
        element = document.getElementById('total-cash');
        element.innerHTML = 'Total Cash: $' + cash.toFixed(2);
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
            element.innerHTML = '_'.repeat(4) + `x${coinValue}`;

            element = document.getElementById('sum-'+coinName);
            element.innerHTML = '= ' + '_'.repeat(10);
        }
    }

    element = document.getElementById('sum-coin');
    element.innerHTML = '= ' + '_'.repeat(10);
}