const categories = [
  { name: "Uang Belanja", total: 196500, used: 0 },
  { name: "Uang Lauk", total: 72000, used: 0 },
  { name: "Uang Beras & Bumbu Masak", total: 87000, used: 0 },
  { name: "Uang Belanja Bahan Masak", total: 32000, used: 0 },
  { name: "Donasi", total: 50000, used: 0 },
];

const trackerContainer = document.getElementById("tracker");
const mutasiList = document.getElementById("mutasi-list");
const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

// Render Tracker
function renderTracker() {
  trackerContainer.innerHTML = "";
  categories.forEach((cat, index) => {
    const percent = (cat.used / cat.total) * 100;
    const div = document.createElement("div");
    div.className = "category";
    div.innerHTML = `
          <h3>${cat.name}</h3>
          <div class="progress"><div class="progress-bar" style="width:${percent}%"></div></div>
          <p>Terpakai: Rp ${cat.used.toLocaleString()} / Rp ${cat.total.toLocaleString()}</p>
          <input type="number" id="input-${index}" placeholder="Masukkan jumlah pengeluaran..." min="0">
          <input type="text" id="note-${index}" placeholder="Catatan pengeluaran...">
          <button class="add" onclick="tambahPengeluaran(${index})">Tambah Pengeluaran</button>
        `;
    trackerContainer.appendChild(div);
  });
}

// Tambah pengeluaran
function tambahPengeluaran(index) {
  const input = document.getElementById(`input-${index}`);
  const note = document.getElementById(`note-${index}`);
  const value = parseInt(input.value);
  const catNote = note.value.trim();

  if (!value || value <= 0) return alert("Masukkan jumlah yang valid!");
  if (!catNote) return alert("Tambahkan catatan pengeluaran!");

  const cat = categories[index];
  if (cat.used + value > cat.total) return alert("Melebihi batas anggaran!");

  cat.used += value;
  mutasiList.innerHTML += `<li>-${cat.name}: Rp ${value.toLocaleString()} <br><small><i>${catNote}</i></small></li>`;

  renderTracker();
  updateChart();

  input.value = "";
  note.value = "";
}

// Navigasi antar halaman
navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    pages.forEach((p) => p.classList.remove("active"));
    document.getElementById(btn.dataset.target).classList.add("active");
  });
});

// Inisialisasi Chart
const ctx = document.getElementById("chart").getContext("2d");
const chart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: categories.map((c) => c.name),
    datasets: [
      {
        data: categories.map((c) => c.used || c.total),
        backgroundColor: ["#4f46e5", "#22c55e", "#f97316", "#14b8a6", "#eab308"],
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  },
});

function updateChart() {
  chart.data.datasets[0].data = categories.map((c) => (c.used / c.total) * 100);
  chart.update();
}

renderTracker();
