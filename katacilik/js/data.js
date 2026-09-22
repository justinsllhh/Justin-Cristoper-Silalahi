// Bank Data Soal, Kosakata, Suku Kata, Teka-Teki, dan Stiker Koleksi KataCilik

const WORLDS = [
    {
        id: "world-animals",
        name: "Hutan Satwa Rimba",
        desc: "Kenali beragam binatang sahabat kita di alam bebas!",
        icon: "🦁",
        bgColor: "linear-gradient(135deg, #10B981, #059669)",
        themeClass: "theme-green",
        stickers: [
            { id: "stk_lion", name: "Singa Perkasa", emoji: "🦁", fact: "Singa dijuluki raja hutan!" },
            { id: "stk_rabbit", name: "Kelinci Lincah", emoji: "🐰", fact: "Kelinci suka makan wortel dan melompat." },
            { id: "stk_elephant", name: "Gajah Baik Hati", emoji: "🐘", fact: "Gajah punya belalai yang serbaguna!" },
            { id: "stk_dolphin", name: "Lumba-Lumba Cerdas", emoji: "🐬", fact: "Lumba-lumba bernapas dengan paru-paru." }
        ]
    },
    {
        id: "world-fruits",
        name: "Kebun Buah & Makanan Sehat",
        desc: "Belajar nama-nama buah manis dan makanan bergizi!",
        icon: "🍎",
        bgColor: "linear-gradient(135deg, #F59E0B, #D97706)",
        themeClass: "theme-orange",
        stickers: [
            { id: "stk_apple", name: "Apel Renyah", emoji: "🍎", fact: "Apel kaya vitamin C dan serat sehat." },
            { id: "stk_banana", name: "Pisang Manis", emoji: "🍌", fact: "Pisang banyak mengandung kalium untuk energi." },
            { id: "stk_watermelon", name: "Semangka Segar", emoji: "🍉", fact: "Semangka mengandung 92% air menyegarkan." },
            { id: "stk_strawberry", name: "Stroberi Cantik", emoji: "🍓", fact: "Stroberi punya biji kecil di luar kulitnya!" }
        ]
    },
    {
        id: "world-city",
        name: "Kota Profesi & Kendaraan",
        desc: "Jelajahi berbagai profesi hebat dan alat transportasi seru!",
        icon: "🚀",
        bgColor: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
        themeClass: "theme-blue",
        stickers: [
            { id: "stk_doctor", name: "Dokter Penolong", emoji: "🩺", fact: "Dokter merawat dan mengobati orang yang sakit." },
            { id: "stk_pilot", name: "Pilot Hebat", emoji: "👨‍✈️", fact: "Pilot menerbangkan pesawat melintasi awan." },
            { id: "stk_rocket", name: "Roket Antariksa", emoji: "🚀", fact: "Roket meluncur cepat menembus luar angkasa!" },
            { id: "stk_train", name: "Kereta Cepat", emoji: "🚅", fact: "Kereta berjalan di atas rel besi khusus." }
        ]
    },
    {
        id: "world-nature",
        name: "Alam Semesta & Sains Cilik",
        desc: "Pelajari keajaiban bumi, cuaca, dan benda langit!",
        icon: "🌈",
        bgColor: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
        themeClass: "theme-purple",
        stickers: [
            { id: "stk_sun", name: "Matahari Bersinar", emoji: "☀️", fact: "Matahari adalah bintang terdekat dengan bumi." },
            { id: "stk_rainbow", name: "Pelangi Ajaib", emoji: "🌈", fact: "Pelangi terbentuk dari pembiasan cahaya oleh tetes air hujan." },
            { id: "stk_moon", name: "Bulan Sabit", emoji: "🌙", fact: "Bulan memantulkan cahaya indah dari matahari di malam hari." },
            { id: "stk_volcano", name: "Gunung Berapi", emoji: "🌋", fact: "Gunung berapi menyimpan magma di dalam perut bumi." }
        ]
    }
];

