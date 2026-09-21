document.addEventListener('DOMContentLoaded', () => {
  const historyBox = document.querySelector('.history-list');
  const clearBtn = document.querySelector('[data-action="clear-history"]');
  const exportBtn = document.querySelector('[data-action="export-history"]');

  const defaultHistory = [
    { expression: '(256 + 123) x (645 + 25)', result: '= 12,810.2' },
    { expression: 'sin(45) + log(100) x 2', result: '= 2.1213203436' },
    { expression: '2,568 ÷ 12', result: '= 214' },
    { expression: '(25 + 17) x 4', result: '= 93' },
    { expression: 'tan(60) x cos(30)', result: '= 1.5' }
  ];

  const saved = JSON.parse(localStorage.getItem('calcHistory') || 'null');
  const history = Array.isArray(saved) && saved.length ? saved : defaultHistory;

  const renderHistory = () => {
    if (!historyBox) return;

    historyBox.innerHTML = '';

    if (!history.length) {
      const empty = document.createElement('div');
      empty.className = 'flex items-center justify-center h-full text-center text-gray-500 text-sm';
      empty.textContent = 'Belum ada riwayat perhitungan';
      historyBox.appendChild(empty);
      return;
    }

    history.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between gap-3 px-[12px] pt-[18px] text-[15px] text-[#666]';

      const expr = document.createElement('span');
      expr.className = 'truncate';
      expr.textContent = item.expression;

      const value = document.createElement('span');
      value.className = 'shrink-0 text-right';
      value.textContent = item.result;

      row.appendChild(expr);
      row.appendChild(value);
      historyBox.appendChild(row);
    });
  };

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      history.length = 0;
      localStorage.setItem('calcHistory', JSON.stringify(history));
      renderHistory();
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const text = history.map((item) => `${item.expression} ${item.result}`).join('\n');
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'history.txt';
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  localStorage.setItem('calcHistory', JSON.stringify(history));
  renderHistory();
  document.body.classList.add('page-loaded');

  document.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      e.preventDefault();
      document.body.classList.remove('page-loaded');
      setTimeout(() => {
        window.location.href = href;
      }, 350);
    });
  });
});
