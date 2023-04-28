const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0];
const numberNames = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    0: 'zero',
    '.': 'dot'
}
const operations = ['C', '<', '+', '-', '÷', '*', '=']
const operatorNames = {
    '+': 'addition',
    '-': 'substraction',
    '*': 'multiplication',
    '÷': 'division',
    'C': 'clear',
    '<': 'backspace',
    '=': 'equals'
}
const buttons = document.querySelector('.buttons')
const display = document.querySelector('.display')

let displayString = '0'
let firstNumber = 0
let secondNumber = 0
let operator = ''
display.textContent = displayString

for (let i = 0; i < numbers.length; i++) {

    let numberButtons = buttons.querySelector('.numbers')
    let button = numberButtons.appendChild(document.createElement('div'))

    button.setAttribute('class', `${numberNames[numbers[i]]} flex jc-center ai-center`)
    button.textContent = numbers[i]

    button.addEventListener('click', function () {
        addListenersToNumberButtons(numberNames[numbers[i]])
    })
}

for (let i = 0; i < operations.length; i++) {

    let operatorButtons = buttons.querySelector('.operations')
    let button = operatorButtons.appendChild(document.createElement('div'))

    button.setAttribute('class', `${operatorNames[operations[i]]} flex jc-center ai-center`)
    button.textContent = operations[i]
    button.addEventListener('click', function () {
        addListenersToOperatorButtons(operatorNames[operations[i]])
    })
}

function addListenersToNumberButtons(btn) {

    let button = document.querySelector(`.${btn}`)

    //if displayString is '0' and a number (NOT '.') is pressed => change displayString to the number pressed
    if (displayString == '0' && button.textContent !== '.') {
        displayString = button.textContent
        display.textContent = displayString
    }

    //If there IS '.' in the FIRST number => DO NOT add it there
    //If there IS '.' in the SECOND number => DO NOT add it there 
    else if (button.textContent === '.'
        && displayString.includes('.')  //Checks if there is a dot in the first number
        && operator.length < 1          //if the operator has not been pressed then there is only one number on display
        ||
        (button.textContent === '.'
        && displayString.slice(displayString.indexOf(operator)).includes('.'))  //Checks if there is a dot in the second number
        && operator.length > 0) { //if the operator has been pressed then there is a second number(might be empty)
    }

    //in all other cases add the number (OR '.') of the button to the string
    else {

        displayString += button.textContent
        display.textContent = displayString

    }
}

function addListenersToOperatorButtons(btn) {

    let button = document.querySelector(`.${btn}`)

    //if an operator HAS been pressed => perform operation
    if (button.textContent === '=' && operator.length > 0) {
        operate(operator)
    }

    //if an operator has NOT been pressed => leave everything as is
    else if (button.textContent === '=' && operator.length == 0) {
    }

    //if C is pressed => call clear()
    else if (button.textContent === 'C') {
        clear()
    }

    //if < is pressed => call backspace()
    else if (button.textContent === '<') {
        backspace()
    }

    //if one of ['+', '-', '÷', '*'] buttons was pressed AND the last symbol of displayString IS an operator
    //  => replace the operator in the string and the variable
    else if (operations.slice(2, operations.length - 1).includes(button.textContent)
        && isNaN(displayString[displayString.length - 1])) {
        operator = button.textContent
        displayString = displayString.slice(0, -1) + operator
        display.textContent = displayString
    }

    //in all other cases call operate(), update the operator
    //and add the new operator to displayString(which now is the result of operation)
    else {
        operate(operator)
        operator = button.textContent
        displayString += operator
        display.textContent = displayString
    }
}

//finds the numbers before and after the operator 
function findNumbers() {
    firstNumber = +displayString.slice(0, displayString.indexOf(operator))
    secondNumber = +displayString.slice(displayString.indexOf(operator) + 1)
}

//replaces displayString with '0' and updates operator
function clear() {
    displayString = '0'
    display.textContent = displayString
    operator = ''
}

function backspace() {

    // if the las symbol in display string is an operator => remove last symbol and update operator value
    if (operations.slice(2, operations.length - 1).includes(displayString[displayString.length - 1])) {
        displayString = displayString.slice(0, displayString.length - 1)
        operator = ''
        display.textContent = displayString
    }

    // if displayString is longer than 1 symbol => delete last symbol
    else if (displayString.length > 1) {
        displayString = displayString.slice(0, displayString.length - 1)
        display.textContent = displayString
    }

    // if displayString is only 1 symbol long => displayString = '0'
    else if (displayString.length == 1) {
        displayString = '0'
        display.textContent = displayString
    }

    else {
    }
}

function operate(op) {

    findNumbers()
    let result = 0

    if (op === '+') {
        result = +firstNumber + secondNumber
        updateResults(result)
    } 
    else if (op === '-') {
        result = +firstNumber - secondNumber
        updateResults(result)
    } 
    else if (op === '*') {
        result = +firstNumber * secondNumber
        updateResults(result)
    } 
    else if (op === '÷') {
        result = +firstNumber / secondNumber
        updateResults(result)
    }
}

function updateResults(num) {
    displayString = num.toString()
    display.textContent = displayString
    operator = ''
}