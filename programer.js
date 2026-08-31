class ProgrammerCalculator {
  constructor() {
    this.display = document.getElementById('result') || document.querySelector('[data-role="result"]') || document.querySelector('.result');
    this.expression = document.getElementById('expression') || document.querySelector('[data-role="expression"]') || document.querySelector('.expression');
    this.currentValue = '0';
    this.previousValue = '';
    this.operation = null;
    this.shouldResetDisplay = false;
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.updateDisplay();
  }

  attachEventListeners() {
    document.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const text = (button.textContent || '').trim();
        this.handleButtonClick(text);
      });
    });
  }

  normalize(text) {
    return (text || '')
      .replace(/\u2212/g, '-')
      .replace(/\u00D7/g, '*')
      .replace(/\u00F7/g, '/')
      .trim();
  }

  handleButtonClick(text) {
    const value = this.normalize(text);

    if (/^[0-9A-F]$/.test(value)) this.addNumber(value);
    else if (['+', '-', '*', '/'].includes(value)) this.setOperation(value);
    else if (value === '=') this.calculate();
    else if (value === 'C' || value === 'CE') this.clear();
    else if (value === '⌫' || value === 'DEL') this.backspace();
    else if (value === '.') this.addDecimal();
    else if (value === '±') this.toggleSign();
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
    if (this.previousValue === '') this.previousValue = this.currentValue;
    else if (!this.shouldResetDisplay) this.calculate();
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

    this.currentValue = String(result);
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

  backspace() {
    this.currentValue = this.currentValue.length > 1 ? this.currentValue.slice(0, -1) : '0';
    this.updateDisplay();
  }

  toggleSign() {
    const value = parseFloat(this.currentValue);
    this.currentValue = String(value * -1);
    this.updateDisplay();
  }

  updateDisplay() {
    if (this.display) this.display.textContent = this.currentValue;
    if (this.expression) {
      if (this.previousValue && this.operation) {
        this.expression.textContent = `${this.previousValue} ${this.operation} ${this.shouldResetDisplay ? '' : this.currentValue}`;
      } else {
        this.expression.textContent = '&nbsp;';
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('button')) {
    new ProgrammerCalculator();
  }
});
