//Need to add limit on amount of characters that the user is able to enter


const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];
const numberNames = {
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
    '6': 'six',
    '7': 'seven',
    '8': 'eight',
    '9': 'nine',
    '0': 'zero',
    '.': 'dot'
}
const actionSymbols = ['C', '<', '-', '+', '/', '*', '=']
const actionNames = {
    '+': 'addition',
    '-': 'substraction',
    '*': 'multiplication',
    'C': 'clear',
    '<': 'backspace',
    '=': 'equals',
    '/': 'division'
}

const allOperators = actionSymbols.slice(2, actionSymbols.length - 1)
const operatorsExceptMinus = actionSymbols.slice(3, actionSymbols.length - 1)

const numberButtons = document.querySelector('.numbers')
const operatorButtons = document.querySelector('.actionSymbols')
const display = document.querySelector('.display')



let displayString = '0'
let firstNumber = 0
let secondNumber = 0
let operator = ''
display.textContent = displayString

for (let i = 0; i < numbers.length; i++) {

    let button = numberButtons.appendChild(document.createElement('div'))

    button.setAttribute('class', `${numberNames[numbers[i]]} flex jc-center ai-center`)
    button.textContent = numbers[i]

    button.addEventListener('click', function () {
        showNumberOnDisplay(numberNames[numbers[i]])
    })
}

for (let i = 0; i < actionSymbols.length; i++) {

    let button = operatorButtons.appendChild(document.createElement('div'))

    button.setAttribute('class', `${actionNames[actionSymbols[i]]} flex jc-center ai-center`)
    button.textContent = actionSymbols[i]
    button.addEventListener('click', function () {
        showOperatorOnDisplay(actionNames[actionSymbols[i]])
    })
}


window.addEventListener('keydown', function(e){
    let pressedKey = e.key
    console.log(pressedKey)
    if(numbers.includes(pressedKey)){
        showNumberOnDisplay(numberNames[pressedKey])
    } else if (pressedKey === 'Backspace'){
        pressedKey = '<'
        showOperatorOnDisplay(actionNames[pressedKey])
    } else if (pressedKey === 'Enter'){
        pressedKey = '='
        showOperatorOnDisplay(actionNames[pressedKey])
    }
    else if(actionSymbols.includes(pressedKey.toUpperCase())){
        showOperatorOnDisplay(actionNames[pressedKey.toUpperCase()])
    }
})


function showNumberOnDisplay(btn) {

    let button = document.querySelector(`.${btn}`)
    let stringAfterOperator = displayString.slice(displayString.lastIndexOf(operator) + 1)
    let stringBeforeOperator = displayString.slice(0, displayString.lastIndexOf(operator))

    //if displayString is '0' and a number (NOT '.') is pressed => change displayString to the number pressed
    if (displayString == '0' && button.textContent !== '.' || displayString === 'Error') {
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
        && stringAfterOperator.includes('.'))  //Checks if there is a dot in the second number
        && operator.length > 0
        ||
        operator.length < 1
        && Math.abs(displayString).toString().length >= 7
        ||
        operator.length > 0
        && Math.abs(stringAfterOperator).toString().length >= 7
        ||
        stringBeforeOperator.length + stringAfterOperator.length >= 16) { //if the operator has been pressed then there is a second number(might be empty)
    }

    //in all other cases add the number (OR '.') of the button to the string
    else {

        displayString += button.textContent
        display.textContent = displayString

    }
}

//should be possible for '-' to follow operators [+, *, /]
//if there is already an active operator and it's not '-' and the button pressed IS '-' and the last symbol in string is not '-' => add '-' to string

