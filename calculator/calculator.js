// Global variables
let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let previousInput = '';
let memory = 0;
let isNewCalculation = false;

// Bug Level 1 - Issue 1: Missing initialization of display
// The display should be initialized to '0' on page load

// Bug Level 1 - Issue 2: Incorrect operator precedence handling
function appendToDisplay(value) {
    if (isNewCalculation && !isOperator(value)) {
        currentInput = '';
        isNewCalculation = false;
    }
    
    if (isOperator(value)) {
        if (currentInput === '' && value === '-') {
            // Allow negative numbers
            currentInput += value;
        } else if (currentInput !== '') {
            if (previousInput !== '' && operator !== '') {
                calculate();
            }
            operator = value;
            previousInput = currentInput;
            currentInput = '';
        }
    } else {
        currentInput += value;
    }
    
    updateDisplay();
}

function isOperator(value) {
    return ['+', '-', '*', '/'].includes(value);
}

function updateDisplay() {
    if (currentInput === '') {
        display.value = previousInput || '0';
    } else {
        display.value = currentInput;
    }
}

function clearDisplay() {
    currentInput = '';
    operator = '';
    previousInput = '';
    isNewCalculation = false;
    display.value = '0';
}

// Bug Level 2 - Issue 1: Division by zero not handled properly
function calculate() {
    if (previousInput === '' || currentInput === '' || operator === '') {
        return;
    }
    
    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
        alert("Error: Division by zero is not allowed");
        clearDisplay();
        return;
    }
            result = prev / current; 
            break;
        default:
            return;
    }
    
    // Bug Level 2 - Issue 2: Floating point precision issues
    // Result should be rounded to avoid floating point errors
     result = parseFloat(result.toFixed(6));
    currentInput = result.toString();
    operator = '';
    previousInput = '';
    isNewCalculation = true;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '') {
            currentInput = '0';
        }
        updateDisplay();
    }
}

// Bug Level 3 - Issue 1: Memory functions don't work with current display value
function memoryStore() {
    if (currentInput !== '') {
        memory = parseFloat(currentInput); // Bug: Should use currentInput or display.value consistently
    }
}

function memoryRecall() {
    currentInput = memory.toString();
    updateDisplay();
}

function memoryClear() {
    memory = 0;
}

// Bug Level 3 - Issue 2: Memory add function has logical error
const MEMORY_LIMIT = 1e12;
function memoryAdd() {
    if (currentInput !== '') {
        memory += parseFloat(currentInput);
    } else {
        memory += parseFloat(display.value); // Bug: Inconsistent behavior
    }
    memory = Math.min(memory, MEMORY_LIMIT);
}

// Bug Level 4 - Issue 1: Multiple decimal points allowed
function appendToDisplay(value) {
    if (isNewCalculation && !isOperator(value)) {
        currentInput = '';
        isNewCalculation = false;
    }
    

    
    if (isOperator(value)) {
        if (currentInput === '' && value === '-') {
            currentInput += value;
        } else if (currentInput !== '') {
            if (previousInput !== '' && operator !== '') {
                calculate();
            }
            operator = value;
            previousInput = currentInput;
            currentInput = '';
        }
    } else {
        // Bug: No check for multiple decimal points
        if (value === '.' && currentInput.includes('.')) return;
        currentInput += value;
    }
    
    updateDisplay();
}

// Bug Level 4 - Issue 2: Keyboard input not supported
// Missing keyboard event listeners for better UX
window.addEventListener('keydown', function(e) {
    const validKeys = '0123456789+-*/.=BackspaceEnter';
    if (validKeys.includes(e.key)) {
        if (e.key === 'Enter' || e.key === '=') {
            calculate();
        } else if (e.key === 'Backspace') {
            deleteLast();
        } else {
            appendToDisplay(e.key);
        }
    }
});

// Bug Level 5 - Issue 1: Chain calculations don't work properly
function calculate() {
    if (previousInput === '' || currentInput === '' || operator === '') {
        return;
    }
    
    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            
            if (current === 0) {
                
                clearDisplay();
                return;
            }
            result = prev / current;
            break;

    

        default:
            return;
    }
    
    // Bug: Chain calculations reset previousInput incorrectly
    result = parseFloat(result.toFixed(6));
    currentInput = result.toString();
    operator = '';
    previousInput = currentInput;  // Keep result for chaining
    isNewCalculation = true;
    updateDisplay();

}

// Bug Level 5 - Issue 2: Memory overflow not handled
function memoryAdd() {
    if (currentInput !== '') {
        memory += parseFloat(currentInput);
    } else {
        memory += parseFloat(display.value);
    }
    // Bug: No check for memory overflow (very large numbers)
    // Should limit memory to reasonable bounds
    memory = Math.min(memory, MEMORY_LIMIT);
}

// Initialize calculator on page load
window.onload = function() {
    display.value = '0'; // This should fix Level 1 Bug 1 if added
};
