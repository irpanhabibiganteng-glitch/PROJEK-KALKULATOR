class Calculator {
  constructor() {
    this.display = document.getElementById('result');
    this.expression = document.getElementById('expression');
    this.currentValue = '0';
    this.previousValue = '';
    this.operation = null;
    this.memory = 0;
    this.shouldResetDisplay = false;

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
        const text = (btn.textContent || '').trim();
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

    if (/^\d$/.test(value)) {
      this.addNumber(value);
    } else if (['+', '-', '*', '/'].includes(value)) {
      this.setOperation(value);
    } else if (value === '=') {
      this.calculate();
    } else if (value === 'C' || value === 'AC') {
      this.clear();
    } else if (value === 'CE') {
      this.clearEntry();
    } else if (value === '⌫' || value === 'DEL' || value === 'Backspace') {
      this.backspace();
    } else if (value === 'MC') {
      this.memoryClear();
    } else if (value === 'MR') {
      this.memoryRecall();
    } else if (value === 'M+') {
      this.memoryAdd();
    } else if (value === 'M-') {
      this.memorySubtract();
    } else if (value === 'MS') {
      this.memoryStore();
    } else if (value === '%') {
      this.percentage();
    } else if (value === '.') {
      this.addDecimal();
    } else if (value === '+/-' || value === '±') {
      this.toggleSign();
    }
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
    if (this.currentValue === '') return;

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
      case '+':
        result = prev + curr;
        break;
      case '-':
        result = prev - curr;
        break;
      case '*':
        result = prev * curr;
        break;
      case '/':
        result = curr !== 0 ? prev / curr : 0;
        break;
      default:
        return;
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

  memoryClear() {
    this.memory = 0;
  }

  memoryRecall() {
    this.currentValue = this.formatResult(this.memory);
    this.shouldResetDisplay = true;
    this.updateDisplay();
  }

  memoryAdd() {
    this.memory += parseFloat(this.currentValue);
    this.shouldResetDisplay = true;
    this.updateDisplay();
  }

  memorySubtract() {
    this.memory -= parseFloat(this.currentValue);
    this.shouldResetDisplay = true;
    this.updateDisplay();
  }

  memoryStore() {
    this.memory = parseFloat(this.currentValue);
    this.shouldResetDisplay = true;
    this.updateDisplay();
  }

  formatResult(num) {
    if (isNaN(num)) return '0';
    if (num.toString().length > 12) return num.toExponential(8);
    return parseFloat(num.toPrecision(12)).toString();
  }

  updateDisplay() {
    if (this.display) {
      this.display.textContent = this.currentValue;
    }

    if (this.expression) {
      let expr = '';
      if (this.previousValue) {
        expr = this.previousValue;
        if (this.operation) {
          expr += ' ' + this.operation + ' ';
          if (!this.shouldResetDisplay) {
            expr += this.currentValue;
          }
        }
      }
      this.expression.textContent = expr || '&nbsp;';
    }
  }

  handleKeyboard(e) {
    const key = e.key;

    if (/^\d$/.test(key)) {
      this.addNumber(key);
    } else if (key === '.') {
      this.addDecimal();
    } else if (key === '+' || key === '-') {
      this.setOperation(key);
    } else if (key === '*') {
      e.preventDefault();
      this.setOperation('*');
    } else if (key === '/' || key === 'Divide') {
      e.preventDefault();
      this.setOperation('/');
    } else if (key === 'Enter' || key === '=') {
      e.preventDefault();
      this.calculate();
    } else if (key === 'Backspace') {
      e.preventDefault();
      this.backspace();
    } else if (key === 'Escape') {
      this.clear();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
  document.body.classList.add('page-loaded');
});
