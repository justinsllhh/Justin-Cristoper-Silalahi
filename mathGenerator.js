/**
 * mathGenerator.js - Generator Soal & Sistem 20 Level untuk Math Bird
 * Menangani 5 Babak Dunia (+, -, ×, ÷, Campuran) dengan progres angka terstruktur
 */

const LEVEL_DEFINITIONS = [
    // --- BABAK 1: HUTAN PENJUMLAHAN (+) ---
    {
        id: 1,
        world: 1,
        worldName: 'Hutan Penjumlahan',
        name: 'Penjumlahan Pemula',
        op: 'add',
        min1: 1, max1: 5,
        min2: 1, max2: 5,
        target: 4,
        speed: 2.1,
        theme: 'forest'
    },
    {
        id: 2,
        world: 1,
        worldName: 'Hutan Penjumlahan',
        name: 'Penjumlahan 1 - 10',
        op: 'add',
        min1: 2, max1: 9,
        min2: 1, max2: 9,
        target: 5,
        speed: 2.2,
        theme: 'forest'
    },
    {
        id: 3,
        world: 1,
        worldName: 'Hutan Penjumlahan',
        name: 'Penjumlahan Belasan',
        op: 'add',
        min1: 5, max1: 15,
        min2: 5, max2: 15,
        target: 6,
        speed: 2.3,
        theme: 'forest'
    },
    {
        id: 4,
        world: 1,
        worldName: 'Hutan Penjumlahan',
        name: 'Penjumlahan Puluhan',
        op: 'add',
        min1: 10, max1: 40,
        min2: 10, max2: 40,
        target: 6,
        speed: 2.4,
        theme: 'forest'
    },

    // --- BABAK 2: LEMBAH PENGURANGAN (-) ---
    {
        id: 5,
        world: 2,
        worldName: 'Lembah Pengurangan',
        name: 'Pengurangan Sederhana',
        op: 'sub',
        min1: 2, max1: 6,
        min2: 1, max2: 5,
        target: 5,
        speed: 2.2,
        theme: 'canyon'
    },
    {
        id: 6,
        world: 2,
        worldName: 'Lembah Pengurangan',
        name: 'Pengurangan 1 - 10',
        op: 'sub',
        min1: 5, max1: 12,
        min2: 1, max2: 9,
        target: 5,
        speed: 2.3,
        theme: 'canyon'
    },
    {
        id: 7,
        world: 2,
        worldName: 'Lembah Pengurangan',
        name: 'Pengurangan Belasan',
        op: 'sub',
        min1: 12, max1: 25,
        min2: 5, max2: 15,
        target: 6,
        speed: 2.4,
        theme: 'canyon'
    },
    {
        id: 8,
        world: 2,
        worldName: 'Lembah Pengurangan',
        name: 'Pengurangan Puluhan',
        op: 'sub',
        min1: 25, max1: 80,
        min2: 10, max2: 50,
        target: 6,
        speed: 2.5,
        theme: 'canyon'
    },

    // --- BABAK 3: GUNUNG PERKALIAN (×) ---
    {
        id: 9,
        world: 3,
        worldName: 'Gunung Perkalian',
        name: 'Perkalian 1, 2, 3',
        op: 'mul',
        min1: 1, max1: 3,
        min2: 1, max2: 9,
        target: 5,
        speed: 2.3,
        theme: 'mountain'
    },
    {
        id: 10,
        world: 3,
        worldName: 'Gunung Perkalian',
        name: 'Perkalian 4, 5, 6',
        op: 'mul',
        min1: 4, max1: 6,
        min2: 2, max2: 9,
        target: 6,
        speed: 2.4,
        theme: 'mountain'
    },
    {
        id: 11,
        world: 3,
        worldName: 'Gunung Perkalian',
        name: 'Perkalian 7, 8, 9',
        op: 'mul',
        min1: 7, max1: 9,
        min2: 3, max2: 9,
        target: 6,
        speed: 2.5,
        theme: 'mountain'
    },
    {
        id: 12,
        world: 3,
        worldName: 'Gunung Perkalian',
        name: 'Master Tabel Perkalian',
        op: 'mul',
        min1: 2, max1: 10,
        min2: 2, max2: 10,
        target: 7,
        speed: 2.6,
        theme: 'mountain'
    },

    // --- BABAK 4: SAMUDRA PEMBAGIAN (÷) ---
    {
        id: 13,
        world: 4,
        worldName: 'Samudra Pembagian',
        name: 'Pembagian Sederhana',
        op: 'div',
        min1: 1, max1: 5,  // multiplier
        min2: 1, max2: 4,  // divisor
        target: 5,
        speed: 2.3,
        theme: 'ocean'
    },
    {
        id: 14,
        world: 4,
        worldName: 'Samudra Pembagian',
        name: 'Pembagian 1 - 10',
        op: 'div',
        min1: 2, max1: 9,
        min2: 2, max2: 6,
        target: 6,
        speed: 2.4,
        theme: 'ocean'
    },
    {
        id: 15,
        world: 4,
        worldName: 'Samudra Pembagian',
        name: 'Pembagian Menengah',
        op: 'div',
        min1: 3, max1: 10,
        min2: 3, max2: 9,
        target: 6,
        speed: 2.5,
        theme: 'ocean'
    },
    {
        id: 16,
        world: 4,
        worldName: 'Samudra Pembagian',
        name: 'Master Pembagian',
        op: 'div',
        min1: 4, max1: 12,
        min2: 3, max2: 10,
        target: 7,
        speed: 2.6,
        theme: 'ocean'
    },

    // --- BABAK 5: KUIL MASTER MATEMATIKA (CAMPURAN) ---
    {
        id: 17,
        world: 5,
        worldName: 'Kuil Master',
        name: 'Kombinasi Tambah & Kurang',
        op: 'mix_add_sub',
        target: 6,
        speed: 2.5,
        theme: 'temple'
    },
    {
        id: 18,
        world: 5,
        worldName: 'Kuil Master',
        name: 'Kombinasi Kali & Bagi',
        op: 'mix_mul_div',
        target: 6,
        speed: 2.6,
        theme: 'temple'
    },
    {
        id: 19,
        world: 5,
        worldName: 'Kuil Master',
        name: 'Tantangan 4 Operasi',
        op: 'mixed',
        target: 8,
        speed: 2.7,
        theme: 'temple'
    },
    {
        id: 20,
        world: 5,
        worldName: 'Kuil Master',
        name: '👑 BOSS MASTER BERHITUNG',
        op: 'mixed',
        target: 10,
        speed: 2.8,
        theme: 'temple'
    }
];

