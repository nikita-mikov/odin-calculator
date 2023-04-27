const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const operations = ['+', '-', '/', '*', '=']
const buttons = document.querySelector('.buttons')
const display = document.querySelector('.display')

let displayString = '0'
let firstNumber = 0
let secondNumber = 0
let operator = ''
display.textContent = displayString

//number+number
//-number+number
//-number-number
//NOT +number+number OR *number-number OR /number-number
//NOT =number OR number=
//NOT number+-*






for(let i = 0; i< numbers.length; i++){
    let numberButtons = buttons.querySelector('.numbers')
    let button = numberButtons.appendChild(document.createElement('div'))
    button.setAttribute('class', `${numbers[i]}`)
    button.textContent = numbers[i]
    button.addEventListener('click', () => {
        if(displayString == '0'){
            displayString = button.textContent
            display.textContent = displayString
        } else{
        displayString += button.textContent
        display.textContent = displayString
        }
    })
}

for(let i = 0; i< operations.length; i++){
    let operatorButtons = buttons.querySelector('.operations')
    let button = operatorButtons.appendChild(document.createElement('div'))
    button.setAttribute('class', `${operations[i]}`)
    button.textContent = operations[i]
    button.addEventListener('click', () => {
        if(button.textContent === '=' && operator.length>0){
            console.log(operator)
            operate(operator)
            console.log('Step 1')
        } else if (button.textContent === '=' && operator.length == 0){
            console.log(operator)
            console.log('Step 2')
        } else if (button.textContent !== '=' && isNaN(displayString[displayString.length-1])){
            operator = button.textContent
            console.log(displayString)
            displayString = displayString.slice(0, -1)+operator
            display.textContent = displayString
            console.log(typeof(displayString))
            console.log(operator)
            console.log('Step 3')
        } else{
            operate(operator)
            operator = button.textContent
            displayString += operator
            display.textContent = displayString
            console.log(operator)
            console.log('Step 4')
        }

    })
}

function findNumbers(){
    firstNumber = +displayString.slice(0, displayString.indexOf(operator))
    secondNumber = +displayString.slice(displayString.indexOf(operator)+1)
}


function add(){
    result = +firstNumber + secondNumber
    displayString = result.toString()
    display.textContent = displayString
    operator = ''
}

function substract(){
    result = +firstNumber - secondNumber
    displayString = result.toString()
    display.textContent = displayString
    operator = ''
}

function multiply(){
    result = +firstNumber * secondNumber
    displayString = result.toString()
    display.textContent = displayString
    operator = ''
}

function divide(){
    result = +firstNumber / secondNumber
    displayString = result.toString()
    display.textContent = displayString
    operator = ''
}

function operate(op){
    findNumbers()
    if(op === '+'){
        add()
    } else if (op === '-'){
        substract()
    } else if (op === '*'){
        multiply()
    } else if (op === '/'){
        divide()
    }
}