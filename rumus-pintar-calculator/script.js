/**
 * RumusPintar Calculator - Comprehensive Math & Physics Engine
 */

// 1. Database Rumus Matematika & Fisika
const FORMULA_DATABASE = [
  // MATEMATIKA
  {
    id: 'circle',
    cat: 'math',
    subcat: 'Matematika - Geometri Datar',
    name: 'Luas & Keliling Lingkaran',
    formula: 'L = π × r², K = 2 × π × r',
    desc: 'Menghitung luas permukaan dan keliling lingkaran berdasarkan panjang jari-jari (r).',
    vars: [
      { key: 'r', label: 'Jari-jari lingkaran (r)', default: 7, unit: 'cm' }
    ],
    calculate: (v) => {
      const r = parseFloat(v.r);
      const luas = Math.PI * r * r;
      const kel = 2 * Math.PI * r;
      return {
        steps: [
          `Diketahui: Jari-jari (r) = ${r} cm, nilai π ≈ 3.14159 atau 22/7`,
          `1. Rumus Luas Lingkaran: L = π × r²`,
          `   Substitusi: L = 3.14159 × (${r})²`,
          `   L = 3.14159 × ${r * r} = ${luas.toFixed(2)} cm²`,
          `2. Rumus Keliling Lingkaran: K = 2 × π × r`,
          `   Substitusi: K = 2 × 3.14159 × ${r}`,
          `   K = ${kel.toFixed(2)} cm`
        ],
        result: `Luas = ${luas.toFixed(2)} cm² | Keliling = ${kel.toFixed(2)} cm`,
        draw: (ctx, w, h) => {
          ctx.clearRect(0, 0, w, h);
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(w / 2, h / 2, Math.min(r * 4, 75), 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
          ctx.fill();
          // Radius line
          ctx.strokeStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(w / 2, h / 2);
          ctx.lineTo(w / 2 + Math.min(r * 4, 75), h / 2);
          ctx.stroke();
          ctx.fillStyle = '#fff';
          ctx.font = '12px Outfit';
          ctx.fillText(`r = ${r} cm`, w / 2 + 15, h / 2 - 8);
        }
      };
    }
  },
  {
    id: 'pythagoras',
    cat: 'math',
    subcat: 'Matematika - Trigonometri',
    name: 'Teorema Pythagoras Segitiga Siku-Siku',
    formula: 'c = √(a² + b²), a = √(c² - b²)',
    desc: 'Menghitung panjang sisi miring (hipotenusa) atau sisi tegak pada segitiga siku-siku.',
    vars: [
      { key: 'a', label: 'Sisi alas mendatar (a)', default: 3, unit: 'cm' },
      { key: 'b', label: 'Sisi tegak vertikal (b)', default: 4, unit: 'cm' }
    ],
    calculate: (v) => {
      const a = parseFloat(v.a);
      const b = parseFloat(v.b);
      const c = Math.sqrt(a * a + b * b);
      return {
        steps: [
          `Diketahui: Sisi alas a = ${a} cm, Sisi tegak b = ${b} cm`,
          `Rumus Pythagoras: c = √(a² + b²)`,
          `Substitusi nilai: c = √(${a}² + ${b}²)`,
          `c = √(${a * a} + ${b * b})`,
          `c = √(${a * a + b * b}) = ${c.toFixed(2)} cm`
        ],
        result: `Panjang Hipotenusa (c) = ${c.toFixed(2)} cm`,
        draw: (ctx, w, h) => {
          ctx.clearRect(0, 0, w, h);
          ctx.strokeStyle = '#8b5cf6';
          ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          const startX = 60, startY = h - 40;
          ctx.moveTo(startX, startY);
          ctx.lineTo(startX + 120, startY);
          ctx.lineTo(startX, startY - 100);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#fff';
          ctx.font = '12px Outfit';
          ctx.fillText(`a = ${a}`, startX + 50, startY + 18);
          ctx.fillText(`b = ${b}`, startX - 30, startY - 50);
          ctx.fillText(`c = ${c.toFixed(1)}`, startX + 65, startY - 55);
        }
      };
    }
  },
  {
    id: 'cylinder',
    cat: 'math',
    subcat: 'Matematika - Geometri Ruang 3D',
    name: 'Volume & Luas Permukaan Tabung',
    formula: 'V = π × r² × t, Lp = 2πr(r + t)',
    desc: 'Menghitung kapasitas isi volume dan luas selimut silinder/tabung.',
    vars: [
      { key: 'r', label: 'Jari-jari alas (r)', default: 7, unit: 'cm' },
      { key: 't', label: 'Tinggi tabung (t)', default: 10, unit: 'cm' }
    ],
    calculate: (v) => {
      const r = parseFloat(v.r);
      const t = parseFloat(v.t);
      const vol = Math.PI * r * r * t;
      const lp = 2 * Math.PI * r * (r + t);
      return {
        steps: [
          `Diketahui: r = ${r} cm, t = ${t} cm`,
          `1. Volume Tabung: V = π × r² × t`,
          `   V = 3.14159 × (${r})² × ${t} = ${vol.toFixed(2)} cm³ (mL)`,
          `2. Luas Permukaan: Lp = 2 × π × r × (r + t)`,
          `   Lp = 2 × 3.14159 × ${r} × (${r} + ${t}) = ${lp.toFixed(2)} cm²`
        ],
        result: `Volume = ${vol.toFixed(2)} cm³ | Luas Permukaan = ${lp.toFixed(2)} cm²`,
        draw: (ctx, w, h) => {
          ctx.clearRect(0, 0, w, h);
          ctx.strokeStyle = '#10b981';
          ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
          ctx.lineWidth = 2;
          // Body
          ctx.strokeRect(w / 2 - 40, 50, 80, 100);
          ctx.fillRect(w / 2 - 40, 50, 80, 100);
          // Top ellipse
          ctx.beginPath();
          ctx.ellipse(w / 2, 50, 40, 15, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Bottom ellipse
          ctx.beginPath();
          ctx.ellipse(w / 2, 150, 40, 15, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#fff';
          ctx.fillText(`r = ${r}`, w / 2 - 10, 45);
          ctx.fillText(`t = ${t}`, w / 2 + 48, 105);
        }
      };
    }
  },
  {
    id: 'quadratic',
    cat: 'math',
    subcat: 'Matematika - Aljabar',
    name: 'Persamaan Kuadrat & Rumus ABC',
    formula: 'x = (-b ± √(b² - 4ac)) / (2a)',
    desc: 'Mencari akar-akar penyelesaian persamaan kuadrat ax² + bx + c = 0.',
    vars: [
      { key: 'a', label: 'Koefisien a (x²)', default: 1, unit: '' },
      { key: 'b', label: 'Koefisien b (x)', default: -5, unit: '' },
      { key: 'c', label: 'Konstanta c', default: 6, unit: '' }
    ],
    calculate: (v) => {
      const a = parseFloat(v.a);
      const b = parseFloat(v.b);
      const c = parseFloat(v.c);
      const D = b * b - 4 * a * c;
      let resText = '';
      const steps = [
        `Bentuk Persamaan: (${a})x² + (${b})x + (${c}) = 0`,
        `1. Hitung Diskriminan: D = b² - 4ac`,
        `   D = (${b})² - 4(${a})(${c}) = ${b * b} - ${4 * a * c} = ${D}`
      ];

      if (D > 0) {
        const x1 = (-b + Math.sqrt(D)) / (2 * a);
        const x2 = (-b - Math.sqrt(D)) / (2 * a);
        steps.push(`   Karena D > 0, memiliki 2 akar riil berbeda:`);
        steps.push(`   x₁ = (-(${b}) + √${D}) / (2 × ${a}) = ${x1.toFixed(2)}`);
        steps.push(`   x₂ = (-(${b}) - √${D}) / (2 × ${a}) = ${x2.toFixed(2)}`);
        resText = `Akar x₁ = ${x1.toFixed(2)}, x₂ = ${x2.toFixed(2)} (D = ${D})`;
      } else if (D === 0) {
        const x = -b / (2 * a);
        steps.push(`   Karena D = 0, memiliki 1 akar kembar: x = ${x.toFixed(2)}`);
        resText = `Akar Kembar x = ${x.toFixed(2)} (D = 0)`;
      } else {
        steps.push(`   Karena D < 0, persamaan tidak memiliki akar riil (akar imajiner).`);
        resText = `Tidak ada akar riil (D = ${D} < 0)`;
      }

      return {
        steps,
        result: resText,
        draw: (ctx, w, h) => {
          ctx.clearRect(0, 0, w, h);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          // Draw parabolic curve
          for (let px = 0; px <= w; px += 2) {
            const graphX = (px - w / 2) / 20;
            const graphY = a * graphX * graphX + b * graphX + c;
            const py = h / 2 - graphY * 10;
            if (px === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
          // Axes
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
          ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
          ctx.stroke();
        }
      };
    }
  },

  // FISIKA
  {
    id: 'glbb',
    cat: 'physics',
    subcat: 'Fisika - Kinematika Gerak',
    name: 'Gerak Lurus Berubah Beraturan (GLBB)',
    formula: 'vt = v₀ + a × t, s = v₀ × t + ½ × a × t²',
    desc: 'Menghitung kecepatan akhir dan jarak tempuh benda yang mengalami percepatan konstan.',
    vars: [
      { key: 'v0', label: 'Kecepatan Awal v₀', default: 0, unit: 'm/s' },
      { key: 'a', label: 'Percepatan (a)', default: 2, unit: 'm/s²' },
      { key: 't', label: 'Waktu Tempuh (t)', default: 5, unit: 'detik' }
    ],
    calculate: (v) => {
      const v0 = parseFloat(v.v0);
      const a = parseFloat(v.a);
      const t = parseFloat(v.t);
      const vt = v0 + a * t;
      const s = v0 * t + 0.5 * a * t * t;
      return {
        steps: [
          `Diketahui: Kecepatan awal v₀ = ${v0} m/s, Percepatan a = ${a} m/s², Waktu t = ${t} s`,
          `1. Kecepatan Akhir: vt = v₀ + (a × t)`,
          `   vt = ${v0} + (${a} × ${t}) = ${vt.toFixed(2)} m/s (${(vt * 3.6).toFixed(1)} km/jam)`,
          `2. Jarak Tempuh: s = (v₀ × t) + (½ × a × t²)`,
          `   s = (${v0} × ${t}) + (0.5 × ${a} × ${t}²)`,
          `   s = 0 + (0.5 × ${a} × ${t * t}) = ${s.toFixed(2)} meter`
        ],
        result: `Kecepatan Akhir (vt) = ${vt.toFixed(2)} m/s | Jarak (s) = ${s.toFixed(2)} m`,
        draw: (ctx, w, h) => {
          ctx.clearRect(0, 0, w, h);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          // Road
          ctx.strokeStyle = '#475569';
          ctx.beginPath();
          ctx.moveTo(20, h - 50); ctx.lineTo(w - 20, h - 50);
          ctx.stroke();
          // Moving object
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(50, h - 80, 50, 30);
          ctx.fillStyle = '#fff';
          ctx.fillText(`v₀=${v0}`, 55, h - 60);
          // Vector arrow
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(110, h - 65); ctx.lineTo(180, h - 65);
          ctx.lineTo(170, h - 72);
          ctx.moveTo(180, h - 65); ctx.lineTo(170, h - 58);
          ctx.stroke();
          ctx.fillText(`a = ${a} m/s²`, 120, h - 80);
        }
      };
    }
  },
  {
    id: 'newton2',
    cat: 'physics',
    subcat: 'Fisika - Dinamika Gaya',
    name: 'Hukum II Newton (Gaya & Percepatan)',
    formula: 'F = m × a, a = F / m',
    desc: 'Menghitung besarnya resultan gaya (F) atau percepatan benda bermassa m.',
    vars: [
      { key: 'm', label: 'Massa Benda (m)', default: 10, unit: 'kg' },
      { key: 'a', label: 'Percepatan (a)', default: 3, unit: 'm/s²' }
    ],
    calculate: (v) => {
      const m = parseFloat(v.m);
      const a = parseFloat(v.a);
      const F = m * a;
      return {
        steps: [
          `Diketahui: Massa m = ${m} kg, Percepatan a = ${a} m/s²`,
          `Rumus Hukum II Newton: F = m × a`,
          `Substitusi: F = ${m} kg × ${a} m/s²`,
          `Hasil Gaya: F = ${F.toFixed(2)} Newton (N)`
        ],
        result: `Gaya Total (F) = ${F.toFixed(2)} Newton (N)`,
        draw: (ctx, w, h) => {
          ctx.clearRect(0, 0, w, h);
          ctx.fillStyle = '#8b5cf6';
          ctx.fillRect(w / 2 - 35, h / 2 - 35, 70, 70);
          ctx.fillStyle = '#fff';
          ctx.fillText(`m = ${m}kg`, w / 2 - 25, h / 2 + 5);
          // Force arrow
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(w / 2 - 90, h / 2);
          ctx.lineTo(w / 2 - 40, h / 2);
          ctx.lineTo(w / 2 - 50, h / 2 - 8);
          ctx.moveTo(w / 2 - 40, h / 2);
          ctx.lineTo(w / 2 - 50, h / 2 + 8);
          ctx.stroke();
          ctx.fillText(`F = ${F}N`, w / 2 - 90, h / 2 - 12);
        }
      };
    }
  },
  {
    id: 'energy',
    cat: 'physics',
    subcat: 'Fisika - Usaha & Energi',
    name: 'Energi Kinetik & Energi Potensial',
    formula: 'Ek = ½ × m × v², Ep = m × g × h',
    desc: 'Menghitung energi gerak (kinetik) dan energi posisi gravitasi benda.',
    vars: [
      { key: 'm', label: 'Massa Benda (m)', default: 2, unit: 'kg' },
      { key: 'v', label: 'Kecepatan (v)', default: 10, unit: 'm/s' },
      { key: 'h', label: 'Ketinggian (h)', default: 5, unit: 'meter' }
    ],
    calculate: (v) => {
      const m = parseFloat(v.m);
      const vel = parseFloat(v.v);
      const h = parseFloat(v.h);
      const g = 9.8;
      const Ek = 0.5 * m * vel * vel;
      const Ep = m * g * h;
      const Em = Ek + Ep;
      return {
        steps: [
          `Diketahui: Massa m = ${m} kg, Kecepatan v = ${vel} m/s, Ketinggian h = ${h} m, g = 9.8 m/s²`,
          `1. Energi Kinetik: Ek = ½ × m × v²`,
          `   Ek = 0.5 × ${m} × (${vel})² = ${Ek.toFixed(2)} Joule`,
          `2. Energi Potensial: Ep = m × g × h`,
          `   Ep = ${m} × 9.8 × ${h} = ${Ep.toFixed(2)} Joule`,
          `3. Energi Mekanik Total: Em = Ek + Ep = ${Em.toFixed(2)} Joule`
        ],
        result: `Ek = ${Ek.toFixed(2)} J | Ep = ${Ep.toFixed(2)} J | Em = ${Em.toFixed(2)} J`,
        draw: (ctx, w, hCanvas) => {
          ctx.clearRect(0, 0, w, hCanvas);
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(w / 2, 60, 25, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.fillText(`h = ${h}m`, w / 2 + 35, 65);
          ctx.fillText(`v = ${vel}m/s`, w / 2 - 20, 65);
        }
      };
    }
  },
  {
    id: 'ohm',
    cat: 'physics',
    subcat: 'Fisika - Listrik Dinamis',
    name: 'Hukum Ohm & Daya Listrik',
    formula: 'V = I × R, P = V × I',
    desc: 'Menghitung tegangan (V), arus listrik (I), hambatan (R), dan konsumsi daya listrik (P).',
    vars: [
      { key: 'I', label: 'Kuat Arus Listrik (I)', default: 2, unit: 'Ampere (A)' },
      { key: 'R', label: 'Hambatan Listrik (R)', default: 110, unit: 'Ohm (Ω)' }
    ],
    calculate: (v) => {
      const I = parseFloat(v.I);
      const R = parseFloat(v.R);
      const V = I * R;
      const P = V * I;
      return {
        steps: [
          `Diketahui: Kuat Arus I = ${I} A, Hambatan R = ${R} Ω`,
          `1. Tegangan Listrik (Beda Potensial): V = I × R`,
          `   V = ${I} A × ${R} Ω = ${V.toFixed(2)} Volt`,
          `2. Daya Listrik: P = V × I`,
          `   P = ${V.toFixed(2)} V × ${I} A = ${P.toFixed(2)} Watt`
        ],
        result: `Tegangan (V) = ${V.toFixed(2)} Volt | Daya (P) = ${P.toFixed(2)} Watt`,
        draw: (ctx, w, h) => {
          ctx.clearRect(0, 0, w, h);
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3;
          // Simple circuit loop
          ctx.strokeRect(40, 40, w - 80, h - 80);
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(w / 2 - 30, 30, 60, 20);
          ctx.strokeStyle = '#06b6d4';
          ctx.strokeRect(w / 2 - 30, 30, 60, 20);
          ctx.fillStyle = '#fff';
          ctx.fillText(`R = ${R}Ω`, w / 2 - 20, 45);
          ctx.fillText(`I = ${I}A ➔`, 60, h / 2);
          ctx.fillText(`V = ${V}V`, w / 2 - 15, h - 25);
        }
      };
    }
  }
];

// 2. Unit Converter Data
const UNITS_DATA = {
  length: {
    base: 'm',
    rates: { 'm': 1, 'km': 1000, 'cm': 0.01, 'mm': 0.001, 'mil': 1609.34, 'kaki': 0.3048 }
  },
  mass: {
    base: 'kg',
    rates: { 'kg': 1, 'gram': 0.001, 'mg': 0.000001, 'ton': 1000, 'pon': 0.453592 }
  },
  speed: {
    base: 'm/s',
    rates: { 'm/s': 1, 'km/jam': 0.277778, 'knot': 0.514444, 'mil/jam (mph)': 0.44704 }
  },
  data: {
    base: 'byte',
    rates: { 'Byte': 1, 'KB (Kilobyte)': 1024, 'MB (Megabyte)': 1048576, 'GB (Gigabyte)': 1073741824, 'TB (Terabyte)': 1099511627776 }
  }
};

// 3. RumusPintar App Controller
class RumusPintarApp {
  constructor() {
    this.currentFormula = FORMULA_DATABASE[0];
    this.savedCheatSheet = JSON.parse(localStorage.getItem('rp_cheatsheet')) || ['circle', 'pythagoras', 'glbb'];
    this.activeConvType = 'length';

    this.initDOM();
    this.renderFormulaList();
    this.loadFormula(this.currentFormula);
    this.initConverter();
    this.renderCheatSheet();
  }

  initDOM() {
    // Nav tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(`tab-${btn.dataset.tab}`);
        if (target) target.classList.add('active');
      });
    });

    // Search filter
    document.getElementById('formula-search').addEventListener('input', (e) => {
      this.filterFormulas(e.target.value);
    });

    // Category filter pills
    document.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.renderFormulaList(pill.dataset.cat);
      });
    });

    // Calculate Button
    document.getElementById('btn-calculate').addEventListener('click', () => this.calculateCurrent());

    // Bookmark button
    document.getElementById('btn-bookmark-formula').addEventListener('click', () => this.toggleBookmarkCurrent());

    // Print button
    document.getElementById('btn-print-sheet').addEventListener('click', () => window.print());
  }

  renderFormulaList(catFilter = 'all', query = '') {
    const list = document.getElementById('formula-list');
    list.innerHTML = '';

    const filtered = FORMULA_DATABASE.filter(f => {
      const matchCat = catFilter === 'all' || f.cat === catFilter;
      const matchQ = !query || f.name.toLowerCase().includes(query.toLowerCase()) || f.formula.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    });

    if (filtered.length === 0) {
      list.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem; padding: 10px;">Tidak ada rumus yang cocok.</div>';
      return;
    }

    filtered.forEach(f => {
      const card = document.createElement('div');
      card.className = `formula-card-item ${this.currentFormula.id === f.id ? 'active' : ''}`;
      card.innerHTML = `
        <div class="f-tag">${f.subcat}</div>
        <div class="f-title">${f.name}</div>
        <div class="f-math">${f.formula}</div>
      `;
      card.addEventListener('click', () => {
        document.querySelectorAll('.formula-card-item').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.loadFormula(f);
      });
      list.appendChild(card);
    });
  }

  filterFormulas(query) {
    const activeCat = document.querySelector('.cat-pill.active').dataset.cat;
    this.renderFormulaList(activeCat, query);
  }

  loadFormula(f) {
    this.currentFormula = f;
    document.getElementById('formula-category').textContent = f.subcat;
    document.getElementById('formula-name').textContent = f.name;
    document.getElementById('formula-display').textContent = f.formula;

    const form = document.getElementById('formula-inputs-form');
    form.innerHTML = '';

    f.vars.forEach(v => {
      const group = document.createElement('div');
      group.className = 'var-input-group';
      group.innerHTML = `
        <label for="var-${v.key}">${v.label} ${v.unit ? `(${v.unit})` : ''}</label>
        <input type="number" step="any" id="var-${v.key}" data-key="${v.key}" value="${v.default}" />
      `;
      form.appendChild(group);
    });

    this.updateBookmarkButton();
    this.calculateCurrent();
  }

  calculateCurrent() {
    const inputs = {};
    this.currentFormula.vars.forEach(v => {
      const el = document.getElementById(`var-${v.key}`);
      inputs[v.key] = el ? parseFloat(el.value) || 0 : 0;
    });

    const res = this.currentFormula.calculate(inputs);
    const box = document.getElementById('solution-content');

    box.innerHTML = res.steps.map(s => `<div class="math-step-line">${s}</div>`).join('') +
      `<div class="math-result-highlight">🏁 Hasil Akhir: ${res.result}</div>`;

    // Draw visual
    const canvas = document.getElementById('visual-canvas');
    const ctx = canvas.getContext('2d');
    res.draw(ctx, canvas.width, canvas.height);
  }

  toggleBookmarkCurrent() {
    const id = this.currentFormula.id;
    if (this.savedCheatSheet.includes(id)) {
      this.savedCheatSheet = this.savedCheatSheet.filter(x => x !== id);
    } else {
      this.savedCheatSheet.push(id);
    }
    localStorage.setItem('rp_cheatsheet', JSON.stringify(this.savedCheatSheet));
    this.updateBookmarkButton();
    this.renderCheatSheet();
  }

  updateBookmarkButton() {
    const btn = document.getElementById('btn-bookmark-formula');
    const isSaved = this.savedCheatSheet.includes(this.currentFormula.id);
    btn.textContent = isSaved ? '⭐ Tersimpan di Contekan' : '☆ Simpan ke Contekan';
    btn.style.background = isSaved ? 'var(--accent-amber)' : 'var(--bg-elevated)';
    btn.style.color = isSaved ? '#000' : 'var(--text-main)';
  }

  renderCheatSheet() {
    const grid = document.getElementById('cheatsheet-grid');
    grid.innerHTML = '';

    const list = FORMULA_DATABASE.filter(f => this.savedCheatSheet.includes(f.id));
    if (list.length === 0) {
      grid.innerHTML = '<div style="color: var(--text-muted);">Belum ada rumus yang disimpan. Klik ikon bintang pada pemecah rumus untuk menyusun contekan belajarmu!</div>';
      return;
    }

    list.forEach(f => {
      const card = document.createElement('div');
      card.className = 'cs-card';
      card.innerHTML = `
        <div class="cs-head">
          <span class="cs-tag">${f.subcat}</span>
          <button style="background:none; border:none; color:var(--accent-rose); cursor:pointer;" title="Hapus">&times;</button>
        </div>
        <div class="cs-title">${f.name}</div>
        <div class="cs-formula">${f.formula}</div>
        <div class="cs-desc">${f.desc}</div>
      `;
      card.querySelector('button').addEventListener('click', () => {
        this.savedCheatSheet = this.savedCheatSheet.filter(x => x !== f.id);
        localStorage.setItem('rp_cheatsheet', JSON.stringify(this.savedCheatSheet));
        this.updateBookmarkButton();
        this.renderCheatSheet();
      });
      grid.appendChild(card);
    });
  }

  // Unit Converter Logic
  initConverter() {
    document.querySelectorAll('.conv-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.conv-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeConvType = tab.dataset.type;
        this.populateConverterUnits();
      });
    });

    document.getElementById('conv-from-val').addEventListener('input', () => this.runConversion());
    document.getElementById('conv-from-unit').addEventListener('change', () => this.runConversion());
    document.getElementById('conv-to-unit').addEventListener('change', () => this.runConversion());

    this.populateConverterUnits();
  }

  populateConverterUnits() {
    const fromSel = document.getElementById('conv-from-unit');
    const toSel = document.getElementById('conv-to-unit');
    fromSel.innerHTML = '';
    toSel.innerHTML = '';

    if (this.activeConvType === 'temp') {
      const temps = ['Celsius (°C)', 'Fahrenheit (°F)', 'Kelvin (K)', 'Reamur (°R)'];
      temps.forEach((t, idx) => {
        fromSel.add(new Option(t, t));
        toSel.add(new Option(t, t));
      });
      toSel.selectedIndex = 1;
    } else {
      const data = UNITS_DATA[this.activeConvType];
      const keys = Object.keys(data.rates);
      keys.forEach((k, idx) => {
        fromSel.add(new Option(k, k));
        toSel.add(new Option(k, k));
      });
      toSel.selectedIndex = 1;
    }
    this.runConversion();
  }

  runConversion() {
    const val = parseFloat(document.getElementById('conv-from-val').value) || 0;
    const from = document.getElementById('conv-from-unit').value;
    const to = document.getElementById('conv-to-unit').value;
    const outInput = document.getElementById('conv-to-val');
    const infoText = document.getElementById('conv-info-text');

    let result = 0;

    if (this.activeConvType === 'temp') {
      // Temperature conversion logic
      let inC = val;
      if (from.includes('Fahrenheit')) inC = (val - 32) * 5 / 9;
      else if (from.includes('Kelvin')) inC = val - 273.15;
      else if (from.includes('Reamur')) inC = val * 5 / 4;

      if (to.includes('Celsius')) result = inC;
      else if (to.includes('Fahrenheit')) result = (inC * 9 / 5) + 32;
      else if (to.includes('Kelvin')) result = inC + 273.15;
      else if (to.includes('Reamur')) result = inC * 4 / 5;

    } else {
      const data = UNITS_DATA[this.activeConvType];
      const baseVal = val * data.rates[from];
      result = baseVal / data.rates[to];
    }

    outInput.value = result.toLocaleString('id-ID', { maximumFractionDigits: 4 });
    infoText.textContent = `${val} ${from} = ${result.toLocaleString('id-ID', { maximumFractionDigits: 4 })} ${to}`;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.rumusApp = new RumusPintarApp();
});