class MathGenerator {
    constructor() {
        this.currentProblem = null;
        this.levelDefs = LEVEL_DEFINITIONS;
    }

    getLevel(levelId) {
        return this.levelDefs.find(l => l.id === levelId) || this.levelDefs[0];
    }

    /**
     * Generate soal matematika berdasarkan Level ID
     */
    generateForLevel(levelId, optionCount = 2) {
        const lvl = this.getLevel(levelId);
        let op = lvl.op;

        if (op === 'mix_add_sub') {
            op = Math.random() < 0.5 ? 'add' : 'sub';
        } else if (op === 'mix_mul_div') {
            op = Math.random() < 0.5 ? 'mul' : 'div';
        } else if (op === 'mixed') {
            const ops = ['add', 'sub', 'mul', 'div'];
            op = ops[Math.floor(Math.random() * ops.length)];
        }

        let num1, num2, symbol, answer;

        switch (op) {
            case 'add':
                symbol = '+';
                num1 = this.randomInt(lvl.min1 || 3, lvl.max1 || 20);
                num2 = this.randomInt(lvl.min2 || 2, lvl.max2 || 20);
                answer = num1 + num2;
                break;

            case 'sub':
                symbol = '-';
                const nA = this.randomInt(lvl.min1 || 5, lvl.max1 || 25);
                const nB = this.randomInt(lvl.min2 || 1, lvl.max2 || 15);
                num1 = Math.max(nA, nB);
                num2 = Math.min(nA, nB);
                answer = num1 - num2;
                break;

            case 'mul':
                symbol = '×';
                num1 = this.randomInt(lvl.min1 || 2, lvl.max1 || 9);
                num2 = this.randomInt(lvl.min2 || 2, lvl.max2 || 9);
                answer = num1 * num2;
                break;

            case 'div':
                symbol = '÷';
                const quotient = this.randomInt(lvl.min1 || 2, lvl.max1 || 8);
                const divisor = this.randomInt(lvl.min2 || 2, lvl.max2 || 8);
                num1 = quotient * divisor;
                num2 = divisor;
                answer = quotient;
                break;

            default:
                symbol = '+';
                num1 = 3; num2 = 3; answer = 6;
        }

        const questionText = `${num1} ${symbol} ${num2}`;
        const options = this.generateOptions(answer, optionCount, op, num1, num2);

        this.currentProblem = {
            num1,
            num2,
            symbol,
            operation: op,
            questionText,
            answer,
            options,
            correctIndex: options.indexOf(answer)
        };

        return this.currentProblem;
    }