// Bank Soal Mode 1: Susun Huruf (Spelling Quest)
const SPELLING_QUESTIONS = [
    // World 1 - Animals
    {
        id: "spell_1",
        worldId: "world-animals",
        word: "SINGA",
        emoji: "🦁",
        hint: "Raja hutan yang memiliki surai lebat dan auman keras.",
        syllables: ["SI", "NGA"]
    },
    {
        id: "spell_2",
        worldId: "world-animals",
        word: "KELINCI",
        emoji: "🐰",
        hint: "Hewan bertelinga panjang yang suka melompat gembira.",
        syllables: ["KE", "LIN", "CI"]
    },
    {
        id: "spell_3",
        worldId: "world-animals",
        word: "GAJAH",
        emoji: "🐘",
        hint: "Hewan darat raksasa dengan belalai panjang.",
        syllables: ["GA", "JAH"]
    },
    {
        id: "spell_4",
        worldId: "world-animals",
        word: "JERAPAH",
        emoji: "🦒",
        hint: "Hewan tinggi yang memiliki leher sangat panjang.",
        syllables: ["JE", "RA", "PAH"]
    },
    {
        id: "spell_5",
        worldId: "world-animals",
        word: "LUMBA",
        emoji: "🐬",
        hint: "Mamalia laut yang sangat cerdas dan ramah pada manusia.",
        syllables: ["LUM", "BA"]
    },

    // World 2 - Fruits
    {
        id: "spell_6",
        worldId: "world-fruits",
        word: "PISANG",
        emoji: "🍌",
        hint: "Buah berwarna kuning melengkung favorit monyet.",
        syllables: ["PI", "SANG"]
    },
    {
        id: "spell_7",
        worldId: "world-fruits",
        word: "MANGGA",
        emoji: "🥭",
        hint: "Buah manis berdaging oranye dengan aroma harum.",
        syllables: ["MANG", "GA"]
    },
    {
        id: "spell_8",
        worldId: "world-fruits",
        word: "SEMANGKA",
        emoji: "🍉",
        hint: "Buah besar berbiji dengan daging merah yang sangat berair.",
        syllables: ["SE", "MANG", "KA"]
    },
    {
        id: "spell_9",
        worldId: "world-fruits",
        word: "ANGGUR",
        emoji: "🍇",
        hint: "Buah bulat kecil bergerombol manis berwarna ungu/hijau.",
        syllables: ["ANG", "GUR"]
    },
    {
        id: "spell_10",
        worldId: "world-fruits",
        word: "ALPUKAT",
        emoji: "🥑",
        hint: "Buah berdaging lembut dengan biji bulat besar di tengah.",
        syllables: ["AL", "PU", "KAT"]
    },

    // World 3 - City & Vehicles
    {
        id: "spell_11",
        worldId: "world-city",
        word: "PESAWAT",
        emoji: "✈️",
        hint: "Kendaraan bersayap yang terbang di angkasa luas.",
        syllables: ["PE", "SA", "WAT"]
    },
    {
        id: "spell_12",
        worldId: "world-city",
        word: "SEPEDA",
        emoji: "🚲",
        hint: "Kendaraan roda dua yang digowes dengan kedua kaki.",
        syllables: ["SE", "PE", "DA"]
    },
    {
        id: "spell_13",
        worldId: "world-city",
        word: "DOKTER",
        emoji: "🩺",
        hint: "Orang yang memeriksa kesehatan dan merawat orang sakit.",
        syllables: ["DOK", "TER"]
    },
    {
        id: "spell_14",
        worldId: "world-city",
        word: "GURU",
        emoji: "👩‍🏫",
        hint: "Pahlawan tanpa tanda jasa yang mengajar kita di sekolah.",
        syllables: ["GU", "RU"]
    },
    {
        id: "spell_15",
        worldId: "world-city",
        word: "KAPAL",
        emoji: "🚢",
        hint: "Kendaraan air besar yang mengarungi lautan samudra.",
        syllables: ["KA", "PAL"]
    },

    // World 4 - Nature & Science
    {
        id: "spell_16",
        worldId: "world-nature",
        word: "PELANGI",
        emoji: "🌈",
        hint: "Busur warna-warni indah di langit sehabis hujan.",
        syllables: ["PE", "LA", "NGI"]
    },
    {
        id: "spell_17",
        worldId: "world-nature",
        word: "BINTANG",
        emoji: "⭐",
        hint: "Benda langit yang berkelap-kelip indah di malam hari.",
        syllables: ["BIN", "TANG"]
    },
    {
        id: "spell_18",
        worldId: "world-nature",
        word: "GUNUNG",
        emoji: "⛰️",
        hint: "Dataran yang menjulang sangat tinggi ke langit.",
        syllables: ["GU", "NUNG"]
    },
    {
        id: "spell_19",
        worldId: "world-nature",
        word: "MATAHARI",
        emoji: "☀️",
        hint: "Pusat tata surya yang menerangi dan menghangatkan bumi.",
        syllables: ["MA", "TA", "HA", "RI"]
    },
    {
        id: "spell_20",
        worldId: "world-nature",
        word: "PLANET",
        emoji: "🪐",
        hint: "Benda luar angkasa yang mengitari matahari di orbitnya.",
        syllables: ["PLA", "NET"]
    }
];

