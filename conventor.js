const lengthUnits = {
  kilometer: { label: 'Kilometer', toBase: 1000, fromBase: 1 / 1000 },
  meter: { label: 'Meter', toBase: 1, fromBase: 1 },
  mile: { label: 'Mile', toBase: 1609.344, fromBase: 1 / 1609.344 },
  foot: { label: 'Foot', toBase: 0.3048, fromBase: 1 / 0.3048 }
};

document.addEventListener('DOMContentLoaded', () => {
  const fromInput = document.getElementById('fromValue');
  const toValue = document.getElementById('toValue');
  const fromUnit = document.getElementById('fromUnit');
  const toUnit = document.getElementById('toUnit');

  const convert = () => {
    if (!fromInput || !toValue || !fromUnit || !toUnit) return;

    const value = Number(fromInput.textContent || fromInput.innerText || 0);
    const fromKey = fromUnit.dataset.unit || 'kilometer';
    const toKey = toUnit.dataset.unit || 'mile';

    const meters = value * lengthUnits[fromKey].toBase;
    const result = meters * lengthUnits[toKey].fromBase;
    toValue.textContent = Number(result).toLocaleString(undefined, { maximumFractionDigits: 5 });
  };

  if (fromInput) {
    fromInput.addEventListener('input', convert);
  }

  if (fromUnit && toUnit) {
    fromUnit.addEventListener('change', convert);
    toUnit.addEventListener('change', convert);
  }

  convert();
  document.body.classList.add('page-loaded');
});
