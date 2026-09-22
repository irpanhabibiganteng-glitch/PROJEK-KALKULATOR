/* =========
   PROJEK-KALKULATOR - Logic Backend (JS)
   Dikerjakan oleh: Back-End Developer
   ========= */
// ---------- 1. STANDARD MODE ----------
// State kalkulator standar
let displayValue = "0";
let expression = "";
let history = []; // dipakai juga oleh History Mode
// Dipanggil setiap tombol angka/operator diklik
// Contoh HTML: <button onclick="pressKey('7')">7</button>
function pressKey(key) {
  if (displayValue === "0" && key !== ".") {
    displayValue = key;
  } else {
    displayValue += key;
  }
  updateDisplay(displayValue);
}
// Tombol Clear (C) - hapus semua
function clearDisplay() {
  displayValue = "0";
  expression = "";
  updateDisplay(displayValue);
}
// Tombol Clear Entry (CE) - hapus input terakhir
function clearEntry() {
  displayValue = displayValue.slice(0, -1) || "0";
  updateDisplay(displayValue);
}
// Tombol "=" - hitung hasil dari expression yang diketik
// Contoh HTML: <button onclick="calculate()">=</button>
function calculate() {
  try {
    // eslint-disable-next-line no-eval
    const result = eval(displayValue.replace(/×/g, "*").replace(/÷/g, "/"));
    addToHistory(displayValue, result);
    displayValue = String(result);
    updateDisplay(displayValue);
    return result;
  } catch (error) {
    updateDisplay("Error");
    displayValue = "0";
  }
}
// Fungsi operasi dasar terpisah (kalau front-end mau panggil langsung
// tanpa lewat string expression, misal dari 2 input field)
function tambah(a, b) {
  return Number(a) + Number(b);
}
function kurang(a, b) {
  return Number(a) - Number(b);
}
function kali(a, b) {
  return Number(a) * Number(b);
}
function bagi(a, b) {
  if (Number(b) === 0) return "Error: tidak bisa dibagi 0";
  return Number(a) / Number(b);
}
// Update tampilan layar - front-end tinggal isi ID elemennya
function updateDisplay(value) {
  const displayElement = document.getElementById("display");
  if (displayElement) displayElement.textContent = value;
}
// ---------- 2. CONVERTER MODE ----------
// -- Konversi Panjang --
// Semua dikonversi lewat satuan dasar: meter
const panjangKeMeter = {
  meter: 1,
  kilometer: 1000,
  centimeter: 0.01,
  milimeter: 0.001,
  inch: 0.0254,
  mile: 1609.34,
};
function konversiPanjang(nilai, dari, ke) {
  const meter = nilai * panjangKeMeter[dari];
  return meter / panjangKeMeter[ke];
}
// -- Konversi Berat --
const beratKeGram = {
  gram: 1,
  kilogram: 1000,
  miligram: 0.001,
  pon: 453.592,
  ons: 28.3495,
};
function konversiBerat(nilai, dari, ke) {
  const gram = nilai * beratKeGram[dari];
  return gram / beratKeGram[ke];
}
// -- Konversi Suhu --
// Suhu beda rumus tiap pasangan, jadi ditulis manual
function konversiSuhu(nilai, dari, ke) {
  let celsius;
  // Ubah dulu ke Celsius
  if (dari === "celsius") celsius = nilai;
  else if (dari === "fahrenheit") celsius = (nilai - 32) * (5 / 9);
  else if (dari === "kelvin") celsius = nilai - 273.15;
  // Dari Celsius ubah ke satuan tujuan
  if (ke === "celsius") return celsius;
  if (ke === "fahrenheit") return celsius * (9 / 5) + 32;
  if (ke === "kelvin") return celsius + 273.15;
}
// Contoh cara front-end manggil (dari dropdown + input):
// konversiPanjang(10, "kilometer", "mile")   -> 6.21371
// konversiSuhu(100, "celsius", "fahrenheit") -> 212
// ---------- 3. HISTORY MODE ----------
function addToHistory(soal, hasil) {
  history.push({ soal: soal, hasil: hasil, waktu: new Date() });
  renderHistory();
}
function renderHistory() {
  const historyElement = document.getElementById("history-list");
  if (!historyElement) return;
  historyElement.innerHTML = "";
  history.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.soal} = ${item.hasil}`;
    historyElement.appendChild(li);
  });
}
function clearHistory() {
  history = [];
  renderHistory();
}