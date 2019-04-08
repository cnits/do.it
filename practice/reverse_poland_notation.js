/**
 * Resolve the RPN - Reverse Poland Notation
 * EX: 1 + (1 + 2 - 3) * ((5 - 6) / 2)
 *      122 + (10 + 2.4 - 3) * ((5 - 6) / 2) + 12.4
 * TODO: 1 1 2 3-++ 5 6-2/*
 */

const Stack = require('./../utils/stack');

class ReversePolandNotation {
    constructor(infix = '') {
        this.infixElems = this.parseInfixToArray(infix);
        this.char = '';
        this.postfixStack = new Stack();
        this.stack = new Stack();
    }
    parseInfixToArray(strInfix = '') {
        if (!strInfix || typeof strInfix !== "string") {
            throw new Error('The Infix must be a string without empty');
        }
        const _strInfix = strInfix.replace(/\,+/g, '.').trim();
        if (this.isInvalidInfix(_strInfix)) {
            throw new Error('The Infix string does not accept any letter');
        }
        const result = [];
        let currentValue = '';
        for (const _char of _strInfix) {
            this.setCurrentChar(_char);
            if (!this.char) {
                continue;
            }
            if (this.isOperator() || this.isBracket()) {
                if (currentValue) {
                    result.push(currentValue);
                    currentValue = '';
                    if (this.isOpenBracket()) {
                        result.push('*');
                    }
                    result.push(this.char);
                } else {
                    result.push(this.char);
                }
            } else {
                currentValue += this.char;
            }
        }
        if (currentValue) {
            result.push(currentValue);
        }
        this.setCurrentChar('');
        return result;
    }
    getPriority(operator) {
        if (['+', '-'].indexOf(operator) >= 0) {
            return 1;
        } else if (['*', '/'].indexOf(operator) >= 0) {
            return 2;
        } else if (['^'].indexOf(operator) >= 0) {
            return 3;
        }
        return 0;
    }
    convertInfixToPostfix() {
        if (!this.infixElems.length) {
            throw new Error('The Infix is invalid');
        }
        for (const item of this.infixElems) {
            this.setCurrentChar(item);
            if (!isNaN(item)) {
                this.postfixStack.push(Number(item));
            } else {
                if (this.isBracket()) {
                    if (this.isOpenBracket()) {
                        this.stack.push(this.char);
                    } else {
                        let _pop;
                        while ((_pop = this.stack.pop()) !== '(') {
                            this.postfixStack.push(_pop);
                        }
                    }
                } else {
                    const _pop = this.stack.pop();
                    if (_pop && this.isOperator(_pop)) {
                        if (this.getPriority(this.char) <= this.getPriority(_pop)) {
                            this.postfixStack.push(_pop);
                            this.stack.push(this.char);
                        } else {
                            this.stack.push(_pop);
                            this.stack.push(this.char);
                        }
                    } else {
                        if (_pop) {
                            this.stack.push(_pop);
                        }
                        this.stack.push(this.char);
                    }
                }
            }
        }
        let _pop;
        while (_pop = this.stack.pop()) {
            this.postfixStack.push(_pop);
        }
    }
    calculatePostfix() {
        this.stack.release();
        const postfixArr = this.postfixStack.toArray();
        for (const item of postfixArr) {
            if (isNaN(item)) {
                // Is operator
                const secondOperand = this.stack.pop(),
                    firstOperand = this.stack.pop(),
                    result = this.calculate(firstOperand, secondOperand, item);
                if (result !== null) {
                    this.stack.push(result);
                }
            } else {
                // Is number
                this.stack.push(item);
            }
        }
        return this.stack.pop();
    }
    calculate(operand1, operand2, operator) {
        let result = null;
        const no1 = Number(operand1),
            no2 = Number(operand2);
        switch (operator) {
            case '+':
                result = no1 + no2;
                break;
            case '-':
                result = no1 - no2;
                break;
            case '*':
                result = no1 * no2;
                break;
            case '/':
                result = no1 / no2;
                break;
            case '^':
                result = Math.pow(no1, no2);
                break;
        }
        return result;
    }
    isInvalidInfix(infix) {
        return /[^0-9\.\+\-\*\/\s\(\)\^]/g.test(infix);
    }
    isOperator(element = '') {
        return /^[\+\-\*\/\^]$/.test(element || this.char);
    }
    isBracket(element = '') {
        return /^[\(\)]$/.test(element || this.char);
    }
    isOpenBracket(element = '') {
        return (element || this.char) === '(';
    }
    isClosedBracket(element = '') {
        return (element || this.char) === ')';
    }
    setCurrentChar(element) {
        let _char = '';
        if (typeof element === "string") {
            _char = element.trim();
        }
        this.char = _char;
    }
}

const abc = new ReversePolandNotation('2+2^3');

abc.convertInfixToPostfix();
console.log(abc.postfixStack);
console.log(abc.calculatePostfix());