// Bank Soal Mode 2: Sambung Suku Kata (Syllable Match)
const SYLLABLE_QUESTIONS = [
    {
        id: "syl_1",
        worldId: "world-animals",
        targetWord: "BURUNG",
        emoji: "🐦",
        parts: ["BU", "RUNG"],
        distractors: ["TU", "PIS", "LANG"]
    },
    {
        id: "syl_2",
        worldId: "world-animals",
        targetWord: "KUCING",
        emoji: "🐱",
        parts: ["KU", "CING"],
        distractors: ["PA", "LOK", "TING"]
    },
    {
        id: "syl_3",
        worldId: "world-animals",
        targetWord: "HARIMAU",
        emoji: "🐯",
        parts: ["HA", "RI", "MAU"],
        distractors: ["JA", "TI", "KAU"]
    },
    {
        id: "syl_4",
        worldId: "world-fruits",
        targetWord: "JERUK",
        emoji: "🍊",
        parts: ["JE", "RUK"],
        distractors: ["BE", "LIK", "ROK"]
    },
    {
        id: "syl_5",
        worldId: "world-fruits",
        targetWord: "KELAPA",
        emoji: "🥥",
        parts: ["KE", "LA", "PA"],
        distractors: ["TE", "MA", "DA"]
    },
    {
        id: "syl_6",
        worldId: "world-city",
        targetWord: "MOBIL",
        emoji: "🚗",
        parts: ["MO", "BIL"],
        distractors: ["NA", "PIL", "GEL"]
    },
    {
        id: "syl_7",
        worldId: "world-city",
        targetWord: "POLISI",
        emoji: "👮",
        parts: ["PO", "LI", "SI"],
        distractors: ["BA", "TI", "KU"]
    },
    {
        id: "syl_8",
        worldId: "world-nature",
        targetWord: "LAUTAN",
        emoji: "🌊",
        parts: ["LA", "U", "TAN"],
        distractors: ["MI", "A", "KAN"]
    }
];

