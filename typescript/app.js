"use strict";
const num1Element = document.getElementById('num1');
const num2Element = document.getElementById('num2');
const buttonElement = document.querySelector('button');
function add(num1, num2) {
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;
    }
    else if (typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + ' ' + num2;
    }
    return +num1 + +num2;
}
const numresult = [];
const textresult = [];
function printObj(resultObj) {
    console.log(resultObj.val);
}
buttonElement.addEventListener('click', () => {
    const num1 = num1Element.value;
    const num2 = num2Element.value;
    const result = add(+num1, +num2);
    const textResult = add(num1, num2);
    printObj({ val: result, timestamp: new Date() });
    numresult.push(result);
    textresult.push(textResult);
    console.log(numresult, textresult);
});
const promise = new Promise((res, rej) => {
    setTimeout(() => {
        res('it worked');
    }, 1000);
});
promise.then((result) => {
    console.log(result.split('w'));
});