    /**
     * Generate soal mode bebas / endless
     */
    generateProblem(operation = 'add', difficulty = 'easy', optionCount = 2) {
        let op = operation;
        if (op === 'mixed') {
            const ops = ['add', 'sub', 'mul', 'div'];
            op = ops[Math.floor(Math.random() * ops.length)];
        }

        let num1, num2, symbol, answer;

        switch (op) {
            case 'add':
                symbol = '+';
                if (difficulty === 'easy') {
                    num1 = this.randomInt(1, 9);
                    num2 = this.randomInt(1, 9);
                } else if (difficulty === 'medium') {
                    num1 = this.randomInt(5, 25);
                    num2 = this.randomInt(5, 25);
                } else {
                    num1 = this.randomInt(15, 60);
                    num2 = this.randomInt(15, 60);
                }
                answer = num1 + num2;
                break;

            case 'sub':
                symbol = '-';
                if (difficulty === 'easy') {
                    num1 = this.randomInt(2, 10);
                    num2 = this.randomInt(1, num1);
                } else if (difficulty === 'medium') {
                    num1 = this.randomInt(10, 40);
                    num2 = this.randomInt(1, num1);
                } else {
                    num1 = this.randomInt(25, 99);
                    num2 = this.randomInt(10, num1);
                }
                answer = num1 - num2;
                break;

            case 'mul':
                symbol = '×';
                if (difficulty === 'easy') {
                    num1 = this.randomInt(1, 5);
                    num2 = this.randomInt(1, 5);
                } else if (difficulty === 'medium') {
                    num1 = this.randomInt(2, 9);
                    num2 = this.randomInt(2, 9);
                } else {
                    num1 = this.randomInt(3, 12);
                    num2 = this.randomInt(3, 12);
                }
                answer = num1 * num2;
                break;

            case 'div':
                symbol = '÷';
                if (difficulty === 'easy') {
                    num2 = this.randomInt(1, 5);
                    answer = this.randomInt(1, 5);
                    num1 = num2 * answer;
                } else if (difficulty === 'medium') {
                    num2 = this.randomInt(2, 9);
                    answer = this.randomInt(2, 9);
                    num1 = num2 * answer;
                } else {
                    num2 = this.randomInt(3, 12);
                    answer = this.randomInt(3, 12);
                    num1 = num2 * answer;
                }
                break;

            default:
                symbol = '+';
                num1 = 2; num2 = 2; answer = 4;
        }

        const questionText = `${num1} ${symbol} ${num2}`;
        const options = this.generateOptions(answer, optionCount, op, num1, num2);

        this.currentProblem = {
            num1,
            num2,
            symbol,
            operation: op,
            questionText,
            answer,
            options,
            correctIndex: options.indexOf(answer)
        };

        return this.currentProblem;
    }

    /**
     * Membuat opsi pilihan jawaban cerdas (distraktor)
     */
    generateOptions(correctAnswer, count, operation, num1, num2) {
        const optionsSet = new Set([correctAnswer]);
        const candidates = [];

        // Distraktor operasi umum
        if (operation === 'add') {
            candidates.push(Math.abs(num1 - num2));
            candidates.push(num1 * num2);
        } else if (operation === 'sub') {
            candidates.push(num1 + num2);
        } else if (operation === 'mul') {
            candidates.push(num1 + num2);
            candidates.push(correctAnswer + num1);
            candidates.push(correctAnswer - num1);
        } else if (operation === 'div') {
            candidates.push(num1 - num2);
            candidates.push(correctAnswer + 1);
            candidates.push(correctAnswer - 1);
        }

        // Distraktor dekat (±1, ±2, ±3, ±5, ±10)
        const offsets = [-3, -2, -1, 1, 2, 3, 5, 10, -5];
        offsets.sort(() => Math.random() - 0.5);

        for (const offset of offsets) {
            const fake = correctAnswer + offset;
            if (fake >= 0) candidates.push(fake);
        }

        for (const cand of candidates) {
            if (optionsSet.size >= count) break;
            if (cand !== correctAnswer && cand >= 0) {
                optionsSet.add(cand);
            }
        }

        while (optionsSet.size < count) {
            const delta = this.randomInt(1, 5) * (Math.random() < 0.5 ? 1 : -1);
            const val = Math.max(0, correctAnswer + delta);
            optionsSet.add(val);
        }

        const options = Array.from(optionsSet);
        options.sort(() => Math.random() - 0.5);
        return options;
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

if (typeof window !== 'undefined') {
    window.MathGenerator = MathGenerator;
    window.LEVEL_DEFINITIONS = LEVEL_DEFINITIONS;
}
