class ScientificCalculator {
  constructor() {
    this.display = document.getElementById('result') || document.querySelector('[data-role="result"]') || document.querySelector('.result') || document.querySelector('.display') || document.querySelector('#display');
    this.expression = document.getElementById('expression') || document.querySelector('[data-role="expression"]') || document.querySelector('.expression');
    this.currentValue = '0';
    this.previousValue = '';
    this.operation = null;
    this.memory = 0;
    this.shouldResetDisplay = false;
    this.angleMode = 'deg';
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.updateDisplay();
  }

  attachEventListeners() {
    document.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const text = (btn.textContent || '').replace(/\s+/g, ' ').trim();
        this.handleButtonClick(text);
      });
    });

    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  normalizeButtonText(text) {
    return (text || '')
      .replace(/\u2212/g, '-')
      .replace(/\u00D7/g, '*')
      .replace(/\u00F7/g, '/')
      .replace(/\uFF0B/g, '+')
      .trim();
  }

  handleButtonClick(text) {
    const value = this.normalizeButtonText(text);

    if (/^\d$/.test(value)) this.addNumber(value);
    else if (['+', '-', '*', '/'].includes(value)) this.setOperation(value);
    else if (value === '=') this.calculate();
    else if (value === 'C' || value === 'AC') this.clear();
    else if (value === 'CE') this.clearEntry();
    else if (value === '⌫' || value === 'DEL' || value === 'Backspace') this.backspace();
    else if (value === 'MC') this.memoryClear();
    else if (value === 'MR') this.memoryRecall();
    else if (value === 'M+') this.memoryAdd();
    else if (value === 'M-') this.memorySubtract();
    else if (value === 'MS') this.memoryStore();
    else if (value === '%') this.percentage();
    else if (value === '.') this.addDecimal();
    else if (value === '±' || value === '+/-') this.toggleSign();
    else if (value === 'sin') this.scientificFunc('sin');
    else if (value === 'cos') this.scientificFunc('cos');
    else if (value === 'tan') this.scientificFunc('tan');
    else if (value === 'cot') this.scientificFunc('cot');
    else if (value === 'sec') this.scientificFunc('sec');
    else if (value === 'csc') this.scientificFunc('csc');
    else if (value === '√x' || value === '√') this.scientificFunc('sqrt');
    else if (value === '∛x') this.scientificFunc('cbrt');
    else if (value.includes('x²') || value.includes('x2')) this.scientificFunc('square');
    else if (value.includes('x³') || value.includes('x3')) this.scientificFunc('cube');
    else if (value === 'log') this.scientificFunc('log');
    else if (value === 'ln') this.scientificFunc('ln');
    else if (value === 'π') this.addNumber(Math.PI.toString());
    else if (value === 'e') this.addNumber(Math.E.toString());
    else if (value === '(' || value === ')') this.addNumber(value);
  }

  addNumber(num) {
    if (this.shouldResetDisplay) {
      this.currentValue = num;
      this.shouldResetDisplay = false;
    } else {
      if (this.currentValue === '0' && num !== '.') {
        this.currentValue = num;
      } else {
        this.currentValue += num;
      }
    }
    this.updateDisplay();
  }

  addDecimal() {
    if (this.shouldResetDisplay) {
      this.currentValue = '0.';
      this.shouldResetDisplay = false;
    } else if (!this.currentValue.includes('.')) {
      this.currentValue += '.';
    }
    this.updateDisplay();
  }

  setOperation(op) {
    if (!this.currentValue) return;
    if (this.previousValue === '') {
      this.previousValue = this.currentValue;
    } else if (!this.shouldResetDisplay) {
      this.calculate();
    }
    this.operation = op;
    this.shouldResetDisplay = true;
    this.updateDisplay();
  }

  calculate() {
    if (this.operation === null || this.previousValue === '') return;

    const prev = parseFloat(this.previousValue);
    const curr = parseFloat(this.currentValue);
    let result = 0;

    switch (this.operation) {
      case '+': result = prev + curr; break;
      case '-': result = prev - curr; break;
      case '*': result = prev * curr; break;
      case '/': result = curr !== 0 ? prev / curr : 0; break;
      default: return;
    }

    this.currentValue = this.formatResult(result);
    this.previousValue = '';
    this.operation = null;
    this.shouldResetDisplay = true;
    this.updateDisplay();
  }

  clear() {
    this.currentValue = '0';
    this.previousValue = '';
    this.operation = null;
    this.shouldResetDisplay = false;
    this.updateDisplay();
  }

  clearEntry() {
    this.currentValue = '0';
    this.shouldResetDisplay = false;
    this.updateDisplay();
  }

  backspace() {
    this.currentValue = this.currentValue.length > 1 ? this.currentValue.slice(0, -1) : '0';
    this.updateDisplay();
  }

  percentage() {
    const value = parseFloat(this.currentValue);
    this.currentValue = this.formatResult(value / 100);
    this.updateDisplay();
  }

  toggleSign() {
    const value = parseFloat(this.currentValue);
    this.currentValue = this.formatResult(value * -1);
    this.updateDisplay();
  }

  memoryClear() { this.memory = 0; }
  memoryRecall() { this.currentValue = this.formatResult(this.memory); this.shouldResetDisplay = true; this.updateDisplay(); }
  memoryAdd() { this.memory += parseFloat(this.currentValue); this.shouldResetDisplay = true; this.updateDisplay(); }
  memorySubtract() { this.memory -= parseFloat(this.currentValue); this.shouldResetDisplay = true; this.updateDisplay(); }
  memoryStore() { this.memory = parseFloat(this.currentValue); this.shouldResetDisplay = true; this.updateDisplay(); }

  scientificFunc(func) {
    const value = parseFloat(this.currentValue);
    if (isNaN(value)) return;

    const angleValue = this.angleMode === 'rad' ? value : (value * Math.PI) / 180;
    let result = 0;

    switch (func) {
      case 'sin': result = Math.sin(angleValue); break;
      case 'cos': result = Math.cos(angleValue); break;
      case 'tan': result = Math.tan(angleValue); break;
      case 'cot': result = 1 / Math.tan(angleValue); break;
      case 'sec': result = 1 / Math.cos(angleValue); break;
      case 'csc': result = 1 / Math.sin(angleValue); break;
      case 'sqrt': result = Math.sqrt(value); break;
      case 'cbrt': result = Math.cbrt(value); break;
      case 'square': result = value * value; break;
      case 'cube': result = value * value * value; break;
      case 'log': result = Math.log10(value); break;
      case 'ln': result = Math.log(value); break;
      default: return;
    }

    this.currentValue = this.formatResult(result);
    this.shouldResetDisplay = true;
    this.updateDisplay();
  }

  formatResult(num) {
    if (isNaN(num)) return '0';
    if (num.toString().length > 12) return num.toExponential(8);
    return parseFloat(num.toPrecision(12)).toString();
  }

  updateDisplay() {
    if (this.display) this.display.textContent = this.currentValue;
    if (this.expression) {
      let expr = '';
      if (this.previousValue) {
        expr = this.previousValue;
        if (this.operation) {
          expr += ` ${this.operation} `;
          if (!this.shouldResetDisplay) expr += this.currentValue;
        }
      }
      this.expression.textContent = expr || '&nbsp;';
    }
  }

  handleKeyboard(e) {
    const key = e.key;
    if (/^\d$/.test(key)) this.addNumber(key);
    else if (key === '.') this.addDecimal();
    else if (key === '+' || key === '-') this.setOperation(key);
    else if (key === '*') this.setOperation('*');
    else if (key === '/' || key === 'Divide') this.setOperation('/');
    else if (key === 'Enter' || key === '=') this.calculate();
    else if (key === 'Backspace') this.backspace();
    else if (key === 'Escape') this.clear();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('button')) {
    new ScientificCalculator();
  }
});