// Bank Soal Mode 3: Tebak Gambar & Kosakata (Visual Word Quiz)
const PICTURE_QUIZ_QUESTIONS = [
    {
        id: "pic_1",
        worldId: "world-animals",
        question: "Hewan apa yang memiliki leher sangat panjang?",
        imageEmoji: "🦒",
        options: [
            { text: "Jerapah", correct: true, icon: "🦒" },
            { text: "Kambing", correct: false, icon: "🐐" },
            { text: "Kucing", correct: false, icon: "🐱" },
            { text: "Bebek", correct: false, icon: "🦆" }
        ],
        explanation: "Jerapah adalah hewan tertinggi di dunia dengan leher yang panjang!"
    },
    {
        id: "pic_2",
        worldId: "world-animals",
        question: "Hewan apa yang suka makan madu dan bisa berhibernasi?",
        imageEmoji: "🐻",
        options: [
            { text: "Beruang", correct: true, icon: "🐻" },
            { text: "Ayam", correct: false, icon: "🐔" },
            { text: "Ikan", correct: false, icon: "🐟" },
            { text: "Tupai", correct: false, icon: "🐿️" }
        ],
        explanation: "Beruang sangat gemar mencari madu lezat di pohon!"
    },
    {
        id: "pic_3",
        worldId: "world-fruits",
        question: "Buah berduri yang memiliki aroma khas dan dijuluki raja buah adalah...",
        imageEmoji: "🍈",
        options: [
            { text: "Durian", correct: true, icon: "🍈" },
            { text: "Rambutan", correct: false, icon: "🍒" },
            { text: "Apel", correct: false, icon: "🍎" },
            { text: "Pepaya", correct: false, icon: "🥭" }
        ],
        explanation: "Durian memiliki kulit berduri tajam dan daging buah yang legit!"
    },
    {
        id: "pic_4",
        worldId: "world-fruits",
        question: "Sayuran berwarna oranye yang sangat baik untuk kesehatan mata kita adalah...",
        imageEmoji: "🥕",
        options: [
            { text: "Wortel", correct: true, icon: "🥕" },
            { text: "Bayam", correct: false, icon: "🥬" },
            { text: "Kentang", correct: false, icon: "🥔" },
            { text: "Jagung", correct: false, icon: "🌽" }
        ],
        explanation: "Wortel kaya vitamin A yang membuat mata kita tetap jernih dan sehat!"
    },
    {
        id: "pic_5",
        worldId: "world-city",
        question: "Siapakah yang bertugas memadamkan api saat terjadi kebakaran?",
        imageEmoji: "🧑‍🚒",
        options: [
            { text: "Pemadam Kebakaran", correct: true, icon: "🧑‍🚒" },
            { text: "Koki Masak", correct: false, icon: "👨‍🍳" },
            { text: "Petani", correct: false, icon: "👨‍🌾" },
            { text: "Astronot", correct: false, icon: "👨‍🚀" }
        ],
        explanation: "Pemadam kebakaran adalah pahlawan pemberani yang memadamkan api!"
    },
    {
        id: "pic_6",
        worldId: "world-nature",
        question: "Benda langit apa yang memberi penerangan alami di bumi pada siang hari?",
        imageEmoji: "☀️",
        options: [
            { text: "Matahari", correct: true, icon: "☀️" },
            { text: "Bulan", correct: false, icon: "🌙" },
            { text: "Bintang", correct: false, icon: "⭐" },
            { text: "Awan", correct: false, icon: "☁️" }
        ],
        explanation: "Matahari memancarkan sinar hangat yang menopang kehidupan seluruh makhluk di bumi!"
    }
];

// Bank Soal Mode 4: Teka-Teki Detektif Kata (Word Riddles)
const RIDDLE_QUESTIONS = [
    {
        id: "rid_1",
        worldId: "world-animals",
        riddle: "Aku punya cangkang keras di punggungku. Jalanku lambat dan aku bisa hidup sangat lama. Siapakah aku?",
        answer: "KURA-KURA",
        emoji: "🐢",
        options: ["KURA-KURA", "SIPUT", "KANCIL", "BUAYA"]
    },
    {
        id: "rid_2",
        worldId: "world-animals",
        riddle: "Aku hewan yang setia dan suka menggonggong. Aku suka menjaga rumah majikanku. Siapakah aku?",
        answer: "ANJING",
        emoji: "🐕",
        options: ["ANJING", "KUCING", "KELINCI", "BURUNG"]
    },
    {
        id: "rid_3",
        worldId: "world-fruits",
        riddle: "Kulitku berduri halus seperti rambut warna merah. Dagingku putih kenyal dan manis. Siapakah aku?",
        answer: "RAMBUTAN",
        emoji: "🍒",
        options: ["RAMBUTAN", "SALAK", "MANGGIS", "NANAS"]
    },
    {
        id: "rid_4",
        worldId: "world-city",
        riddle: "Aku punya sirine meraung-raung dan lampu berkedip. Aku melaju kencang membawa orang sakit ke rumah sakit. Siapakah aku?",
        answer: "AMBULANS",
        emoji: "🚑",
        options: ["AMBULANS", "TAKSI", "TRUK", "BECAK"]
    },
    {
        id: "rid_5",
        worldId: "world-nature",
        riddle: "Aku turun rintik-rintik dari langit awan kelabu. Aku menyirami tanaman dan menyegarkan bumi. Siapakah aku?",
        answer: "HUJAN",
        emoji: "🌧️",
        options: ["HUJAN", "ANGIN", "SALJU", "PETIR"]
    }
];