function showOperatorOnDisplay(btn) {

    let button = document.querySelector(`.${btn}`)
    let lastDigitOnDisplay = displayString[displayString.length - 1]
    let secondToLastDigitOnDisplay = displayString[displayString.length - 2]
    let stringAfterOperator = displayString.slice(displayString.lastIndexOf(operator) + 1)
    

    //if an operator HAS been pressed => perform operation
    if (button.textContent === '=' && operator.length > 0) {
        operate(operator)
    }


    //if C is pressed => call clear()
    else if (button.textContent === 'C') {
        clear()
    }

    //if < is pressed => call backspace()
    else if (button.textContent === '<') {
        backspace()
    }

    else if(displayString === 'Error'){
        displayString = `0${button.textContent}`
        display.textContent = displayString
        operator = button.textContent
    }

    //add '-' after another operator (basically make second number negative)
    else if (operatorsExceptMinus.includes(lastDigitOnDisplay)
        && numbers.includes(secondToLastDigitOnDisplay)
        && button.textContent == '-'
    ) {
        console.log('stage 3')
        displayString += '-'
        display.textContent = displayString
    }

    /*
        +('bla')
        if 'bla'+5<0 => don't add '-

        123+-(-) => 123+- (don't do anything)     second number is not a number && 
        123+.(-) => 123+. (don't do anything)     second number is not a number ; there is a '.' after operator
        123+-.(-) => 123+-. (don't do anything)   second number is not a number ; there is a '.' after operator
        123-(-) =>  123-  (don't do anything)     second number is empty && button pressed == operator
        123*(*) => 123*     (don't do anything)   second number is empty && button pressed == operator

        123-(+) => 123+     (change operator)     second number is not a number

        123+1(-) => 124     (perform operation)
        123+-1(-) => 122    (perform operation)
        123+1.(-) => 124    (perform operation)     last digit is not a number ; there is a '.' after operator

    */

    //if an operator has NOT been pressed OR if second number is NaN OR if second number is empty && button pressed == operator => leave everything as is
    else if (button.textContent === '=' && operator.length == 0
        ||
        isNaN(stringAfterOperator)
        ||
        stringAfterOperator == '' && button.textContent == operator) {
            console.log('stage 4')
    }

    //if one of ['+', '÷', '*'] buttons was pressed AND the last symbol of displayString IS an operator
    //  => replace the operator in the string and the variable
    else if (operatorsExceptMinus.includes(button.textContent)
        && isNaN(lastDigitOnDisplay)) {
        console.log('stage 5')
        operator = button.textContent
        displayString = displayString.slice(0, -1) + operator
        display.textContent = displayString
    }

    //in all other cases call operate(), update the operator
    //and add the new operator to displayString(which now is the result of operation)
    else {
        console.log('stage 6')

        operate(operator)
        operator = button.textContent
        displayString += operator
        display.textContent = displayString
    }
}

//finds the numbers before and after the operator 
function findNumbers() {
    firstNumber = +displayString.slice(0, displayString.lastIndexOf(operator))
    secondNumber = +displayString.slice(displayString.lastIndexOf(operator) + 1)
    if (isNaN(secondNumber)) {
        secondNumber = 0
    }
    console.log(firstNumber)
    console.log(secondNumber)

}

//replaces displayString with '0' and updates operator
function clear() {
    displayString = '0'
    display.textContent = displayString
    operator = ''
}

function backspace() {

    let lastDigitOnDisplay = displayString[displayString.length - 1]

    // if the las symbol in display string is THE operator => remove last symbol and update operator value
    if (allOperators.includes(lastDigitOnDisplay)
        && lastDigitOnDisplay == operator) {
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
    console.log(op)
    findNumbers()
    let result = 0

    if (op === '+') {
        result = +firstNumber + secondNumber
        updateResults(result)
    }
    else if (op === '-') {
        console.log('substract')
        result = +firstNumber - secondNumber
        updateResults(result)
    }
    else if (op === '*') {
        result = +firstNumber * secondNumber
        updateResults(result)
    }
    else if (op === '/') {
        result = +firstNumber / secondNumber
        updateResults(result)
    }
}

function updateResults(num) {
    let absoluteNum = Math.abs(num).toString()
    if(num.toString()[0] == 'I'){
        displayString = 'Error'
        display.textContent = displayString
        operator = ''
    } 
    else if(Math.abs(num)>=10000000 ){
        displayString = Math.round(num/`1e${absoluteNum.length-1}`) + 'e'+ absoluteNum.slice(1).length
        display.textContent = displayString
        operator = ''
    }
    else {
        displayString = num.toString()
        display.textContent = displayString
        operator = ''}

    console.log('updated')
}